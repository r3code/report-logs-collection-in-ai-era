# Схема ClickHouse (2/2)

```sql
...
SETTINGS index_granularity = 8192,
         ttl_only_drop_parts = 0;
```

<v-click>

**`ttl_only_drop_parts = 0`** – критично!

</v-click>

<!--
`ttl_only_drop_parts = 0` — позволяем ClickHouse удалять части с истёкшим TTL, не дожидаясь полного парта. Чуть больше нагрузки на merge, но TTL срабатывает точнее. Без этого если запись с TTL=3 и TTL=30 оказались в одной партиции ClickHouse, то удалится она только когда запись с TTL=30 протухнет — а нам надо раньше.
-->
