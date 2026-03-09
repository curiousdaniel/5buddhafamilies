import {
  streamInterpretation,
  streamModuleInterpretation,
  streamPairingInterpretation,
} from '../server/interpret.js'

export const config = {
  api: {
    bodyParser: true,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { scores, moduleId, familyA, familyB, context } = req.body || {}

  let stream
  try {
    if (familyA && familyB && context) {
      stream = streamPairingInterpretation(familyA, familyB, context)
    } else if (moduleId && scores && typeof scores === 'object') {
      stream = streamModuleInterpretation(scores, moduleId)
    } else if (scores && typeof scores === 'object') {
      stream = streamInterpretation(scores)
    } else {
      return res.status(400).json({ error: 'Invalid request: scores required' })
    }
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Invalid request' })
  }

  try {
    let headersSent = false
    for await (const chunk of stream) {
      if (!headersSent) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Transfer-Encoding', 'chunked')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        res.status(200)
        res.flushHeaders?.()
        headersSent = true
      }
      res.write(chunk)
      if (typeof res.flush === 'function') res.flush()
    }
    if (!headersSent) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200)
    }
    res.end()
  } catch (err) {
    console.error('Interpret API error:', err.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Interpretation failed' })
    }
  }
}
