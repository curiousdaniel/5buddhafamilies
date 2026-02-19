import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { QuizMode } from '../types'

interface QuizState {
  mode: QuizMode | null
  answers: Record<string, string[]>
  currentIndex: number
  setMode: (mode: QuizMode) => void
  setAnswer: (questionId: string, optionIds: string[]) => void
  fillTestAnswers: (answers: Record<string, string[]>) => void
  toggleOption: (questionId: string, optionId: string) => void
  setCurrentIndex: (index: number) => void
  goNext: () => void
  goBack: () => void
  reset: () => void
}

const initialState = {
  mode: null as QuizMode | null,
  answers: {} as Record<string, string[]>,
  currentIndex: 0,
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      ...initialState,
      setMode: (mode) => set({ mode, answers: {}, currentIndex: 0 }),
      setAnswer: (questionId, optionIds) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: optionIds } })),
      fillTestAnswers: (answers) => set({ answers, currentIndex: 0 }),
      toggleOption: (questionId, optionId) =>
        set((s) => {
          const current = s.answers[questionId] ?? []
          const has = current.includes(optionId)
          const next = has ? current.filter((id) => id !== optionId) : [...current, optionId]
          return { answers: { ...s.answers, [questionId]: next } }
        }),
      setCurrentIndex: (currentIndex) => set({ currentIndex }),
      goNext: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, 999) })),
      goBack: () => set((s) => ({ currentIndex: Math.max(s.currentIndex - 1, 0) })),
      reset: () => set(initialState),
    }),
    { name: 'five-buddha-quiz', storage: createJSONStorage(() => sessionStorage) }
  )
)
