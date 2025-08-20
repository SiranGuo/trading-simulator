import { useState , useEffect } from 'react'

import AppStyles from './components/AppStyles'

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [trackedStocks, setTrackedStocks] = useState(['BBAI', 'TSLA', 'APLD', 'QUBT', 'PLTR']);

  const STOCKS = ['BBAI', 'TSLA', 'APLD', 'QUBT', 'PLTR'];

  // Function to fetch stock data from the backend
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
  // Search function to filter stocks based on user input
  const searchStocks = async (symbol) => {
    if (!symbol.trim()) return;

    setIsSearching(true);
    setSearchResults(null);

    try {
      const response = await fetch(`/api/stocks/${symbol.toUpperCase()}`);
      const data = await response.json();

      if (data.success && data.data) {
        setSearchResults(data.data);
      } else {
        throw new Error(data.error || 'No stocks found');
      }
    } catch (err) {
      console.error('Error searching stocks:', err);
      setError(err.message || 'Failed to search stocks');
      setSearchResults(null);
    }
    setIsSearching(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm.trim()) {
      searchStocks(searchTerm.trim());
    }
  };

  const addToTrackedStocks = (stock) => {
    const currentStocks = Array.isArray(stocks) ? stocks : [];
    const existingStock = currentStocks.find(s => s.symbol === stock.symbol);
    if(existingStock) {
      console.log(`Stock ${stock.symbol} is already tracked.`);
      return;
    }

    const UpdatedStocks = [...currentStocks, stock];
    setStocks(UpdatedStocks);
    setTrackedStocks([...trackedStocks, stock.symbol]);
    setSearchResults(null);
    setSearchTerm('');
  };

  const removeFromTrackedStocks = (symbol) => {
    setStocks(stocks.filter(s => s.symbol !== symbol));
    setTrackedStocks(trackedStocks.filter(s => s !== symbol));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
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

  const StockCard = ({ stock, isSearchResult = false, onAdd, onRemove }) => {
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
              ${(stock.price || 0).toFixed(2)}
            </div>
            {isSearchResult ?(
              <button
                onClick={() => onAdd(stock)}
                className="add-button"
                disabled = {stocks.find(s => s.symbol === stock.symbol)}
                style ={{
                  background: stocks.find(s => s.symbol === stock.symbol) ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: stocks.find(s => s.symbol === stock.symbol) ? 'not-allowed' : 'pointer'
                }}
              >
                {stocks.find(s => s.symbol === stock.symbol) ? 'Added' : '+ Add'}
              </button>
            ) : (
              !STOCKS.includes(stock.symbol) && (
                <button
                  onClick={() => onRemove(stock.symbol)}
                  className="remove-button"
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )
            )}
          </div>
        </div>
        
        <div className={`change-container ${isPositive ? 'change-container-positive' : 'change-container-negative'}`}>
          <div className="change-row">
            <div className={`change-text ${isPositive ? 'change-text-positive' : 'change-text-negative'}`}>
              <span>{arrow}</span>

            </div>
            <div className={`change-percent ${isPositive ? 'change-percent-positive' : 'change-percent-negative'}`}>
              {isPositive ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
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
      {/* Search Bar */}
      <section style={{
        background: 'white',
        margin: '20px',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          🔍 Search for Stocks
        </h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: '1' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              disabled={isSearching}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            style={{
              background: isSearching || !searchTerm.trim() ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSearching || !searchTerm.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (!e.target.disabled) e.target.style.background = '#2563eb';
            }}
            onMouseOut={(e) => {
              if (!e.target.disabled) e.target.style.background = '#3b82f6';
            }}
          >
            {isSearching ? '🔄 Searching...' : '🔍 Search'}
          </button>
        </div>

        {/* Search Result */}
        {searchResults && (
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              Search Result
            </h3>
            <div style={{ maxWidth: '400px' }}>
              <StockCard 
                stock={searchResults} 
                isSearchResult={true}
                onAdd={addToTrackedStocks}
              />
            </div>
          </div>
        )}
      </section>
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
              <LoadingSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            // Show stock cards

            Array.isArray(stocks) ? stocks.map((stock) => (
                <StockCard 
                  key={stock.symbol} 
                  stock={stock} 
                  onRemove={removeFromTrackedStocks}
                />
            )) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#ef4444'
              }}>
                ⚠️ Error: Unable to load stock data
              </div>
            )
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
