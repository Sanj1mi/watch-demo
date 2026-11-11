#!/usr/bin/env fish

set ROOT "src/main/resources/static"
set OUTPUT "frontend-audit.md"

set FILES \
    "$ROOT/index.html" \
    "$ROOT/css/style.css" \
    "$ROOT/js/api.js" \
    "$ROOT/js/app.js" \
    "$ROOT/js/journal.js" \
    "$ROOT/js/templates.js" \
    "$ROOT/js/ui.js"

if not test -d "$ROOT"
    echo "Directory not found: $ROOT"
    exit 1
end

echo "# Frontend audit" > $OUTPUT
echo "" >> $OUTPUT
echo "Generated: "(date) >> $OUTPUT
echo "" >> $OUTPUT

echo "## File tree" >> $OUTPUT
echo '```text' >> $OUTPUT
tree "$ROOT" >> $OUTPUT
echo '```' >> $OUTPUT
echo "" >> $OUTPUT

for file in $FILES
    if not test -f "$file"
        echo "WARNING: missing $file"
        continue
    end

    set size (wc -c < "$file" | string trim)

    echo "## $file" >> $OUTPUT
    echo "" >> $OUTPUT
    echo "- Size: $size bytes" >> $OUTPUT

    switch "$file"
        case "*.html"
            set lang html
        case "*.css"
            set lang css
        case "*.js"
            set lang javascript
        case '*'
            set lang text
    end

    echo "" >> $OUTPUT
    echo "\`\`\`$lang" >> $OUTPUT
    cat "$file" >> $OUTPUT
    echo "" >> $OUTPUT
    echo "\`\`\`" >> $OUTPUT
    echo "" >> $OUTPUT
end

echo "## JS declarations and API calls" >> $OUTPUT
echo '```text' >> $OUTPUT

for file in $ROOT/js/*.js
    echo "" >> $OUTPUT
    echo "### $file" >> $OUTPUT

    rg -n \
        '^(export )?(async )?function |^(const|let|var) .*=>|addEventListener|fetch\(|axios\.|XMLHttpRequest|import |export ' \
        "$file" >> $OUTPUT
end

echo '```' >> $OUTPUT

echo "Audit saved to: $OUTPUT"
