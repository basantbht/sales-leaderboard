import React, { useState } from 'react';
import axios from 'axios';
import './AddSaleForm.css';

const API_URL = 'http://localhost:5000/api';

const AddSaleForm = ({ onSaleAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    agentName: '',
    amount: '',
    numberOfSales: '1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agentName.trim() || !formData.amount || !formData.numberOfSales) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (parseInt(formData.numberOfSales) <= 0) {
      setError('Number of sales must be at least 1');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const amount = parseFloat(formData.amount);
      const numberOfSales = parseInt(formData.numberOfSales);
      const agentName = formData.agentName.trim();
      
      // Send single sale record with numberOfSales field
      const response = await axios.post(`${API_URL}/sales`, {
        agentName: agentName,
        amount: amount,
        numberOfSales: numberOfSales
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData({ agentName: '', amount: '', numberOfSales: '1' });
        
        // Call parent callback after short delay
        setTimeout(() => {
          setSuccess(false);
          onSaleAdded();
        }, 1500);
      }
    } catch (err) {
      console.error('Error adding sale:', err);
      setError(err.response?.data?.message || 'Failed to add sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const count = parseInt(formData.numberOfSales) || 1;
    return amount * count;
  };

  return (
    <div className="add-sale-form-container">
      <div className="form-card">
        <h3>Add New Sale</h3>
        
        {success && (
          <div className="success-message">
            ✓ Sale added successfully!
          </div>
        )}

        {error && (
          <div className="error-message-form">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="agentName">Agent Name</label>
            <input
              type="text"
              id="agentName"
              name="agentName"
              value={formData.agentName}
              onChange={handleChange}
              placeholder="Enter agent name"
              disabled={loading || success}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Sales Amount (Rs.)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              disabled={loading || success}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numberOfSales">Number of Sales</label>
            <input
              type="number"
              id="numberOfSales"
              name="numberOfSales"
              value={formData.numberOfSales}
              onChange={handleChange}
              placeholder="Enter number of sales"
              min="1"
              step="1"
              disabled={loading || success}
              required
            />
            <small className="field-hint">
              Total amount: Rs. {calculateTotal().toLocaleString()} ({formData.numberOfSales || 1} deal{parseInt(formData.numberOfSales || 1) !== 1 ? 's' : ''})
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading || success}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || success}
            >
              {loading ? 'Adding...' : 'Add Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSaleForm;