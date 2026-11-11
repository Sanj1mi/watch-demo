#!/bin/sh
# Настройка git для проекта. Идемпотентно: можно запускать повторно.
# Запуск (из fish тоже):  sh scripts/git-setup.sh
set -eu
cd "$(dirname "$0")/.."

if [ -d .git ]; then
  echo "• репозиторий уже есть"
else
  git init -b main
fi

# ---------- .gitignore: добавляем только недостающие строки ----------
touch .gitignore
while IFS= read -r line; do
  grep -qxF -- "$line" .gitignore || printf '%s\n' "$line" >> .gitignore
done <<'PATTERNS'
# --- frontend ---
frontend/node_modules/
frontend/dist/
# сборка фронта кладётся в Spring static — это артефакт, не исходник
src/main/resources/static/
# --- секреты ---
.env
.env.*
!.env.example
# --- рантайм-данные ---
data/*.backup.*
data/hospital_logs.json
backup.sql
person-data.sql
# --- IDE / сборка ---
.idea/
.settings/
.classpath
.factorypath
.project
.gradle/
build/
bin/
*.log
# --- служебное ---
frontend-audit.md
PATTERNS

# ---------- .gitattributes: LF везде, кроме .bat ----------
touch .gitattributes
if ! grep -q '^\* text' .gitattributes; then
  # строка должна быть ПЕРВОЙ: в gitattributes побеждает последнее совпавшее правило
  { printf '* text=auto eol=lf\n'; cat .gitattributes; } > .gitattributes.tmp
  mv .gitattributes.tmp .gitattributes
fi

# ---------- индекс ----------
git add -A
echo
echo "— что попадёт в коммит —"
git status --short | head -60
echo "всего файлов: $(git status --short | wc -l)"

if git status --short | grep -qE 'node_modules|/dist/|\.env$'; then
  echo "⚠ в индексе лишнее (node_modules/dist/.env) — проверь .gitignore"
fi

if [ -z "$(git config user.name || true)" ]; then
  echo
  echo "⚠ не задано имя:  git config --global user.name  'Имя'"
  echo "                  git config --global user.email 'you@example.com'"
fi

echo
echo "Дальше:"
echo "  git commit -m 'Initial commit: Spring Boot backend + React frontend'"
echo "  git remote add origin git@github.com:<user>/<repo>.git"
echo "  git push -u origin main"
