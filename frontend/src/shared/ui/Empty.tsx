export function Empty({ children }: { children: string }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-line bg-panel/50 p-14 text-center text-lg text-dim italic">
      {children}
    </p>
  )
}
