<script setup lang="ts">
import { curVersion } from '~/composables/useMock'

const route = useRoute()
const router = useRouter()
const actions = usePostActions()
const toast = useToast()
const companyId = useCompanyId()

// isolation: a post of another company is "not found"
const post = computed(() => {
  const p = actions.find(Number(route.params.id))
  return p && p.companyId === companyId.value ? p : undefined
})

const shown = ref(0) // 0 = latest version
const version = computed(() => {
  const p = post.value!
  return shown.value ? p.versions[p.versions.length - 1 - shown.value]! : curVersion(p)
})
watch(() => post.value?.versions.length, () => (shown.value = 0))
const versionTabs = computed(() => [...(post.value?.versions ?? [])].reverse().map((v, i) => ({ label: `v${v.n}`, value: String(i) })))

const editable = computed(() => ['pending', 'scheduled'].includes(post.value?.status ?? ''))
const generating = computed(() => post.value?.status === 'generating')
const problem = computed(() => post.value?.status === 'failed' || post.value?.status === 'uncertain')

const times = ['Сейчас', 'Сб, 14.11, 10:00', 'Пн, 16.11, 10:00', 'Пт, 20.11, 10:00']
const timeItems = computed(() => [times.map(t => ({
  label: t, icon: post.value?.publishAt === t ? 'i-lucide-check' : 'i-lucide-clock',
  onSelect: () => actions.reschedule(post.value!.id, t)
}))])

// "Не подтверждено источниками: «…»" -> title + subtitle
const warnings = computed(() => (post.value?.warnings ?? []).map((w) => {
  const [head, ...rest] = w.split(': ')
  return { title: rest.join(': ') || w, subtitle: rest.length ? head! : 'Замечание' }
}))

const initials = (n: string) => n.split(' ').map(x => x[0]).join('').slice(0, 2)
const decision = {
  pending: { t: 'Ждёт решения', c: 'text-amber-600', tone: 'slate' },
  approved: { t: 'Одобрил', c: 'text-success', tone: 'emerald' },
  rejected: { t: 'Отклонил', c: 'text-rose-500', tone: 'rose' }
}

const reviseOpen = ref(false)
const comment = ref('')
const chips = ['Сделай короче', 'Другая картинка', 'Добавь призыв к действию', 'Перенеси на пятницу']
function sendRevision() {
  if (!comment.value.trim()) return
  actions.requestChanges(post.value!.id, comment.value.trim())
  comment.value = ''
  reviseOpen.value = false
}

function back() {
  if (window.history.length > 1) router.back()
  else navigateTo('/approve')
}

async function copy() {
  try { await navigator.clipboard.writeText(post.value!.link!) } catch {}
  toast.add({ title: 'Ссылка скопирована', icon: 'i-lucide-copy', color: 'neutral' })
}
</script>

