import axios from "axios";
import {
  getAllPlayerByName,
  getAllPlayerListByType,
  updatePlayersById,
} from "../service/playersService";
import { PlayType } from "../config/constant";
import puppeteer, { Browser, Page } from "puppeteer-core";
import { delay } from "../utils/utils";

const launchBrowser = async () => {
  return await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    userDataDir: "/var/www",
  });
};

const getPlayerImageLink = async (firstName: string, page: Page) => {
  // const url = `https://www.nfl.com/players/active/all?query=${firstName}`;
  const url = `https://www.nfl.com/players/retired/all?query=${firstName}`;
  const results: { name: string; image: string }[] = [];

  await page.goto(url, { waitUntil: "load", timeout: 0 });

  const data = await page.evaluate(() => {
    const rows = Array.from(
      document.querySelectorAll("table.d3-o-team-stats--detailed tbody tr")
    );
    return rows.map((row) => {
      const name =
        row.querySelector("td a.d3-o-player-fullname")?.textContent?.trim() ||
        "";
      const image =
        row.querySelector("td img.img-responsive")?.getAttribute("src") || "";
      return { name, image };
    });
  });

  results.push(...data);

  return results;
};

let browser: Browser;
let page: Page;

const start = async (status: boolean = false) => {
  if (status) {
    browser = await launchBrowser();
    page = await browser.newPage();
  }

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

    const links = await getPlayerImageLink(
      dat.dataValues.firstName.slice(0, 3),
      page
    );
    console.log({
      id: dat.dataValues.id,
      count: links.length,
    });

    for (const link of links) {
      const results = await getAllPlayerByName(link.name, PlayType.NFL);
      console.log(results.length, link.name, link.image);
      const imageLink =
        results.length === 1 ? link.image : results.length.toString();

      for (const result of results) {
        await updatePlayersById(
          { imageLink: imageLink.replace("/t_lazy", "") },
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

start(true);
