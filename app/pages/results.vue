<script setup lang="ts">
import { weekChart, competitors } from '~/composables/useMock'

const kpis = useStats()
const usage = useUsage()
const companyId = useCompanyId()
const posts = useCompanyPosts()
const allComments = useComments()
const plan = usePlan()
const toast = useToast()

const tab = ref('stats')
const tabs = [
  { label: 'Показатели', value: 'stats' },
  { label: 'Комментарии', value: 'comments' },
  { label: 'Рынок', value: 'market' }
]

// ---- stats
const kpiTone: Record<string, string> = { prepared: 'brand', published: 'emerald', pending: 'amber', rejected: 'rose', subs: 'sky', approve: 'indigo' }
const max = Math.max(...weekChart.map(w => w.v), 1)
const limitPct = computed(() => Math.round((usage.value.today / usage.value.limit) * 100))
const published = computed(() => posts.value.filter(p => p.status === 'published' && p.metrics))
const views = computed(() => published.value.reduce((s, p) => s + p.metrics!.views, 0))
const reactions = computed(() => published.value.reduce((s, p) => s + p.metrics!.reactions, 0))
const metrics = computed(() => [
  { l: 'Просмотры', v: String(views.value), i: 'i-lucide-eye', tone: 'sky' },
  { l: 'Реакции', v: String(reactions.value), i: 'i-lucide-heart', tone: 'rose' },
  { l: 'Охват', v: '', i: 'i-lucide-radio', tone: 'slate' },
  { l: 'Рост подписчиков', v: '', i: 'i-lucide-user-plus', tone: 'slate' }
])

// ---- comments
const autoHide = ref(false)
const comments = computed(() => allComments.value.filter(c => c.companyId === companyId.value))
const fresh = computed(() => comments.value.filter(c => c.status === 'new'))
const done = computed(() => comments.value.filter(c => c.status !== 'new'))
const sentiTone = { pos: 'emerald', neu: 'sky', neg: 'rose' }
function reply(id: number) {
  const c = allComments.value.find(x => x.id === id); if (!c) return
  c.status = 'replied'
  toast.add({ title: 'Ответ отправлен', description: `Для ${c.author}`, icon: 'i-lucide-send', color: 'success' })
}
function hide(id: number) {
  const c = allComments.value.find(x => x.id === id); if (!c) return
  c.status = 'hidden'
  toast.add({ title: 'Комментарий скрыт', icon: 'i-lucide-eye-off', color: 'neutral' })
}

// ---- market
const rivals = computed(() => competitors[companyId.value] ?? [])
const rivalTones = ['sky', 'indigo', 'amber', 'cyan']
const added = ref<string[]>([])
function addIdea(topic: string) {
  plan.value.push({
    id: Date.now(), companyId: companyId.value, date: '21.11', weekday: 'Сб', time: '11:00', rubric: 'По рынку',
    status: 'idea', origin: 'schedule', title: topic, reason: 'Формат хорошо работает у конкурентов'
  })
  added.value.push(topic)
  toast.add({ title: 'Идея добавлена в план', icon: 'i-lucide-calendar-plus', color: 'primary' })
}
</script>

