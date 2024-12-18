import express from "express";

import playerRouter from "./apis/playerApi";
import historyRouter from "./apis/historyApi";

const router = express.Router();

router.use("/game", playerRouter);

router.use("/history", historyRouter);

export default router;
