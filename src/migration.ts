import axios from "axios";
import sequelize from "./config/db";
import { BalldontlieAPI } from "@balldontlie/sdk";
import NFLTeam from "./models/NFLTeams";
import NFLPlayer from "./models/NFLPlayers";
import { syncDatabase } from "./dbSync";
import NBATeam from "./models/NBATeams";
import NBAPlayer from "./models/NBAPlayers";
import { delay } from "./utils/utils";

const API_KEY = process.env.API_KEY || "";

const fetchAndMigrate = async () => {
  try {
    let cursor = 0;
    const perPage = 100;

    const api = new BalldontlieAPI({ apiKey: API_KEY });

    await syncDatabase();

    while (true) {
      const response = await api.nfl.getPlayers({ cursor, per_page: perPage });

      await sequelize.transaction(async (transaction) => {
        for (const playerData of response.data) {
          const teamData = {
            id: playerData.team.id,
            conference: playerData.team.conference,
            division: playerData.team.division,
            location: playerData.team.location,
            name: playerData.team.name,
            fullName: playerData.team.full_name,
            abbreviation: playerData.team.abbreviation,
          };

          const [team] = await NFLTeam.upsert(teamData, { transaction });

          const player = {
            id: playerData.id,
            firstName: playerData.first_name,
            lastName: playerData.last_name,
            position: playerData.position,
            positionAbbreviation: playerData.position_abbreviation,
            height: playerData.height,
            weight: playerData.weight,
            jerseyNumber: playerData.jersey_number,
            college: playerData.college,
            experience: playerData.experience,
            age: playerData.age,
            teamId: team.dataValues.id,
          };

          await NFLPlayer.create(player, { transaction });
        }
      });

      console.log(response.data?.length);

      if (!response.meta || !response.meta.next_cursor) {
        break;
      }

      cursor = response.meta.next_cursor;
    }

    // while (true) {
    //   await delay(5);
    //   const response = await api.nba.getPlayers({ cursor, per_page: perPage });

    //   await sequelize.transaction(async (transaction) => {
    //     for (const playerData of response.data) {
    //       const teamData = {
    //         id: playerData.team.id,
    //         conference: playerData.team.conference,
    //         division: playerData.team.division,
    //         city: playerData.team.city,
    //         name: playerData.team.name,
    //         fullName: playerData.team.full_name,
    //         abbreviation: playerData.team.abbreviation,
    //       };

    //       const [team] = await NBATeam.upsert(teamData, { transaction });

    //       const player = {
    //         id: playerData.id,
    //         firstName: playerData.first_name,
    //         lastName: playerData.last_name,
    //         position: playerData.position,
    //         height: playerData.height,
    //         weight: playerData.weight,
    //         jerseyNumber: playerData.jersey_number,
    //         college: playerData.college,
    //         country: playerData.country,
    //         draftYear: playerData.draft_year,
    //         draftRound: playerData.draft_round,
    //         draftNumber: playerData.draft_number,
    //         teamId: team.dataValues.id,
    //       };

    //       await NBAPlayer.create(player, { transaction });
    //     }
    //   });

    //   console.log(response.data?.length);

    //   if (!response.meta || !response.meta.next_cursor) {
    //     break;
    //   }

    //   cursor = response.meta.next_cursor;
    // }
  } catch (err) {
    console.error(`Error during migration: `, err);
  } finally {
    await sequelize.close();
  }
};

fetchAndMigrate();
