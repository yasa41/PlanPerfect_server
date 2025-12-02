import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
}, { _id: true });

const toDoListSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, unique: true },
  tasks: [taskSchema],
}, { timestamps: true });

const ToDoList = mongoose.models.ToDoList || mongoose.model('ToDoList', toDoListSchema);
export default ToDoList;
