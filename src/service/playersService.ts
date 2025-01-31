import { Op } from "sequelize";
import { ActiveStatus, Difficulty, PlayType } from "../config/constant";
import NBAPlayer, { NBAPlayerAttributes } from "../models/NBAPlayers";
import NFLPlayer, { NFLPlayerAttributes } from "../models/NFLPlayers";
import { delay, getRandNumber } from "../utils/utils";
import Setting from "../models/Setting";
import { Sequelize } from "sequelize";

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

export const getRandPlayerInfo = async (playType: PlayType) => {
  const model = getModelFromPlayType(playType);

  let data: NBAPlayer[] | NFLPlayer[] = [];
  let gridCount = 9;
  let resArr: NBAPlayer[] | NFLPlayer[] = [];
  if (model) {
    data = await model.findAll({
      attributes: ["id", "firstName", "lastName", "difficulty"],
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ status: 1 }, { active: { [Op.ne]: -1 } }],
          },
          {
            active: 1,
          },
        ],
      },
    });

    while (gridCount > 0) {
      const difficulty = Math.ceil((10 - gridCount) / 3) as Difficulty;

      const filteredData = data.filter(
        (dat) => (dat.dataValues.difficulty as Difficulty) === difficulty
      );
      if (filteredData.length < 3) return [];
      const randNum = getRandNumber(0, filteredData.length - 1);

      const randData = filteredData[randNum];
      if (
        resArr.some((player) => player.dataValues.id === randData.dataValues.id)
      )
        continue;
      resArr.push(randData);
      gridCount--;
    }
  }

  return resArr;
};

export const getPlayerDataByID = async (id: number, type: PlayType) => {
  const model = getModelFromPlayType(type);

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
        college: {
          [Op.not]: null as any,
        },
      },
    });

    return data;
  }
  return null;
};

export const updateStatusOfPlayers = async (
  allSettings: Setting[],
  playType: PlayType
) => {
  const settings = allSettings
    .map((setting) =>
      setting.dataValues.setting ? JSON.parse(setting.dataValues.setting) : null
    )
    .filter((setting) => setting !== null);

  console.log(settings, "settings");

  if (playType === PlayType.NBA) {
    await NBAPlayer.update(
      {
        status: 0,
      },
      {
        where: {},
      }
    );
  } else if (playType === PlayType.NFL) {
    await NFLPlayer.update(
      {
        status: 0,
      },
      {
        where: {},
      }
    );
  }

  const model = getModelFromPlayType(playType);
  if (!model) {
    return;
  }

  for (const setting of settings) {
    if (!setting || typeof setting.type === "undefined") {
      console.warn("Invalid setting:", setting);
      continue;
    }

    const countryCondition =
      setting.country === "-1"
        ? { [Op.or]: ["USA", "Canada"] }
        : setting.country;

    const draftYearCondition = parseInt(setting.draft, 10) || 0;
    const experience = parseInt(setting.experience, 10) || 0;
    const ageTo = parseInt(setting.ageTo, 10) || 0;
    const ageFrom = parseInt(setting.ageFrom, 10) || 0;

    try {
      if (model == NBAPlayer) {
        const whereConditions: any = {
          firstName: { [Op.not]: null },
          lastName: { [Op.not]: null },
          college: { [Op.not]: null },
          country: countryCondition,
          draftYear: { [Op.gte]: draftYearCondition },
        };

        if (setting.position !== "-1") {
          whereConditions.position = setting.position;
        }

        const result = await model.update(
          {
            status: 1,
          },
          {
            where: whereConditions,
          }
        );
      }

      if (model == NFLPlayer) {
        const conditions: any = {
          firstName: { [Op.not]: null },
          lastName: { [Op.not]: null },
          college: { [Op.not]: null },
        };

        if (setting.position !== "-1") {
          conditions.position = setting.position;
        }

        if (experience) {
          conditions.experience = { [Op.gte]: experience };
        }

        if (ageTo && ageFrom) {
          conditions.age = { [Op.between]: [ageFrom, ageTo] };
        }

        const result = await model.update({ status: 1 }, { where: conditions });
      }
    } catch (error) {
      console.error(`Error updating players for playType: ${playType}`, error);
    }
  }
};

export const updatePlayersById = async (
  target: any,
  where: any,
  type: PlayType
) => {
  if (type === PlayType.NBA) {
    await NBAPlayer.update(target, { where });
  } else if (type === PlayType.NFL) {
    await NFLPlayer.update(target, { where });
  }
};

export const getAllPlayerByName = async (name: string, type: PlayType) => {
  let data: NBAPlayer[] | NFLPlayer[] = [];
  if (type === PlayType.NBA) {
    data = await NBAPlayer.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "CONCAT",
          Sequelize.col("firstName"),
          " ",
          Sequelize.col("lastName")
        ),
        name
      ),
    });
  } else if (type === PlayType.NFL) {
    data = await NFLPlayer.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "CONCAT",
          Sequelize.col("firstName"),
          " ",
          Sequelize.col("lastName")
        ),
        name
      ),
    });
  }
  return data;
};
