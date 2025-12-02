import express from 'express';
import { 
  getInviteTemplate, 
  generateInviteText, 
  downloadInvitePdf, 
  sendInviteEmail 
} from '../controllers/inviteController.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/template/:eventId',verifyToken, getInviteTemplate);
router.post('/generate-text',verifyToken, generateInviteText);
router.post('/download-pdf',verifyToken, downloadInvitePdf);
router.post('/send-emails',verifyToken, sendInviteEmail);

export default router;
