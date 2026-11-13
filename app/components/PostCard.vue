<script setup lang="ts">
import { curVersion, type Post } from '~/composables/useMock'

const props = defineProps<{ post: Post }>()
const actions = usePostActions()
const v = computed(() => curVersion(props.post))
const to = computed(() => `/post/${props.post.id}`)

const subtitle = computed(() => props.post.status === 'generating'
  ? 'AI собирает факты из материалов'
  : (v.value.body || props.post.rubric))

const line = computed(() => {
  const p = props.post
  switch (p.status) {
    case 'pending': return { text: `Ждёт решения${p.versions.length > 1 ? ` · v${v.value.n}` : ''}${p.warnings.length ? ' · есть замечания' : ''}`, cls: 'text-warning' }
    case 'generating': return { text: 'Готовится… 1–2 мин', cls: 'text-primary' }
    case 'scheduled': return { text: `Выйдет: ${p.publishAt}`, cls: 'text-primary' }
    case 'published': return { text: `Опубликован · ${p.metrics?.views ?? 0} просмотров`, cls: 'text-success' }
    case 'failed': return { text: 'Ошибка публикации', cls: 'text-error' }
    case 'uncertain': return { text: 'Исход публикации неясен', cls: 'text-warning' }
    case 'rejected': return { text: 'Отклонён', cls: 'text-muted' }
    default: return { text: p.publishAt, cls: 'text-muted' }
  }
})

const button = computed(() => ({
  generating: { label: undefined, loading: true, color: 'neutral', variant: 'soft' },
  pending: { label: 'Решить', color: 'primary', variant: 'outline' },
  failed: { label: 'Повтор', color: 'error', variant: 'outline' },
  uncertain: { label: 'Сверить', color: 'error', variant: 'outline' }
} as Record<string, { label?: string; loading?: boolean; color: 'neutral' | 'primary' | 'error'; variant: 'soft' | 'outline' }>)[props.post.status]
  ?? { label: 'Открыть', color: 'neutral', variant: 'soft' })

function onButton(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  if (props.post.status === 'failed') return actions.retry(props.post.id)
  navigateTo(to.value)
}
</script>

<template>
  <NuxtLink :to="to" class="block">
    <InfoRow
      :rubric="post.rubric" :kind="post.kind" tile="lg" :lines="2"
      :title="v.title" :subtitle="subtitle" :meta="line.text" :meta-class="line.cls"
    >
      <UButton
        :label="button.label" :loading="button.loading" :color="button.color" :variant="button.variant"
        :class="button.loading && 'w-22'" @click="onButton"
      />
    </InfoRow>
  </NuxtLink>
</template>
