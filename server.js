import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

//express 
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import testAiRoute from './routes/testRoute.js';
import typeRouter from "./routes/eventTypeRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import guestRouter from "./routes/guestRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import todoRouter from "./routes/toDoListRoutes.js";
import vendorRouter from "./routes/vendorRoutes.js";
import inviteRouter from "./routes/inviteRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

// Serve static files from the 'assets/images' directory
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')))

// Routes
app.use("/api/auth", authRouter);
app.use('/api', testAiRoute);
app.use('/api/event-type',typeRouter);
app.use('/api/events',eventRouter);
app.use('/api/guests',guestRouter);
app.use('/api/budget',budgetRouter);
app.use('/api/todo',todoRouter);
app.use('/api/vendor',vendorRouter);
app.use('/api/invites',inviteRouter);

app.get("/", (req, res) => {
  res.send("PlanPerfext API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
