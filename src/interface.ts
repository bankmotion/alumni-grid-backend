import { PlayType } from "./config/constant";

export interface SettingType {
  id?: number;
  type: PlayType;
  position?: string;
  country?: string;
  draft?: number;
  experience?: string;
  ageTo?: number;
  ageFrom?:number;
}
