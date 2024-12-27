import { SettingType } from "../interface";
import Setting, { SettingAttributes } from "../models/Setting";

export const createNewSetting = async (setting: SettingType) => {
  await Setting.create({
    type: setting.type,
    setting: JSON.stringify(setting),
  });

  return true;
};

export const updateSetting = async (setting: SettingType) => {
  const data: SettingAttributes = {
    type: setting.type,
    setting: JSON.stringify(setting),
  };

  const updatedData = await Setting.update(data, {
    where: {
      id: setting.id,
    },
  });

  return updatedData;
};

export const deleteSettingById = async (settingId: number) => {
  await Setting.destroy({ where: { id: settingId } });
  return true;
};

export const getSettings = async () => {
  const data = await Setting.findAll();
  return data;
};
