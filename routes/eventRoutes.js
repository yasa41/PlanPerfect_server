import express from 'express';
import { 
  listEvents, 
  getEventById, 
  addWorkingEvent, 
  removeWorkingEvent,
  getWorkingEvents,createEvent
} from '../controllers/eventControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/create',verifyToken,createEvent);
router.get('/', verifyToken, listEvents);               // List all events
router.get('/:id', verifyToken, getEventById);          // Get event by id

router.get('/working/list', verifyToken, getWorkingEvents);       // Get user’s working events
router.post('/working/add', verifyToken, addWorkingEvent);        // Add event to workingEvents
router.post('/working/remove', verifyToken, removeWorkingEvent);  // Remove event from workingEvents

export default router;
