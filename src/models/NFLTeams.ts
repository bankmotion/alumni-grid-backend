import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export interface NFLTeamAttributes {
  id?: number;
  conference?: string;
  division?: string;
  location?: string;
  name?: string;
  fullName?: string;
  abbreviation?: string;
}

interface NFLTeamCreationAttributes extends Optional<NFLTeamAttributes, "id"> {}

class NFLTeam extends Model<NFLTeamAttributes, NFLTeamCreationAttributes> {}

NFLTeam.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    conference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "nfl_teams",
    timestamps: false,
  }
);

export default NFLTeam;
