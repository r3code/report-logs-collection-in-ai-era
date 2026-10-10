# Наш путь

**Чтение не с самого старого файла** – и блоками по 16KB:

```yaml
sources:
  kubernetes_logs:
    type: kubernetes_logs
    oldest_first: false
    max_read_bytes: 16384
```

<v-click>

**`oldest_first: false`** – свежие логи первыми, не застреваем на старых

</v-click>

<v-click>

**`max_read_bytes: 16384`** – блоками по 16KB, не держим fd долго

</v-click>

<!--
Решение многослойное:
1. `oldest_first: false` — агент читает свежие логи первыми, не застревая на старых.
2. `max_read_bytes: 16384` — читаем блоками по 16KB, не держим fd долго.
3. Троттлинг на уровне ноды — защита агрегатора от всплесков с конкретных namespace (на следующем слайде).
-->
