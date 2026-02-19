import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    const base = 'px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-gold text-dark hover:bg-gold-light',
      secondary: 'border border-gold text-gold hover:bg-gold/10',
      ghost: 'text-gold hover:bg-gold/10',
    }
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export default Button
