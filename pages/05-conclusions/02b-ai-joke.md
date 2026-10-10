---
clicks: 3
---

# Но ИИ скоро всё сможет, ему просто нужно:

<div class="w-2/3 pr-8">
  <ul class="progressive">
    <li v-show="$clicks >= 0" :class="{ active: $clicks === 0 }">Иметь MCP на каждое приложение, БД, кэш, платформу, сервер</li>
    <li v-show="$clicks >= 1" :class="{ active: $clicks === 1 }">Загрузить контекст всего этого в себя</li>
    <li v-show="$clicks >= 2" :class="{ active: $clicks === 2 }">В реалтайме реагировать на изменения в системе</li>
    <li v-show="$clicks >= 3" :class="{ active: $clicks >= 3 }">...и как-то не разломать всё это в попытках починить</li>
  </ul>
</div>

<div class="absolute right-0 bottom-0" style="width: 40%; top: 120px; display: flex; align-items: center; justify-content: flex-end;">
  <img src="/images/one-man-band.png" style="max-height: 100%; max-width: 100%; object-fit: contain;" alt="One man band">
</div>

<!--
Шутка-заключение. ИИ скоро сможет, но требования к этому «скоро» — MCP на всё, весь контекст, реалтайм, и не сломать. Мем: бродячий музыкант (one-man band) — барабан за спиной, губная гармошка в зубах. ИИ тоже должен всё сам, как этот музыкант.
-->
