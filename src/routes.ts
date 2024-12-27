import express from "express";

import playerRouter from "./apis/playerApi";
import historyRouter from "./apis/historyApi";
import adminRouter from "./apis/adminApi";

const router = express.Router();

router.use("/game", playerRouter);

router.use("/history", historyRouter);

router.use("/admin", adminRouter);

export default router;
