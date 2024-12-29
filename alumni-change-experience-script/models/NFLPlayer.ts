import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; // Adjust the path to your database config file

export class NFLPlayer extends Model {
  public id!: number;
  public experience!: string | number;
}

NFLPlayer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    experience: {
      type: DataTypes.STRING, // Change to `DataTypes.INTEGER` if already numeric in the DB
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'NFLPlayer',
    tableName: 'nfl_players',
    timestamps: false, // Set to `true` if you have timestamps in your table
  }
);

export default NFLPlayer;
