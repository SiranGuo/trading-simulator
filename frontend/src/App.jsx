import { useState , useEffect } from 'react'

import AppStyles from './components/AppStyles'

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const STOCKS = ['BBAI', 'TSLA', 'APLD', 'QUBT', 'PLTR'];

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stocks');
      const data = await response.json();

      if (data.success) {
        setStocks(data.data);
        setLastUpdated(data.lastUpdated);
      } else {
        throw new Error(data.error || 'Failed to fetch stocks');
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err.message || 'Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const LoadingSkeleton = () => (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-symbol"></div>
        <div className="skeleton-price"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line"></div>
        <div className="skeleton-line-short"></div>
      </div>
    </div>
  );

  const StockCard = ({ stock }) => {
    const isPositive = stock.change >= 0;
    const arrow = isPositive ? '↗' : '↘';

    return (
      <div className={`stock-card ${isPositive ? 'stock-card-positive' : 'stock-card-negative'}`}>
        <div className="card-header">
          <div>
            <h3 className="symbol">{stock.symbol}</h3>
            {!stock.isReal && (
              <span className="demo-tag">Demo</span>
            )}
          </div>
          <div className="price-container">
            <div className="price">
              ${stock.price.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className={`change-container ${isPositive ? 'change-container-positive' : 'change-container-negative'}`}>
          <div className="change-row">
            <div className={`change-text ${isPositive ? 'change-text-positive' : 'change-text-negative'}`}>
              <span>{arrow}</span>
              <span className="change-amount">
                {isPositive ? '+' : ''}${stock.change.toFixed(2)}
              </span>
            </div>
            <div className={`change-percent ${isPositive ? 'change-percent-positive' : 'change-percent-negative'}`}>
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="last-updated">
          Last updated: {stock.lastUpdated}
        </div>
      </div>
    );
  };
  return (
    <div className="app-container">
      <AppStyles />

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="title">
              📈 Stock Price Tracker
            </h1>
            <p className="subtitle">
              Real-time prices for BBAI, TSLA, APLD, QUBT, PLTR
            </p>
          </div>
          <div className="header-right">
            <button
              onClick={fetchStocks}
              disabled={loading}
              className="refresh-button"
            >
              {loading ? '🔄 Loading...' : '🔄 Refresh'}
            </button>
            {lastUpdated && (
              <div className="update-time">
                Updated: {lastUpdated}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Stock Grid */}
        <div className="stock-grid">
          {loading ? (
            // Show loading skeletons
            Array.from({ length: 5 }, (_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : (
            // Show stock cards
            stocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-card">
            <p className="footer-text">
              🔴 Live Data • Auto-refresh every 60 seconds
            </p>
            <p className="footer-subtext">
              Demo Mode - Simulated Stock Prices
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App
