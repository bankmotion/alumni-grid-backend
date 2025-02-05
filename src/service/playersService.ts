import { Op } from "sequelize";
import { PlayType } from "../config/constant";
import NBAPlayer from "../models/NBAPlayers";
import NFLPlayer from "../models/NFLPlayers";
import { getRandNumber } from "../utils/utils";
import Setting from "../models/Setting";

export const getModelFromPlayType = (playType: PlayType) => {
  return playType === PlayType.NBA
    ? NBAPlayer
    : playType === PlayType.NFL
    ? NFLPlayer
    : null;
};

export const getAllColleges = async () => {
  let data: NBAPlayer[] | NFLPlayer[] = [];

  const nba = await NBAPlayer.findAll({
    attributes: ["college"],
    where: {
      college: {
        [Op.not]: null as unknown as string,
      },
    },
    group: ["college"],
    order: [["college", "ASC"]],
  });
  const nfl = await NBAPlayer.findAll({
    attributes: ["college"],
    where: {
      college: {
        [Op.not]: null as unknown as string,
      },
    },
    group: ["college"],
    order: [["college", "ASC"]],
  });

  return [...nba, ...nfl];
};

export const getRandPlayerInfo = async () => {
  let nbaCount = 5;
  let nflCount = 4;
  let indexArr: number[] = [];
  let resArr: NBAPlayer[] | NFLPlayer[] = [];

  const nbaData = await NBAPlayer.findAll({
    attributes: ["id", "firstName", "lastName"],
  });
  const dataCount = nbaData.length;

  while (nbaCount) {
    const randNum = getRandNumber(0, dataCount - 1);
    if (indexArr.findIndex((num) => num === randNum) !== -1) continue;
    indexArr.push(randNum);
    resArr.push(nbaData[randNum]);
    nbaCount--;
  }

  indexArr = [];

  const nflData = await NFLPlayer.findAll({
    attributes: ["id", "firstName", "lastName"],
  });

  while (nflCount) {
    const randNum = getRandNumber(0, dataCount - 1);
    if (indexArr.findIndex((num) => num === randNum) !== -1) continue;
    indexArr.push(randNum);
    resArr.push(nflData[randNum]);
    nflCount--;
  }

  return resArr;
};

export const getPlayerDataByID = async (id: number, type: PlayType) => {
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

export const updateStatusOfPlayers = async (allSettings: Setting[]) => {
  // Parse settings and filter out invalid ones
  const settings = allSettings
    .map((setting) =>
      setting.dataValues.setting ? JSON.parse(setting.dataValues.setting) : null
    )
    .filter((setting) => setting !== null); // Remove null entries

  console.log(settings, "settings");

  // Update all NBA players' status to 0
  await NBAPlayer.update(
    {
      // Set the status to 0 for all records
      status: 0,
    },
    {
      where: {}, // No condition, update all records
    }
  );

  // Update all NFL players' status to 0
  await NFLPlayer.update(
    {
      // Set the status to 0 for all records
      status: 0,
    },
    {
      where: {}, // No condition, update all records
    }
  );

  // Iterate over parsed settings and update status
  for (const setting of settings) {
    if (!setting || typeof setting.type === "undefined") {
      console.warn("Invalid setting:", setting);
      continue; // Skip invalid settings
    }

    // Map setting.type to PlayType using a mapping object
    const playTypeMapping: Record<number, PlayType> = {
      0: PlayType.NBA,
      1: PlayType.NFL,
    };

    console.log(playTypeMapping[setting.type], "playTypeMapping[setting.type]");
    const playType = playTypeMapping[setting.type];

    // Get the model based on playType
    const model = getModelFromPlayType(playType);
    console.log(model, "model");
    if (!model) {
      console.warn("No model found for playType:", playType);
      continue;
    }

    console.log(
      `Model found for playType: ${playType}. Proceed with updating logic.`
    );

    // Prepare conditions
    const countryCondition =
      setting.country === "-1"
        ? { [Op.or]: ["USA", "Canada"] } // Country is USA or Canada
        : setting.country; // Otherwise, match the specific country

    const draftYearCondition = parseInt(setting.draft, 10) || 0; // Convert draft to number, default to 0 if invalid
    const experience = parseInt(setting.experience, 10) || 0;
    const ageTo = parseInt(setting.ageTo, 10) || 0;
    const ageFrom = parseInt(setting.ageFrom, 10) || 0;

    try {
      if (model == NBAPlayer) {
        const whereConditions: any = {
          firstName: { [Op.not]: null },
          lastName: { [Op.not]: null },
          college: { [Op.not]: null },
          country: countryCondition, // Apply country condition
          draftYear: { [Op.gte]: draftYearCondition }, // Draft year >= setting.draft
        };

        // Only filter by position if setting.position is not "-1"
        if (setting.position !== "-1") {
          whereConditions.position = setting.position; // Match position from the setting
        }

        const result = await model.update(
          {
            status: 1, // Replace with your actual fields and values
          },
          {
            where: whereConditions,
          }
        );
        console.log(`Update successful for playType: ${playType}`, result);
      }

      if (model == NFLPlayer) {
        const conditions: any = {
          firstName: { [Op.not]: null },
          lastName: { [Op.not]: null },
          college: { [Op.not]: null },
        };

        // Only filter by position if setting.position is not "-1"
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

        console.log(`Update successful for playType: ${playType}`, result);
      }
    } catch (error) {
      console.error(`Error updating players for playType: ${playType}`, error);
    }
  }
};
