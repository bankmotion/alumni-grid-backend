import express from "express";
import {
  getAllHistory,
  getPlayers,
  getPlayersByTimeStamp,
} from "../controller/historyController";

const router = express.Router();

router.get("/", getPlayers);

router.get("/timestamp/:timestamp", getPlayersByTimeStamp);

router.get("/all", getAllHistory);

export default router;
