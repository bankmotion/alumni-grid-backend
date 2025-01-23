import { Request, Response } from "express";
import { getGameData, getAllHistorySer } from "../service/historyService";
import { GameDuration } from "../config/config";
import { getStartTimeByTimestampDaily } from "../utils/utils";
import { PlayType } from "../config/constant";

export const getPlayersByTimeStamp = async (req: Request, res: Response) => {
  try {
    const { playType, timestamp } = req.params;
    const curTimestamp = getStartTimeByTimestampDaily(Number(timestamp));

    console.log(curTimestamp);
    let data = await getGameData(curTimestamp, playType as unknown as PlayType);

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
    const { playType } = req.params;
    const data = await getAllHistorySer(playType as unknown as PlayType);

    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error(`historyController~getAllHistory() => ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to get getAllHistory()" });
  }
};
