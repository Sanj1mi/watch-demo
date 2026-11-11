import { AdminStatus } from '@/features/admin-auth'
import { ThemeToggle } from '@/features/theme-toggle'

export type Tab = 'main' | 'journal' | 'jpa'

const TABS: Array<[Tab, string, string]> = [
  ['main', 'Главная', 'fa-house'],
  ['journal', 'Журнал', 'fa-book-medical'],
  ['jpa', 'JPA запросы', 'fa-database'],
]

interface Props {
  tab: Tab
  onTabChange: (tab: Tab) => void
}

export function Header({ tab, onTabChange }: Props) {
  return (
    <>
      <header className="fx-scan sticky top-3 z-40 mb-6 flex items-center justify-between gap-4 rounded-2xl border-2 border-line bg-panel/90 px-4 py-3 shadow-lg shadow-accent/15 backdrop-blur-md sm:px-6">
        <h1 className="fx-glow flex items-center gap-3 text-xl font-bold text-accent sm:text-2xl">
          <i className="fas fa-hospital" />
          <span className="hidden sm:inline">Hosp (x-X)</span>
          <span className="sm:hidden">Больница</span>
        </h1>

        <nav className="hidden gap-1 md:flex">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`cursor-pointer rounded-xl border-2 px-4 py-1.5 text-sm font-semibold transition hover:bg-accent/10 hover:text-accent ${
                tab === id ? 'border-accent bg-accent/10 text-accent' : 'border-transparent text-soft'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AdminStatus />
        </div>
      </header>

      {/* на телефоне навигация внизу, под большой палец */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t-2 border-line bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        {TABS.map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`flex cursor-pointer flex-col items-center gap-1 py-2.5 text-xs font-semibold transition ${
              tab === id ? 'text-accent' : 'text-muted'
            }`}
          >
            <i className={`fas ${icon} text-lg`} />
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}
