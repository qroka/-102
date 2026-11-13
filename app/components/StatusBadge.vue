<script setup lang="ts">
/** Post status as UBadge (outline = white chip, see app.config). */
const props = defineProps<{ status: string }>()

type Color = 'primary' | 'success' | 'warning' | 'error' | 'neutral'
const map: Record<string, { label: string; color: Color; icon: string }> = {
  generating: { label: 'Готовится', color: 'primary', icon: 'i-lucide-loader-circle' },
  pending: { label: 'Ждёт решения', color: 'warning', icon: 'i-lucide-hourglass' },
  changes: { label: 'На доработке', color: 'warning', icon: 'i-lucide-pencil' },
  scheduled: { label: 'Одобрен', color: 'primary', icon: 'i-lucide-calendar-check' },
  published: { label: 'Опубликован', color: 'success', icon: 'i-lucide-circle-check' },
  rejected: { label: 'Отклонён', color: 'neutral', icon: 'i-lucide-ban' },
  failed: { label: 'Ошибка', color: 'error', icon: 'i-lucide-triangle-alert' },
  uncertain: { label: 'Исход неясен', color: 'warning', icon: 'i-lucide-circle-help' }
}
const s = computed(() => map[props.status] ?? map.pending!)
</script>

<template>
  <UBadge
    :label="s.label" :icon="s.icon" :color="s.color" variant="outline" size="lg"
    :ui="{ leadingIcon: status === 'generating' ? 'animate-spin' : '' }"
  />
</template>
