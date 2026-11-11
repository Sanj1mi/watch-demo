import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'warning' | 'danger'
type Size = 'md' | 'sm'

const variants: Record<Variant, string> = {
  primary: 'border-accent from-accent to-accent-dark text-white',
  secondary: 'border-line2 from-field2 to-field text-strong',
  warning: 'border-warn from-warn to-[#cc5200] text-white',
  danger: 'border-[#990000] from-[#990000] to-[#660000] text-white',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  sm: 'px-3.5 py-1.5 text-xs',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: Props) {
  return (
    <button
      type="button"
      className={`fx-sweep inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 bg-linear-to-br font-semibold shadow-md shadow-shade transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
