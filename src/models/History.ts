import { DataTypes, Model, Optional } from "sequelize";
import NBAPlayer from "./NBAPlayers";
import sequelize from "../config/db";

export interface HistoryAttributes {
  id?: number;
  playerId?: number;
  timestamp?: number;
  playingCount?: number;
  correctCount?: number;
}

interface HistoryCreationAttributes extends Optional<HistoryAttributes, "id"> {}

class History extends Model<HistoryAttributes, HistoryCreationAttributes> {}

History.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    playerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: NBAPlayer,
        key: "id",
      },
    },
    timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    correctCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "history",
    timestamps: false,
  }
);

History.belongsTo(NBAPlayer, { foreignKey: "playerId" });
NBAPlayer.hasMany(History, { foreignKey: "playerId" });

export default History;
