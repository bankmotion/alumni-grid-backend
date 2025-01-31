import axios from "axios";
import {
  getAllPlayerByName,
  getAllPlayerListByType,
  updatePlayersById,
} from "../service/playersService";
import { PlayType } from "../config/constant";
import puppeteer from "puppeteer";

const getPlayerImageLink = async (firstName: string) => {
  const url = `https://www.nfl.com/players/active/all?query=${firstName}`;
  const results: { name: string; image: string }[] = [];

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximize"],
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load", timeout: 0 });

  const data = await page.evaluate(() => {
    const rows = Array.from(
      document.querySelectorAll("table.d3-o-team-stats--detailed tbody tr")
    );
    return rows.map((row) => {
      const name =
        row.querySelector("td a.d3-o-player-fullname")?.textContent?.trim() ||
        "";
      const image = row.querySelector("td img")?.getAttribute("src") || "";
      return { name, image };
    });
  });

  results.push(...data);
  await browser.close();

  return results;
};

const start = async () => {
  try {
    let data = await getAllPlayerListByType(PlayType.NFL, true);
    if (!data) return;
    console.log({ count: data.length });
    for (const dat of data) {
      if (!dat.dataValues.firstName || dat.dataValues.imageLink) continue;
      // const link = await getPlayerImageLink("dev");
      const links = await getPlayerImageLink(
        dat.dataValues.firstName.slice(0, 3)
      );
      console.log({
        id: dat.dataValues.id,
        count: links.length,
      });

      for (const link of links) {
        const results = await getAllPlayerByName(link.name, PlayType.NFL);
        console.log(results.length, link.name, link.image);
        const imageLink = results.length === 1 ? link.image : results.length;

        for (const result of results) {
          await updatePlayersById(
            { imageLink },
            { id: result.dataValues.id },
            PlayType.NFL
          );
        }
      }

      data = await getAllPlayerListByType(PlayType.NFL, true);
    }
  } catch (err) {
    setTimeout(() => {
      start();
    }, 10000);
  }
};

start();
