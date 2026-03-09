import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
dotenv.config()
import express from "express"
import cors from "cors"
import {
  streamInterpretation,
  streamModuleInterpretation,
  streamPairingInterpretation,
} from "./interpret.js"
import profileSave from "../api/profile/save.js"
import profileLoad from "../api/profile/load.js"
import profileUpdate from "../api/profile/update.js"
import subscribe from "../api/subscribe.js"
import unsubscribe from "../api/unsubscribe.js"
import sendContemplations from "../api/cron/send-contemplations.js"
import setupSchema from "../api/setup/schema.js"
import sendTestEmail from "../api/send-test-email.js"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post("/api/profile/save", (req, res) => profileSave(req, res))
app.get("/api/profile/load", (req, res) => profileLoad(req, res))
app.patch("/api/profile/update", (req, res) => profileUpdate(req, res))
app.post("/api/subscribe", (req, res) => subscribe(req, res))
app.get("/api/unsubscribe", (req, res) => unsubscribe(req, res))
app.all("/api/cron/send-contemplations", (req, res) => sendContemplations(req, res))
app.get("/api/setup/schema", (req, res) => setupSchema(req, res))
app.post("/api/send-test-email", (req, res) => sendTestEmail(req, res))

app.post("/api/interpret", async (req, res) => {
  const { scores, moduleId, familyA, familyB, context, selectedCategories } = req.body

  try {
    let stream
    if (familyA && familyB && context) {
      stream = streamPairingInterpretation(familyA, familyB, context)
    } else if (moduleId && scores && typeof scores === "object") {
      stream = streamModuleInterpretation(scores, moduleId)
    } else if (scores && typeof scores === "object") {
      stream = streamInterpretation(scores, selectedCategories)
    } else {
      return res.status(400).json({ error: "Invalid request: scores required" })
    }

    let headersSent = false
    for await (const chunk of stream) {
      if (!headersSent) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.setHeader("Transfer-Encoding", "chunked")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")
        res.flushHeaders()
        headersSent = true
      }
      res.write(chunk)
      if (typeof res.flush === "function") res.flush()
    }
    if (!headersSent) res.setHeader("Content-Type", "text/plain; charset=utf-8")
    res.end()
  } catch (err) {
    console.error("Interpret API error:", err.message)
    if (!res.headersSent) {
      res.status(500).json({ error: "Interpretation failed" })
    }
  }
})

app.listen(PORT, () => {
  console.log(`Interpret API running on http://localhost:${PORT}`)
})
