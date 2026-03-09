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

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post("/api/interpret", async (req, res) => {
  const { scores, moduleId, familyA, familyB, context } = req.body

  try {
    let stream
    if (familyA && familyB && context) {
      stream = streamPairingInterpretation(familyA, familyB, context)
    } else if (moduleId && scores && typeof scores === "object") {
      stream = streamModuleInterpretation(scores, moduleId)
    } else if (scores && typeof scores === "object") {
      stream = streamInterpretation(scores)
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
