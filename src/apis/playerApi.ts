import express from "express";
import {
  getColleges,
  getPlayerInfo,
  getRandPlayerNames,
  identifyingCollege,
} from "../controller/playersController";

const router = express.Router();

router.get("/colleges", getColleges);

router.get("/randplayer", getRandPlayerNames);

router.post("/college", identifyingCollege);

router.get("/:id", getPlayerInfo);

export default router;
