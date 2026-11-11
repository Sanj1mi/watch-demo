import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
}

export function Pill({ active, className = '', ...props }: Props) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? 'border-accent bg-linear-to-br from-accent to-accent-dark text-white'
          : 'border-line2 bg-field2 text-soft hover:border-muted hover:bg-hover'
      } ${className}`}
      {...props}
    />
  )
}
