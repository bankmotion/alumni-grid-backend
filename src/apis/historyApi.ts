import express from "express";
import {
  getAllHistory,
  getPlayersByTimeStamp,
} from "../controller/historyController";

const router = express.Router();

router.get("/timestamp/:timestamp", getPlayersByTimeStamp);

router.get("/all", getAllHistory);

export default router;
