import express from 'express';
import { getVendorsByEvent, addVendor, updateVendor, deleteVendor } from '../controllers/vendorControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:eventId', verifyToken, getVendorsByEvent);
router.post('/add', verifyToken, addVendor);
router.post('/update', verifyToken, updateVendor);
router.post('/delete', verifyToken, deleteVendor);

export default router;
