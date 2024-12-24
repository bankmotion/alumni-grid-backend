import { GameDuration } from "../config/config";

export const delay = async (delayTime: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayTime * 1000));
};

export const getRandNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + 1;
};

export const getStartTimeByTimestampDaily = (timestamp: number) => {
  const currentTime = timestamp === 0 ? new Date() : new Date(timestamp * 1000);

  const utcTime = currentTime.getTime();

  const pstOffset = -8 * 3600 * 1000;
  const pstDate = new Date(utcTime + pstOffset);
  pstDate.setUTCHours(0, 0, 0, 0);

  return Math.floor((pstDate.getTime() - pstOffset) / 1000);
};
