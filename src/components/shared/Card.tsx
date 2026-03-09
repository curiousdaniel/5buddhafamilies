import { type HTMLAttributes, forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border border-stone-300 dark:border-stone-700/50 bg-white/80 dark:bg-dark-lighter/80 backdrop-blur ${className}`}
      {...props}
    />
  )
)
Card.displayName = 'Card'

export default Card
