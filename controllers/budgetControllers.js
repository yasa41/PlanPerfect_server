import Budget from '../models/budgetModel.js';

// Fetch event budget and spending
export const getBudgetByEvent = async (req, res) => {
  try {
    const budget = await Budget.findOne({ eventId: req.params.eventId });
    if (!budget) return res.json({ success: false, message: 'No budget found' });
    const status = budget.spentAmount < budget.totalBudget ? 
      `Underspent by ${budget.totalBudget - budget.spentAmount}` :
      budget.spentAmount > budget.totalBudget ?
      `Overspent by ${budget.spentAmount - budget.totalBudget}` :
      'On Track';

    res.json({ success: true, budget, status });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update event budget
export const setOrUpdateBudget = async (req, res) => {
  try {
    const { eventId, totalBudget } = req.body;
    let budget = await Budget.findOne({ eventId });
    if (!budget) {
      budget = new Budget({ eventId, totalBudget, spentAmount: 0, details: [] });
    } else {
      budget.totalBudget = totalBudget;
    }
    await budget.save();
    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add an expense (spending)
export const addExpense = async (req, res) => {
  try {
    const { eventId, description, amount } = req.body;
    const budget = await Budget.findOne({ eventId });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });

    budget.spentAmount += amount;
    budget.details.push({ description, amount });
    await budget.save();

    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
