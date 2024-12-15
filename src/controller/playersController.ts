import { Request, Response } from "express";
import {
  getAllColleges,
  getPlayerDataByID,
  getRandPlayerInfo,
} from "../service/playersService";
import { PlayType } from "../config/constant";

export const getColleges = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    console.log(type);
    const data = await getAllColleges(Number(type));

    res.status(200).json({ status: 200, colleges: data });
  } catch (err) {
    console.error(`playersController~getColleges()=> ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get colleges" });
  }
};

export const getRandPlayerNames = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const data = await getRandPlayerInfo(Number(type));

    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error(`playersController~getRandPlayerNames() => ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to get randplayernames" });
  }
};

export const identifyingCollege = async (req: Request, res: Response) => {
  try {
    const { id, college, type } = req.body;
    const data = await getPlayerDataByID(id, Number(type));
    if (data?.dataValues.college === college) {
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