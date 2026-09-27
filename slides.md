---
theme: default
title: Сбор логов на vector и clickhouse
info: 'Доклад Дмитрия Синявского · HardFest'
drawings:
  persist: false
fonts:
  sans: 'Arial'
  mono: 'Fira Code'
class: cover
---

# Сбор логов на vector и clickhouse – то, что ИИ за тебя не сделал бы

<p class="speaker-name">Дмитрий Синявский</p>
<p class="speaker-role">Инженер по надёжности (SRE)</p>
<p class="speaker-company">Ви.Tech</p>

<div class="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center p-4 text-center rounded">
  [ИЗОБРАЖЕНИЕ: прижато вправо-вниз, занимает половину слайда, не перекрывает текст слева.<br>Тематическая картинка или схема стека Vector → ClickHouse]
</div>

---

# О чем поговорим

<v-click at="1">
<v-click-hide at="2">

<p class="text-black font-bold mb-6">➔ Иллюзия «готового решения»</p>

<p class="text-black">Что LLM выдаст идеальный конфиг Vector за 30 секунд – и сломается на первом масштабировании.</p>

</v-click-hide>
</v-click>

<v-click at="2">
<v-click-hide at="3">

<p class="text-black mb-6">• Иллюзия «готового решения»</p>
<p class="text-black font-bold mb-6">➔ Ловушка №1: масштабирование управления</p>

<p class="text-black">Лимит в 64 символа на ключ аннотации K8s ломает деплой при 10+ контейнерах в поде.</p>

</v-click-hide>
</v-click>

<v-click at="3">
<v-click-hide at="4">

<p class="text-black mb-6">• Иллюзия «готового решения»</p>
<p class="text-black mb-6">• Ловушка №1: масштабирование управления</p>
<p class="text-black font-bold mb-6">➔ Ловушка №2: инфраструктурные ограничения</p>

<p class="text-black">Шумные соседи: 20 МБ/с логов в Dev забивают диск за 2 часа и оставляют висящие fd.</p>

</v-click-hide>
</v-click>

<v-click at="4">
<v-click-hide at="5">

<p class="text-black mb-6">• Иллюзия «готового решения»</p>
<p class="text-black mb-6">• Ловушка №1: масштабирование управления</p>
<p class="text-black mb-6">• Ловушка №2: инфраструктурные ограничения</p>
<p class="text-black font-bold mb-6">➔ Ловушка №3: хранение как политика данных</p>

<p class="text-black">TTL – это не параметр, а бизнес-политика: 30 дней для платежей, 3 дня для Dev.</p>

</v-click-hide>
</v-click>

<v-click at="5">

<p class="text-black mb-6">• Иллюзия «готового решения»</p>
<p class="text-black mb-6">• Ловушка №1: масштабирование управления</p>
<p class="text-black mb-6">• Ловушка №2: инфраструктурные ограничения</p>
<p class="text-black mb-6">• Ловушка №3: хранение как политика данных</p>
<p class="text-black font-bold mb-6">➔ Итоги – 3 принципа</p>

</v-click>

---

# Обо мне

<div class="absolute left-10 top-1/4 w-1/3 h-1/2 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center p-4 text-center rounded">
  [ИЗОБРАЖЕНИЕ: «молния» ⚡ – иконка рядом с цифрой 20]
</div>

<div class="absolute right-10 top-1/4 w-1/2 grid grid-cols-2 gap-4">

<div class="text-center">
  <p class="text-5xl font-bold text-black">20 ⚡</p>
  <p class="text-black">лет в IT</p>
</div>

<div class="text-center">
  <p class="text-5xl font-bold text-black">9</p>
  <p class="text-black">лет в разработке</p>
</div>

<div class="text-center">
  <p class="text-5xl font-bold text-black">6</p>
  <p class="text-black">лет руководил разработкой</p>
</div>

<div class="text-center">
  <p class="text-5xl font-bold text-black">5</p>
  <p class="text-black">лет в SRE</p>
</div>

</div>

Дмитрий Синявский, инженер по надёжности (SRE), Ви.Tech

---
class: bg-black text-white flex flex-col justify-center p-20
---

# Иллюзия «готового решения»

---

# Иллюзия «готового решения»

Спросите GPT/Claude: «Как собрать логи из K8s используя Vector.dev в ClickHouse?»

<v-click>

Он выдаст идеальный конфиг Vector. Запустите его – и всё заработает. Но только до первого масштабирования.

</v-click>

<v-click>

**Тезис:** конфиг работает в вакууме, но в продакшене масштабируются не инструменты, а проблемы управления ими.

</v-click>

<div class="absolute right-10 bottom-10 w-1/3 h-1/3 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center p-4 text-center rounded">
  [СКРИНШОТ: идеальный ответ Claude рядом с графиком реального инцидента]
</div>

