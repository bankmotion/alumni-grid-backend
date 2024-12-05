import sequelize from "./config/db";
import Player from "./models/NFLPlayers";
import Team from "./models/NFLTeams";

export const syncDatabase = async () => {
  try {
    await sequelize.sync(); // `force: true` drops existing tables and recreates them
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  } finally {
  }
};
