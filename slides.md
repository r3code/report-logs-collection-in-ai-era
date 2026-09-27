---
theme: default
title: Сбор логов на vector и clickhouse
info: Доклад Дмитрия Синявского
drawings:
  persist: false
fonts:
  sans: 'Arial'
  mono: 'Fira Code'
---

# Сбор логов на vector и clickhouse — то, что ИИ за тебя не сделал бы

Дмитрий Синявский, SRE, @r3code

<div class="absolute right-0 bottom-0 w-1/2 h-full flex items-center justify-center">
  <div class="w-full h-3/4 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 text-xl p-4 text-center rounded">
    [ИЗОБРАЖЕНИЕ: Прижато вправо, без полей.<br>Тематическая картинка или схема стека]
  </div>
</div>

---

# О чем поговорим

<v-click>

➔ Иллюзия "готового решения"

</v-click>

<v-click>

➔ Почему логи — это не «просто данные»

</v-click>

<v-click>

➔ Vector как универсальный шлюз

</v-click>

<v-click>

➔ ClickHouse как хранилище для логов

</v-click>

<v-click>

➔ Что ИИ за тебя не сделает (пока)

</v-click>

---

# Иллюзия «готового решения»

Современный SRE-инженер открывает StackBlitz, говорит ИИ «собери мне сбор логов» — и через 30 секунд получает конфиг.

<v-click>

Проблема: **конфиг ≠ система**.

</v-click>

<v-click>

- Логи разные по структуре
- Источники живут в разных окружениях
- Объёмы разные на dev / prod / peak
- Требования к доступности разные

</v-click>

---

# Почему логи — это не «просто данные»

| Аспект | OLTP база | Логи |
|--------|-----------|------|
| Объём | ГБ | ТБ в день |
| Схема | Стабильная | Меняется |
| Запросы | По ключу | Аналитические |
| TTL | Долгий | Короткий |
| Дубли | Запрещены | Норма |

---

# Vector как универсальный шлюз

Vector — это один бинарник, который умеет всё:

- **sources**: file, http, kafka, docker, journald, syslog
- **transforms**: parse, filter, route, enrich
- **sinks**: clickhouse, kafka, s3, blackhole

<v-click>

```toml {all|1-3|5-8|all}
[sources.app]
type = "file"
include = ["/var/log/app/*.log"]

[sinks.clickhouse]
type = "clickhouse"
inputs = ["app"]
endpoint = "http://ch:8123"
database = "logs"
```

</v-click>

---

# ClickHouse как хранилище для логов

**Почему именно ClickHouse:**

- Колоночное хранение → быстрый scan
- Сжатие LZ4/ZSTD → 10-20x на текстовых логах
- MergeTree + TTL → автоматическая ротация
- SQL → инженерам не нужно учить новый язык

<v-click>

```sql
CREATE TABLE logs.app (
  ts DateTime,
  level Enum8('DEBUG'=1,'INFO'=2,'WARN'=3,'ERROR'=4),
  msg String,
  fields Map(String, String)
) ENGINE = MergeTree
PARTITION BY toYYYYMM(ts)
ORDER BY (level, ts)
TTL ts + INTERVAL 30 DAY;
```

</v-click>

---

# Что ИИ за тебя не сделает (пока)

<v-click>

**1. Не придумает SLA**
Сколько логов хранить, с какой скоростью отвечать — это бизнес-решение.

</v-click>

<v-click>

**2. Не знает твою топологию**
Где стоит NATS, где Kafka, где S3 — это твои данные.

</v-click>

<v-click>

**3. Не предусмотрит «день сурка»**
Пик трафика, выкатка, инцидент — всё одновременно.

</v-click>

<v-click>

**4. Не отвечает за прод**
Ты отвечаешь. ИИ — это инструмент, а не SRE-on-call.

</v-click>

---

# Спасибо

Дмитрий Синявский · @r3code

Презентация: [github.com/r3code/report-logs-collection-in-ai-era](https://github.com/r3code/report-logs-collection-in-ai-era)
