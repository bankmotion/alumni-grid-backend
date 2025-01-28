import express from "express";
import {
  createOrUpdateSetting,
  deleteSetting,
  getSetting,
  updateDifficultyStatus,
} from "../controller/adminController";

const router = express.Router();

router.get("/:type", getSetting);

router.post("/:type", createOrUpdateSetting);

router.delete("/:id/:type", deleteSetting);

router.post("/difficulty/:type", updateDifficultyStatus);

export default router;
