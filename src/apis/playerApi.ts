import express from "express";
import {
  gameStart,
  getAllPlayerList,
  getColleges,
  getPlayerInfo,
  identifyingCollege,
  updateActive,
} from "../controller/playersController";

const router = express.Router();

router.get("/colleges/:playType", getColleges); // using

router.post("/college/:playType", identifyingCollege); // using

router.post("/gamestart/:playType", gameStart); // using

router.get("/answer/:playType/:id", getPlayerInfo); // using

router.get("/all/:type", getAllPlayerList); // using

router.put("/active/:type", updateActive); // using

export default router;
