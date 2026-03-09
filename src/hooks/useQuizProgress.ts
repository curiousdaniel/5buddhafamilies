import { useMemo } from 'react'
import { useQuizStore } from '../stores/quizStore'
import { calculateScores } from '../lib/scoring'

export function useQuizProgress() {
  const { questions, answers } = useQuizStore()
  const scores = useMemo(() => calculateScores(answers), [answers])
  return { answers, questions, scores }
}
