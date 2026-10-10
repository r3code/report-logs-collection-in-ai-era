# Архитектура сбора логов

<div class="absolute inset-0 w-full h-full flex items-center justify-center">
  <img src="/images/logging-architecture-01.jpg" class="max-w-full max-h-full object-contain" alt="Архитектура сбора логов">
</div>

<!--
Архитектура нашего сбора логов. Vector-агенты на каждой ноде K8s и на VM собирают логи, отправляют на агрегаторы. Агрегаторы — это тоже Vector, но уже с трансформами: нормализация, enrichment, маршрутизация. Дальше — в ClickHouse. Кажется просто — но на каждом уровне есть ловушки, о которых буду говорить.
-->
