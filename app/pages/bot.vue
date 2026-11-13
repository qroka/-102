<script setup lang="ts">
import { curVersion } from '~/composables/useMock'

const route = useRoute()
const chat = useChat()
const companyId = useCompanyId()
const company = useCompany()
const posts = useCompanyPosts()
const actions = usePostActions()

const msgs = computed(() => chat.value[companyId.value] ?? [])
const text = ref(typeof route.query.draft === 'string' ? route.query.draft : '')
const end = ref<HTMLElement>()
let id = 1000

const quick = ['Пост про энергосберегающее стекло', 'Идеи на неделю', 'Сценарий короткого видео про производство', 'Статус']

function push(m: Omit<(typeof msgs.value)[number], 'id'>) {
  chat.value[companyId.value]!.push({ id: id++, ...m })
  nextTick(() => end.value?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
}

function labelOf(s: string) {
  return ({ generating: 'готовится', pending: 'на согласовании', scheduled: 'одобрен', published: 'опубликован', rejected: 'отклонён', failed: 'ошибка', uncertain: 'исход неясен', changes: 'на доработке' } as Record<string, string>)[s] ?? s
}

function send(raw?: string) {
  const t = (raw ?? text.value).trim()
  if (!t) return
  text.value = ''
  push({ from: 'user', text: t })

  if (/^статус/i.test(t)) {
    setTimeout(() => push({ from: 'bot', text: 'Последние посты:\n' + posts.value.slice(0, 5).map(p => `• ${curVersion(p).title} — ${labelOf(p.status)}`).join('\n') }), 500)
    return
  }
  if (/идеи|план/i.test(t)) {
    setTimeout(() => push({ from: 'bot', text: 'Предложил темы на неделю — смотрите во вкладке «План». Их можно принять целиком или по одной.' }), 700)
    return
  }
  setTimeout(() => push({ from: 'bot', text: 'Принял, готовлю. Обычно это занимает 1–2 минуты.' }), 450)
  const pid = actions.create(companyId.value, t, 'chat', /видео|ролик/i.test(t) ? 'video' : 'post')
  setTimeout(() => push({ from: 'bot', text: 'Материал готов и ждёт вашего решения.', postId: pid }), 3800)
}

onMounted(() => end.value?.scrollIntoView({ block: 'end' }))
watch(companyId, () => nextTick(() => end.value?.scrollIntoView({ block: 'end' })))
</script>

<template>
  <section class="-mb-6 flex min-h-full flex-col">
    <div class="flex-1 pb-3">
      <UChatMessage
        v-for="m in msgs" :id="String(m.id)" :key="m.id"
        :role="m.from === 'user' ? 'user' : 'assistant'"
        :parts="[{ type: 'text', text: m.text }]"
        :side="m.from === 'user' ? 'right' : 'left'"
        :variant="m.from === 'user' ? 'solid' : 'soft'"
        color="neutral"
      >
        <template #content>
          <p class="whitespace-pre-line">{{ m.text }}</p>
          <UButton
            v-if="m.postId" :to="`/post/${m.postId}`" label="Открыть карточку" trailing-icon="i-lucide-arrow-right"
            color="primary" variant="outline" block class="mt-2 justify-between"
          />
        </template>
      </UChatMessage>
      <div ref="end" />
    </div>

    <div class="sticky bottom-0 -mx-3 space-y-2.5 bg-default/95 px-3 py-3 backdrop-blur">
      <div class="scroll-row">
        <UButton v-for="q in quick" :key="q" :label="q" variant="outline" size="sm" class="shrink-0" @click="send(q)" />
      </div>
      <UChatPrompt v-model="text" :placeholder="`Задача для ${company.name}…`" variant="soft" :rows="1" @submit="send()">
        <template #footer>
          <span />
          <UChatPromptSubmit variant="solid" color="neutral" :disabled="!text.trim()" />
        </template>
      </UChatPrompt>
    </div>
  </section>
</template>
