# Наш путь – исключаем лишнее

**Собираем всё, но с исключениями** – два уровня:

<v-click>

**Vector-аннотации** – для точечного исключения pod или контейнеров в нём:

```yaml
vector.dev/exclude: "true"
vector.dev/exclude-containers: "container1,container2"
```

</v-click>

<v-click>

**`excluded_services`** – настройка исключения сервисов по namespace на vector-агентах. Настройка через список excluded_services в конфигурации агента.

</v-click>

<!--
Собираем всё, но с исключениями. Два уровня:
1. Наш список `excluded_services` в Ansible — для системных namespace, где логи не нужны.
2. Встроенные в Vector аннотации для точечного исключения: `vector.dev/exclude: "true"` исключает весь pod, `vector.dev/exclude-containers: "container1,container2"` исключает конкретные контейнеры в поде.

Конфигурация генерируется через Jinja-шаблоны Ansible — все исключения в одном месте, видно сразу.
-->
