import { GameDuration } from "../config/config";
import { PlayType } from "../config/constant";
import { createNewGame, getLatestTimestamp } from "../service/historyService";
import { delay, getStartTimeByTimestampDaily } from "../utils/utils";

const createNewGameDaily = async (playType: PlayType) => {
  try {
    let latestTime = (await getLatestTimestamp(playType)) + GameDuration;

    const nowTime = Math.floor(new Date().getTime() / 1000);
    const nowGameTime = getStartTimeByTimestampDaily(nowTime);

    console.log("hi", nowGameTime, latestTime)
    while (nowGameTime >= latestTime) {
      const result = await createNewGame(latestTime, playType);
      if (!result) return latestTime;
      latestTime += GameDuration;
    }

    const remainTime = latestTime - nowTime;
    return remainTime;
  } catch (err) {
    console.error(`Error in createnewGameDaily event: ${err}`);
    throw err;
  }
};

export const createNewGameEvent = async (playType: PlayType) => {
  try {
    const scheduleNextTime = async () => {
      const remainTime = await createNewGameDaily(playType);

      console.log({ remainTime });

      setTimeout(async () => {
        await scheduleNextTime();
      }, 1000 * remainTime);
    };

    await scheduleNextTime();
  } catch (err) {
    console.error("Error in createNewGameEvent:", err);
  }
};
