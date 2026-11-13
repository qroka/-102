<script setup lang="ts">
import { competitors, rivalUrl, type RivalFormat } from '~/composables/useMock'

const route = useRoute()
const router = useRouter()
const companyId = useCompanyId()
const plan = usePlan()
const toast = useToast()

const rival = computed(() => (competitors[companyId.value] ?? []).find(r => r.slug === route.params.slug))

const formatMeta: Record<RivalFormat, { icon: string; tone: string }> = {
  'Гайд': { icon: 'i-lucide-list-checks', tone: 'emerald' },
  'Видео': { icon: 'i-lucide-clapperboard', tone: 'rose' },
  'Акция': { icon: 'i-lucide-percent', tone: 'amber' },
  'Новость': { icon: 'i-lucide-newspaper', tone: 'sky' },
  'Кейс': { icon: 'i-lucide-briefcase', tone: 'indigo' }
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toLocaleString('ru', { maximumFractionDigits: 1 })} тыс` : String(n)
const erText = (n: number) => `${n.toLocaleString('ru')}%`
const erClass = (n: number) => n >= 5 ? 'text-success' : n >= 3 ? 'text-primary' : 'text-muted'

// average ER by format, best first
const formats = computed(() => {
  const m = new Map<RivalFormat, number[]>()
  for (const p of rival.value?.posts ?? []) m.set(p.format, [...(m.get(p.format) ?? []), p.er])
  return [...m.entries()]
    .map(([f, ers]) => ({ f, n: ers.length, er: +(ers.reduce((a, b) => a + b, 0) / ers.length).toFixed(1) }))
    .sort((a, b) => b.er - a.er)
})
const maxEr = computed(() => Math.max(...formats.value.map(f => f.er), 1))
const avgEr = computed(() => {
  const p = rival.value?.posts ?? []
  return p.length ? +(p.reduce((s, x) => s + x.er, 0) / p.length).toFixed(1) : 0
})
const bestId = computed(() => [...(rival.value?.posts ?? [])].sort((a, b) => b.er - a.er)[0]?.id)

const open = ref<number | null>(null)
const added = ref<number[]>([])
function toPlan(id: number, title: string) {
  plan.value.push({
    id: Date.now(), companyId: companyId.value, date: '24.11', weekday: 'Вт', time: '12:00', rubric: 'По рынку',
    status: 'idea', origin: 'schedule', title: `Наша версия: ${title}`, reason: `Формат «${rival.value!.name}» с ER выше среднего`
  })
  added.value.push(id)
  toast.add({ title: 'Идея добавлена в план', description: 'Вторник, 24 ноября', icon: 'i-lucide-calendar-plus', color: 'primary' })
}

function back() {
  if (window.history.length > 1) router.back()
  else navigateTo('/results')
}
</script>

<template>
  <div v-if="rival" class="space-y-3">
    <div class="flex items-center justify-between px-1">
      <UButton icon="i-lucide-arrow-left" variant="outline" square size="lg" aria-label="Назад" @click="back" />
      <UButton :to="`https://t.me/${rival.slug}`" target="_blank" label="Канал" icon="i-lucide-send" variant="outline" />
    </div>

    <!-- Summary -->
    <UCard :ui="{ body: 'space-y-5' }">
      <div class="flex items-center gap-4">
        <IconTile :text="rival.name[0]" tone="sky" size="md" />
        <div class="min-w-0">
          <p class="text-stat font-bold leading-tight tracking-tight">{{ rival.name }}</p>
          <p class="text-body text-muted">{{ rival.handle }}</p>
        </div>
      </div>
      <div class="grid grid-cols-3">
        <div><p class="text-stat font-bold leading-none">{{ rival.perWeek }}</p><p class="mt-1 text-caption text-muted">постов в неделю</p></div>
        <div><p class="text-stat font-bold leading-none">{{ erText(avgEr) }}</p><p class="mt-1 text-caption text-muted">средний ER</p></div>
        <div><p class="text-stat font-bold leading-none">{{ formats[0]?.f }}</p><p class="mt-1 text-caption text-muted">лучший формат</p></div>
      </div>
    </UCard>

    <!-- What works -->
    <SectionCard title="Что заходит" icon="i-lucide-chart-bar-big">
      <div v-for="f in formats" :key="f.f" class="flex items-center gap-3.5">
        <IconTile :icon="formatMeta[f.f].icon" :tone="formatMeta[f.f].tone" />
        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="flex items-baseline justify-between">
            <p class="text-heading font-semibold">{{ f.f }} <span class="text-meta font-normal text-muted">· {{ f.n }} {{ f.n === 1 ? 'пост' : 'поста' }}</span></p>
            <p class="text-body font-bold" :class="erClass(f.er)">{{ erText(f.er) }}</p>
          </div>
          <UProgress :model-value="(f.er / maxEr) * 100" :color="f.er >= 5 ? 'success' : 'primary'" />
        </div>
      </div>
      <InfoRow icon="i-lucide-lightbulb" tone="amber" :title="rival.insight" subtitle="Вывод AI" :lines="0" />
    </SectionCard>

    <!-- Posts -->
    <SectionCard title="Последние посты" icon="i-lucide-newspaper" :count="rival.posts.length">
      <div v-for="p in rival.posts" :key="p.id" class="space-y-3">
        <button class="flex w-full items-center gap-3.5 text-left" @click="open = open === p.id ? null : p.id">
          <IconTile :icon="formatMeta[p.format].icon" :tone="formatMeta[p.format].tone" />
          <div class="min-w-0 flex-1">
            <p class="line-clamp-2 text-heading font-semibold leading-snug">{{ p.title }}</p>
            <p class="mt-0.5 truncate text-meta text-muted">{{ p.format }} · {{ p.date }} · {{ fmt(p.views) }} просмотров</p>
            <p class="mt-0.5 text-meta font-medium" :class="erClass(p.er)">
              ER {{ erText(p.er) }}<span v-if="p.id === bestId"> · лучший пост</span>
            </p>
          </div>
          <UIcon name="i-lucide-chevron-down" class="size-5 shrink-0 text-muted transition" :class="open === p.id && 'rotate-180'" />
        </button>
        <div v-if="open === p.id" class="ml-[62px] space-y-2.5">
          <p class="rounded-tile-sm bg-muted px-3.5 py-2.5 text-body leading-relaxed text-toned">{{ p.text }}</p>
          <p class="text-caption text-muted">{{ fmt(p.reactions) }} реакций · {{ fmt(p.views) }} просмотров</p>
          <div class="flex gap-2">
            <UButton :to="rivalUrl(rival, p)" target="_blank" label="Оригинал" icon="i-lucide-external-link" size="sm" class="flex-1" />
            <UButton v-if="!added.includes(p.id)" label="Идею в план" variant="solid" size="sm" class="flex-[1.3]" @click="toPlan(p.id, p.title)" />
            <UButton v-else label="В плане" icon="i-lucide-check" color="success" variant="soft" size="sm" class="flex-[1.3]" disabled />
          </div>
        </div>
      </div>
    </SectionCard>

    <p class="px-4 pb-2 text-center text-caption text-muted">Данные из открытого канала · обновлено сегодня, 09:00</p>
  </div>

  <UCard v-else class="mt-6" :ui="{ body: 'px-6 py-14 text-center' }">
    <IconTile icon="i-lucide-telescope" tone="slate" size="md" class="mx-auto" />
    <p class="mt-4 text-heading font-semibold">Конкурент не найден</p>
    <p class="text-meta text-muted">Возможно, он относится к другой компании</p>
    <UButton to="/results" label="К итогам" variant="solid" class="mt-5" />
  </UCard>
</template>
