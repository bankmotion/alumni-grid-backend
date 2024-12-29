import { Request, Response } from "express";
import {
  getAllColleges,
  getAllPlayerListByType,
  getPlayerDataByID,
} from "../service/playersService";
import { PlayType } from "../config/constant";

export const getColleges = async (req: Request, res: Response) => {
  try {
    const data = await getAllColleges();

    res.status(200).json({ status: 200, colleges: data });
  } catch (err) {
    console.error(`playersController~getColleges()=> ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get colleges" });
  }
};

export const identifyingCollege = async (req: Request, res: Response) => {
  try {
    const { id, college, type } = req.body;
    const data = await getPlayerDataByID(id, type);
    console.log(data);
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

export const getPlayerInfo = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params;
    const data = await getPlayerDataByID(Number(id), Number(type));
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
