import React from 'react';
import { FaChartLine, FaSync } from 'react-icons/fa';
import './Leaderboard.css';

const Leaderboard = ({ data, loading, onRefresh }) => {
  const getRankClass = (rank) => {
    switch(rank) {
      case 1:
        return 'rank-1';
      case 2:
        return 'rank-2';
      case 3:
        return 'rank-3';
      default:
        return '';
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <FaChartLine className="header-icon" />
          <h2>Today's Leaderboard</h2>
        </div>
        <div className="loading-state">
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <FaChartLine className="header-icon" />
          <h2>Today's Leaderboard</h2>
        </div>
        <div className="empty-state">
          <p>No sales data available yet.</p>
          <p>Add your first sale to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <FaChartLine className="header-icon" />
        <h2>Today's Leaderboard</h2>
        <button onClick={onRefresh} className="refresh-btn" disabled={loading}>
          <FaSync className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>
      <div className="leaderboard-list">
        {data.map((agent, index) => (
          <div 
            key={agent.id || index} 
            className={`leaderboard-item ${getRankClass(index + 1)}`}
          >
            <div className="rank-badge">
              <span className="rank-number">#{index + 1}</span>
            </div>
            <div className="agent-info">
              <h3>{agent.agentName}</h3>
              <p className="sales-info">
                Rs. {agent.totalSales.toLocaleString()} Total Sales • {agent.totalDeals} {agent.totalDeals === 1 ? 'Deal' : 'Deals'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;