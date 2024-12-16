import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/db";
import { BackendURL, FrontendURL, Port, WWWFrontendURL } from "./config/config";
import routes from "./routes";

const app = express();

app.use(cors({ origin: [FrontendURL, WWWFrontendURL] }));

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
      console.log(`Server is running on ${BackendURL}`);
    });
  } catch (err) {
    console.error(`Error synchronizing the database: ${err}`);
  }
};

startServer();
