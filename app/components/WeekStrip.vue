<script setup lang="ts">
/** Week row: one dot per planned post, coloured by status. */
interface Day { w: string; n: number; statuses: string[]; today?: boolean; key?: string | number }
defineProps<{ days: Day[]; selected?: string | number }>()
defineEmits<{ select: [d: Day] }>()

const dot: Record<string, string> = {
  published: 'bg-success', drafted: 'bg-primary', accepted: 'bg-primary', idea: 'bg-warning', skipped: 'bg-accented'
}
</script>

<template>
  <UCard :ui="{ body: 'p-3 sm:p-3 pb-3.5' }" class="select-none">
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="d in days" :key="d.n"
        class="flex flex-col items-center gap-1 rounded-tile-sm py-2.5 transition"
        :class="(selected !== undefined ? selected === (d.key ?? d.n) : d.today) && 'bg-muted'"
        @click="$emit('select', d)"
      >
        <span class="text-meta text-muted">{{ d.w }}</span>
        <span class="text-lg font-semibold leading-none" :class="d.today && 'text-primary'">{{ d.n }}</span>
        <span class="mt-1.5 flex h-2 items-center gap-[3px]">
          <span v-for="(s, i) in d.statuses.slice(0, 3)" :key="i" class="size-2 rounded-full" :class="dot[s]" />
          <span v-if="!d.statuses.length" class="h-0.5 w-2.5 rounded-full bg-accented" />
        </span>
      </button>
    </div>
    <StatusLegend class="mt-2" />
  </UCard>
</template>
