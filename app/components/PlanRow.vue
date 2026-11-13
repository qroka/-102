<script setup lang="ts">
import type { PlanItem } from '~/composables/useMock'

const props = defineProps<{ item: PlanItem }>()
const plan = usePlan()

const line = computed(() => ({
  idea: { t: `Идея · ${props.item.time}`, c: 'text-warning' },
  accepted: { t: `Принята · ${props.item.time}`, c: 'text-primary' },
  drafted: { t: `Черновик готов · ${props.item.time}`, c: 'text-success' },
  published: { t: `Вышел · ${props.item.time}`, c: 'text-success' },
  skipped: { t: 'Пропущена', c: 'text-muted' }
}[props.item.status]))

function set(s: 'accepted' | 'skipped') {
  const i = plan.value.find(x => x.id === props.item.id)
  if (i) i.status = s
}
</script>

<template>
  <InfoRow
    :rubric="item.rubric" tile="lg" :lines="2" :class="item.status === 'skipped' && 'opacity-45'"
    :title="item.title" :subtitle="item.reason" :meta="line.t" :meta-class="line.c"
  >
    <div v-if="item.status === 'idea'" class="flex flex-col items-end gap-0.5">
      <UButton label="Принять" color="primary" variant="outline" @click="set('accepted')" />
      <UButton label="Пропустить" variant="ghost" size="sm" class="h-7 px-2 text-caption" @click="set('skipped')" />
    </div>
    <UIcon
      v-else-if="item.status !== 'skipped'"
      :name="item.status === 'published' ? 'i-lucide-send' : 'i-lucide-check'" class="mx-2 size-5"
      :class="item.status === 'accepted' ? 'text-primary' : 'text-success'"
    />
  </InfoRow>
</template>
