# Five Buddha Families Quiz

A web-based quiz application that helps users discover their personal composition of the Five Buddha Families — an ancient Vajrayana Buddhist framework describing five fundamental energy patterns.

## Features

- **Quiz modes**: Secular only (24 questions), Sacred only (21 questions), or Full (45 questions)
- **Multi-select answers** with randomized option order per question
- **Progress persistence** via sessionStorage (survives browser refresh)
- **Rich results**: Radar chart, mandala portrait, full family profiles
- **Share via URL** with scores encoded in query parameters
- **Download results** as PNG or PDF
- **Copy share text** for social media

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state + sessionStorage persistence)
- React Router
- Recharts (radar chart)
- Framer Motion (animations)
- html2canvas + jsPDF (export)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content

The question bank and family profiles use placeholder content. Replace the data in:

- `src/data/questions.ts` — 45 questions (24 secular, 21 sacred)
- `src/data/families.ts` — Full profiles for each family
- `src/data/combinations.ts` — Primary + secondary combination descriptions
