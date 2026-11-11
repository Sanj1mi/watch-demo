#!/usr/bin/env fish

# Запускать из корня Spring Boot проекта
set ROOT (pwd)

set TREE "/tmp/watchdemo2-tree.txt"
set JAVA "/tmp/watchdemo2-java.txt"
set CONFIG "/tmp/watchdemo2-config.txt"
set BUILD "/tmp/watchdemo2-build.txt"
set OTHER "/tmp/watchdemo2-other.txt"

echo "Собираю проект из: $ROOT"

# 1. Структура проекта
echo "PROJECT ROOT: $ROOT" > $TREE
find $ROOT \
    -type d \( -name .git -o -name build -o -name .gradle -o -name node_modules -o -name out \) -prune \
    -o -type f -print \
    | sed "s|$ROOT/||" \
    | sort >> $TREE

# Функция добавления файла с маскировкой секретов
function append_file
    set file $argv[1]
    set target $argv[2]

    echo "" >> $target
    echo "==================================================" >> $target
    echo "FILE: "(string replace "$ROOT/" "" "$file") >> $target
    echo "==================================================" >> $target

    sed -E \
        -e '/^[[:space:]]*(password|passwd|secret|token|api[-_]?key|client[-_]?secret)[[:space:]]*[:=]/I s/([:=])[[:space:]]*.*/\1 [REDACTED]/' \
        "$file" >> $target
end

# 2. Java / Kotlin исходники и тесты
echo "JAVA AND KOTLIN SOURCES" > $JAVA

for f in (find $ROOT \
    -type d \( -name .git -o -name build -o -name .gradle -o -name node_modules -o -name out \) -prune \
    -o -type f \( -name '*.java' -o -name '*.kt' \) -print | sort)

    append_file $f $JAVA
end

# 3. Конфигурация приложения
echo "APPLICATION CONFIGURATION" > $CONFIG

for f in (find $ROOT \
    -type d \( -name .git -o -name build -o -name .gradle -o -name node_modules -o -name out \) -prune \
    -o -type f \( \
        -name 'application*.yml' -o \
        -name 'application*.yaml' -o \
        -name 'application*.properties' -o \
        -name 'hibernate.cfg.xml' -o \
        -name 'persistence.xml' -o \
        -name '*.sql' \
    \) -print | sort)

    append_file $f $CONFIG
end

# 4. Gradle / Maven файлы
echo "BUILD CONFIGURATION" > $BUILD

for f in (find $ROOT -maxdepth 4 -type f \( \
    -name 'build.gradle' -o \
    -name 'build.gradle.kts' -o \
    -name 'settings.gradle' -o \
    -name 'settings.gradle.kts' -o \
    -name 'gradle.properties' -o \
    -name 'pom.xml' -o \
    -name 'libs.versions.toml' \
    \) -print | sort)

    append_file $f $BUILD
end

# 5. README, документация и прочие полезные текстовые файлы
echo "OTHER PROJECT DOCUMENTATION" > $OTHER

for f in (find $ROOT -maxdepth 4 -type f \( \
    -iname 'README*' -o \
    -iname '*.md' \
    \) -print | sort)

    append_file $f $OTHER
end

echo ""
echo "Готово. Созданы файлы:"
ls -lh $TREE $JAVA $CONFIG $BUILD $OTHER
echo ""
echo "Перед отправкой проверь конфигурацию на личные данные."
