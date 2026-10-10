# Как Vector узнаёт имя сервиса

На агрегаторе читаем лейбл с namespace:

```rust
ServiceName = strip_whitespace( to_string!( del( 
    .kubernetes.pod_annotations."tags.vitech.team/service_name" 
) ) )
```

<!--
На агрегаторе VRL-трансформ читает лейбл с namespace и кладёт в поле `ServiceName`. Всё — дальше логи идут в ClickHouse с правильным именем сервиса.
-->
