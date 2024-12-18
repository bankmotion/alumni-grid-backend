import express from "express";
import {
  getColleges,
  getRandPlayerNames,
  identifyingCollege,
} from "../controller/playersController";

const router = express.Router();

router.get("/colleges", getColleges);

router.get("/randplayer", getRandPlayerNames);

router.post("/college", identifyingCollege);

export default router;
