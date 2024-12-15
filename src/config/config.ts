import dotenv from "dotenv";
dotenv.config();

export const APIUrl = "https://api.balldontlie.io/nfl/v1/players";
export const Port = 5000;
export const IPAddress =
  process.env.LIVE_MODE === "true"
    ? "http://147.182.188.81"
    : "http://localhost";
export const BackendURL = `${IPAddress}:${Port}`;
export const FrontendURL = `${IPAddress}:3000`;
