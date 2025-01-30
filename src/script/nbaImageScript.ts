import { PlayType } from "../config/constant";
import { nbaData } from "../config/nba";
import {
  getAllPlayerListByType,
  updatePlayersById,
} from "../service/playersService";

export const updateNBAWithImageLink = async () => {
  const dbData = await getAllPlayerListByType(PlayType.NBA);

  if (dbData) {
    for (const data of nbaData) {
      const filterData = dbData.filter(
        (dat) =>
          dat.dataValues.firstName === data[2] &&
          dat.dataValues.lastName === data[1]
      );
      if (data[26]) {
        await updatePlayersById(
          {
            imageLink: `https://cdn.nba.com/headshots/nba/latest/260x190/${data[0]}.png`,
          },
          { id: data[26] },
          PlayType.NBA
        );
      } else if (filterData.length !== 1) {
        console.log("-----------");
        console.log(
          data[0],
          data[2],
          data[1],
          filterData.map((dat) => dat.dataValues.id)
        );
      } else {
        await updatePlayersById(
          {
            imageLink: `https://cdn.nba.com/headshots/nba/latest/260x190/${data[0]}.png`,
          },
          { id: filterData[0].dataValues.id },
          PlayType.NBA
        );
      }
    }
  }
};
