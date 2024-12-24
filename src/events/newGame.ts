import { GameDuration } from "../config/config";
import { createNewGame, getLatestTimestamp } from "../service/historyService";
import { getStartTimeByTimestampDaily } from "../utils/utils";

const createNewGameDaily = async () => {
  try {
    let latestTime = (await getLatestTimestamp()) + GameDuration;

    const nowTime = Math.floor(new Date().getTime() / 1000);
    const nowGameTime = getStartTimeByTimestampDaily(nowTime);

    while (nowGameTime <= latestTime) {
      await createNewGame(latestTime);
      latestTime += GameDuration;
    }

    const remainTime = (await getLatestTimestamp()) + GameDuration;
    return remainTime;
  } catch (err) {
    console.error(`Error in createnewGameDaily event: ${err}`);
    throw err;
  }
};

export const createNewGameEvent = async () => {
  try {
    const scheduleNextTime = async () => {
      const remainTime = await createNewGameDaily();

      setTimeout(async () => {
        await scheduleNextTime();
      }, 1000 * remainTime);
    };

    await scheduleNextTime();
  } catch (err) {
    console.error("Error in createNewGameEvent:", err);
  }
};
