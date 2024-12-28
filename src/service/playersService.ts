import { Op } from "sequelize";
import { PlayType } from "../config/constant";
import NBAPlayer from "../models/NBAPlayers";
import NFLPlayer from "../models/NFLPlayers";
import { getRandNumber } from "../utils/utils";

export const getModelFromPlayType = (playType: PlayType) => {
  return playType === PlayType.NBA
    ? NBAPlayer
    : playType === PlayType.NFL
    ? NFLPlayer
    : null;
};

export const getAllColleges = async (playType: PlayType) => {
  const model = getModelFromPlayType(playType);

  let data: NBAPlayer[] | NFLPlayer[] = [];
  if (model) {
    data = await model.findAll({
      attributes: ["college"],
      where: {
        college: {
          [Op.not]: null as unknown as string,
        },
      },
      group: ["college"],
      order: [["college", "ASC"]],
    });
  }

  return data;
};

export const getRandPlayerInfo = async (playType: PlayType = 0) => {
  const model = getModelFromPlayType(playType);

  let data: NBAPlayer[] | NFLPlayer[] = [];
  let gridCount = 9;
  let indexArr: number[] = [];
  let resArr: NBAPlayer[] | NFLPlayer[] = [];
  if (model) {
    data = await model.findAll({
      attributes: ["id", "firstName", "lastName"],
    });
    const dataCount = data.length;

    while (gridCount) {
      const randNum = getRandNumber(0, dataCount - 1);
      if (indexArr.findIndex((num) => num === randNum) !== -1) continue;
      indexArr.push(randNum);
      resArr.push(data[randNum]);
      gridCount--;
    }
  }

  return resArr;
};

export const getPlayerDataByID = async (id: number, type: PlayType = 0) => {
  const model = getModelFromPlayType(type);
  console.log(model);

  if (model) {
    const data = await model.findOne({
      where: { id },
    });
    return data;
  }
  return null;
};

export const getAllPlayerListByType = async (type: PlayType) => {
  const model = getModelFromPlayType(type);

  if (model) {
    const data = await model.findAll({
      where: {
        firstName: {
          [Op.not]: null as any,
        },
        lastName: {
          [Op.not]: null as any,
        },
      },
    });

    return data;
  }
  return null;
};
