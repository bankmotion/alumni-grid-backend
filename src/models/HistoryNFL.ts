import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import NFLPlayer from "./NFLPlayers";

export interface HistoryNFLAttributes {
  id?: number;
  playerId?: number;
  timestamp?: number;
  playingCount?: number;
  correctCount?: number;
}

interface HistoryNFLCreationAttributes
  extends Optional<HistoryNFLAttributes, "id"> {}

class HistoryNFL extends Model<
  HistoryNFLAttributes,
  HistoryNFLCreationAttributes
> {}

HistoryNFL.init(
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
        model: NFLPlayer,
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
    tableName: "history_nfl",
    timestamps: false,
  }
);

HistoryNFL.belongsTo(NFLPlayer, { foreignKey: "playerId" });
NFLPlayer.hasMany(HistoryNFL, { foreignKey: "playerId" });

export default HistoryNFL;
