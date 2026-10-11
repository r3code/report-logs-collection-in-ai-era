# lsof при инциденте

**`lsof` на ноде Dev-кластера** – диск заполнен на 100%:

```text
COMMAND  PID   FD  TYPE  NAME
vector   1234  45r REG   /var/log/pods/dev_bff-7d8f9c6b4-xk2m1_8a3f.../bff/0.log (deleted)
vector   1234  46r REG   /var/log/pods/dev_bff-7d8f9c6b4-xk2m1_8a3f.../bff/1.log (deleted)
vector   1234  47r REG   /var/log/pods/dev_api-5f6g7h8i9-j3l4n_9b4e.../api/0.log (deleted)
vector   1234  48r REG   /var/log/pods/dev_bff-7d8f9c6b4-xk2m1_8a3f.../bff/2.log (deleted)
```

<v-click>

**Файлы удалены (rotated), но Vector держит fd** – inodes закончились

</v-click>

<v-click>

<div class="absolute inset-0 flex items-center justify-center" style="background: white; z-index: 100;">
  <img src="/images/no-space-left-on-device.png" class="max-h-full max-w-full object-contain" alt="No space left on device">
</div>

</v-click>

<!--
Иллюстрация проблемы изнутри. lsof показывает сотни (deleted) дескрипторов на логах подов K8s. Файлы физически удалены при ротации, но процесс vector продолжает их держать открытыми — потому что не успел дочитать. Результат: диск формально свободен, но inodes кончились, новые файлы создать нельзя, нода падает. В Dev-кластере это случалось чаще всего.

[click] Показываем скриншот No space left on device — результат всего этого.
-->
