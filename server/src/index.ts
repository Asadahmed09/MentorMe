import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import adminRoutes from "./routes/adminRoutes";
import requestRoutes from "./routes/requestRoutes";
import { ensureProfileContactColumns } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/requests", requestRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MentorMe API is running" });
});

// TODO: Routes will be added here

const startServer = async () => {
  try {
    await ensureProfileContactColumns();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database schema", error);
    process.exit(1);
  }
};

void startServer();
