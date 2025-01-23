import express from "express";
import {
  getAllHistory,
  getPlayersByTimeStamp,
} from "../controller/historyController";

const router = express.Router();

router.get("/timestamp/:playType/:timestamp", getPlayersByTimeStamp); // using

router.get("/all/:playType", getAllHistory); // using

export default router;
