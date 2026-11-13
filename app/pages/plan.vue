<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { weekdayOf, TODAY } from '~/composables/useMock'

const all = usePlan()
const companyId = useCompanyId()
const schedules = useSchedule()
const actions = usePostActions()
const toast = useToast()

const plan = computed(() => all.value.filter(i => i.companyId === companyId.value))
const schedule = computed(() => schedules.value[companyId.value]!)
const ideas = computed(() => plan.value.filter(i => i.status === 'idea'))
const byDay = (n: number) => plan.value.filter(i => i.date === `${n}.11`)

const mode = ref<'week' | 'month'>('week')
const modes = [{ label: 'Неделя', value: 'week' }, { label: 'Месяц', value: 'month' }]
const selected = ref(16)
const weekStart = ref(16)

const names: Record<string, string> = { Пн: 'Понедельник', Вт: 'Вторник', Ср: 'Среда', Чт: 'Четверг', Пт: 'Пятница', Сб: 'Суббота', Вс: 'Воскресенье' }
const isWeekend = (n: number) => ['Сб', 'Вс'].includes(weekdayOf(n))
const dayTitle = (n: number) => `${names[weekdayOf(n)]}, ${n} ноября`

// ---------- week ----------
const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const week = computed(() => WEEK.map((w, k) => {
  const n = weekStart.value + k
  const statuses = n <= 30 ? byDay(n).filter(i => i.status !== 'skipped').map(i => i.status) : []
  return { w, n: n > 30 ? n - 30 : n, key: n, statuses, today: n === TODAY }
}))
const weekDays = computed(() => Array.from({ length: 7 }, (_, k) => weekStart.value + k)
  .filter(n => n <= 30).map(n => ({ n, items: byDay(n) })).filter(d => d.items.length))
