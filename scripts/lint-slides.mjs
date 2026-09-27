#!/usr/bin/env node
/**
 * Linter for slides.md — проверяет соблюдение Style Guide Дмитрия Синявского.
 *
 * Запуск:
 *   node scripts/lint-slides.mjs [path-to-slides.md]
 *
 * Возвращает exit code 1 если есть errors, 0 если только warnings или чисто.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const SLIDES_PATH = process.argv[2] || resolve(process.cwd(), 'slides.md')

if (!existsSync(SLIDES_PATH)) {
  console.error(`✗ Файл не найден: ${SLIDES_PATH}`)
  process.exit(2)
}

const src = readFileSync(SLIDES_PATH, 'utf8')
const lines = src.split('\n')

const errors = []
const warnings = []

// ─── Helpers ───────────────────────────────────────────────────────────────

function addError(line, msg) {
  errors.push(`  L${line + 1}: ✗ ${msg}`)
}
function addWarning(line, msg) {
  warnings.push(`  L${line + 1}: ⚠ ${msg}`)
}

// ─── 1. Frontmatter ────────────────────────────────────────────────────────

const fmMatch = src.match(/^---\n([\s\S]*?)\n---/)
if (!fmMatch) {
  errors.push('  ✗ Frontmatter не найден (ожидался блок --- в начале файла)')
} else {
  const fm = fmMatch[1]
  const required = {
    'theme:': 'default',
    'title:': null,
    'info:': null,
    'fonts:': null,
    'sans:': 'Arial',
    'mono:': 'Fira Code',
  }
  for (const [key, val] of Object.entries(required)) {
    if (!fm.includes(key)) {
      errors.push(`  ✗ Frontmatter: отсутствует поле "${key}"`)
    } else if (val && !fm.includes(`${key} '${val}'`) && !fm.includes(`${key} "${val}"`) && !fm.includes(`${key} ${val}`)) {
      errors.push(`  ✗ Frontmatter: "${key}" должен быть "${val}"`)
    }
  }
  if (!fm.includes('drawings:')) {
    warnings.push('  ⚠ Frontmatter: нет блока drawings (рекомендуется drawings.persist: false)')
  }
}

// ─── 2. Кавычки и тире ─────────────────────────────────────────────────────
// Style Guide: только прямые кавычки " и только дефисы -
// Запрещены: « » " " „ " — –

const forbiddenChars = [
  { ch: '«', name: 'левая типографская кавычка «', replacement: '"' },
  { ch: '»', name: 'правая типографская кавычка »', replacement: '"' },
  { ch: '\u201C', name: 'левая двойная "smart" кавычка', replacement: '"' },
  { ch: '\u201D', name: 'правая двойная "smart" кавычка', replacement: '"' },
  { ch: '\u2018', name: 'левая одинарная кавычка', replacement: "'" },
  { ch: '\u2019', name: 'правая одинарная кавычка', replacement: "'" },
  { ch: '—', name: 'длинное тире —', replacement: '-' },
  { ch: '–', name: 'среднее тире –', replacement: '-' },
]

lines.forEach((line, i) => {
  // Пропускаем строки внутри code-блоков
  // Простая проверка — если строка внутри блока ``` ... ```
  for (const { ch, name, replacement } of forbiddenChars) {
    if (line.includes(ch)) {
      addError(i, `Запрещённый символ "${name}" — замените на "${replacement}"`)
    }
  }
})

// ─── 3. Структура слайдов ──────────────────────────────────────────────────

const slideSeparators = []
lines.forEach((line, i) => {
  if (line.trim() === '---') {
    slideSeparators.push(i)
  }
})
const slideCount = slideSeparators.length + 1
if (slideCount < 5) {
  warnings.push(`  ⚠ Мало слайдов: ${slideCount}. Минимум 5 по Style Guide`)
}

// ─── 4. v-click паттерн ────────────────────────────────────────────────────
// Style Guide: активный пункт → ➔ (U+2794), пройденный → • (U+2022)

let hasProgressive = false
lines.forEach((line, i) => {
  if (line.includes('<v-click>')) hasProgressive = true
  // Если в строке есть ➔ но она не внутри v-click — возможно проблема
  // (но v-click может быть на предыдущей строке, поэтому только warn)
})

if (!hasProgressive) {
  warnings.push('  ⚠ Не найдено ни одного <v-click> — Progressive Disclosure не используется')
}

// ─── 5. Разделители разделов: bg-black text-white ──────────────────────────
// Не enforced, но предупреждаем если нет ни одного

if (!src.includes('bg-black') || !src.includes('text-white')) {
  warnings.push('  ⚠ Не найдено слайдов-разделителей (bg-black text-white). Style Guide требует чёрные разделители разделов')
}

// ─── 6. Размеры шрифтов ────────────────────────────────────────────────────
// Style Guide: заголовки 32pt, текст 21pt, код 18pt
// Проверяем, что в slides.md нет явных text-sm/text-xs/text-lg нарушающих гайд
// (если используете CSS-классы — это в style.css, здесь не проверяем)

const smallFontClasses = ['text-xs', 'text-sm', 'text-base']
lines.forEach((line, i) => {
  for (const cls of smallFontClasses) {
    if (line.includes(`class="${cls}`) || line.includes(`class="... ${cls}`)) {
      addWarning(i, `Класс "${cls}" делает шрифт меньше Style Guide (минимум 21pt основной текст)`)
    }
  }
})

// ─── 7. HTML-теги без экранирования ────────────────────────────────────────
// Style Guide: не использовать < и > внутри HTML-тегов без экранирования
// Это сложно проверить статически, но можем найти очевидные кейсы вроде <3 или >5

lines.forEach((line, i) => {
  // Пропускаем code-блоки — это сложнее, делаем простой эвристический проход
  const codeBlockMatch = line.match(/```/)
  if (codeBlockMatch) return

  // Ищем " < " или " > " в тексте (не в тегах)
  // Пропускаем строки, начинающиеся с < (это теги)
  if (!line.trim().startsWith('<') && !line.trim().startsWith('-')) {
    if (/\s<\s/.test(line) && !line.includes('&lt;')) {
      addWarning(i, `Возможно, неэкранированный "<" в тексте — замените на &lt;`)
    }
  }
})

// ─── 8. Плейсхолдеры для картинок ──────────────────────────────────────────
// Style Guide: картинки — плейсхолдеры в <div class="bg-gray-200 border-2 border-dashed border-gray-400">

if (src.includes('![') && !src.includes('bg-gray-200')) {
  warnings.push('  ⚠ Найдены markdown-картинки (![]) без плейсхолдеров. Style Guide требует <div class="bg-gray-200 border-2 border-dashed border-gray-400">')
}

// ─── 9. Финальный слайд ────────────────────────────────────────────────────
// Style Guide: финальный слайд — t.me/letitkit + QR

if (!src.includes('t.me/letitkit')) {
  warnings.push('  ⚠ Финальный слайд: не найдена ссылка t.me/letitkit (Style Guide требует)')
}

// ─── Report ────────────────────────────────────────────────────────────────

console.log('\n── Lint slides.md ────────────────────────────────────────')
console.log(`Файл: ${SLIDES_PATH}`)
console.log(`Слайдов: ~${slideCount}`)
console.log(`Errors:   ${errors.length}`)
console.log(`Warnings: ${warnings.length}`)
console.log('')

if (warnings.length) {
  console.log('── Warnings ──────────────────────────────────────────────')
  warnings.forEach((w) => console.log(w))
  console.log('')
}

if (errors.length) {
  console.log('── Errors ────────────────────────────────────────────────')
  errors.forEach((e) => console.log(e))
  console.log('')
  process.exit(1)
}

console.log('✓ Линтер прошёл без ошибок\n')
process.exit(0)
