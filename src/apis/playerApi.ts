import express from "express";
import {
  getColleges,
  getRandPlayerNames,
  identifyingCollege,
} from "../controller/playersController";

const router = express.Router();

router.get("/colleges/:type", getColleges);

router.get("/randplayer/:type", getRandPlayerNames);

router.post("/college", identifyingCollege);

export default router;
