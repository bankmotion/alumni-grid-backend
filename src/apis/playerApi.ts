import express from "express";
import {
  getAllPlayerList,
  getColleges,
  getPlayerInfo,
  identifyingCollege,
  updateActive,
} from "../controller/playersController";

const router = express.Router();

router.get("/colleges", getColleges);

router.post("/college", identifyingCollege);

router.get("/:id", getPlayerInfo);

router.get("/all/:type", getAllPlayerList);

router.put("/active/:type", updateActive);

export default router;
