# report-logs-collection-in-ai-era

Slidev-презентация: "Сбор логов на vector и clickhouse - то, что ИИ за тебя не сделал бы".

Доклад Дмитрия Синявского (@r3code).

## Установка

```bash
pnpm install
```

## Запуск

```bash
pnpm dev          # режим разработки с hot-reload, http://localhost:3030
pnpm build        # SPA-сборка в ./dist
pnpm build:pages  # сборка для GitHub Pages (с правильным --base)
pnpm lint         # проверка slides.md на соответствие Style Guide
pnpm export-pdf   # экспорт в PDF (локально, требует Chromium)
```

## Структура

- `slides.md` - основная колода слайдов
- `style.css` - глобальные стили (типографика Style Guide: 32/21/18pt)
- `scripts/lint-slides.mjs` - линтер slides.md
- `pages/` - вынесенные слайды (через `src:`)
- `components/` - пользовательские Vue-компоненты
- `snippets/` - фрагменты кода для подсветки
- `.github/workflows/`:
  - `deploy.yml` - автосборка и публикация на GitHub Pages (на каждый push в main)
  - `lint.yml` - проверка slides.md на PR и push
  - `export-pdf.yml` - ручной экспорт в PDF
  - `export-pptx.yml` - ручной экспорт слайдов в PPTX (как картинки)

## Превью

При каждом пуше в `main` GitHub Actions автоматически собирает презентацию
и публикует на GitHub Pages:

https://r3code.github.io/report-logs-collection-in-ai-era/

## Экспорт в PDF и PPTX

Экспорт запускается вручную через GitHub Actions:

1. Откройте [Actions](https://github.com/r3code/report-logs-collection-in-ai-era/actions)
2. Выберите workflow:
   - **Export PDF** - для PDF
   - **Export PPTX (images)** - для PPTX (каждый слайд как картинка)
3. Нажмите **Run workflow**, при необходимости укажите коммит/ветку
4. После завершения скачайте артефакт (PDF или PPTX) со страницы запуска

Артефакты хранятся 30 дней.

## Линтер

Проверяет соблюдение Style Guide:
- обязательные поля frontmatter (theme, title, info, fonts, drawings)
- запрещённые символы: типографские кавычки, длинные тире (только `"` и `-`)
- наличие `<v-click>` для Progressive Disclosure
- наличие слайдов-разделителей (`bg-black text-white`)
- финальный слайд со ссылкой `t.me/letitkit`
- отсутствие markdown-картинок без плейсхолдеров

Локально: `pnpm lint`
В CI: запускается автоматически на PR и push в `slides.md`.
