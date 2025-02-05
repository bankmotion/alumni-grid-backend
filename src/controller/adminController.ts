import { Request, Response } from "express";
import { SettingAttributes } from "../models/Setting";
import { SettingType } from "../interface";
import {
  createNewSetting,
  deleteSettingById,
  getSettings,
  updateSetting,
  getAllSettings
} from "../service/adminService";
import {updateStatusOfPlayers}  from "../service/playersService"
import { all } from "axios";

export const createOrUpdateSetting = async (req: Request, res: Response) => {
  try {
    const { id, position, country, draft, experience, ageTo, ageFrom } = req.body;
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

    const allSettings = await getAllSettings();

    console.log(allSettings,"allSettings")
    await updateStatusOfPlayers(allSettings);

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
    const { id } = req.params;
    await deleteSettingById(Number(id));

    const allSettings = await getAllSettings();
    await updateStatusOfPlayers(allSettings);

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
