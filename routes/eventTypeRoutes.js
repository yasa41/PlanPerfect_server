import express from "express";
import { getAllEventTypes, getEventTypeByName } from "../controllers/eventTypeControllers.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/", verifyToken, getAllEventTypes);       
router.get("/:name", verifyToken, getEventTypeByName);  

export default router;
