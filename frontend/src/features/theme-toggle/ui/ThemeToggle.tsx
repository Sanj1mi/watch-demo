import { useTheme } from '../model/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const toLight = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      title={toLight ? 'Светлая тема' : 'Тёмная тема'}
      aria-label={toLight ? 'Включить светлую тему' : 'Включить тёмную тему'}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-line2 bg-field text-lg text-accent transition hover:rotate-12 hover:border-accent hover:bg-hover"
    >
      <i className={`fas ${toLight ? 'fa-sun' : 'fa-moon'}`} />
    </button>
  )
}
