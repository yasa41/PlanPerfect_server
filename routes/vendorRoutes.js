import express from 'express';
import { getVendorsByEvent, addVendor, updateVendor, deleteVendor,sendVendorEmail } from '../controllers/vendorControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.get("/send-email", (req, res) => {
  res.send("This endpoint requires POST");
});

router.post("/send-email",verifyToken, sendVendorEmail);
router.get('/event/:eventId', verifyToken, getVendorsByEvent);
router.post('/add', verifyToken, addVendor);
router.post('/update', verifyToken, updateVendor);
router.post('/delete', verifyToken, deleteVendor);



export default router;
