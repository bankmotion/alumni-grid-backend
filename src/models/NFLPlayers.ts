import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import NFLTeam, { NFLTeamAttributes } from "./NFLTeams";

export interface NFLPlayerAttributes {
  id?: number;
  firstName?: string;
  lastName?: string;
  position?: string;
  positionAbbreviation?: string;
  height?: string;
  weight?: string;
  jerseyNumber?: string;
  college?: string;
  experience?: string;
  age?: number;
  teamId?: number; // Foreign Key
  status?: number;
}

interface NFLPlayerCreationAttributes extends Optional<NFLPlayerAttributes, "id"> {}

class NFLPlayer extends Model<NFLPlayerAttributes, NFLPlayerCreationAttributes> {}

NFLPlayer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    positionAbbreviation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jerseyNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    college: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: NFLTeam,
        key: "id",
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "nfl_players",
    timestamps: false,
  }
);

NFLPlayer.belongsTo(NFLTeam, { foreignKey: "teamId" });
NFLTeam.hasMany(NFLPlayer, { foreignKey: "teamId" });

export default NFLPlayer;
