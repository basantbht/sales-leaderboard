const Sale = require('../models/Sale');

// @desc    Add a new sale
// @route   POST /api/sales
// @access  Public
const addSale = async (req, res) => {
  try {
    const { agentName, amount, numberOfSales } = req.body;

    if (!agentName || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide agent name and amount' 
      });
    }

    if (amount < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount cannot be negative' 
      });
    }

    const salesCount = numberOfSales || 1;
    
    if (salesCount < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Number of sales must be at least 1' 
      });
    }

    const sale = await Sale.create({
      agentName: agentName.trim(),
      amount: Number(amount),
      numberOfSales: Number(salesCount)
    });

    res.status(201).json({
      success: true,
      message: 'Sale added successfully',
      data: sale
    });
  } catch (error) {
    console.error('Error adding sale:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding sale',
      error: error.message 
    });
  }
};

// @desc    Add multiple sales
// @route   POST /api/sales/bulk
// @access  Public
const addBulkSales = async (req, res) => {
  try {
    const { sales } = req.body;

    if (!Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of sales' 
      });
    }

    // Validate each sale
    const validSales = sales.filter(sale => 
      sale.agentName && 
      sale.amount !== undefined && 
      sale.amount >= 0
    ).map(sale => ({
      agentName: sale.agentName.trim(),
      amount: Number(sale.amount),
      numberOfSales: Number(sale.numberOfSales) || 1
    }));

    if (validSales.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid sales data provided' 
      });
    }

    const insertedSales = await Sale.insertMany(validSales);

    res.status(201).json({
      success: true,
      message: `${insertedSales.length} sales added successfully`,
      data: insertedSales
    });
  } catch (error) {
    console.error('Error adding bulk sales:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding bulk sales',
      error: error.message 
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/sales/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    // Aggregate sales data by agent
    const leaderboard = await Sale.aggregate([
      {
        $group: {
          _id: '$agentName',
          totalSales: { $sum: '$amount' },
          totalDeals: { $sum: '$numberOfSales' }
        }
      },
      {
        $sort: { totalSales: -1, totalDeals: -1 }
      },
      {
        $project: {
          _id: 0,
          agentName: '$_id',
          totalSales: 1,
          totalDeals: 1
        }
      }
    ]);

    // Add ranking with proper handling of ties
    let currentRank = 1;
    let previousSales = null;
    let agentsWithSameRank = 0;

    const rankedLeaderboard = leaderboard.map((agent, index) => {
      if (previousSales === null || agent.totalSales < previousSales) {
        currentRank = index + 1;
        agentsWithSameRank = 0;
      } else if (agent.totalSales === previousSales) {
        agentsWithSameRank++;
      }

      previousSales = agent.totalSales;

      return {
        rank: currentRank,
        agentName: agent.agentName,
        totalSales: agent.totalSales,
        totalDeals: agent.totalDeals
      };
    });

    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching leaderboard',
      error: error.message 
    });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Public
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 });
    
    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching sales',
      error: error.message 
    });
  }
};

// @desc    Delete all sales (for testing)
// @route   DELETE /api/sales
// @access  Public
const deleteAllSales = async (req, res) => {
  try {
    await Sale.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: 'All sales deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sales:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting sales',
      error: error.message 
    });
  }
};

module.exports = {
  addSale,
  addBulkSales,
  getLeaderboard,
  getAllSales,
  deleteAllSales
};