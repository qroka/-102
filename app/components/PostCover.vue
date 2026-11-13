<script setup lang="ts">
defineProps<{ title: string; label?: string; size?: 'sm' | 'lg' }>()
</script>

<template>
  <div
    class="relative isolate overflow-hidden bg-gradient-to-br from-[#2a8796] via-[#1b5662] to-[#0e2f37] text-white"
    :class="size === 'lg' ? 'aspect-[16/9] rounded-xl p-4' : 'aspect-square rounded-lg p-2'"
  >
    <span class="absolute -z-10 rounded-full border border-white/15" :class="size === 'lg' ? 'size-56 -right-16 -top-20' : 'size-24 -right-8 -top-8'" />
    <span class="absolute -z-10 rounded-full bg-white/10" :class="size === 'lg' ? 'size-24 right-10 top-6' : 'size-10 right-1 top-3'" />
    <span class="absolute -z-10 rounded-full bg-[#7fd6e2]/20 blur-xl" :class="size === 'lg' ? 'size-40 -bottom-16 -left-10' : 'size-16 -bottom-8 -left-4'" />
    <div class="flex h-full flex-col justify-between">
      <span v-if="size === 'lg'" class="w-fit rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">{{ label || 'Салаватстекло' }}</span>
      <BrandMark v-else class="size-4 opacity-90" />
      <p class="font-extrabold leading-tight" :class="size === 'lg' ? 'max-w-[85%] text-[22px]' : 'line-clamp-3 text-[9px]'">{{ title }}</p>
    </div>
  </div>
</template>
