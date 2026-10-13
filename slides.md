---
theme: default
title: Сбор логов на vector и clickhouse – то, что ИИ за тебя не сделал бы
info: 'Доклад Дмитрия Синявского · HardFest'
routeAlias: cover
drawings:
  persist: false
export:
  showProgress: false
head:
  - <style>.slidev-page-number,.slidev-progress,.slidev-clicks-indicator,.slidev-page-no,.slidev-layout footer{display:none!important;opacity:0!important;visibility:hidden!important}</style>
fonts:
  sans: 'Noto Sans'
  mono: 'Fira Code'
layout: cover
---

<div class="absolute right-0 top-0 bottom-0 w-1/2 h-full">
  <img src="/images/bg-slide-1.png" class="w-full h-full object-cover" alt="Фон презентации">
</div>

<div class="absolute z-20" style="top: 30px; right: 30px; height: 50px; width: auto;">
  <img src="/images/vitech-logo-white-tech.svg" style="height: 50px !important; width: auto !important; display: block;" alt="Ви.Tech логотип">
</div>

<p class="absolute bottom-0 right-3 z-20" style="font-size: 10pt !important; color: #374151 !important; margin: 0 !important; padding: 0 !important; line-height: 1 !important;">__VERSION__</p>

<div class="relative z-10 w-1/2 pr-8">
<h1>Сбор логов на vector<br>и clickhouse<br>– то, что ИИ за тебя<br>не сделал бы</h1>

<p class="speaker-name">Дмитрий Синявский</p>
<p class="speaker-role">Инженер по надёжности (SRE)<br>Ви.Tech</p>
</div>

<!--
Открываю доклад. 35 минут поговорим про то, что ИИ не скажет вам про сбор логов на Vector и ClickHouse. Это не введение в инструмент, это эмпирические ловушки, которые я выстрадал в продакшене Ви.Tech. Аудитория — Middle+ DevOps/SRE, которые уже масштабировали инфраструктуру.

Краткое интро: я Дмитрий Синявский, SRE в Ви.Tech, веду каналы letitkit и allslo_ru. Доклад основан на двух предыдущих — DevOpsConf 2024 (миграция с EFK) и DevOpsConf 2025 (итоги двух лет с Unified Log Pipeline). Сегодня — про ловушки, которые не описаны в документации и которые LLM не предскажет.
-->

---
src: ./pages/00-intro/02-about.md
---

---
src: ./pages/00-intro/03-stats.md
---

---
src: ./pages/00-intro/04-overview.md
---

---
src: ./pages/01-illusion/01-section.md
---

---
src: ./pages/01-illusion/02-illusion.md
---

---
src: ./pages/01-illusion/03-chatgpt-response.md
---

---
src: ./pages/01-illusion/05c-ai-vs-reality.md
---

---
src: ./pages/01-illusion/04-architecture.md
---

---
src: ./pages/01-illusion/05-scale.md
---

---
src: ./pages/01-illusion/05b-structured-logs.md
---

---
src: ./pages/04-trap3/05b-batching.md
---

---
src: ./pages/02-trap1/01-section.md
---

---
src: ./pages/02-trap1/02-annotations.md
---

---
src: ./pages/02-trap1/03-wall.md
---

---
src: ./pages/02-trap1/04-our-path.md
---

---
src: ./pages/02-trap1/05-exclusions.md
---

---
src: ./pages/02-trap1/05d-boyarskiy-meme.md
---

---
src: ./pages/02-trap1/06-one-for-all.md
---

---
src: ./pages/02-trap1/07-vrl.md
---

---
src: ./pages/02-trap1/08-results.md
---

---
src: ./pages/03-trap2/01-section.md
---

---
src: ./pages/03-trap2/02-noisy-neighbors.md
---

---
src: ./pages/03-trap2/03-lsof.md
---

---
src: ./pages/03-trap2/03b-no-space.md
---

---
src: ./pages/03-trap2/04-our-path.md
---

---
src: ./pages/03-trap2/05-throttling-dev.md
---

---
src: ./pages/03-trap2/06-throttling-prod.md
---

---
src: ./pages/04-trap3/01-section.md
---

---
src: ./pages/04-trap3/02-ttl-policy.md
---

---
src: ./pages/04-trap3/03-sre-meme.md
---

---
src: ./pages/04-trap3/04-ttl-options.md
---

---
src: ./pages/04-trap3/05-ttl-solution.md
---

---
src: ./pages/04-trap3/06-schema-1.md
---

---
src: ./pages/04-trap3/07-schema-2.md
---

---
src: ./pages/04-trap3/02b-interactive.md
---

---
src: ./pages/04-trap3/07b-partitions.md
---

---
src: ./pages/05-conclusions/01-section.md
---

---
src: ./pages/05-conclusions/02-principles.md
---

---
src: ./pages/05-conclusions/03-main-conclusion.md
---

---
src: ./pages/05-conclusions/02b-ai-joke.md
---

---
src: ./pages/05-conclusions/04-repo-qr.md
---

---
src: ./pages/05-conclusions/05-questions.md
---
