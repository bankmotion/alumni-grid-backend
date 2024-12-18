import express from "express";
import { getPlayers } from "../controller/historyController";

const router = express.Router();

router.get("/", getPlayers);

export default router;
