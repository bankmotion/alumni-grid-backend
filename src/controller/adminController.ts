import { Request, Response } from "express";
import { SettingAttributes } from "../models/Setting";
import { SettingType } from "../interface";
import {
  createNewSetting,
  deleteSettingById,
  getSettings,
  updateSetting,
} from "../service/adminService";

export const createOrUpdateSetting = async (req: Request, res: Response) => {
  try {
    const { id, type, position, country, draft, college } = req.body;

    const data: SettingType = { type };
    if (Number(id) >= 0) data.id = Number(id);
    if (position) data.position = position;
    if (country) data.country = country;
    if (draft) data.draft = draft;
    if (college) data.college = college;

    if (data.id && data.id >= 0) {
      await updateSetting(data);
    } else {
      await createNewSetting(data);
    }

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

    res.status(200).json({ status: 200 });
  } catch (err) {
    console.error(`adminController ~ deleteSetting() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to delete setting" });
  }
};

export const getSetting = async (req: Request, res: Response) => {
  try {
    const data = await getSettings();

    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error(`adminController ~ getSetting() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get setting" });
  }
};
