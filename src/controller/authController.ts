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
  timestamp: numbe
@'
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { findOrCreateUser } from "../service/authService";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res
        .status(400)
        .json({ status: 400, message: "Missing Google credential" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid Google token" });
    }

    const user = await findOrCreateUser({
      googleId: payload.sub,
      email: payload.email || "",
      name: payload.name || "",
      picture: payload.picture || "",
    });

    res.status(200).json({
      status: 200,
      user: {
        id: user.getDataValue("id"),
        googleId: user.getDataValue("googleId"),
        email: user.getDataValue("email"),
        name: user.getDataValue("name"),
        picture: user.getDataValue("picture"),
      },
    });
  } catch (err) {
    console.error(`authController~googleLogin() => ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to authenticate with Google" });
  }
};
