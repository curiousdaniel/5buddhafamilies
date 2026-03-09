import type { Question } from '../types'
import type { FamilyCode } from '../types'
import type { QuizCategoryId } from './categories'

import questionsCsv from '../../five_buddha_families_questions (extra).csv?raw'
import { shuffle } from '../lib/shuffle'

const FAMILY_MAP: Record<string, FamilyCode> = {
  B: 'buddha',
  V: 'vajra',
  R: 'ratna',
  P: 'padma',
  K: 'karma',
}

const CATEGORY_IDS: QuizCategoryId[] = [
  'secular',
  'sacred',
  'embodiment',
  'aesthetic',
  'time',
  'falling_apart',
  'learning',
  'appetite',
  'humor',
  'childhood',
]

interface CsvRow {
  question_id: string
  category: string
  question_text: string
  answer_a_text: string
  answer_a_family: string
  answer_b_text: string
  answer_b_family: string
  answer_c_text: string
  answer_c_family: string
  answer_d_text: string
  answer_d_family: string
  answer_e_text: string
  answer_e_family: string
}

function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')
  const rows: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? ''
    })
    rows.push(row as unknown as CsvRow)
  }
  return rows
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function normalizeCategory(cat: string): QuizCategoryId {
  const normalized = cat.trim().toLowerCase()
  return CATEGORY_IDS.includes(normalized as QuizCategoryId)
    ? (normalized as QuizCategoryId)
    : 'secular'
}

function csvRowToQuestion(row: CsvRow): Question {
  const answers = [
    { text: row.answer_a_text, family: row.answer_a_family },
    { text: row.answer_b_text, family: row.answer_b_family },
    { text: row.answer_c_text, family: row.answer_c_family },
    { text: row.answer_d_text, family: row.answer_d_family },
    { text: row.answer_e_text, family: row.answer_e_family },
  ]

  const id = row.question_id
  const category = normalizeCategory(row.category)

  return {
    id,
    category,
    text: row.question_text,
    options: answers.map((a, i) => ({
      id: `${id}-opt-${i}`,
      family: FAMILY_MAP[a.family] ?? 'buddha',
      text: a.text,
    })),
  }
}

const csvText: string = typeof questionsCsv === 'string' ? questionsCsv : ''
export const QUESTIONS: Question[] = parseCsv(csvText).map(csvRowToQuestion)

export function getQuestionsForCategories(
  selectedCategories: string[]
): Question[] {
  if (selectedCategories.length === 0) return []
  const filtered = QUESTIONS.filter((q) =>
    selectedCategories.includes(q.category)
  )
  return shuffle(filtered)
}
