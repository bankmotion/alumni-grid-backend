import { StartTimeStamp } from "../config/config";
import { PlayType } from "../config/constant";
import History from "../models/History";
import HistoryNFL from "../models/HistoryNFL";
import NBAPlayer from "../models/NBAPlayers";
import NFLPlayer from "../models/NFLPlayers";
import { getRandPlayerInfo } from "./playersService";

export const getLatestTimestamp = async (playType: PlayType) => {
  if (playType === PlayType.NBA) {
    let latestTimestamp = await History.max("timestamp");
    if (!latestTimestamp) latestTimestamp = StartTimeStamp;
    return Number(latestTimestamp);
  } else if (playType === PlayType.NFL) {
    let latestTimestamp = await HistoryNFL.max("timestamp");
    if (!latestTimestamp) latestTimestamp = StartTimeStamp;
    return Number(latestTimestamp);
  }
  return 0;
};

export const createNewGame = async (timestamp: number, playType: PlayType) => {
  const data = await getRandPlayerInfo(playType);
  if (playType === PlayType.NBA) {
    for (const dat of data) {
      await History.create({
        playerId: dat.dataValues.id,
        timestamp,
      });
    }
  } else if (playType === PlayType.NFL) {
    for (const dat of data) {
      await HistoryNFL.create({
        playerId: dat.dataValues.id,
        timestamp,
      });
    }
  }

  return timestamp;
};

export const getGameData = async (timestamp: number, playType: PlayType) => {
  if (playType === PlayType.NBA) {
    const data = await History.findAll({
      where: { timestamp },
      include: {
        model: NBAPlayer,
        attributes: ["id", "firstName", "lastName"],
      },
    });

    return data;
  } else if (playType === PlayType.NFL) {
    const data = await HistoryNFL.findAll({
      where: { timestamp },
      include: {
        model: NFLPlayer,
        attributes: ["id", "firstName", "lastName"],
      },
    });

    return data;
  }

  return null;
};

export const getAllHistorySer = async (playType: PlayType) => {
  let data: History[] | HistoryNFL[] = [];
  console.log({ playType });
  if (playType === PlayType.NBA) {
    data = await History.findAll({
      include: {
        model: NBAPlayer,
        attributes: ["id", "firstName", "lastName"],
      },
      raw: true,
    });
  } else if (playType === PlayType.NFL) {
    data = await HistoryNFL.findAll({
      include: {
        model: NFLPlayer,
        attributes: ["id", "firstName", "lastName"],
      },
      raw: true,
    });
  }

  let results: {
    timestamp: number;
    players: {
      id: number;
      firstName: string;
      lastName: string;
      playingCount: number;
      correctCount: number;
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
        id: dat["NBAPlayer.id"] || dat["NFLPlayer.id"],
        firstName: dat["NBAPlayer.firstName"] || dat["NFLPlayer.firstName"],
        lastName: dat["NBAPlayer.lastName"] || dat["NFLPlayer.lastName"],
        playingCount: dat.playingCount,
        correctCount: dat.correctCount,
      });

      return updatedRes;
    });
  }

  return results;
};

export const incrementCorrectCount = async (
  correctCount: number,
  where: any,
  playType: PlayType
) => {
  if (playType === PlayType.NBA) {
    await History.increment("correctCount", { by: correctCount, where });
  } else if (playType === PlayType.NFL) {
    await HistoryNFL.increment("correctCount", { by: correctCount, where });
  }

  return true;
};

export const incrementPlayingCount = async (
  playingCount: number,
  playType: PlayType,
  where: any
) => {
  if (playType === PlayType.NBA) {
    await History.increment("playingCount", { by: playingCount, where });
  } else if (playType === PlayType.NFL) {
    await HistoryNFL.increment("playingCount", { by: playingCount, where });
  } else {
    return false;
  }

  return true;
};
