<script setup lang="ts">
const posts = useCompanyPosts()
const filter = ref('all')

const items = [
  { label: 'Все', value: 'all' },
  { label: 'Готовятся', value: 'generating' },
  { label: 'На решении', value: 'pending' },
  { label: 'Одобрены', value: 'scheduled' },
  { label: 'Вышли', value: 'published' },
  { label: 'Ошибки', value: 'problem' },
  { label: 'Отклонены', value: 'rejected' }
]

const is = (v: string, s: string) => v === 'all' || v === s || (v === 'problem' && (s === 'failed' || s === 'uncertain'))
const list = computed(() => posts.value.filter(p => is(filter.value, p.status)))
const count = (v: string) => posts.value.filter(p => is(v, p.status)).length

const groups = computed(() => {
  if (filter.value !== 'all') return [{ title: items.find(i => i.value === filter.value)!.label, icon: 'i-lucide-list', posts: list.value }]
  const g = [
    { title: 'Посты', icon: 'i-lucide-newspaper', posts: list.value.filter(p => p.kind === 'post') },
    { title: 'Сценарии видео', icon: 'i-lucide-clapperboard', posts: list.value.filter(p => p.kind === 'video') }
  ]
  return g.filter(x => x.posts.length)
})
</script>

<template>
  <div class="space-y-3">
    <div class="scroll-row">
      <UButton
        v-for="i in items.filter(x => count(x.value))" :key="i.value"
        :variant="filter === i.value ? 'solid' : 'outline'" class="shrink-0"
        @click="filter = i.value"
      >
        {{ i.label }} <span class="opacity-60">{{ count(i.value) }}</span>
      </UButton>
    </div>

    <SectionCard v-for="g in groups" :key="g.title" :title="g.title" :icon="g.icon" :count="g.posts.length">
      <PostCard v-for="p in g.posts" :key="p.id" :post="p" />
    </SectionCard>

    <UCard v-if="!list.length" :ui="{ body: 'py-12 text-center text-meta text-muted' }">Здесь пока ничего нет</UCard>
  </div>
</template>
