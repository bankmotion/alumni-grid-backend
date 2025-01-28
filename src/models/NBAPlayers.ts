import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import NBATeam, { NBATeamAttributes } from "./NBATeams";

export interface NBAPlayerAttributes {
  id?: number;
  firstName?: string;
  lastName?: string;
  position?: string;
  height?: string;
  weight?: string;
  jerseyNumber?: string;
  college?: string;
  country?: string;
  draftYear?: number;
  draftRound?: number;
  draftNumber?: number;
  teamId?: number; // Foreign Key
  status?: number;
  active?: number;
  difficulty?: number;
}

interface NBAPlayerCreationAttributes
  extends Optional<NBAPlayerAttributes, "id"> {}

class NBAPlayer extends Model<
  NBAPlayerAttributes,
  NBAPlayerCreationAttributes
> {}

NBAPlayer.init(
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
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    draftYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    draftRound: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    draftNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: NBATeam,
        key: "id",
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "nba_players",
    timestamps: false,
  }
);

NBAPlayer.belongsTo(NBATeam, { foreignKey: "teamId" });
NBATeam.hasMany(NBAPlayer, { foreignKey: "teamId" });

export default NBAPlayer;
