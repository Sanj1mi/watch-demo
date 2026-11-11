import type { ReactNode } from 'react'

export const controlClass =
  'w-full rounded-xl border-2 border-line2 bg-field px-4 py-2.5 text-base text-strong outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15'

interface Props {
  label: string
  htmlFor?: string
  children: ReactNode
}

export function Field({ label, htmlFor, children }: Props) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-soft"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
