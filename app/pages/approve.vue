<script setup lang="ts">
import { TODAY } from '~/composables/useMock'

const list = useCompanyPosts()
const queue = computed(() => list.value.filter(p => p.status === 'pending' || p.status === 'generating'))
const attention = computed(() => list.value.filter(p => p.status === 'failed' || p.status === 'uncertain'))
const soon = computed(() => list.value.filter(p => p.status === 'scheduled'))
const recent = computed(() => list.value.filter(p => p.status === 'published').slice(0, 2))

// current week (9–15 Nov): one dot per planned post, coloured by status
const plan = usePlan()
const companyId = useCompanyId()
const week = computed(() => ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((w, k) => {
  const n = 9 + k
  const statuses = plan.value.filter(i => i.companyId === companyId.value && i.date === `${n}.11` && i.status !== 'skipped').map(i => i.status)
  return { w, n, statuses, today: n === TODAY }
}))
</script>

<template>
  <div class="space-y-3">
    <WeekStrip :days="week" @select="navigateTo('/plan')" />

    <SectionCard v-if="attention.length" title="Требуют внимания" icon="i-lucide-triangle-alert" :count="attention.length">
      <PostCard v-for="p in attention" :key="p.id" :post="p" />
    </SectionCard>

    <SectionCard title="Ждут решения" icon="i-lucide-hourglass" :count="queue.length || undefined">
      <TransitionGroup name="page" tag="div" class="space-y-5">
        <PostCard v-for="p in queue" :key="p.id" :post="p" />
      </TransitionGroup>
      <InfoRow v-if="!queue.length" icon="i-lucide-party-popper" tone="emerald" tile="lg" title="Всё согласовано" subtitle="Новые посты появятся здесь">
        <UButton to="/bot" label="Задача" />
      </InfoRow>
    </SectionCard>

    <SectionCard v-if="soon.length" title="Скоро выйдут" icon="i-lucide-calendar-clock" :count="soon.length">
      <PostCard v-for="p in soon" :key="p.id" :post="p" />
    </SectionCard>

    <SectionCard v-if="recent.length" title="Недавно вышли" icon="i-lucide-send">
      <PostCard v-for="p in recent" :key="p.id" :post="p" />
    </SectionCard>
  </div>
</template>
