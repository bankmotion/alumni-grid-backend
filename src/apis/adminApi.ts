import express from "express";
import {
  createOrUpdateSetting,
  deleteSetting,
  getSetting,
  updateDifficultyStatus,
  updateImageLink,
} from "../controller/adminController";

const router = express.Router();

router.get("/:type", getSetting);

router.post("/:type", createOrUpdateSetting);

router.delete("/:id/:type", deleteSetting);

router.post("/difficulty/:type", updateDifficultyStatus);

router.put("/image/:type", updateImageLink);

export default router;
