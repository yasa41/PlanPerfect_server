import express from 'express';
import { getToDoListByEvent, addTask, deleteTask, updateTask } from '../controllers/toDoController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:eventId', verifyToken, getToDoListByEvent);    // Get ToDo list for event

router.post('/add', verifyToken, addTask);              // Add task
router.post('/delete', verifyToken, deleteTask);        // Delete task
router.post('/update', verifyToken, updateTask);        // Update task

export default router;