---

# Масштаб системы – контекст

Чтобы было понятно, о каких масштабах речь:

| Параметр | Значение |
|----------|----------|
| Сервисов в продакшене | 200 |
| Объём логов | 3.6–3.8 ТБ/день, 66 MiB/s |
| Событий в секунду | 100–130K |
| Vector-агентов в K8s | 764 (4 кластера) |
| Vector-агентов на VM/железе | 1300 |
| Vector-агрегаторов | 8 (по 2 в 4 кластерах) |

---
class: bg-black text-white flex flex-col justify-center p-20
---

# Ловушка №1: масштабирование управления, а не парсинга

---

# Ловушка №1: масштабирование управления

**Эмпирическое незнание:** мы думали, что проблема – в разнородных логах. Оказалось – в управлении ими при масштабировании.

<v-click>

**Проблема:** включать сбор логов через аннотации контейнеров:

```yaml
logging.vitech.team/<container.name>.unified_log_model: "true"
```

</v-click>

<v-click>

**Эмпирический факт:** лимит в 64 символа на ключ аннотации K8s. При 10+ контейнерах в поде манифест просто не деплоится.

</v-click>

<v-click>

**Боль:** не включить сбор логов!

</v-click>

---

# Ловушка №1: почему LLM молчит

LLM знает синтаксис аннотаций K8s, но не может предусмотреть, что мы достигнем ограничений K8s API.

<v-click>

**Наш путь:** отказ от настройки на контейнер в пользу централизованного управления.

</v-click>

<v-click>

Собираем всё, но с исключениями (`excluded_services`) через Jinja-шаблоны Ansible.

</v-click>

<v-click>

Лейбл на namespace вместо аннотаций на контейнерах:

```yaml
tags.vitech.team/service_name: my-cool-service
```

</v-click>

---

# Ловушка №1: VRL на агрегаторе

На агрегаторе читаем лейбл с namespace:

```toml
ServiceName = strip_whitespace(
  to_string!(del(.kubernetes.pod_annotations."tags.vitech.team/service_name"))
)
```

<v-click>

**Экономия времени:**

| Метрика | Было | Стало |
|---------|------|-------|
| Подключение нового сервиса | 5–8 часов | 10 минут |
| Строк в конфигах | 2–40 | 2 |
| Валидация конфигов (тесты Vector) | 15 минут | 4 минуты (параллельно на 5 сред) |

</v-click>

<div class="absolute right-10 bottom-10 w-1/4 h-1/4 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center p-4 text-center rounded">
  [СКРИНШОТ: «стена» из 10 аннотаций в одном деплойменте vs один лейбл на namespace]
</div>

---
class: bg-black text-white flex flex-col justify-center p-20
---

# Ловушка №2: инфраструктурные ограничения &gt; конфигурация

---

# Ловушка №2: шумные соседи

**Эмпирическое незнание:** «мы думали, что Vector сам справится с файлами. Оказалось – инфраструктура ломается первой».

<v-click>

**Проблема:** сервис в Dev начинает писать 10–30 КБ/сек, файл лога ротируется быстрее, чем Vector успевает его вычитать.

</v-click>

<v-click>

**Конкретный пример:** сервис `bff` пишет 6.39 MiB/s, при баге – до 20 MiB/s. Диск 50 ГБ в Dev заполняется за 2 часа.

</v-click>

<v-click>

**Что хуже:** потеря событий и заполнение диска на 100% удалёнными файловыми дескрипторами (handle leaks), которые удерживает процесс.

</v-click>

---

# Ловушка №2: почему LLM молчит

LLM знает `source = kubernetes_logs`, но не знает, как поведут себя сервисы в реальной среде.

<v-click>

**Наш путь:**

- Явная настройка `max_line_bytes` и `data_dir` для состояния
- Включение `buffer.type = "disk"`
- Троттлинг на уровне ноды для защиты агрегатора от всплесков

</v-click>

<v-click>

**Троттлинг применяется на агентах (не агрегаторах):**

```toml
# Dev: 129000 evt/min
key_field = "{{.kubernetes.pod_namespace}}"
threshold = 2150
window_secs = 1
```

```toml
# Prod
key_field = "{{.kubernetes.pod_namespace}}"
threshold = 600
window_secs = 60
```

</v-click>

<div class="absolute right-10 bottom-10 w-1/4 h-1/4 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center p-4 text-center rounded">
  [СКРИНШОТ: график заполнения диска в / и вывод lsof с висящими fd]
</div>

---
class: bg-black text-white flex flex-col justify-center p-20
---

# Ловушка №3: хранение – это политика данных, а не просто таблица

---

# Ловушка №3: TTL – это политика

**Эмпирическое незнание:** «мы думали, что TTL – это просто параметр. Оказалось – это политика данных».

<v-click>

