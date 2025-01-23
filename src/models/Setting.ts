import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export interface SettingAttributes {
  id?: number;
  type?: number;
  setting?: string;
}

interface SettingCreationAttributes extends Optional<SettingAttributes, "id"> {}

class Setting extends Model<SettingAttributes, SettingCreationAttributes> {}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    setting: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "setting",
    timestamps: false,
  }
);

export default Setting;
