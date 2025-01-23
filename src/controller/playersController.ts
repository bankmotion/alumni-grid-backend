import { Request, Response } from "express";
import {
  getAllColleges,
  getAllPlayerListByType,
  getPlayerDataByID,
  getRandPlayerInfo,
  updateActiveStatusById,
} from "../service/playersService";
import { PlayType } from "../config/constant";
import {
  incrementCorrectCount,
  incrementPlayingCount,
} from "../service/historyService";

export const getColleges = async (req: Request, res: Response) => {
  try {
    const { playType } = req.params;
    const data = await getAllColleges(playType as unknown as PlayType);

    res.status(200).json({ status: 200, colleges: data });
  } catch (err) {
    console.error(`playersController~getColleges()=> ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get colleges" });
  }
};

export const identifyingCollege = async (req: Request, res: Response) => {
  try {
    const { id, college, timestamp } = req.body;
    const { playType } = req.params;

    const data = await getPlayerDataByID(id, playType as unknown as PlayType);
    
    if (data?.dataValues.college === college) {
      await incrementCorrectCount(1, { playerId: id, timestamp });
      res.status(200).json({ status: 200, message: true });
    } else {
      res.status(200).json({ status: 200, message: false });
    }
  } catch (err) {
    console.error(`playerController~identifyingCollege() => ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to identify college" });
  }
};

export const gameStart = async (req: Request, res: Response) => {
  try {
    const { timestamp } = req.body;
    const { playType } = req.params;
    const result = await incrementPlayingCount(
      1,
      playType as unknown as PlayType,
      {
        timestamp,
      }
    );
    res.status(200).json({ status: 200, message: result });
  } catch (err) {
    console.error(`playerController~gameStart() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to start game" });
  }
};

export const getPlayerInfo = async (req: Request, res: Response) => {
  try {
    const { playType, id } = req.params;
    const data = await getPlayerDataByID(
      Number(id),
      playType as unknown as PlayType
    );
    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error(`playerController~getPlayerInfo() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get player info" });
  }
};

export const getAllPlayerList = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const data = await getAllPlayerListByType(Number(type) as PlayType);
    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error(`playerController ~ getAllPlayerList() => ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to get all player list" });
  }
};

export const updateActive = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { id, status } = req.body;
    await updateActiveStatusById(Number(type), id, status);
    res.status(200).json({ status: 200 });
  } catch (err) {
    console.error(`playController ~ updateActive() => ${err}`);
  }
};
