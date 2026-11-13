<script setup lang="ts">
/**
 * The main list row of the app: tile + title / subtitle / meta + action slot.
 * Pass `rubric` for a content tile, or `icon` / `text` + `tone` for a generic one.
 */
withDefaults(defineProps<{
  title: string
  subtitle?: string
  meta?: string
  metaClass?: string
  icon?: string
  text?: string
  tone?: string
  rubric?: string
  kind?: string
  spin?: boolean
  tile?: 'sm' | 'md' | 'lg'
  lines?: 1 | 2 | 0 // title lines: 1 = truncate, 2 = clamp, 0 = wrap freely
}>(), { tile: 'sm', lines: 1 })
</script>

<template>
  <div class="flex items-center" :class="tile === 'lg' ? 'gap-4' : 'gap-3.5'">
    <RubricTile v-if="rubric || kind" :rubric="rubric" :kind="kind" :size="tile" />
    <IconTile v-else :icon="icon" :text="text" :tone="tone" :spin="spin" :size="tile" />
    <div class="min-w-0 flex-1">
      <p class="text-heading font-semibold" :class="{ 1: 'truncate', 2: 'line-clamp-2', 0: '' }[lines]">{{ title }}</p>
      <p v-if="subtitle" class="mt-0.5 text-meta text-muted" :class="lines === 0 ? '' : 'truncate'">{{ subtitle }}</p>
      <p v-if="meta" class="mt-0.5 truncate text-meta font-medium" :class="metaClass ?? 'text-muted'">{{ meta }}</p>
      <slot name="below" />
    </div>
    <slot />
  </div>
</template>
