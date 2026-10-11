# lsof при инциденте

**`lsof` на ноде Dev-кластера**

```text
COMMAND  PID   FD  TYPE  NAME
vector   1234  45r REG   /var/log/pods/dev_bff-7d8f9c6b4-xk2m1_8a3f.../bff/0.log (deleted)
vector   1234  46r REG   /var/log/pods/dev_bff-7d8f9c6b4-xk2m1_8a3f.../bff/1.log (deleted)
vector   1234  47r REG   /var/log/pods/dev_api-5f6g7h8i9-j3l4n_9b4e.../api/0.log (deleted)
vector   1234  48r REG   /var/log/pods/dev_bff-7d8f9c6b4-xk2m1_8a3f.../bff/2.log (deleted)
```

<v-click>

**Файлы удалены (rotated), но Vector держит fd**

</v-click>

<!--
Иллюстрация проблемы изнутри. lsof показывает сотни (deleted) дескрипторов на логах подов K8s. Файлы физически удалены при ротации, но процесс vector продолжает их держать открытыми — потому что не успел дочитать. Результат: диск формально свободен, но inodes кончились, новые файлы создать нельзя, нода падает. В Dev-кластере это случалось чаще всего.
-->
