import express from "express";
import {
  createOrUpdateSetting,
  deleteSetting,
  getSetting,
} from "../controller/adminController";

const router = express.Router();

router.get("/", getSetting);

router.post("/", createOrUpdateSetting);

router.delete("/:id", deleteSetting);

export default router;