<template>
  <section v-if="post" class="space-y-3">
    <div class="flex items-center justify-between px-1">
      <UButton icon="i-lucide-arrow-left" variant="outline" square size="lg" aria-label="Назад" @click="back" />
      <StatusBadge :status="post.status" />
    </div>

    <PostCover :title="version.title" :label="post.kind === 'video' ? 'Видео · сценарий' : post.rubric" size="lg" class="!rounded-card" />

    <!-- Problem -->
    <SectionCard
      v-if="problem"
      :title="post.status === 'failed' ? 'Публикация не удалась' : 'Исход неясен'"
      :icon="post.status === 'failed' ? 'i-lucide-triangle-alert' : 'i-lucide-circle-help'"
      :tone="post.status === 'failed' ? 'error' : 'warning'"
    >
      <p class="text-body leading-relaxed text-toned">{{ post.error }}</p>
      <div class="flex gap-2">
        <UButton
          label="Повторить" icon="i-lucide-rotate-cw" class="flex-1"
          :variant="post.status === 'failed' ? 'solid' : 'outline'" @click="actions.retry(post.id)"
        />
        <UButton v-if="post.status === 'uncertain'" label="Пост вышел" variant="solid" class="flex-[1.4]" @click="actions.markPublished(post.id)" />
      </div>
    </SectionCard>

    <!-- Published -->
    <SectionCard v-if="post.status === 'published' && post.link" title="Опубликован" icon="i-lucide-circle-check">
      <div v-if="post.metrics" class="grid grid-cols-3 text-center">
        <div v-for="m in [{ l: 'просмотров', v: post.metrics.views }, { l: 'реакций', v: post.metrics.reactions }, { l: 'комментариев', v: post.metrics.comments }]" :key="m.l">
          <p class="text-stat font-bold leading-none">{{ m.v }}</p>
          <p class="mt-1 text-caption text-muted">{{ m.l }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton :to="post.link" target="_blank" label="Открыть в канале" variant="solid" class="flex-1" />
        <UButton icon="i-lucide-copy" square aria-label="Копировать ссылку" @click="copy" />
      </div>
    </SectionCard>

    <!-- Generating -->
    <SectionCard v-if="generating" title="Готовится" icon="i-lucide-sparkles">
      <InfoRow icon="i-lucide-loader-circle" spin tone="brand" title="AI пишет текст и подбирает факты" subtitle="Обычно 1–2 минуты" />
      <UProgress size="xs" />
    </SectionCard>

    <template v-else>
      <!-- Publication -->
      <SectionCard title="Публикация" icon="i-lucide-send">
        <InfoRow icon="i-lucide-send" tone="sky" :title="post.channel" subtitle="Telegram-канал" />
        <InfoRow icon="i-lucide-clock" tone="brand" :title="post.publishAt" subtitle="Время выхода · UTC+5">
          <UDropdownMenu v-if="editable" :items="timeItems" :content="{ align: 'end' }">
            <UButton label="Изменить" />
          </UDropdownMenu>
        </InfoRow>
      </SectionCard>

      <!-- Text -->
      <SectionCard :title="post.kind === 'video' ? 'Сценарий' : 'Текст'" icon="i-lucide-align-left">
        <template #right>
          <UTabs
            v-if="post.versions.length > 1" :model-value="String(shown)" :items="versionTabs" :content="false" size="sm"
            class="w-auto" :ui="{ list: 'bg-muted p-0.5', trigger: 'h-7 px-3' }"
            @update:model-value="v => (shown = Number(v))"
          />
        </template>
        <p v-if="version.note" class="!mt-0 text-meta font-medium text-primary">Правка: «{{ version.note }}»</p>
        <p class="whitespace-pre-line text-body">{{ version.body }}</p>
        <InfoRow
          v-for="(s, i) in post.kind === 'video' ? post.scenes ?? [] : []" :key="s.t"
          :text="String(i + 1)" tone="rose" :title="s.text" :subtitle="`${s.t} · ${s.shot}`" :lines="0"
        />
      </SectionCard>

      <!-- Check -->
      <SectionCard title="Проверка" icon="i-lucide-shield-check">
        <InfoRow v-for="w in warnings" :key="w.title" icon="i-lucide-triangle-alert" tone="amber" :title="w.title" :subtitle="w.subtitle" :lines="0" />
        <InfoRow v-if="!warnings.length" icon="i-lucide-check" tone="emerald" title="Замечаний нет" subtitle="Текст прошёл проверку" />
        <InfoRow v-for="f in post.facts" :key="f.claim" icon="i-lucide-book-open" tone="brand" :title="f.claim" :subtitle="f.source" :lines="0" />
      </SectionCard>

      <!-- Approvers -->
      <SectionCard title="Согласующие" icon="i-lucide-users">
        <template #right><span class="text-meta text-muted">нужен один</span></template>
        <InfoRow
          v-for="a in post.approvers" :key="a.name" :text="initials(a.name)" :tone="decision[a.decision].tone"
          :title="a.name" :meta="decision[a.decision].t" :meta-class="decision[a.decision].c"
        />
      </SectionCard>

      <p class="px-4 pb-2 text-center text-caption text-muted">
        {{ post.cost.tokens.toLocaleString('ru') }} токенов ≈ {{ post.cost.rub.toLocaleString('ru') }} ₽ ·
        {{ post.origin === 'schedule' ? 'по расписанию' : 'по запросу' }} · {{ post.createdAt }}
      </p>
    </template>

    <!-- Bottom actions -->
    <div v-if="editable" class="sticky -bottom-6 z-10 -mx-3 flex gap-2 rounded-t-card bg-elevated px-4 pb-6 pt-3 shadow-[0_-8px_24px_rgb(15_59_68/.06)]">
      <UButton v-if="post.status === 'pending'" label="Отклонить" color="error" variant="outline" size="lg" class="flex-1" @click="actions.reject(post.id); navigateTo('/approve')" />
      <UButton label="Правка" icon="i-lucide-wand-sparkles" size="lg" class="flex-1" @click="reviseOpen = true" />
      <UButton v-if="post.status === 'pending'" label="Одобрить" icon="i-lucide-check" variant="solid" size="lg" class="flex-[1.3]" @click="actions.approve(post.id)" />
    </div>

    <UDrawer v-model:open="reviseOpen" >
      <template #content>
        <div class="p-3 pb-6">
          <UCard :ui="{ body: 'space-y-4' }">
            <div>
              <p class="text-title font-semibold">Что поменять?</p>
              <p class="text-meta text-muted">AI подготовит новую версию, её нужно будет одобрить заново</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <UButton v-for="c in chips" :key="c" :label="c" size="sm" :variant="comment === c ? 'solid' : 'soft'" @click="comment = c" />
            </div>
            <UTextarea v-model="comment" placeholder="Или напишите своими словами" :rows="3" autoresize variant="soft" class="w-full" />
            <UButton label="Отправить на доработку" variant="solid" size="lg" block :disabled="!comment.trim()" @click="sendRevision" />
          </UCard>
        </div>
      </template>
    </UDrawer>
  </section>

  <UCard v-else class="mt-6" :ui="{ body: 'px-6 py-14 text-center' }">
    <IconTile icon="i-lucide-file-question" tone="slate" size="md" class="mx-auto" />
    <p class="mt-4 text-heading font-semibold">Пост не найден</p>
    <p class="text-meta text-muted">Возможно, он принадлежит другой компании</p>
    <UButton to="/approve" label="На главную" variant="solid" class="mt-5" />
  </UCard>
</template>
