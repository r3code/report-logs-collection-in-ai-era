# Проблема – «стена» аннотаций

**Деплоймент с 10 контейнерами** – в каждый аннотацию:

```yaml
metadata:
  annotations:
    logging.vitech.team/container1.unified_log_model: "true"
    logging.vitech.team/container1.service_name: "my-cool-service"
    logging.vitech.team/container2.unified_log_model: "true"
    logging.vitech.team/container2.service_name: "my-cool-service"
```

<v-click>

**И так 10 раз**

</v-click>

<!--
Слайд-сравнение: как было и как стало. Слева – «стена» из 10 аннотаций в одном деплойменте, которые ещё и могут не примениться из-за лимита 63 символа.
-->
