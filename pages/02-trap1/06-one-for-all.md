# Один за всех

**Один лейбл на namespace** – покрывает весь namespace сразу:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  labels:
    tags.vitech.team/service_name: my-cool-service
```

<v-click>

**Никаких аннотаций на контейнеры**

</v-click>

<!--
Справа – один лейбл на namespace, который покрывает весь namespace сразу. Один за всех — как мушкетёры.
-->
