<script setup lang="ts">
/** IconTile with icon and colour picked by content rubric. */
const props = withDefaults(defineProps<{ rubric?: string; kind?: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'lg' })

const map: Record<string, [string, string]> = {
  'Новости отрасли': ['i-lucide-newspaper', 'sky'],
  'Полезное': ['i-lucide-lightbulb', 'emerald'],
  'О компании': ['i-lucide-factory', 'brand'],
  'О нас': ['i-lucide-store', 'brand'],
  'Продукт в деталях': ['i-lucide-gem', 'cyan'],
  'Технологии': ['i-lucide-flame', 'orange'],
  'Жизнь компании': ['i-lucide-users', 'indigo'],
  'Видео': ['i-lucide-clapperboard', 'rose'],
  'Новинки': ['i-lucide-coffee', 'amber'],
  'Закулисье': ['i-lucide-flame', 'orange'],
  'По рынку': ['i-lucide-telescope', 'slate'],
  'По запросу': ['i-lucide-sparkles', 'brand']
}
const t = computed(() => props.kind === 'video' || props.rubric === 'Видео' ? map['Видео']! : (map[props.rubric ?? ''] ?? map['По запросу']!))
</script>

<template>
  <IconTile :icon="t[0]" :tone="t[1]" :size="size" />
</template>
