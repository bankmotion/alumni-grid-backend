import express from "express"
import {
  createOrUpdateSetting,
  csvUploadNBA,
  csvUploadNFL,
  deleteSetting,
  getSetting,
  updateDifficultyStatus,
  updateImageLink,
} from "../controller/adminController"
import multer from "multer"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

router.get("/:type", getSetting)

router.post("/game/csvUploadNBA", upload.single("file"), csvUploadNBA)

router.post("/game/csvUploadNFL", upload.single("file"), csvUploadNFL)

router.post("/:type", createOrUpdateSetting)

router.delete("/:id/:type", deleteSetting)

router.post("/difficulty/:type", updateDifficultyStatus)

router.put("/image/:type", updateImageLink)

export default router
