const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const axios = require('axios');

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const Stocks = [ 'BBAI', 'TSLA', 'APLD', 'QUBT', 'PLTR' ];

let stockCache = {};
let lastFetch = 0;
const CACHE_DURATION = 60000;

const getStockData = async (symbol) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}';
    
    const response = await axios.get(url);
    const quote = response.data['Global Quote'];

    if (!quote || Object.keys(quote).length === 0) {
      return getSimulatedData(symbol);
  }

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change percent']),
      changePercent: parseFloat(quote['10. change percent']),
      lastUpdated: quote['07. latest trading day'],
      isReal: true
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return getSimulatedData(symbol);
  }
};

const getSimulatedData = (symbol) => {
  const basePrices = {
    'BBAI': 10.00,
    'TSLA': 700.00,
    'APLD': 5.00,
    'QUBT': 15.00,
    'PLTR': 20.00
  };
  const basePrice = basePrices[symbol] || 10.00;
  const change = (Math.random() - 0.5) * (basePrice * 0.1);
  const price = basePrice + change;
      
  return {
    symbol: symbol,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
    lastUpdated: new Date().toISOString().split('T')[0],
    isReal: false
  };
};

app.get('/api/stocks', async (req, res) => {
  try {
    const now = Date.now();

    if (now - lastFetch > CACHE_DURATION) {
      console.log('Fetching new stock data');

      const stockPromises = Stocks.map(symbol => getStockData(symbol));
      const stockData = await Promise.all(stockPromises);

      stockCache = {  };
      stockData.forEach(stock => {
        stockCache[stock.symbol] = stock;
      });
      lastFetch = now;
    } 
    const stocks = Stocks.map(symbol => stockCache[symbol]).filter(Boolean);
    
    res.json({
      success: true,
      data: stocks,
      lastUpdated: new Date(lastFetch).toISOString(),
      cached: now - lastFetch < CACHE_DURATION
    });
  } catch (error) {
    console.error('Error in /api/stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data'
    });
  }
});
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stocks: Stocks
  });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📊 Tracking stocks: ${Stocks.join(', ')}`);
});