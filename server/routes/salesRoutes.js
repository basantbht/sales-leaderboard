const express = require('express');
const router = express.Router();
const {
  addSale,
  addBulkSales,
  getLeaderboard,
  getAllSales,
  deleteAllSales
} = require('../controllers/salesController');

// Sales routes
router.post('/', addSale);
router.post('/bulk', addBulkSales);
router.get('/', getAllSales);
router.delete('/', deleteAllSales);

// Leaderboard route
router.get('/leaderboard', getLeaderboard);

module.exports = router;