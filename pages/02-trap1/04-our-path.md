# Наш путь

**Отказались от настройки на контейнер** – перешли к централизованному управлению

<v-click>

**Лейбл на namespace** – вместо аннотаций на контейнерах:

```yaml
tags.vitech.team/service_name: my-cool-service
```

</v-click>

<!--
Решение: перешли от аннотаций на контейнерах к лейблу на namespace. Один лейбл — `tags.vitech.team/service_name: my-cool-service` — и весь namespace собирается.
-->
