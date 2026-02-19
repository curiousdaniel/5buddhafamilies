import { useMemo } from 'react'
import { useQuizStore } from '../stores/quizStore'
import { getQuestionsByMode } from '../data/questions'
import { calculateScores } from '../lib/scoring'

export function useQuizProgress() {
  const { mode, answers } = useQuizStore()
  const questions = mode ? getQuestionsByMode(mode) : []
  const scores = useMemo(() => calculateScores(answers), [answers])
  return { mode, answers, questions, scores }
}
