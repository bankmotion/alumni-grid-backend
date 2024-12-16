import dotenv from "dotenv";
dotenv.config();

export const APIUrl = "https://api.balldontlie.io/nfl/v1/players";
export const Port = 5000;
export const IPAddress =
  process.env.LIVE_MODE === "true"
    ? "https://backend.alumnigrid.com"
    : "http://localhost:3000";
console.log(IPAddress);
export const BackendURL = `${IPAddress}`;
export const FrontendURL = `${IPAddress}`;
