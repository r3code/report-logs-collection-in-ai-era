# report-logs-collection-in-ai-era

Slidev-презентация: «Сбор логов на vector и clickhouse — то, что ИИ за тебя не сделал бы».

Доклад Дмитрия Синявского (@r3code).

## Установка

```bash
pnpm install
```

## Запуск

```bash
pnpm dev      # режим разработки с hot-reload, http://localhost:3030
pnpm build    # SPA-сборка в ./dist
pnpm export-pdf  # экспорт в PDF
```

## Структура

- `slides.md` — основная колода слайдов
- `pages/` — вынесенные слайды (через `src:`)
- `components/` — пользовательские Vue-компоненты
- `snippets/` — фрагменты кода для подсветки
- `.github/workflows/deploy.yml` — CI: сборка и публикация на GitHub Pages

## Превью

При каждом пуше в `main` GitHub Actions автоматически собирает презентацию
и публикует на GitHub Pages:

https://r3code.github.io/report-logs-collection-in-ai-era/
