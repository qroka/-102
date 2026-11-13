<script setup lang="ts">
/** Pastel square tile with an icon or 1–2 letters. The only purely decorative component. */
withDefaults(defineProps<{ icon?: string; text?: string; tone?: string; size?: 'sm' | 'md' | 'lg'; spin?: boolean }>(), { size: 'sm', tone: 'brand' })

const tones: Record<string, string> = {
  brand: 'from-brand-100 to-brand-200 text-brand-600',
  sky: 'from-sky-100 to-sky-200 text-sky-600',
  cyan: 'from-cyan-100 to-cyan-200 text-cyan-600',
  emerald: 'from-emerald-100 to-emerald-200 text-emerald-600',
  amber: 'from-amber-100 to-amber-200 text-amber-600',
  orange: 'from-amber-100 to-orange-200 text-orange-500',
  rose: 'from-rose-100 to-pink-200 text-rose-500',
  indigo: 'from-indigo-100 to-indigo-200 text-indigo-500',
  slate: 'from-slate-100 to-slate-200 text-slate-500'
}
const sizes = {
  sm: { box: 'size-12 rounded-tile-sm', icon: 'size-6' },
  md: { box: 'size-15 rounded-tile', icon: 'size-7' },
  lg: { box: 'size-18 rounded-tile', icon: 'size-9' }
}
</script>

<template>
  <div
    class="relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br shadow-[inset_0_1px_0_rgb(255_255_255/.8)]"
    :class="[tones[tone] ?? tones.brand, sizes[size].box]"
  >
    <span class="absolute -right-3 -top-3 size-10 rounded-full bg-white/40" />
    <UIcon v-if="icon" :name="icon" class="relative drop-shadow-[0_3px_4px_rgb(15_59_68/.18)]" :class="[sizes[size].icon, spin && 'animate-spin']" />
    <span v-else class="relative text-heading font-bold">{{ text }}</span>
  </div>
</template>
