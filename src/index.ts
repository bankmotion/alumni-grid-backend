import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/db";
import {
  LiveBackendURL,
  LiveFrontendURL,
  LocalBackendURL,
  LocalFrontendURL,
  Port,
  WWWFrontendURL,
} from "./config/config";
import routes from "./routes";
import dotenv from "dotenv";
import { createNewGameEvent } from "./events/newGameEvent";
import { PlayType } from "./config/constant";
import { updateNBAWithImageLink } from "./script/nbaImageScript";
dotenv.config();

const app = express();

app.use(cors({ origin: [LiveFrontendURL, LocalFrontendURL, WWWFrontendURL] }));

// app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("Database synchromized!🎉");

    app.listen(Port, () => {
      console.log(
        `Server is running on ${
          process.env.LIVE_MODE === "true" ? LiveBackendURL : LocalBackendURL
        }`
      );

      createNewGameEvent(PlayType.NBA);
      createNewGameEvent(PlayType.NFL);

      updateNBAWithImageLink();
    });
  } catch (err) {
    console.error(`Error synchronizing the database: ${err}`);
  }
};

startServer();
