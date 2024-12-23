import { GameDuration } from "../config/config";
import History from "../models/History";
import NBAPlayer from "../models/NBAPlayers";
import { getRandPlayerInfo } from "./playersService";

export const getLatestTimestamp = async () => {
  const latestTimestamp = await History.max("timestamp");
  return Number(latestTimestamp);
};

export const createNewGame = async () => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const startTime = Math.floor(currentTime / GameDuration) * GameDuration;

  const data = await getRandPlayerInfo();
  for (const dat of data) {
    await History.create({
      playerId: dat.dataValues.id,
      timestamp: startTime,
    });
  }

  return startTime;
};

export const getGameData = async (timestamp: number) => {
  const data = await History.findAll({
    where: { timestamp },
    include: {
      model: NBAPlayer,
      attributes: ["id", "firstName", "lastName"],
    },
  });

  return data;
};

export const getAllHistorySer = async () => {
  const data = await History.findAll({
    include: {
      model: NBAPlayer,
      attributes: ["id", "firstName", "lastName"],
    },
    raw: true,
  });

  console.log(data);

  let results: {
    timestamp: number;
    players: {
      id: number;
      firstName: string;
      lastName: string;
    }[];
  }[] = [];

  for (let index = 0; index < data.length; index++) {
    const dat = data[index] as any;

    if (!results.some((item) => item.timestamp === dat.timestamp)) {
      results.push({
        timestamp: dat.timestamp,
        players: [],
      });
    }

    results = results.map((result) => {
      if (result.timestamp !== dat.timestamp) return result;

      const updatedRes = { ...result };
      updatedRes.players.push({
        id: dat["NBAPlayer.id"],
        firstName: dat["NBAPlayer.firstName"],
        lastName: dat["NBAPlayer.lastName"],
      });

      return updatedRes;
    });

  }
  console.log(results);

  return results;
};
