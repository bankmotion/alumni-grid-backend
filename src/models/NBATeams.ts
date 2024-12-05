import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export interface NBATeamAttributes {
  id?: number;
  conference?: string;
  division?: string;
  city?: string;
  name?: string;
  fullName?: string;
  abbreviation?: string;
}

interface NBATeamCreationAttributes extends Optional<NBATeamAttributes, "id"> {}

class NBATeam extends Model<NBATeamAttributes, NBATeamCreationAttributes> {}

NBATeam.init(
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
    city: {
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
    tableName: "nba_teams",
    timestamps: false,
  }
);

export default NBATeam;
