import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, unique: true },
  totalBudget: { type: Number, required: true },
  spentAmount: { type: Number, default: 0 },
  details: [
    {
      description: { type: String },
      amount: { type: Number },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
export default Budget;
