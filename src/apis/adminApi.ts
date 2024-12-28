import express from "express";
import {
  createOrUpdateSetting,
  deleteSetting,
  getSetting,
} from "../controller/adminController";

const router = express.Router();

router.get("/:type", getSetting);

router.post("/:type", createOrUpdateSetting);

router.delete("/:id", deleteSetting);

export default router;