const weekLabel = computed(() => {
  const end = weekStart.value + 6
  return end > 30 ? `${weekStart.value} нояб. – ${end - 30} дек.` : `${weekStart.value}–${end} ноября`
})
function shiftWeek(d: number) {
  weekStart.value = Math.min(30, Math.max(2, weekStart.value + d * 7))
  selected.value = weekStart.value
}
function pickWeekDay(n: number) {
  selected.value = n
  document.getElementById(`day-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------- month (UCalendar) ----------
const NOV = { start: new CalendarDate(2026, 11, 1), end: new CalendarDate(2026, 11, 30) }
const calendarValue = computed({
  get: () => new CalendarDate(2026, 11, selected.value),
  set: (d: DateValue | undefined) => { if (d && d.month === 11) selected.value = d.day }
})
const dayItems = (d: DateValue) => d.month === 11 ? byDay(d.day) : []
const dot: Record<string, string> = {
  published: 'bg-success', drafted: 'bg-primary', accepted: 'bg-primary', idea: 'bg-warning', skipped: 'bg-accented'
}
const stats = computed(() => {
  const l = plan.value
  const emptyDays = Array.from({ length: 30 - TODAY }, (_, k) => TODAY + 1 + k).filter(n => !isWeekend(n) && !byDay(n).length)
  return {
    published: l.filter(i => i.status === 'published').length,
    planned: l.filter(i => i.status === 'accepted' || i.status === 'drafted').length,
    ideas: l.filter(i => i.status === 'idea').length,
    emptyDays
  }
})
const rubrics = computed(() => {
  const m = new Map<string, number>()
  for (const i of plan.value) if (i.status !== 'skipped') m.set(i.rubric, (m.get(i.rubric) ?? 0) + 1)
  const list = [...m.entries()].map(([r, n]) => ({ r, n })).sort((a, b) => b.n - a.n)
  const max = Math.max(...list.map(x => x.n), 1)
  return list.map(x => ({ ...x, pct: (x.n / max) * 100 }))
})

// ---------- actions ----------
const suggestions = [
  ['Полезное', 'Как читать маркировку стекла', 'В комментариях спрашивают про маркировку'],
  ['Жизнь компании', 'Один день из жизни технолога', 'Внутренняя жизнь компании, нехватка в плане'],
  ['Продукт в деталях', 'Тонированное стекло: оттенки и где применять', 'Рубрика «Продукт» раз в неделю'],
  ['Технологии', 'Как проверяют качество стекла', 'Объяснительный формат заходит лучше всего'],
  ['Новости отрасли', 'Что изменится в отрасли в 2027 году', 'Регулярная рубрика новостей']
]
let sIdx = 0
function addIdea(n: number) {
  const [rubric, title, reason] = suggestions[sIdx++ % suggestions.length]!
  all.value.push({ id: Date.now() + n, companyId: companyId.value, date: `${n}.11`, weekday: weekdayOf(n), time: '11:00', rubric: rubric!, status: 'idea', origin: 'schedule', title: title!, reason: reason! })
}
function fillEmpty() {
  const days = stats.value.emptyDays
  days.forEach(addIdea)
  toast.add({ title: `Предложено тем: ${days.length}`, description: 'Примите их или пропустите', icon: 'i-lucide-sparkles', color: 'primary' })
}
function suggestFor(n: number) {
  addIdea(n)
  toast.add({ title: 'AI предложил тему', icon: 'i-lucide-sparkles', color: 'primary' })
}
function acceptAll() {
  ideas.value.forEach((i) => { const x = all.value.find(y => y.id === i.id); if (x) x.status = 'accepted' })
  toast.add({ title: 'Все идеи приняты', description: 'Черновики появятся в назначенные дни', icon: 'i-lucide-circle-check', color: 'success' })
}
function runNow() {
  actions.create(companyId.value, 'Автоматический черновик по рубрикам', 'schedule')
  toast.add({ title: 'Запущено', description: 'Черновик придёт на согласование', icon: 'i-lucide-play', color: 'primary' })
}
</script>

<template>
  <div class="space-y-3">
    <UTabs v-model="mode" :items="modes" :content="false" />

    <!-- ================= WEEK ================= -->
    <template v-if="mode === 'week'">
      <div class="flex items-center justify-between px-1">
        <UButton icon="i-lucide-chevron-left" variant="outline" square :disabled="weekStart <= 2" aria-label="Предыдущая неделя" @click="shiftWeek(-1)" />
        <p class="text-heading font-semibold">{{ weekLabel }}</p>
        <UButton icon="i-lucide-chevron-right" variant="outline" square :disabled="weekStart >= 30" aria-label="Следующая неделя" @click="shiftWeek(1)" />
      </div>

      <WeekStrip :days="week" :selected="selected" @select="d => pickWeekDay(Number(d.key))" />

      <UCard>
        <InfoRow icon="i-lucide-bot" tone="brand" tile="md" title="Автозапуск" :subtitle="schedule.label"
          :meta="schedule.enabled ? `Через ${schedule.next}` : 'Выключен'" :meta-class="schedule.enabled ? 'text-primary' : 'text-muted'">
          <div class="flex flex-col items-end gap-2">
            <USwitch v-model="schedule.enabled" aria-label="Автозапуск" />
            <UButton label="Сейчас" size="sm" :disabled="!schedule.enabled" @click="runNow" />
          </div>
        </InfoRow>
      </UCard>

      <UCard v-if="ideas.length" :ui="{ body: 'flex items-center gap-3 p-4 sm:p-4 ps-5' }">
        <UIcon name="i-lucide-lightbulb" class="size-5 shrink-0 text-warning" />
        <p class="flex-1 text-body font-semibold">Идей ждут решения: {{ ideas.length }}</p>
        <UButton to="/bot?draft=Измени план: " label="Изменить" size="sm" />
        <UButton label="Принять" variant="solid" size="sm" @click="acceptAll" />
      </UCard>

      <section v-for="day in weekDays" :id="`day-${day.n}`" :key="day.n" class="scroll-mt-3">
        <SectionCard :title="dayTitle(day.n)" :icon="day.n === TODAY ? 'i-lucide-sun' : 'i-lucide-calendar'">
          <PlanRow v-for="i in day.items" :key="i.id" :item="i" />
        </SectionCard>
      </section>

      <UCard v-if="!weekDays.length">
        <InfoRow icon="i-lucide-calendar-plus" tone="slate" tile="md" title="Неделя пустая" subtitle="AI предложит темы на будни">
          <UButton label="Заполнить" variant="solid" @click="fillEmpty" />
        </InfoRow>
      </UCard>
    </template>

    <!-- ================= MONTH ================= -->
    <template v-else>
      <UCard :ui="{ body: 'p-4 sm:p-4' }">
        <UCalendar
          v-model="calendarValue" locale="ru" :week-starts-on="1" :min-value="NOV.start" :max-value="NOV.end"
          :year-controls="false" :month-controls="false" :fixed-weeks="false" weekday-format="short" color="neutral"
        >
          <template #day="{ day }">
            <span class="leading-none">{{ day.day }}</span>
            <span class="mt-1.5 flex h-1.5 gap-[3px]">
              <span v-for="i in dayItems(day).slice(0, 3)" :key="i.id" class="size-1.5 rounded-full" :class="dot[i.status]" />
            </span>
          </template>
        </UCalendar>
        <StatusLegend class="mt-3" />
      </UCard>

      <SectionCard :title="dayTitle(selected)" :icon="selected === TODAY ? 'i-lucide-sun' : 'i-lucide-calendar'">
        <PlanRow v-for="i in byDay(selected)" :key="i.id" :item="i" />
        <InfoRow
          v-if="!byDay(selected).length" icon="i-lucide-calendar-plus" tone="slate"
          :title="selected < TODAY ? 'Постов не было' : 'Свободный день'"
          :subtitle="selected < TODAY ? 'В этот день ничего не выходило' : isWeekend(selected) ? 'Выходной: можно оставить пустым' : 'AI может предложить тему'"
        >
          <UButton v-if="selected > TODAY" label="Предложить" color="primary" variant="outline" @click="suggestFor(selected)" />
        </InfoRow>
      </SectionCard>

      <UCard v-if="stats.emptyDays.length" :ui="{ body: 'flex items-center gap-3 p-4 sm:p-4 ps-5' }">
        <UIcon name="i-lucide-sparkles" class="size-5 shrink-0 text-primary" />
        <p class="flex-1 text-body font-semibold">Будних дней без постов: {{ stats.emptyDays.length }}</p>
        <UButton label="Заполнить" variant="solid" size="sm" @click="fillEmpty" />
      </UCard>

      <SectionCard title="Ноябрь в цифрах" icon="i-lucide-chart-pie">
        <div class="grid grid-cols-3">
          <div><p class="text-stat font-bold text-success">{{ stats.published }}</p><p class="mt-1 text-caption text-muted">вышло</p></div>
          <div><p class="text-stat font-bold text-primary">{{ stats.planned }}</p><p class="mt-1 text-caption text-muted">в плане</p></div>
          <div><p class="text-stat font-bold text-warning">{{ stats.ideas }}</p><p class="mt-1 text-caption text-muted">идей</p></div>
        </div>
        <div class="space-y-3">
          <p class="text-meta font-semibold text-muted">Баланс рубрик</p>
          <div v-for="r in rubrics" :key="r.r" class="flex items-center gap-3">
            <RubricTile :rubric="r.r" size="sm" />
            <div class="min-w-0 flex-1 space-y-1.5">
              <div class="flex justify-between text-meta"><span class="truncate font-medium">{{ r.r }}</span><span class="font-semibold text-muted">{{ r.n }}</span></div>
              <UProgress :model-value="r.pct" size="xs" />
            </div>
          </div>
        </div>
      </SectionCard>
    </template>
  </div>
</template>
