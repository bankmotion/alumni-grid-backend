import express from "express";
import {
  getAllPlayerList,
  getColleges,
  getPlayerInfo,
  identifyingCollege,
} from "../controller/playersController";

const router = express.Router();

router.get("/colleges", getColleges);

router.post("/college", identifyingCollege);

router.get("/:id/:type", getPlayerInfo);

router.get("/all/:type", getAllPlayerList);

export default router;
