import { Request, Response } from "express";
import { SettingType } from "../interface";
import {
  createNewSetting,
  deleteSettingById,
  getSettings,
  updateSetting,
} from "../service/adminService";
import {
  updatePlayersById,
  updateStatusOfPlayers,
} from "../service/playersService";
import { Difficulty, PlayType } from "../config/constant";

export const createOrUpdateSetting = async (req: Request, res: Response) => {
  try {
    const { id, position, country, draft, experience, ageTo, ageFrom } =
      req.body;
    const { type } = req.params;

    const data: SettingType = { type: Number(type) };
    if (Number(id) >= 0) data.id = Number(id);
    if (position) data.position = position;
    if (country) data.country = country;
    if (draft) data.draft = draft;
    if (experience) data.experience = experience;
    if (ageTo) data.ageTo = Number(ageTo);
    if (ageFrom) data.ageFrom = Number(ageFrom);

    if (data.id && data.id >= 0) {
      await updateSetting(data);
    } else {
      await createNewSetting(data);
    }

    const settings = await getSettings(Number(type) as PlayType);

    await updateStatusOfPlayers(settings, Number(type) as PlayType);

    res.status(200).json({ status: 200 });
  } catch (err) {
    console.error(`adminController ~ createOrUpdateSetting() =>${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to create or update setting" });
  }
};

export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params;
    await deleteSettingById(Number(id));

    const settings = await getSettings(Number(type) as PlayType);
    await updateStatusOfPlayers(settings, Number(type) as PlayType);

    res.status(200).json({ status: 200 });
  } catch (err) {
    console.error(`adminController ~ deleteSetting() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to delete setting" });
  }
};

export const getSetting = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const data = await getSettings(Number(type));

    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error(`adminController ~ getSetting() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get setting" });
  }
};

export const updateDifficultyStatus = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { ids, difficulty } = req.body;

    if (!Array.isArray(ids) || typeof difficulty !== "number") {
      res.status(400).json({ status: 400, error: "Invalid input data" });
      return;
    }

    for (const id of ids) {
      await updatePlayersById({ difficulty }, { id }, Number(type));
    }

    res.status(200).json("Updated successfully");
  } catch (err) {
    console.error(`adminController ~ updateDifficultyStatus() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get setting" });
  }
};

export const updateImageLink = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { id, imageLink } = req.body;

    if (typeof id !== "number" || typeof imageLink !== "string") {
      res.status(400).json({ status: 400, error: "Invalid input data" });
      return;
    }

    await updatePlayersById({ imageLink }, { id }, Number(type));
    res.status(200).json("Updated successfully");
  } catch (err) {
    console.error(`adminController ~ updateImageLink() => ${err}`);
    res
      .status(500)
      .json({ status: 500, message: "Failed to update image link" });
  }
};
