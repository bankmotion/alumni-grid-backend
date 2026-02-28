import DailyScore from "../models/DailyScore";
import User from "../models/User";
import { Op } from "sequelize";

export const submitScore = async (
  userId: number,
  score: number,
  playType: number,
  timestamp: number
) => {
  const [dailyScore, created] = await DailyScore.findOrCreate({
    where: {
      userId,
      playType,
      timestamp,
    },
    defaults: {
      userId,
      score,
      playType,
      timestamp,
    },
  });

  if (!created && score > dailyScore.getDataValue("score")) {
    await dailyScore.update({ score });
  }

  return dailyScore;
};

export const getDailyLeaderboard = async (
  playType: number,
  timestamp: number,
  limit: number = 50
) => {
  const scores = await DailyScore.findAll({
    where: {
      playType,
      timestamp,
    },
    include: [
      {
        model: User,
        attributes: ["id", "name", "picture"],
      },
    ],
    order: [["score", "DESC"]],
    limit,
  });

  return scores;
};

export const getUserScore = async (
  userId: number,
  playType: number,
  timestamp: number
) => {
  return await DailyScore.findOne({
    where: {
      userId,
      playType,
      timestamp,
    },
  });
};

export const getScorePercentile = async (
  score: number,
  playType: number,
  timestamp: number
) => {
  const totalCount = await DailyScore.count({
    where: { playType, timestamp },
  });

  if (totalCount === 0) return { percentile: 100, totalPlayers: 0 };

  const belowCount = await DailyScore.count({
    where: {
      playType,
      timestamp,
      score: { [Op.lt]: score },
    },
  });

  const percentile = Math.round((belowCount / totalCount) * 100);

  return { percentile, totalPlayers: totalCount };
};
