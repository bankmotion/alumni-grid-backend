import express from "express";
import { getAllHistory, getPlayers } from "../controller/historyController";

const router = express.Router();

router.get("/", getPlayers);

router.get("/all", getAllHistory);

export default router;
