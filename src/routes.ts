import express from "express";
import playerRouter from "./apis/playerApi";
import historyRouter from "./apis/historyApi";
import adminRouter from "./apis/adminApi";
import authRouter from "./apis/authApi";
import leaderboardRouter from "./apis/leaderboardApi";

const router = express.Router();

router.use("/game", playerRouter);
router.use("/history", historyRouter);
router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/leaderboard", leaderboardRouter);

export default router;
