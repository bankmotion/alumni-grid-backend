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

// export const updateStatusOfPlayers = async (allSettings: Setting[]) => {
//   console.log(allSettings, "allSettings_1");

//   // Parse settings
//   const settings = allSettings.map((setting) =>
//     setting.dataValues.setting ? JSON.parse(setting.dataValues.setting) : null
//   );

//   console.log(settings, "settings");

//   // Iterate over parsed settings and update status
//   settings.forEach(async (setting) => {
//     if (!setting || typeof setting.type === "undefined") {
//       console.warn("Invalid setting:", setting);
//       return;
//     }

//     // Map setting.type to PlayType
//     let playType: PlayType;
//     switch (setting.type) {
//       case 0:
//         playType = PlayType.NBA;
//         break;
//       case 1:
//         playType = PlayType.NFL;
//         break;
//       default:
//         console.warn("Unknown play type for setting:", setting);
//         return;
//     }

//     // Get the model based on playType
//     const model = getModelFromPlayType(playType);
//     console.log(model, "model");

//     // Additional logic for updating player status can go here
//     if (model) {
//       console.log(`Model found for playType: ${playType}. Proceed with updating logic.`);

//       const countryCondition =
//         setting.country === "-1"
//           ? { [Op.or]: ["USA", "Canada"] } // Country is USA or Canada
//           : setting.country; // Otherwise, match the specific country

//       const draftYearCondition = parseInt(setting.draft, 10) || 0; // Convert draft to number, default to 0 if invalid

//       const result = await model.update(
//         {
//           // Fields to update (example: you can add fields here as required)
//           status: 1, // Replace with your actual fields and values
//         },
//         {
//           where: {
//             firstName: { [Op.not]: null as any },
//             lastName: { [Op.not]: null as any },
//             college: { [Op.not]: null as any },
//             position: setting.position, // Match position from the setting
//             country: countryCondition, // Apply country condition
//             draftYear: { [Op.gte]: draftYearCondition }, // Draft year >= setting.draft
//           },
//         }
//       );

//     } else {
//       console.warn("No model found for playType:", playType);
//     }
//   });
// };

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
      where: {} // No condition, update all records
    }
  );

  // Update all NFL players' status to 0
  await NFLPlayer.update(
    {
      // Set the status to 0 for all records
      status: 0,
    },
    {
      where: {} // No condition, update all records
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

    console.log(playTypeMapping[setting.type], "playTypeMapping[setting.type]")
    const playType = playTypeMapping[setting.type];
    // if (!playType) {
    //   console.warn("Unknown play type for setting:", setting);
    //   continue;
    // }

    // Get the model based on playType
    const model = getModelFromPlayType(playType);
    console.log(model, "model")
    if (!model) {
      console.warn("No model found for playType:", playType);
      continue;
    }

    console.log(`Model found for playType: ${playType}. Proceed with updating logic.`);

    // Prepare conditions
    const countryCondition =
      setting.country === "-1"
        ? { [Op.or]: ["USA", "Canada"] } // Country is USA or Canada
        : setting.country; // Otherwise, match the specific country

    const draftYearCondition = parseInt(setting.draft, 10) || 0; // Convert draft to number, default to 0 if invalid
    const experience = parseInt(setting.experience) || 0;
    const ageTo = parseInt(setting.ageTo) || 0;
    const ageFrom = parseInt(setting.ageFrom) || 0;
    try {
      // Perform the update
      if (model == NBAPlayer) {
        const result = await model.update(
          {
            // Fields to update (example: add other fields as required)
            status: 1, // Replace with your actual fields and values
          },
          {
            where: {
              firstName: { [Op.not]: null as any },
              lastName: { [Op.not]: null as any },
              college: { [Op.not]: null as any },
              position: setting.position, // Match position from the setting
              country: countryCondition, // Apply country condition
              draftYear: { [Op.gte]: draftYearCondition }, // Draft year >= setting.draft
            },
          }
        );
        console.log(`Update successful for playType: ${playType}`, result);
      }
      if (model == NFLPlayer) {
        const conditions: any = {
          firstName: { [Op.not]: null },
          lastName: { [Op.not]: null },
          college: { [Op.not]: null },
          position: setting.position,
        };

        if (experience) {
          conditions.experience = { [Op.gte]: experience };
        }

        if (ageTo && ageFrom) {
          conditions.age = { [Op.between]: [ageFrom, ageTo] };
        }

        const result = await model.update(
          { status: 1 },
          { where: conditions }
        );

        console.log(`Update successful for playType: ${playType}`, result);
      }

    } catch (error) {
      console.error(`Error updating players for playType: ${playType}`, error);
    }
  }
};

