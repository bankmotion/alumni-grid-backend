import { Request, Response } from "express";
import {
  createNewGame,
  getGameData,
  getLatestTimestamp,
} from "../service/historyService";
import { GameDuration } from "../config/config";

export const getPlayers = async (req: Request, res: Response) => {
  try {
    console.log("hello");
    let latestTimestamp = await getLatestTimestamp();
    console.log({ latestTimestamp });
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