**Проблема:** разные требования к срокам хранения:

- 30 дней для платёжных логов
- 3 дня для Dev-окружения
- Системы вроде VictoriaLogs не дают такой гибкости на уровне записей

</v-click>

<v-click>

**Эмпирический факт:** создание отдельных таблиц под каждый сервис приводит к дублированию схемы и усложнению запросов.

</v-click>

<v-click>

**Почему LLM молчит:** он знает синтаксис TTL, но не знает ваших бизнес-требований к хранению.

</v-click>

---

# Ловушка №3: схема ClickHouse

Единая таблица `logs_local` (ReplicatedMergeTree) с динамическим TTL:

```sql
`TTL` UInt16 DEFAULT 7
  COMMENT 'Срок хранения записи лога в таблице в сутках',

-- динамический TTL через колонку
TTL toDateTime(ObservedTimestamp) + toIntervalDay(TTL)

INDEX idx_ServiceName_ObservedTimestamp
  (ServiceName, ObservedTimestamp) TYPE minmax
  GRANULARITY 8192

SETTINGS index_granularity = 8192,
         ttl_only_drop_parts = 0;
```

<v-click>

**Ключевые решения:**

- `logs_local` (ReplicatedMergeTree) на каждом узле + `logs` (Distributed) поверх
- Динамический TTL через колонку `TTL UInt16` – не фиксированный для всей таблицы
- Сжатие `ZSTD(1)` – баланс CPU/место

</v-click>

---

# Тесты трансформов ULP

Всего тестов в Unified Log Pipeline: **101 шт.**

<v-click>

| Трансформ | Тестов |
|-----------|--------|
| `ulp_normalize_severity` | 31 |
| `ulp_message_processing` | 22 |
| `ulp-log-all-metrics-collector` | 13 |
| `ulp_prepare_ttl` | 7 |
| `ulp-internal-metric_logs_total` | 4 |
| `ulp-internal-metric_logs_size_bytes_total` | 4 |
| `ulp-internal-metric_k8s_logs_total` | 3 |
| `ulp_check_unix_timestamp` | 2 |
| `ulp_log_metrics_exclude_filter` | 1 |

</v-click>

<v-click>

**Интеграция в CI/CD:** конфигурация для Vector и тесты генерируются Ansible, отдельный stage прогоняет job-ы с тестами для всех сред vector-агрегаторов в GitLab CI.

</v-click>

---
class: bg-black text-white flex flex-col justify-center p-20
---

# Итоги – 3 принципа

---

# Итоги – 3 принципа

<v-click at="1">
<v-click-hide at="2">

<p class="text-black font-bold mb-6">➔ 1. Децентрализация конфигурации – зло</p>

<p class="text-black">Переносим управление сбором с аннотаций контейнеров (где есть лимиты K8s API) на лейблы namespace и централизованные Jinja-шаблоны Ansible с управлением исключениями. Собирай всё – исключай лишнее.</p>

</v-click-hide>
</v-click>

<v-click at="2">
<v-click-hide at="3">

<p class="text-black mb-6">• 1. Децентрализация конфигурации – зло</p>
<p class="text-black font-bold mb-6">➔ 2. Логи – это нагрузка на систему</p>

<p class="text-black">Vector по умолчанию не спасёт от «шумных соседей». Всегда явно настраивайте disk buffer, data_dir и троттлинг.</p>

</v-click-hide>
</v-click>

<v-click at="3">

<p class="text-black mb-6">• 1. Децентрализация конфигурации – зло</p>
<p class="text-black mb-6">• 2. Логи – это нагрузка на систему</p>
<p class="text-black font-bold mb-6">➔ 3. Хранение должно быть гибким</p>

<p class="text-black">Единая таблица с динамическим TTL на уровне записи выигрывает у зоопарка таблиц или жестких ограничений альтернативных систем.</p>

</v-click>

---

# Главный вывод

<v-click>

<p class="text-black text-3xl font-bold mb-6">Не верьте ИИ на слово.</p>

</v-click>

<v-click>

LLM напишет вам идеальный конфиг для вакуума, но не напишет тесты под ваши граничные случаи и не предусмотрит лимиты API.

</v-click>

<v-click>

**Эмпирическая боль – единственный учитель в инфраструктуре.**

</v-click>

<v-click>

Все наши наработки (схемы SQL, шаблоны Ansible, тесты) – в открытом доступе:

github.com/vseinstrumentiru/unified-log-pipeline

</v-click>

---
class: end
---

# Спасибо

<p class="speaker-name">Дмитрий Синявский</p>

Канал: t.me/letitkit

Репозиторий: github.com/vseinstrumentiru/unified-log-pipeline

<div class="absolute right-10 bottom-10 w-1/4 h-1/2 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center p-4 text-center rounded">
  [QR-код: t.me/letitkit]
</div>
