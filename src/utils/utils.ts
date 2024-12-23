import { GameDuration } from "../config/config";

export const delay = async (delayTime: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayTime * 1000));
};

export const getRandNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + 1;
};

export const getStartTimeByTimestampDaily = (timestamp: number) => {
  const currentTime =
    timestamp === 0 ? Math.floor(new Date().getTime() / 1000) : timestamp;

  // const pstOffset = 8 * 3600;
  const pstOffset = 0;

  const startTime =
    Math.floor(currentTime / GameDuration) * GameDuration - pstOffset;
  return startTime;
};
