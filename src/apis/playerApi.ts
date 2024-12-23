import express from "express";
import {
  getColleges,
  getPlayerInfo,
  identifyingCollege,
} from "../controller/playersController";

const router = express.Router();

router.get("/colleges", getColleges);

router.post("/college", identifyingCollege);

router.get("/:id", getPlayerInfo);

export default router;
