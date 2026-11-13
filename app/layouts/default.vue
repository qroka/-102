<script setup lang="ts">
import { companies } from '~/composables/useMock'

const pending = usePendingCount()
const route = useRoute()
const companyId = useCompanyId()
const company = useCompany()
const toast = useToast()

const heads: Record<string, [string, string]> = {
  '/approve': ['Сегодня,', '13 ноября'],
  '/materials': ['Материалы', ''],
  '/bot': ['Задача', 'боту'],
  '/plan': ['План,', 'ноябрь'],
  '/results': ['Итоги,', '7 дней']
}
const head = computed(() => heads[route.path] ?? ['', ''])
const inPost = computed(() => route.path.startsWith('/post') || route.path.startsWith('/rival'))

const nav = [
  { to: '/approve', icon: 'i-lucide-house', label: 'Главная' },
  { to: '/materials', icon: 'i-lucide-newspaper', label: 'Материалы' },
  { to: '/bot', icon: 'i-lucide-plus', label: 'Задача', center: true },
  { to: '/plan', icon: 'i-lucide-calendar-days', label: 'План' },
  { to: '/results', icon: 'i-lucide-chart-spline', label: 'Итоги' }
]

// company switcher: bottom sheet with large touch targets
const switcherOpen = ref(false)
function pickCompany(id: string) {
  switcherOpen.value = false
  if (id === companyId.value) return
  companyId.value = id
  const c = companies.find(x => x.id === id)!
  toast.add({ title: `Компания: ${c.name}`, description: 'Данные другой компании недоступны', icon: 'i-lucide-shield-check', color: 'neutral' })
}
</script>

<template>
  <div class="flex min-h-dvh justify-center sm:items-center sm:py-6">
    <!-- transform-gpu makes the frame the containing block for fixed overlays (see app.vue) -->
    <div class="relative flex h-dvh w-full max-w-[430px] transform-gpu flex-col overflow-hidden bg-default sm:h-[min(880px,calc(100dvh-3rem))] sm:rounded-[2.75rem] sm:shadow-2xl sm:shadow-slate-900/15 sm:ring-[10px] sm:ring-white">
      <header v-if="!inPost" class="flex items-end justify-between gap-3 px-5 pb-4 pt-6">
        <div class="min-w-0">
          <p class="mb-0.5 truncate text-caption font-semibold uppercase tracking-wider text-primary">AI-маркетолог · {{ company.name }}</p>
          <h1 class="truncate text-display font-bold tracking-tight">
            {{ head[0] }} <span class="font-semibold text-muted">{{ head[1] }}</span>
          </h1>
        </div>
        <UChip color="success" position="bottom-right" inset size="xl" class="mb-1">
          <UButton variant="outline" square size="lg" class="size-12 text-brand-900" aria-label="Сменить компанию" @click="switcherOpen = true">
            <BrandMark v-if="company.icon === 'brand'" class="size-7" />
            <UIcon v-else :name="company.icon" class="size-6" />
          </UButton>
        </UChip>
      </header>

      <UDrawer v-model:open="switcherOpen" title="Компания" :ui="{ header: 'sr-only' }">
        <template #body>
          <SectionCard title="Компания" icon="i-lucide-building-2">
            <button v-for="c in companies" :key="c.id" class="block w-full text-left" @click="pickCompany(c.id)">
              <InfoRow
                :icon="c.icon === 'brand' ? 'i-lucide-factory' : c.icon" :tone="c.icon === 'brand' ? 'brand' : 'amber'" tile="md"
                :title="c.name" :subtitle="c.channel" :meta="c.id === companyId ? 'Выбрана' : undefined" meta-class="text-primary"
              >
                <UIcon v-if="c.id === companyId" name="i-lucide-circle-check" class="size-6 text-primary" />
                <UIcon v-else name="i-lucide-circle" class="size-6 text-dimmed" />
              </InfoRow>
            </button>
            <p class="text-caption text-muted">Данные компаний изолированы: посты, план и статистика другой компании не видны.</p>
          </SectionCard>
        </template>
      </UDrawer>

      <main class="no-scrollbar flex-1 overflow-y-auto px-3 pb-6" :class="inPost ? 'pt-4' : ''">
        <slot />
      </main>

      <nav v-if="!inPost" class="grid grid-cols-5 items-center rounded-t-card bg-elevated px-4 pb-6 pt-3 shadow-[0_-8px_24px_rgb(15_59_68/.05)]">
        <div v-for="n in nav" :key="n.to" class="flex justify-center">
          <UButton
            v-if="n.center" :to="n.to" :icon="n.icon" :aria-label="n.label" variant="solid" square size="lg"
            class="size-12 rounded-nav shadow-lg shadow-brand-900/25" :ui="{ leadingIcon: 'size-6' }"
          />
          <UButton
            v-else :to="n.to" :aria-label="n.label" :active="route.path === n.to"
            variant="ghost" active-variant="soft" active-color="neutral"
            square size="lg" class="size-12 rounded-nav" :class="route.path === n.to ? 'text-brand-900' : 'text-muted'"
          >
            <!-- counter sits on the icon itself, not on the button's corner -->
            <UChip :text="pending" :show="n.to === '/approve' && pending > 0" color="error" size="3xl">
              <UIcon :name="n.icon" class="size-6.5" />
            </UChip>
          </UButton>
        </div>
      </nav>

      <!-- overlay target, see app.vue -->
      <div id="phone-portal" class="relative z-50" />
    </div>
  </div>
</template>
