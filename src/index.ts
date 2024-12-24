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
dotenv.config();

const app = express();

app.use(cors({ origin: [LiveFrontendURL, LocalFrontendURL, WWWFrontendURL] }));

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

      createNewGameEvent();
    });
  } catch (err) {
    console.error(`Error synchronizing the database: ${err}`);
  }
};

startServer();
