# Схема ClickHouse (1/2)

<v-click>

**Единая таблица `logs_local`** (ReplicatedMergeTree) с динамическим TTL:

```sql
`TTL` UInt16 DEFAULT 7
  COMMENT 'Срок хранения записи лога в сутках',

TTL toDateTime(ObservedTimestamp) + toIntervalDay(TTL)
...
```

</v-click>

<v-click>

**Ключевые решения:**

- **Динамический TTL через `TTL UInt16`**

- **`logs_local` + `logs` (Distributed)** – на каждом узле кластера

</v-click>

<!--
Схема: одна таблица `logs_local` на каждом узле кластера ClickHouse. Поверх — распределённая таблица `logs` для запросов.

Фокус — колонка `TTL UInt16 DEFAULT 7`. Каждая запись несёт свой срок хранения. TTL вычисляется динамически: `toDateTime(ObservedTimestamp) + toIntervalDay(TTL)`. Платёжный лог — `TTL = 30`, Dev-лог — `TTL = 3`. Одна таблица, одна схема, разные сроки.
-->
