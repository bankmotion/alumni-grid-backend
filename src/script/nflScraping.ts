import axios from "axios";
import {
  getAllPlayerByName,
  getAllPlayerListByType,
  updatePlayersById,
} from "../service/playersService";
import { PlayType } from "../config/constant";
import puppeteer, { Page } from "puppeteer-core";
import { delay } from "../utils/utils";

const launchBrowser = async () => {
  return await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    userDataDir: "/var/www",
  });
};

const getPlayerImageLink = async (firstName: string, page: Page) => {
  const url = `https://www.nfl.com/players/active/all?query=${firstName}`;
  const results: { name: string; image: string }[] = [];

  await page.goto(url, { waitUntil: "load", timeout: 0 });
  await delay(3000);

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

  return results;
};

const start = async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    let data = await getAllPlayerListByType(PlayType.NFL, true);
    if (!data || !data.length) return;

    console.log({ count: data.length });
    const dat = data[0];

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

    const links = await getPlayerImageLink(dat.dataValues.firstName, page);
    console.log({
      id: dat.dataValues.id,
      count: links.length,
    });

    for (const link of links) {
      const results = await getAllPlayerByName(
        link.name.slice(0, 3),
        PlayType.NFL
      );
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
