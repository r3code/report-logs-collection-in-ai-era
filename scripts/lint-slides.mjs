#!/usr/bin/env node
/**
 * Linter for slides.md — проверяет соблюдение Style Guide Дмитрия Синявского.
 *
 * ПРАВИЛА (актуальные, важнее ранее определённых):
 * - В тексте (вне code-блоков) используются ТОЛЬКО кавычки-ёлочки « »
 * - В тексте используется СРЕДНЕЕ тире – (en dash, U+2013), не дефис и не длинное —
 * - В code-блоках разрешены любые символы (синтаксис языка)
 * - Шрифт везде чёрный, никаких оттенков серого (кроме подсветки кода)
 *
 * Запуск:
 *   node scripts/lint-slides.mjs [path-to-slides.md]
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

function addError(line, msg) { errors.push(`  L${line + 1}: ✗ ${msg}`) }
function addWarning(line, msg) { warnings.push(`  L${line + 1}: ⚠ ${msg}`) }

// ─── 1. Frontmatter ────────────────────────────────────────────────────────

const fmMatch = src.match(/^---\n([\s\S]*?)\n---/)
if (!fmMatch) {
  errors.push('  ✗ Frontmatter не найден')
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

// ─── 2. Отслеживание code-блоков, SpeakerNotes и HTML-комментариев ───────

let inCodeBlock = false
let inSpeakerNotes = false
let inHtmlComment = false
const codeBlockLines = []
const textLines = []

lines.forEach((line, i) => {
  // ``` открывает или закрывает code-блок
  if (line.trim().startsWith('```')) {
    if (inCodeBlock) {
      codeBlockLines.push(i)
      inCodeBlock = false
    } else {
      inCodeBlock = true
      codeBlockLines.push(i)
    }
    return
  }
  // <SpeakerNotes> ... </SpeakerNotes> — пропускаем (legacy)
  if (/<SpeakerNotes[\s>]/.test(line)) {
    inSpeakerNotes = true
  }
  if (inSpeakerNotes) {
    codeBlockLines.push(i)
    if (/<\/SpeakerNotes>/.test(line)) {
      inSpeakerNotes = false
    }
    return
  }
  // <!-- ... --> — HTML-комментарии (используются для speaker notes)
  // Поддержка многострочных комментариев
  if (/<!--/.test(line) && !/-->/.test(line)) {
    inHtmlComment = true
    codeBlockLines.push(i)
    return
  }
  if (inHtmlComment) {
    codeBlockLines.push(i)
    if (/-->/.test(line)) {
      inHtmlComment = false
    }
    return
  }
  // Однострочный комментарий <!-- ... -->
  if (/<!--.*-->/.test(line)) {
    codeBlockLines.push(i)
    return
  }
  if (inCodeBlock) {
    codeBlockLines.push(i)
  } else {
    textLines.push({ line: i, text: line })
  }
})

// ─── 3. Проверка кавычек и тире ВНЕ code-блоков ────────────────────────────
//
// ПРАВИЛА (актуальные):
//   В тексте: только « » (елочки), только – (среднее тире)
//   Запрещены в тексте: " (прямые), " " (smart), ' ' (одинарные),
//                       — (длинное), - как тире (с пробелами вокруг)
//   Дефис в составных словах (по-русски, из-за) - ОК
//
// Дополнительно: HTML-атрибуты могут содержать " (например, class="..."),
// это разрешено, но только внутри <tag attr="value">

const FORBIDDEN_IN_TEXT = [
  { ch: '"', name: 'прямая двойная кавычка "', replacement: '« или » (елочки)' },
  { ch: '\u201C', name: 'левая smart-кавычка', replacement: '«' },
  { ch: '\u201D', name: 'правая smart-кавычка', replacement: '»' },
  { ch: '\u2018', name: 'левая одинарная кавычка', replacement: "'" },
  { ch: '\u2019', name: 'правая одинарная кавычка', replacement: "'" },
  { ch: '—', name: 'длинное тире —', replacement: '– (среднее тире)' },
]

// Регэксп для поиска HTML-атрибутов: <tag attr="value"> или v-if="..."
// Включаем vue-директивы (v-if, v-else, :class, @click и т.д.)
const HTML_ATTR_REGEX = /(\s\w+|\s[:@v-][\w-]+)="[^"]*"/g

// Регэксп для инлайн-кода: `code`
const INLINE_CODE_REGEX = /`[^`]*`/g

textLines.forEach(({ line, text }) => {
  // Убираем HTML-атрибуты и инлайн-код перед проверкой кавычек
  const cleaned = text
    .replace(HTML_ATTR_REGEX, '')
    .replace(INLINE_CODE_REGEX, '')

  for (const { ch, name, replacement } of FORBIDDEN_IN_TEXT) {
    if (cleaned.includes(ch)) {
      addError(line, `Запрещённый символ "${name}" в тексте — замените на ${replacement}`)
    }
  }

  // Проверка: " - " с пробелами вокруг — это тире, должно быть –
  // (дефис в составных словах ОК)
  if (/\s-\s/.test(cleaned)) {
    addError(line, 'Дефис как тире (с пробелами вокруг) — замените на среднее тире – (U+2013)')
  }
})

// ─── 4. Структура слайдов ──────────────────────────────────────────────────

const slideSeparators = []
lines.forEach((line, i) => {
  if (line.trim() === '---') slideSeparators.push(i)
})
const slideCount = slideSeparators.length + 1
if (slideCount < 5) {
  warnings.push(`  ⚠ Мало слайдов: ${slideCount}. Минимум 5`)
}

// ─── 5. v-click ────────────────────────────────────────────────────────────

if (!src.includes('<v-click>')) {
  warnings.push('  ⚠ Не найдено ни одного <v-click> — Progressive Disclosure не используется')
}

// ─── 6. Слайды-разделители ─────────────────────────────────────────────────

if (!src.includes('bg-black') || !src.includes('text-white')) {
  warnings.push('  ⚠ Не найдено слайдов-разделителей (bg-black text-white)')
}

// ─── 7. Запрет text-gray-* ─────────────────────────────────────────────────
// Style Guide: шрифт везде чёрный, никаких оттенков серого, кроме кода

textLines.forEach(({ line, text }) => {
  // text-gray-900, text-gray-500, text-gray-600, etc — запрещены
  const grayMatch = text.match(/text-gray-(?:50|100|200|300|400|500|600|700|800|900)/g)
  if (grayMatch) {
    addError(line, `Запрещён серый цвет: ${grayMatch.join(', ')} — используйте text-black (Style Guide: только чёрный)`)
  }
})

// ─── 8. Финальный слайд: t.me/letitkit ─────────────────────────────────────

if (!src.includes('t.me/letitkit')) {
  warnings.push('  ⚠ Финальный слайд: не найдена ссылка t.me/letitkit')
}

// ─── 9. Markdown-картинки без плейсхолдеров ────────────────────────────────

if (src.includes('![') && !src.includes('bg-gray-200')) {
  warnings.push('  ⚠ Найдены markdown-картинки (![]) без плейсхолдеров')
}

// ─── 10. Номер слайда ───────────────────────────────────────────────────
// Реализован через components/global-top.vue + slide-number.vue
// Первый слайд должен иметь layout: cover или class: cover
// Последний слайд должен иметь layout: end или class: end

const hasCoverClass = /class:[^\n]*\bcover\b/.test(src) || /layout:\s*cover/.test(src)
const hasEndClass = /class:[^\n]*\bend\b/.test(src) || /layout:\s*end/.test(src)

if (!hasCoverClass) {
  warnings.push('  ⚠ Не найден class: cover или layout: cover для первого слайда (номер не должен показываться на титуле)')
}
if (!hasEndClass) {
  warnings.push('  ⚠ Не найден class: end или layout: end для последнего слайда (номер не должен показываться на финале)')
}

// ─── Report ────────────────────────────────────────────────────────────────

console.log('\n── Lint slides.md ────────────────────────────────────────')
console.log(`Файл: ${SLIDES_PATH}`)
console.log(`Слайдов: ~${slideCount}`)
console.log(`Вне code-блоков: ${textLines.length} строк`)
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
