import express from "express";

import playerRouter from "./apis/playerApi";

const router = express.Router();

router.use("/game", playerRouter);

export default router;