<template>
  <div class="space-y-3">
    <!-- Segmented tabs -->
    <UTabs v-model="tab" :items="tabs" :content="false" />

    <!-- ================= Stats ================= -->
    <template v-if="tab === 'stats'">
      <div class="grid grid-cols-2 gap-3">
        <UCard v-for="k in kpis" :key="k.key" :ui="{ body: 'space-y-4' }">
          <IconTile :icon="k.icon" :tone="kpiTone[k.key]" />
          <div>
            <p class="text-display font-bold leading-none tracking-tight">{{ k.value }}</p>
            <p class="mt-1.5 text-meta text-muted">
              {{ k.label }}
              <span v-if="k.delta" class="font-semibold text-success"> {{ k.delta }}</span>
            </p>
          </div>
        </UCard>
      </div>

      <SectionCard title="Расход AI" icon="i-lucide-coins">
        <div class="space-y-2">
          <p class="text-body"><span class="text-stat font-bold">{{ usage.today.toLocaleString('ru') }} ₽</span> <span class="text-muted">из {{ usage.limit }} ₽ сегодня</span></p>
          <UProgress :model-value="limitPct" :color="limitPct > 80 ? 'error' : 'primary'" />
        </div>
        <div class="grid grid-cols-3">
          <div><p class="text-heading font-bold">{{ usage.per.toLocaleString('ru') }} ₽</p><p class="text-caption text-muted">за пост</p></div>
          <div><p class="text-heading font-bold">{{ usage.rub.toLocaleString('ru') }} ₽</p><p class="text-caption text-muted">за 7 дней</p></div>
          <div><p class="text-heading font-bold">≈{{ usage.month }} ₽</p><p class="text-caption text-muted">в месяц</p></div>
        </div>
      </SectionCard>

      <SectionCard title="Канал" icon="i-lucide-radio">
        <InfoRow v-for="m in metrics" :key="m.l" :icon="m.i" :tone="m.tone" :title="m.l" :subtitle="m.v ? 'за 7 дней' : 'Telegram не отдаёт эти данные'">
          <span v-if="m.v" class="text-title font-bold">{{ m.v }}</span>
          <span v-else class="text-body text-dimmed">—</span>
        </InfoRow>
      </SectionCard>

      <SectionCard title="Подготовлено по дням" icon="i-lucide-chart-column">
        <div class="flex h-32 items-end justify-between gap-3 px-1">
          <div v-for="(w, i) in weekChart" :key="w.d" class="flex flex-1 flex-col items-center justify-end gap-2">
            <span v-if="w.v" class="text-caption font-semibold text-muted">{{ w.v }}</span>
            <div
              class="w-full max-w-7 rounded-full"
              :class="i === weekChart.length - 1 ? 'bg-brand-900' : w.v ? 'bg-brand-200' : 'bg-accented'"
              :style="{ height: w.v ? `${Math.round((w.v / max) * 76)}px` : '8px' }"
            />
            <span class="text-caption text-muted">{{ w.d }}</span>
          </div>
        </div>
      </SectionCard>
    </template>

    <!-- ================= Comments ================= -->
    <template v-else-if="tab === 'comments'">
      <SectionCard title="Модерация" icon="i-lucide-shield">
        <InfoRow icon="i-lucide-eye-off" tone="rose" title="Скрывать негатив" subtitle="Автоматически, по разрешению">
          <USwitch v-model="autoHide" aria-label="Скрывать негатив" />
        </InfoRow>
      </SectionCard>

      <SectionCard title="Новые" icon="i-lucide-message-circle" :count="fresh.length || undefined">
        <div v-for="c in fresh" :key="c.id" class="space-y-3">
          <InfoRow :text="c.author[0]" :tone="sentiTone[c.sentiment]" :title="c.author" :subtitle="c.text" :lines="0" />
          <div class="ml-[62px] space-y-2.5">
            <p v-if="c.draft" class="rounded-tile-sm bg-muted px-3.5 py-2.5 text-meta leading-relaxed text-toned">
              <span class="font-semibold text-primary">Ответ AI: </span>{{ c.draft }}
            </p>
            <div class="flex gap-2">
              <UButton label="Скрыть" size="sm" class="flex-1" @click="hide(c.id)" />
              <UButton v-if="c.draft" label="Ответить" variant="solid" size="sm" class="flex-[1.4]" @click="reply(c.id)" />
            </div>
          </div>
        </div>
        <InfoRow v-if="!fresh.length" icon="i-lucide-check" tone="emerald" title="Всё разобрано" subtitle="Новых комментариев нет" />
      </SectionCard>

      <SectionCard v-if="done.length" title="Разобрано" icon="i-lucide-check-check" :count="done.length">
        <InfoRow
          v-for="c in done" :key="c.id" :text="c.author[0]" :tone="c.status === 'hidden' ? 'slate' : sentiTone[c.sentiment]"
          :title="c.author" :subtitle="c.text"
          :meta="c.status === 'replied' ? 'Ответ отправлен' : 'Скрыт'"
          :meta-class="c.status === 'replied' ? 'text-success' : 'text-muted'"
          :class="c.status === 'hidden' && 'opacity-60'"
        />
      </SectionCard>
    </template>

    <!-- ================= Market ================= -->
    <template v-else>
      <SectionCard title="Конкуренты" icon="i-lucide-telescope" :count="rivals.length">
        <NuxtLink v-for="(r, i) in rivals" :key="r.handle" :to="`/rival/${r.slug}`" class="block">
          <InfoRow
            :text="r.name[0]" :tone="rivalTones[i % rivalTones.length]"
            :title="r.name" :subtitle="`Лучший: ${r.top}`" :meta="`ER ${r.er} · ${r.perWeek} постов в неделю`" meta-class="text-primary"
          >
            <UButton label="Посты" tabindex="-1" />
          </InfoRow>
        </NuxtLink>
        <p v-if="!rivals.length" class="text-body text-muted">Конкуренты не добавлены</p>
      </SectionCard>

      <SectionCard v-if="rivals.length" title="Что это значит" icon="i-lucide-lightbulb">
        <InfoRow v-for="r in rivals" :key="r.handle" icon="i-lucide-lightbulb" tone="amber" :title="r.insight" :subtitle="r.name" :lines="0" />
      </SectionCard>
    </template>
  </div>
</template>
