import { Op } from "sequelize";
import { ActiveStatus, Difficulty, PlayType } from "../config/constant";
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

export const getRandPlayerInfo = async (playType: PlayType) => {
  const model = getModelFromPlayType(playType);

  let data: NBAPlayer[] | NFLPlayer[] = [];
  let gridCount = 9;
  let indexArr: number[] = [];
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

    while (gridCount) {
      console.log(data.slice(0, 10).map((dat) => dat.dataValues));
      const filteredData = data.filter(
        (dat) =>
          (dat.dataValues.difficulty as Difficulty) ===
          (Math.ceil(gridCount / 3) as Difficulty)
      );
      const dataCount = filteredData.length;
      console.log({
        dataCount,
        difficulty: Math.ceil(gridCount / 3) as Difficulty,
      });
      if (!dataCount) return [];
      const randNum = getRandNumber(0, dataCount - 1);
      if (indexArr.findIndex((num) => num === randNum) !== -1) continue;
      indexArr.push(randNum);
      resArr.push(filteredData[randNum]);
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

//   // Parse settings and filter out invalid ones
//   const settings = allSettings
//     .map((setting) =>
//       setting.dataValues.setting ? JSON.parse(setting.dataValues.setting) : null
//     )
//     .filter((setting) => setting !== null); // Remove null entries

//   console.log(settings, "settings");

//   // Update all NBA players' status to 0
//   await NBAPlayer.update(
//     {
//       // Set the status to 0 for all records
//       status: 0,
//     },
//     {
//       where: {} // No condition, update all records
//     }
//   );

//   // Update all NFL players' status to 0
//   await NFLPlayer.update(
//     {
//       // Set the status to 0 for all records
//       status: 0,
//     },
//     {
//       where: {} // No condition, update all records
//     }
//   );

//   // Iterate over parsed settings and update status
//   for (const setting of settings) {
//     if (!setting || typeof setting.type === "undefined") {
//       console.warn("Invalid setting:", setting);
//       continue; // Skip invalid settings
//     }

//     // Map setting.type to PlayType using a mapping object
//     const playTypeMapping: Record<number, PlayType> = {
//       0: PlayType.NBA,
//       1: PlayType.NFL,
//     };

//     console.log(playTypeMapping[setting.type], "playTypeMapping[setting.type]")
//     const playType = playTypeMapping[setting.type];
//     // if (!playType) {
//     //   console.warn("Unknown play type for setting:", setting);
//     //   continue;
//     // }

//     // Get the model based on playType
//     const model = getModelFromPlayType(playType);
//     console.log(model, "model")
//     if (!model) {
//       console.warn("No model found for playType:", playType);
//       continue;
//     }

//     console.log(`Model found for playType: ${playType}. Proceed with updating logic.`);

//     // Prepare conditions
//     const countryCondition =
//       setting.country === "-1"
//         ? { [Op.or]: ["USA", "Canada"] } // Country is USA or Canada
//         : setting.country; // Otherwise, match the specific country

//     const draftYearCondition = parseInt(setting.draft, 10) || 0; // Convert draft to number, default to 0 if invalid
//     const experience = parseInt(setting.experience) || 0;
//     const ageTo = parseInt(setting.ageTo) || 0;
//     const ageFrom = parseInt(setting.ageFrom) || 0;
//     try {
//       // Perform the update
//       if (model == NBAPlayer) {
//         const result = await model.update(
//           {
//             // Fields to update (example: add other fields as required)
//             status: 1, // Replace with your actual fields and values
//           },
//           {
//             where: {
//               firstName: { [Op.not]: null as any },
//               lastName: { [Op.not]: null as any },
//               college: { [Op.not]: null as any },
//               position: setting.position, // Match position from the setting
//               country: countryCondition, // Apply country condition
//               draftYear: { [Op.gte]: draftYearCondition }, // Draft year >= setting.draft
//             },
//           }
//         );
//         console.log(`Update successful for playType: ${playType}`, result);
//       }
//       if (model == NFLPlayer) {
//         const conditions: any = {
//           firstName: { [Op.not]: null },
//           lastName: { [Op.not]: null },
//           college: { [Op.not]: null },
//           position: setting.position,
//         };

//         if (experience) {
//           conditions.experience = { [Op.gte]: experience };
//         }

//         if (ageTo && ageFrom) {
//           conditions.age = { [Op.between]: [ageFrom, ageTo] };
//         }

//         const result = await model.update(
//           { status: 1 },
//           { where: conditions }
//         );

//         console.log(`Update successful for playType: ${playType}`, result);
//       }

//     } catch (error) {
//       console.error(`Error updating players for playType: ${playType}`, error);
//     }
//   }
// };

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
