import dotenv from "dotenv";
dotenv.config();

export const APIUrl = "https://api.balldontlie.io/nfl/v1/players";
export const Port = 5000;
export const IPAddress =
  process.env.LIVE_MODE === "true"
    ? "https://alumnigrid.com"
    : "http://localhost:3000";
export const BackendURL = `${IPAddress}:${Port}`;
export const FrontendURL = `${IPAddress}`;
