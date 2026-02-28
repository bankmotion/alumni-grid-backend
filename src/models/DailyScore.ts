import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

export interface DailyScoreAttributes {
  id?: number;
  userId: number;
  score: number;
  playType: number;
  timestamp: number;
}

interface DailyScoreCreationAttributes extends Optional<DailyScoreAttributes, "id"> {}

class DailyScore extends Model<DailyScoreAttributes, DailyScoreCreationAttributes> {}

DailyScore.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    playType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "daily_scores",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "playType", "timestamp"],
      },
      {
        fields: ["timestamp", "playType", "score"],
      },
    ],
  }
);

DailyScore.belongsTo(User, { foreignKey: "userId" });
User.hasMany(DailyScore, { foreignKey: "userId" });

export default DailyScore;
