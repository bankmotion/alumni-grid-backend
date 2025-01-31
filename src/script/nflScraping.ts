import axios from "axios";
import {
  getAllPlayerByName,
  getAllPlayerListByType,
  updatePlayersById,
} from "../service/playersService";
import { PlayType } from "../config/constant";
import puppeteer from "puppeteer-core";

const getPlayerImageLink = async (firstName: string) => {
  const url = `https://www.nfl.com/players/active/all?query=${firstName}`;
  const results: { name: string; image: string }[] = [];

  const browser = await puppeteer.launch({
    // headless: false,
    // defaultViewport: null,
    // args: ["--start-maximize"],
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
    if (!data || !data.length) return;

    console.log({ count: data.length });
    const dat = data[0];

    // const link = await getPlayerImageLink("dev");

    await updatePlayersById(
      {
        imageLink: 0,
      },
      { id: dat.dataValues.id },
      PlayType.NFL
    );

    if (!dat.dataValues.firstName) {
      setTimeout(() => {
        start();
      }, 10000);
      return;
    }

    const links = await getPlayerImageLink(dat.dataValues.firstName);
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

    start();
  } catch (err) {
    console.error(err);
    setTimeout(() => {
      start();
    }, 10000);
  }
};

start();
