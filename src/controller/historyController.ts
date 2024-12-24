import { Request, Response } from "express";
import {
  createNewGame,
  getGameData,
  getLatestTimestamp,
  getAllHistorySer,
} from "../service/historyService";
import { GameDuration } from "../config/config";
import { getStartTimeByTimestampDaily } from "../utils/utils";

export const getPlayersByTimeStamp = async (req: Request, res: Response) => {
  try {
    const { timestamp } = req.params;
    const curTimestamp = getStartTimeByTimestampDaily(Number(timestamp));

    console.log(curTimestamp);
    let data = await getGameData(curTimestamp);

    res.status(200).json({ status: 200, data, timestamp: curTimestamp });
  } catch (err) {
    console.error(`playersController~getPlayers()=> ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to get getPlayerHistory" });
  }
};

export const getAllHistory = async (req: Request, res: Response) => {
  try {
    const data = await getAllHistorySer();

    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error(`historyController~getAllHistory() => ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to get getAllHistory()" });
  }
};
