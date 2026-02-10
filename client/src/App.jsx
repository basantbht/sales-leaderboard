import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Leaderboard from './components/Leaderboard';
import AddSaleForm from './components/AddSaleForm';
import { FaTrophy } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/sales/leaderboard`);
      if (response.data.success) {
        setLeaderboardData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSaleAdded = () => {
    fetchLeaderboard();
    setShowForm(false);
  };

  const getTotalStats = () => {
    const totalSales = leaderboardData.reduce((sum, agent) => sum + agent.totalSales, 0);
    const totalDeals = leaderboardData.reduce((sum, agent) => sum + agent.totalDeals, 0);
    return { totalSales, totalDeals };
  };

  const { totalSales, totalDeals } = getTotalStats();

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Sales Leaderboard</h1>
          </div>
          <button 
            className="add-sale-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Sale'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {showForm && (
          <AddSaleForm 
            onSaleAdded={handleSaleAdded}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-value">{totalDeals}</div>
            <div className="stat-label">Total Deals</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Rs. {totalSales.toLocaleString()}</div>
            <div className="stat-label">Total Amount</div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchLeaderboard}>Retry</button>
          </div>
        )}

        <Leaderboard 
          data={leaderboardData} 
          loading={loading}
          onRefresh={fetchLeaderboard}
        />
      </main>
    </div>
  );
}

export default App;