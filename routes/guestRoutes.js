import express from 'express';
import { getGuestsByEvent, addGuest, updateRsvp, rsvpViaLink ,deleteGuest} from '../controllers/guestControler.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:eventId', verifyToken, getGuestsByEvent);
router.post('/add', verifyToken, addGuest);
router.post('/update-rsvp', verifyToken, updateRsvp);
router.delete('/guest/:guestId',verifyToken, deleteGuest);


// Public unprotected route for RSVP via email link
router.get('/rsvp/:guestId/:action', rsvpViaLink);

export default router;
