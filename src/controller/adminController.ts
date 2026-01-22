import { Request, Response } from "express"
import { SettingType } from "../interface"
import {
  createNewSetting,
  deleteSettingById,
  getSettings,
  updateSetting,
} from "../service/adminService"
import {
  updatePlayersById,
  updateStatusOfPlayers,
} from "../service/playersService"
import {
  Difficulty,
  NBA_COLUMNS,
  NFL_COLUMNS,
  PlayType,
} from "../config/constant"
import csv from "csv-parser"
import fs from "fs"
import NBAPlayer from "../models/NBAPlayers"
import NFLPlayer from "../models/NFLPlayers"

export const createOrUpdateSetting = async (req: Request, res: Response) => {
  try {
    const { id, position, country, draft, experience, ageTo, ageFrom } =
      req.body
    const { type } = req.params

    const data: SettingType = { type: Number(type) }
    if (Number(id) >= 0) data.id = Number(id)
    if (position) data.position = position
    if (country) data.country = country
    if (draft) data.draft = draft
    if (experience) data.experience = experience
    if (ageTo) data.ageTo = Number(ageTo)
    if (ageFrom) data.ageFrom = Number(ageFrom)

    if (data.id && data.id >= 0) {
      await updateSetting(data)
    } else {
      await createNewSetting(data)
    }

    const settings = await getSettings(Number(type) as PlayType)

    await updateStatusOfPlayers(settings, Number(type) as PlayType)

    res.status(200).json({ status: 200 })
  } catch (err) {
    console.error(`adminController ~ createOrUpdateSetting() =>${err}`)
    res
      .status(500)
      .json({ status: 500, message: "Failed to create or update setting" })
  }
}

export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params
    await deleteSettingById(Number(id))

    const settings = await getSettings(Number(type) as PlayType)
    await updateStatusOfPlayers(settings, Number(type) as PlayType)

    res.status(200).json({ status: 200 })
  } catch (err) {
    console.error(`adminController ~ deleteSetting() => ${err}`)
    res.status(500).json({ status: 500, message: "Failed to delete setting" })
  }
}

export const getSetting = async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const data = await getSettings(Number(type))

    res.status(200).json({ status: 200, data })
  } catch (err) {
    console.error(`adminController ~ getSetting() => ${err}`)
    res.status(500).json({ status: 500, message: "Failed to get setting" })
  }
}

export const updateDifficultyStatus = async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const { ids, difficulty } = req.body

    if (!Array.isArray(ids) || typeof difficulty !== "number") {
      res.status(400).json({ status: 400, error: "Invalid input data" })
      return
    }

    for (const id of ids) {
      await updatePlayersById({ difficulty }, { id }, Number(type))
    }

    res.status(200).json("Updated successfully")
  } catch (err) {
    console.error(`adminController ~ updateDifficultyStatus() => ${err}`)
    res.status(500).json({ status: 500, message: "Failed to get setting" })
  }
}

export const updateImageLink = async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const { id, imageLink, college } = req.body

    if (typeof id !== "number" || typeof imageLink !== "string") {
      res.status(400).json({ status: 400, error: "Invalid input data" })
      return
    }

    await updatePlayersById({ imageLink, college }, { id }, Number(type))
    res.status(200).json("Updated successfully")
  } catch (err) {
    console.error(`adminController ~ updateImageLink() => ${err}`)
    res
      .status(500)
      .json({ status: 500, message: "Failed to update image link" })
  }
}

export const csvUploadNBA = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "CSV file is required" })
    return
  }

  const rows: Array<string[]> = []

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(req.file!.path)
        .pipe(csv())
        .on("data", (data: Record<string, string>) => {
          const row = NBA_COLUMNS.map((col) => data[col] ?? null)
          rows.push(row)
        })
        .on("end", () => resolve())
        .on("error", reject)
    })

    if (rows.length === 0) {
      res.status(400).json({ error: "CSV file is empty" })
      return
    }

    rows.forEach((player) => {
      console.log(player)
      NBAPlayer.upsert({
        id: Number(player[0]),
        firstName: player[1],
        lastName: player[2],
        position: player[3],
        height: player[4],
        weight: player[5],
        jerseyNumber: player[6],
        college: player[7],
        country: player[8],
        draftYear: Number(player[9]),
        draftRound: Number(player[10]),
        draftNumber: Number(player[11]),
        teamId: Number(player[12]),
        status: Number(player[13]),
        active: Number(player[14]),
        difficulty: Number(player[15]),
        imageLink: player[16],
      })
    })

    res.status(200).json({
      message: "CSV uploaded successfully",
      insertedRows: rows.length,
    })
    return
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to process CSV file",
    })
    return
  } finally {
    fs.unlink(req.file.path, () => {})
  }
}

export const csvUploadNFL = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "CSV file is required" })
    return
  }

  const rows: Array<string[]> = []

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(req.file!.path)
        .pipe(csv())
        .on("data", (data: Record<string, string>) => {
          const row = NFL_COLUMNS.map((col) => data[col] ?? null)
          rows.push(row)
        })
        .on("end", () => resolve())
        .on("error", reject)
    })

    if (rows.length === 0) {
      res.status(400).json({ error: "CSV file is empty" })
      return
    }

    rows.forEach((player) => {
      console.log(player)
      NFLPlayer.upsert({
        id: Number(player[0]),
        firstName: player[1],
        lastName: player[2],
        position: player[3],
        positionAbbreviation: player[4],
        height: player[5],
        weight: player[6],
        jerseyNumber: player[7],
        college: player[8],
        experience: player[9],
        age: Number(player[10]),
        teamId: Number(player[11]),
        status: Number(player[12]),
        active: Number(player[13]),
        difficulty: Number(player[14]),
        imageLink: player[15],
      })
    })

    res.status(200).json({
      message: "CSV uploaded successfully",
      insertedRows: rows.length,
    })
    return
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to process CSV file",
    })
    return
  } finally {
    fs.unlink(req.file.path, () => {})
  }
}
