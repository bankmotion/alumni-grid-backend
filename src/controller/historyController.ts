import { Request, Response } from "express";
import {
  createNewGame,
  getGameData,
  getLatestTimestamp,
  getAllHistorySer,
} from "../service/historyService";
import { GameDuration } from "../config/config";
import { getStartTimeByTimestampDaily } from "../utils/utils";

export const getPlayers = async (req: Request, res: Response) => {
  try {
    let latestTimestamp = await getLatestTimestamp();
    let currentTime = Math.floor(new Date().getTime() / 1000);

    if (!latestTimestamp || currentTime - latestTimestamp >= GameDuration) {
      latestTimestamp = await createNewGame();
    }
    const data = await getGameData(latestTimestamp);

    res.status(200).json({ status: 200, data, timestamp: latestTimestamp });
  } catch (err) {
    console.error(`playersController~getPlayers()=> ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to get getPlayerHistory" });
  }
};

export const getPlayersByTimeStamp = async (req: Request, res: Response) => {
  try {
    const { timestamp } = req.params;
    const curTimestamp = getStartTimeByTimestampDaily(Number(timestamp));

    const data = await getGameData(curTimestamp);

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
