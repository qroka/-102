<script setup lang="ts">
/**
 * UCard with the app's section header (icon + title + count / right slot).
 * `tone` tints the whole card for alerts (failed / uncertain publication etc.).
 */
const props = defineProps<{ title: string; icon?: string; count?: number | string; tone?: 'error' | 'warning' | 'success' }>()

const tones = {
  error: { root: 'bg-rose-50 ring-1 ring-inset ring-rose-200', icon: 'text-error' },
  warning: { root: 'bg-amber-50 ring-1 ring-inset ring-amber-200', icon: 'text-warning' },
  success: { root: 'bg-emerald-50 ring-1 ring-inset ring-emerald-200', icon: 'text-success' }
}
const t = computed(() => props.tone ? tones[props.tone] : undefined)
</script>

<template>
  <UCard :ui="{ root: t?.root }">
    <template #header>
      <div class="flex items-center gap-2.5">
        <UIcon v-if="icon" :name="icon" class="size-5" :class="t?.icon" />
        <h2 class="flex-1 text-title font-semibold tracking-tight">{{ title }}</h2>
        <span v-if="count !== undefined" class="text-meta font-semibold text-muted">{{ count }}</span>
        <slot name="right" />
      </div>
    </template>
    <div class="space-y-5">
      <slot />
    </div>
  </UCard>
</template>
