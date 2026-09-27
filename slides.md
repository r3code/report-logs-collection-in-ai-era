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

# Сбор логов на vector и clickhouse - то, что ИИ за тебя не сделал бы

Дмитрий Синявский, SRE, @r3code

<div class="absolute right-0 bottom-0 w-1/2 h-full flex items-center justify-center">
  <div class="w-full h-3/4 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 p-4 text-center rounded">
    [ИЗОБРАЖЕНИЕ: Прижато вправо, без полей.<br>Тематическая картинка или схема стека]
  </div>
</div>

---

# О чем поговорим

<v-click at="1">

<p class="text-gray-900 mb-6">➔ Иллюзия "готового решения"</p>

</v-click>

<v-click at="2">

<p class="text-gray-500 mb-6">• Иллюзия "готового решения"</p>

</v-click>

<v-click at="2">

<p class="text-gray-900 mb-6">➔ Почему логи - это не "просто данные"</p>

</v-click>

<v-click at="3">

<p class="text-gray-500 mb-6">• Почему логи - это не "просто данные"</p>

</v-click>

<v-click at="3">

<p class="text-gray-900 mb-6">➔ Vector как универсальный шлюз</p>

</v-click>

<v-click at="4">

<p class="text-gray-500 mb-6">• Vector как универсальный шлюз</p>

</v-click>

<v-click at="4">

<p class="text-gray-900 mb-6">➔ ClickHouse как хранилище для логов</p>

</v-click>

<v-click at="5">

<p class="text-gray-500 mb-6">• ClickHouse как хранилище для логов</p>

</v-click>

<v-click at="5">

<p class="text-gray-900 mb-6">➔ Что ИИ за тебя не сделает (пока)</p>

</v-click>

---

# Обо мне

<div class="absolute left-10 top-1/4 w-1/3 h-1/2 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 p-4 text-center rounded">
  [ИЗОБРАЖЕНИЕ: "Молния" - иконка или фото<br>символизирует скорость и удар]
</div>

<div class="absolute right-10 top-1/4 w-1/2 grid grid-cols-2 gap-4">

<div class="text-center">
  <p class="text-5xl font-bold text-gray-900">12+</p>
  <p class="text-gray-600">лет в IT</p>
</div>

<div class="text-center">
  <p class="text-5xl font-bold text-gray-900">8+</p>
  <p class="text-gray-600">лет в SRE</p>
</div>

<div class="text-center">
  <p class="text-5xl font-bold text-gray-900">50+</p>
  <p class="text-gray-600">продакшен-инцидентов</p>
</div>

<div class="text-center">
  <p class="text-5xl font-bold text-gray-900">100+</p>
  <p class="text-gray-600">сервисов под наблюдением</p>
</div>

</div>

Дмитрий Синявский - SRE, ведёт канал t.me/letitkit

---
layout: center
class: bg-black text-white
---

# Иллюзия готового решения

---

# Иллюзия "готового решения"

Современный SRE-инженер открывает чат с ИИ, говорит "собери мне сбор логов" - и через 30 секунд получает конфиг.

<v-click>

Проблема: **конфиг - это не система**.

</v-click>

<v-click>

- Логи разные по структуре
- Источники живут в разных окружениях
- Объёмы разные на dev / prod / peak
- Требования к доступности разные

</v-click>

---
layout: center
class: bg-black text-white
---

# Почему логи - это не "просто данные"

---

# Почему логи - это не "просто данные"

| Аспект | OLTP база | Логи |
|--------|-----------|------|
| Объём | ГБ | ТБ в день |
| Схема | Стабильная | Меняется |
| Запросы | По ключу | Аналитические |
| TTL | Долгий | Короткий |
| Дубли | Запрещены | Норма |

---
layout: center
class: bg-black text-white
---

# Vector как универсальный шлюз

---

# Vector как универсальный шлюз

Vector - это один бинарник, который умеет всё:

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
layout: center
class: bg-black text-white
---

# ClickHouse как хранилище для логов

---

# ClickHouse как хранилище для логов

**Почему именно ClickHouse:**

- Колоночное хранение - быстрый scan
- Сжатие LZ4/ZSTD - 10-20x на текстовых логах
- MergeTree + TTL - автоматическая ротация
- SQL - инженерам не нужно учить новый язык

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
layout: center
class: bg-black text-white
---

# Что ИИ за тебя не сделает

---

# Что ИИ за тебя не сделает (пока)

<v-click>

**1. Не придумает SLA**
Сколько логов хранить, с какой скоростью отвечать - это бизнес-решение.

</v-click>

<v-click>

**2. Не знает твою топологию**
Где стоит NATS, где Kafka, где S3 - это твои данные.

</v-click>

<v-click>

**3. Не предусмотрит "день сурка"**
Пик трафика, выкатка, инцидент - всё одновременно.

</v-click>

<v-click>

**4. Не отвечает за прод**
Ты отвечаешь. ИИ - это инструмент, а не SRE-on-call.

</v-click>

---

# Что сделать завтра

<v-click>

➔ Посмотреть на свои логи как на данные: объём, схема, TTL

</v-click>

<v-click>

➔ Выбрать один поток логов и довести его до ClickHouse через Vector

</v-click>

<v-click>

➔ Зафиксировать SLA: сколько храним, как быстро отвечаем

</v-click>

<v-click>

➔ Подготовить дашборд и алерт - "не осталось логов за последний час"

</v-click>

<v-click>

➔ Использовать ИИ как напарника, а не как SRE-on-call

</v-click>

---

# Спасибо

Дмитрий Синявский - @r3code

Презентация: github.com/r3code/report-logs-collection-in-ai-era

Канал: t.me/letitkit

<div class="absolute right-10 bottom-10 w-1/4 h-1/2 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 p-4 text-center rounded">
  [QR-код: t.me/letitkit]
</div>
