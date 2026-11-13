export type PostStatus =
  | 'generating' | 'pending' | 'changes' | 'scheduled'
  | 'published' | 'rejected' | 'failed' | 'uncertain'

export interface Version { n: number; title: string; body: string; note?: string; createdAt: string }

export interface Post {
  id: number
  companyId: string
  kind: 'post' | 'video'
  title: string
  rubric: string
  status: PostStatus
  origin: 'chat' | 'schedule'
  channel: string
  publishAt: string
  versions: Version[]
  warnings: string[]
  facts: { claim: string; source: string }[]
  approvers: { name: string; decision: 'pending' | 'approved' | 'rejected' }[]
  link?: string
  metrics?: { views: number; reactions: number; comments: number }
  cost: { tokens: number; rub: number }
  error?: string
  scenes?: { t: string; text: string; shot: string }[]
  createdAt: string
}

export interface Company { id: string; name: string; handle: string; channel: string; icon: string }

export const companies: Company[] = [
  { id: 'sal', name: 'Салаватстекло', handle: '@salavatsteklo_test', channel: '@salavatsteklo_test', icon: 'brand' },
  { id: 'zerno', name: 'Кофейня «Зерно»', handle: '@zerno_coffee_test', channel: '@zerno_coffee_test', icon: 'i-lucide-coffee' }
]

export const useCompanyId = () => useState<string>('company', () => 'sal')
export const useCompany = () => {
  const id = useCompanyId()
  return computed(() => companies.find(c => c.id === id.value) ?? companies[0]!)
}

export const curVersion = (p: Post) => p.versions[p.versions.length - 1]!

const approvers = (n = 1) => [
  { name: 'Ирина Н. (вы)', decision: 'pending' as const },
  ...(n > 1 ? [{ name: 'Артём К.', decision: 'pending' as const }] : [])
]

export const usePosts = () => useState<Post[]>('posts', () => [
  {
    id: 1, companyId: 'sal', kind: 'post', status: 'pending', origin: 'schedule', rubric: 'Новости отрасли',
    title: 'Новые возможности для стекольной отрасли', channel: '@salavatsteklo_test', publishAt: 'Пн, 16.11, 10:00',
    versions: [{ n: 1, createdAt: '09:00', title: 'Новые возможности для стекольной отрасли',
      body: 'Рынок архитектурного и технического стекла быстро меняется: растёт спрос на энергосберегающие решения, а производство переходит на более чистые технологии. По оценкам отрасли, спрос на такие продукты вырос на 15% за год. Рассказываем, какие возможности это открывает для заказчиков Салаватстекло.' }],
    warnings: ['Не подтверждено источниками: «спрос вырос на 15% за год»'],
    facts: [
      { claim: 'Салаватстекло выпускает листовое стекло и продукцию из него', source: 'salavatsteklo.ru · О компании · c3' },
      { claim: 'Растёт спрос на энергосберегающие решения', source: 'Презентация компании.pdf · стр. 4' }
    ],
    approvers: approvers(2), cost: { tokens: 2140, rub: 2.6 }, createdAt: 'сегодня, 09:00'
  },
  {
    id: 2, companyId: 'sal', kind: 'post', status: 'pending', origin: 'chat', rubric: 'Полезное',
    title: 'Какое стекло выбрать под вашу задачу', channel: '@salavatsteklo_test', publishAt: 'Пн, 16.11, 12:00',
    versions: [
      { n: 1, createdAt: '10:12', title: 'Какое стекло выбрать под вашу задачу',
        body: 'Прозрачное, тонированное, энергосберегающее или закалённое? Короткий гид: как подобрать стекло под витрину, фасад или остекление балкона — без переплат и лишних компромиссов. Начните с вопроса: что для вас важнее — свет, тепло или безопасность? От ответа зависит выбор.' },
      { n: 2, createdAt: '10:19', note: 'Сделай короче', title: 'Какое стекло выбрать под вашу задачу',
        body: 'Прозрачное, тонированное, энергосберегающее или закалённое? Короткий гид: как подобрать стекло под витрину, фасад или балкон — без переплат.' }
    ],
    warnings: [],
    facts: [{ claim: 'Виды стекла: прозрачное, тонированное, энергосберегающее, закалённое', source: 'Каталог продукции · c7' }],
    approvers: approvers(1), cost: { tokens: 3380, rub: 4.1 }, createdAt: 'сегодня, 10:12'
  },
  {
    id: 3, companyId: 'sal', kind: 'post', status: 'published', origin: 'chat', rubric: 'О компании',
    title: 'Знакомьтесь: Салаватстекло', channel: '@salavatsteklo_test', publishAt: 'Сегодня, 12:00',
    versions: [{ n: 1, createdAt: '11:40', title: 'Знакомьтесь: Салаватстекло',
      body: 'Салаватстекло — один из ведущих производителей листового стекла в России. Делимся историей завода, ключевыми продуктами и тем, чем мы полезны вашему бизнесу.' }],
    warnings: [], facts: [{ claim: 'Один из ведущих производителей листового стекла', source: 'salavatsteklo.ru · О компании · c1' }],
    approvers: [{ name: 'Ирина Н. (вы)', decision: 'approved' }], link: 'https://t.me/salavatsteklo_test/12',
    metrics: { views: 248, reactions: 19, comments: 4 }, cost: { tokens: 1890, rub: 2.2 }, createdAt: 'сегодня, 11:40'
  },
  {
    id: 4, companyId: 'sal', kind: 'post', status: 'generating', origin: 'schedule', rubric: 'Продукт в деталях',
    title: 'Ultraview R для музейных витрин и ювелирных салонов', channel: '@salavatsteklo_test', publishAt: 'Вт, 17.11, 12:00',
    versions: [{ n: 1, createdAt: 'сейчас', title: 'Ultraview R для музейных витрин и ювелирных салонов', body: '' }],
    warnings: [], facts: [], approvers: approvers(1), cost: { tokens: 0, rub: 0 }, createdAt: 'сейчас'
  },
  {
    id: 5, companyId: 'sal', kind: 'post', status: 'scheduled', origin: 'schedule', rubric: 'Полезное',
    title: 'Энергосберегающее стекло: как оно снижает счета за отопление', channel: '@salavatsteklo_test', publishAt: 'Ср, 18.11, 11:30',
    versions: [{ n: 1, createdAt: 'вчера', title: 'Энергосберегающее стекло: как оно снижает счета за отопление',
      body: 'Тонкое покрытие на стекле возвращает тепло в помещение, а не выпускает на улицу. Рассказываем, как это работает и где даёт максимальный эффект.' }],
    warnings: [], facts: [{ claim: 'Покрытие отражает тепловое излучение', source: 'Технический каталог · c12' }],
    approvers: [{ name: 'Ирина Н. (вы)', decision: 'approved' }], cost: { tokens: 2010, rub: 2.4 }, createdAt: 'вчера, 17:20'
  },
  {
    id: 6, companyId: 'sal', kind: 'video', status: 'pending', origin: 'chat', rubric: 'Видео',
    title: 'Как делают флоат-стекло за 30 секунд', channel: '@salavatsteklo_test', publishAt: 'Пт, 20.11, 15:00',
    versions: [{ n: 1, createdAt: '12:05', title: 'Как делают флоат-стекло за 30 секунд',
      body: 'Короткое вертикальное видео, 30 секунд: путь стекломассы от печи до ровной ленты на расплаве олова.' }],
    scenes: [
      { t: '0–5 с', text: 'Ты видишь это стекло каждый день. А знаешь, как оно рождается?', shot: 'Крупно: оконное стекло, свет' },
      { t: '5–15 с', text: 'Печь, 1500 градусов. Стекломасса течёт на расплавленное олово.', shot: 'Цех: печь, поток расплава' },
      { t: '15–25 с', text: 'Олово делает поверхность идеально ровной.', shot: 'Лента стекла на выходе' },
      { t: '25–30 с', text: 'Салаватстекло. Стекло, которое работает.', shot: 'Логотип, итоговый кадр' }
    ],
    warnings: ['Не подтверждено источниками: «1500 градусов»'], facts: [{ claim: 'Флоат-метод: стекломасса на расплаве олова', source: 'Технологии · c9' }],
    approvers: approvers(1), cost: { tokens: 2760, rub: 3.3 }, createdAt: 'сегодня, 12:05'
  },
  {
    id: 7, companyId: 'sal', kind: 'post', status: 'failed', origin: 'schedule', rubric: 'Новости отрасли',
    title: 'Итоги недели в стекольной отрасли', channel: '@salavatsteklo_test', publishAt: 'Сегодня, 15:00',
    versions: [{ n: 1, createdAt: 'вчера', title: 'Итоги недели в стекольной отрасли', body: 'Главное за неделю: короткий дайджест новостей и трендов стекольной отрасли.' }],
    warnings: [], facts: [], approvers: [{ name: 'Ирина Н. (вы)', decision: 'approved' }],
    error: 'Канал недоступен: у бота нет права публиковать сообщения. Проверьте права администратора.',
    cost: { tokens: 1500, rub: 1.8 }, createdAt: 'вчера, 16:00'
  },
  {
    id: 8, companyId: 'sal', kind: 'post', status: 'uncertain', origin: 'chat', rubric: 'Жизнь компании',
    title: 'Спортивный турнир Салаватстекло', channel: '@salavatsteklo_test', publishAt: 'Сегодня, 14:00',
    versions: [{ n: 1, createdAt: 'вчера', title: 'Спортивный турнир Салаватстекло', body: 'Сотрудники завода собрались на ежегодный турнир. Делимся впечатлениями и итогами.' }],
    warnings: [], facts: [], approvers: [{ name: 'Ирина Н. (вы)', decision: 'approved' }],
    error: 'Нет ответа от Telegram после отправки. Автоповтор отключён, чтобы не получить дубль. Проверьте канал и отметьте результат вручную.',
    cost: { tokens: 1700, rub: 2 }, createdAt: 'вчера, 18:30'
  },
  {
    id: 9, companyId: 'sal', kind: 'post', status: 'rejected', origin: 'schedule', rubric: 'Продукт в деталях',
    title: 'Скидки на стекло только сегодня', channel: '@salavatsteklo_test', publishAt: '—',
    versions: [{ n: 1, createdAt: 'вчера', title: 'Скидки на стекло только сегодня', body: 'Только сегодня скидка 30% на всю продукцию.' }],
    warnings: ['Слово из списка запретов: «скидка»'], facts: [], approvers: [{ name: 'Ирина Н. (вы)', decision: 'rejected' }],
    cost: { tokens: 1200, rub: 1.4 }, createdAt: 'вчера, 09:00'
  },
  {
    id: 10, companyId: 'zerno', kind: 'post', status: 'pending', origin: 'chat', rubric: 'Новинки',
    title: 'Тыквенный раф вернулся', channel: '@zerno_coffee_test', publishAt: 'Пн, 16.11, 09:00',
    versions: [{ n: 1, createdAt: '10:30', title: 'Тыквенный раф вернулся', body: 'Осень в стакане: тыквенный раф снова в меню. Делаем на свежем молоке и домашнем сиропе. Заходите согреться.' }],
    warnings: [], facts: [{ claim: 'Тыквенный раф — сезонная новинка меню', source: 'Меню осень 2026.pdf · стр. 2' }],
    approvers: approvers(1), cost: { tokens: 1650, rub: 2 }, createdAt: 'сегодня, 10:30'
  },
  {
    id: 11, companyId: 'zerno', kind: 'post', status: 'published', origin: 'schedule', rubric: 'О нас',
    title: 'Знакомьтесь: «Зерно»', channel: '@zerno_coffee_test', publishAt: 'Вчера, 10:00',
    versions: [{ n: 1, createdAt: 'вчера', title: 'Знакомьтесь: «Зерно»', body: 'Мы — небольшая кофейня, обжариваем зерно сами. Расскажем, откуда оно и как мы его выбираем.' }],
    warnings: [], facts: [], approvers: [{ name: 'Ирина Н. (вы)', decision: 'approved' }], link: 'https://t.me/zerno_coffee_test/5',
    metrics: { views: 96, reactions: 8, comments: 1 }, cost: { tokens: 1400, rub: 1.7 }, createdAt: 'вчера, 09:30'
  }
])

export const useCompanyPosts = () => {
  const posts = usePosts()
  const id = useCompanyId()
  return computed(() => posts.value.filter(p => p.companyId === id.value))
}

export const usePendingCount = () => {
  const list = useCompanyPosts()
  return computed(() => list.value.filter(p => p.status === 'pending').length)
}

let seq = 100
export const usePostActions = () => {
  const posts = usePosts()
  const toast = useToast()
  const find = (id: number) => posts.value.find(p => p.id === id)

  function publish(p: Post) {
    p.status = 'scheduled'
    setTimeout(() => {
      p.status = 'published'
      p.link = `https://t.me/${p.channel.slice(1)}/${seq++}`
      p.metrics = { views: 0, reactions: 0, comments: 0 }
      toast.add({ title: 'Опубликовано', description: p.link, icon: 'i-lucide-send', color: 'success' })
    }, 1800)
  }

  function approve(id: number) {
    const p = find(id); if (!p) return
    p.approvers[0]!.decision = 'approved'
    toast.add({ title: 'Пост одобрен', description: p.publishAt === 'Сейчас' ? 'Публикуем…' : `Выйдет: ${p.publishAt}`, icon: 'i-lucide-circle-check', color: 'success' })
    if (p.publishAt === 'Сейчас') publish(p); else p.status = 'scheduled'
  }

  function reject(id: number) {
    const p = find(id); if (!p) return
    p.approvers[0]!.decision = 'rejected'
    p.status = 'rejected'
    toast.add({ title: 'Пост отклонён', description: 'Публикация невозможна', icon: 'i-lucide-ban', color: 'error' })
  }

  function reschedule(id: number, label: string) {
    const p = find(id); if (!p) return
    p.publishAt = label
    if (p.status === 'scheduled') {
      p.status = 'pending'
      p.approvers.forEach(a => (a.decision = 'pending'))
      toast.add({ title: 'Время изменено', description: 'Нужно новое одобрение', icon: 'i-lucide-calendar-clock', color: 'warning' })
    }
  }

  function requestChanges(id: number, comment: string) {
    const p = find(id); if (!p) return
    p.status = 'generating'
    p.approvers.forEach(a => (a.decision = 'pending'))
    setTimeout(() => {
      const v = curVersion(p)
      let body = v.body
      if (/коро[тч]/i.test(comment)) {
        const s = v.body.split(/(?<=[.!?])\s+/)
        body = s.slice(0, Math.max(1, s.length > 2 ? 2 : 1)).join(' ')
      }
      else if (/картин|изображ|обложк/i.test(comment)) body = v.body
      else if (!/перенес|пятниц|завтра/i.test(comment)) body = `${v.body} Оставьте заявку — подберём решение под вашу задачу.`
      if (/пятниц/i.test(comment)) p.publishAt = 'Пт, 20.11, 10:00'
      else if (/завтра/i.test(comment)) p.publishAt = 'Сб, 14.11, 10:00'
      p.versions.push({ n: v.n + 1, title: v.title, body, note: comment, createdAt: 'только что' })
      p.cost = { tokens: p.cost.tokens + 900, rub: +(p.cost.rub + 1.1).toFixed(1) }
      p.status = 'pending'
      toast.add({ title: `Версия ${v.n + 1} готова`, description: 'Нужно новое одобрение', icon: 'i-lucide-file-pen-line', color: 'primary' })
    }, 2600)
  }

  function retry(id: number) {
    const p = find(id); if (!p) return
    p.error = undefined
    publish(p)
  }

  function markPublished(id: number) {
    const p = find(id); if (!p) return
    p.error = undefined
    p.status = 'published'
    p.link = `https://t.me/${p.channel.slice(1)}/${seq++}`
    p.metrics = { views: 0, reactions: 0, comments: 0 }
    toast.add({ title: 'Отмечено как опубликованное', icon: 'i-lucide-check', color: 'success' })
  }

  function create(companyId: string, text: string, origin: Post['origin'] = 'chat', kind: Post['kind'] = 'post') {
    const ch = companies.find(c => c.id === companyId)!.channel
    const title = text.replace(/^((сделай|напиши|подготовь|создай)\s+)?(пост\s+)?(про|об|о)\s+/i, '').trim()
    const t = (title[0]?.toUpperCase() ?? '') + title.slice(1)
    const post: Post = {
      id: seq++, companyId, kind, status: 'generating', origin, rubric: 'По запросу',
      title: t.length > 70 ? t.slice(0, 67) + '…' : t, channel: ch, publishAt: 'Пн, 16.11, 10:00',
      versions: [{ n: 1, createdAt: 'сейчас', title: t, body: '' }], warnings: [], facts: [],
      approvers: approvers(1), cost: { tokens: 0, rub: 0 }, createdAt: 'сейчас'
    }
    posts.value.unshift(post)
    const p = posts.value[0]!
    setTimeout(() => {
      p.versions[0]!.body = `${t}. Коротко и по делу: что важно знать, чем это полезно вам и куда обратиться за подробностями. Подробности — в комментариях.`
      p.facts = [{ claim: t, source: 'Материалы компании · c2' }]
      p.cost = { tokens: 1800, rub: 2.2 }
      p.status = 'pending'
    }, 3200)
    return post.id
  }

  return { find, approve, reject, reschedule, requestChanges, retry, markPublished, create }
}

// ---------- plan ----------
export type PlanStatus = 'idea' | 'accepted' | 'drafted' | 'published' | 'skipped'
export interface PlanItem {
  id: number; companyId: string; date: string; weekday: string; time: string; title: string
  rubric: string; status: PlanStatus; reason: string; origin: 'schedule' | 'chat'
}

// November 2026: the 1st is a Sunday
const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
export const weekdayOf = (n: number) => WD[(n - 1) % 7]!
export const TODAY = 13

const pi = (id: number, companyId: string, n: number, time: string, rubric: string, status: PlanStatus, title: string, reason: string, origin: PlanItem['origin'] = 'schedule'): PlanItem =>
  ({ id, companyId, date: `${n}.11`, weekday: weekdayOf(n), time, rubric, status, title, reason, origin })

export const usePlan = () => useState<PlanItem[]>('plan', () => [
  // past — already out
  pi(20, 'sal', 2, '10:00', 'О компании', 'published', 'Салаватстекло: история завода', 'Открывающий пост месяца'),
  pi(21, 'sal', 4, '12:00', 'Полезное', 'published', 'Как ухаживать за стеклом зимой', 'Сезонная тема'),
  pi(22, 'sal', 6, '11:00', 'Жизнь компании', 'published', 'День открытых дверей на заводе', 'Событие из календаря компании', 'chat'),
  pi(23, 'sal', 9, '10:00', 'Продукт в деталях', 'published', 'Закалённое стекло: где оно незаменимо', 'Рубрика «Продукт» раз в неделю'),
  pi(24, 'sal', 11, '12:00', 'Технологии', 'published', 'Что такое низкоэмиссионное покрытие', 'Объяснительный формат заходит лучше всего'),
  pi(25, 'sal', 12, '15:00', 'Новости отрасли', 'skipped', 'Итоги выставки стекольной отрасли', 'Пропущено: нет подтверждённых фактов'),
  pi(26, 'sal', 13, '12:00', 'О компании', 'published', 'Знакомьтесь: Салаватстекло', 'Вводный пост для новых подписчиков', 'chat'),
  // next week
  pi(1, 'sal', 16, '10:00', 'Продукт в деталях', 'drafted', 'Ultraview R для музейных витрин и ювелирных салонов', 'Рубрика «Продукт» не выходила 7 дней, в материалах есть описание свойств стекла'),
  pi(2, 'sal', 17, '12:00', 'Технологии', 'accepted', 'Как формируется листовое стекло: путь из печи на расплав олова', 'Тема объяснительная, хорошо заходит в профильных каналах'),
  pi(3, 'sal', 18, '11:30', 'Полезное', 'accepted', 'Энергосберегающее стекло: как оно снижает счета за отопление', 'Сезонная тема: началось отопительное время'),
  pi(4, 'sal', 19, '10:00', 'Жизнь компании', 'idea', 'Люди Салаватстекло: история одного цеха', 'Кейсодатель просил больше внутренней жизни компании'),
  pi(5, 'sal', 20, '15:00', 'Новости отрасли', 'idea', 'Итоги недели в стекольной отрасли: главное за 5 минут', 'Регулярная пятничная рубрика'),
  // later in the month
  pi(8, 'sal', 23, '10:00', 'Полезное', 'idea', 'Чек-лист: как выбрать стеклопакет', 'Гайды с чек-листом дают ER 6,4% у конкурентов'),
  pi(9, 'sal', 25, '12:00', 'Продукт в деталях', 'accepted', 'Осветлённое стекло для витрин', 'Частый вопрос в комментариях'),
  pi(10, 'sal', 27, '15:00', 'Видео', 'idea', '30 секунд из цеха: резка стекла', 'Видео из производства дают ER выше среднего на 70%'),
  pi(11, 'sal', 30, '10:00', 'Жизнь компании', 'idea', 'Итоги ноября: что мы успели', 'Ежемесячная рубрика'),
  // second company
  pi(27, 'zerno', 9, '09:00', 'О нас', 'published', 'Знакомьтесь: «Зерно»', 'Вводный пост'),
  pi(6, 'zerno', 16, '09:00', 'Новинки', 'drafted', 'Тыквенный раф вернулся', 'Сезонная новинка из меню', 'chat'),
  pi(7, 'zerno', 18, '10:00', 'Закулисье', 'idea', 'Как мы обжариваем зерно', 'Вовлекающий формат «как это сделано»'),
  pi(28, 'zerno', 25, '10:00', 'Новинки', 'idea', 'Зимнее меню', 'Сезонность: первые морозы')
])

export const useSchedule = () => useState('schedule', () => ({
  sal: { label: 'По будням в 09:00', next: '2 ч 14 мин', enabled: true },
  zerno: { label: 'Пн, Ср, Пт в 10:00', next: '1 д 20 ч', enabled: true }
} as Record<string, { label: string; next: string; enabled: boolean }>))

// ---------- stats ----------
export const useUsage = () => {
  const id = useCompanyId()
  const posts = useCompanyPosts()
  return computed(() => {
    const today = id.value === 'sal' ? 12.5 : 4.2
    const limit = 50
    const tokens = posts.value.reduce((s, p) => s + p.cost.tokens, 0)
    const rub = +posts.value.reduce((s, p) => s + p.cost.rub, 0).toFixed(1)
    const per = posts.value.length ? +(rub / posts.value.length).toFixed(1) : 0
    return { today, limit, tokens, rub, per, month: Math.round(per * 30) }
  })
}

export const useStats = () => {
  const id = useCompanyId()
  const posts = useCompanyPosts()
  return computed(() => {
    const l = posts.value
    const c = (f: (p: Post) => boolean) => String(l.filter(f).length)
    const subs = id.value === 'sal' ? '6' : '3'
    return [
      { key: 'prepared', label: 'Подготовлено', value: String(l.length), icon: 'i-lucide-file-pen-line', delta: '+2', tone: 'text-brand-400 bg-brand-400/15' },
      { key: 'published', label: 'Опубликовано', value: c(p => p.status === 'published'), icon: 'i-lucide-send', delta: '+1', tone: 'text-emerald-400 bg-emerald-400/15' },
      { key: 'pending', label: 'Ждут решения', value: c(p => p.status === 'pending'), icon: 'i-lucide-hourglass', delta: '', tone: 'text-amber-400 bg-amber-400/15' },
      { key: 'rejected', label: 'Отклонено', value: c(p => p.status === 'rejected'), icon: 'i-lucide-ban', delta: '', tone: 'text-rose-400 bg-rose-400/15' },
      { key: 'subs', label: 'Подписчики', value: subs, icon: 'i-lucide-users', delta: '+3', tone: 'text-sky-400 bg-sky-400/15' },
      { key: 'approve', label: 'Согласование', value: '1 мин', icon: 'i-lucide-timer', delta: '−4 мин', tone: 'text-violet-400 bg-violet-400/15' }
    ]
  })
}

export const weekChart = [
  { d: 'Пн', v: 0 }, { d: 'Вт', v: 1 }, { d: 'Ср', v: 0 }, { d: 'Чт', v: 2 },
  { d: 'Пт', v: 0 }, { d: 'Сб', v: 1 }, { d: 'Вс', v: 3 }
]

// ---------- comments ----------
export interface Comment {
  id: number; companyId: string; author: string; text: string; postTitle: string
  sentiment: 'pos' | 'neu' | 'neg'; status: 'new' | 'replied' | 'hidden'; draft?: string
}

export const useComments = () => useState<Comment[]>('comments', () => [
  { id: 1, companyId: 'sal', author: 'Дмитрий', text: 'А можно такое стекло для витрины магазина?', postTitle: 'Знакомьтесь: Салаватстекло', sentiment: 'neu', status: 'new',
    draft: 'Здравствуйте, Дмитрий! Да, для витрин подойдёт наше осветлённое стекло. Напишите размеры — подскажем решение.' },
  { id: 2, companyId: 'sal', author: 'Ольга', text: 'Отличный пост, спасибо, было интересно!', postTitle: 'Знакомьтесь: Салаватстекло', sentiment: 'pos', status: 'new',
    draft: 'Спасибо, Ольга! Рады, что вам понравилось. Скоро расскажем больше.' },
  { id: 3, companyId: 'sal', author: 'user_4821', text: 'Ерунда, одна реклама. Отписываюсь.', postTitle: 'Знакомьтесь: Салаватстекло', sentiment: 'neg', status: 'new' },
  { id: 4, companyId: 'sal', author: 'Игорь', text: 'Где можно купить в Уфе?', postTitle: 'Знакомьтесь: Салаватстекло', sentiment: 'neu', status: 'replied',
    draft: 'Игорь, здравствуйте! Свяжитесь с нашим отделом продаж — контакты в описании канала.' },
  { id: 5, companyId: 'zerno', author: 'Аня', text: 'Обожаю ваш раф!', postTitle: 'Знакомьтесь: «Зерно»', sentiment: 'pos', status: 'new', draft: 'Спасибо, Аня! Ждём вас снова.' }
])

// ---------- competitors ----------
export type RivalFormat = 'Гайд' | 'Видео' | 'Акция' | 'Новость' | 'Кейс'
export interface RivalPost { id: number; title: string; text: string; date: string; views: number; reactions: number; er: number; format: RivalFormat }
export interface Rival { slug: string; name: string; handle: string; perWeek: number; er: string; top: string; insight: string; posts: RivalPost[] }

export const rivalUrl = (r: Rival, p: RivalPost) => `https://t.me/${r.slug}/${p.id}`

export const competitors: Record<string, Rival[]> = {
  sal: [
    {
      slug: 'glassyug', name: 'Гласс-Юг', handle: '@glassyug', perWeek: 5, er: '6,4%', top: 'Как выбрать стеклопакет для дома',
      insight: 'Лучше всего заходят короткие гайды с чек-листом',
      posts: [
        { id: 412, format: 'Гайд', date: '12 нояб.', views: 3400, reactions: 218, er: 6.4, title: 'Как выбрать стеклопакет для дома', text: '5 вопросов, которые стоит задать до заказа: камеры, покрытие, профиль, монтаж, гарантия. Чек-лист в карточках.' },
        { id: 409, format: 'Новость', date: '10 нояб.', views: 1900, reactions: 41, er: 2.2, title: 'Открыли новый склад в Краснодаре', text: 'Сократили сроки доставки по краю до 2 дней.' },
        { id: 405, format: 'Гайд', date: '7 нояб.', views: 2800, reactions: 160, er: 5.7, title: 'Мифы о тройном остеклении', text: 'Разбираем 4 популярных заблуждения: тепло, шум, вес, цена.' },
        { id: 401, format: 'Акция', date: '5 нояб.', views: 2100, reactions: 30, er: 1.4, title: 'Скидка 10% на замер до конца месяца', text: 'Оставьте заявку — замерщик приедет бесплатно.' }
      ]
    },
    {
      slug: 'steklotech', name: 'СтеклоТех', handle: '@steklotech', perWeek: 3, er: '8,1%', top: 'Закалка стекла: видео из цеха',
      insight: 'Видео из производства дают ER выше среднего на 70%',
      posts: [
        { id: 233, format: 'Видео', date: '11 нояб.', views: 5200, reactions: 421, er: 8.1, title: 'Закалка стекла: видео из цеха', text: '40 секунд: печь, обдув, проверка на удар. Без закадрового текста — только звук цеха.' },
        { id: 230, format: 'Кейс', date: '8 нояб.', views: 2600, reactions: 140, er: 5.4, title: 'Остекление ТЦ «Мега»: 2 400 м² за месяц', text: 'Как успели в срок и что пошло не по плану.' },
        { id: 227, format: 'Видео', date: '4 нояб.', views: 4100, reactions: 290, er: 7.1, title: 'Как режут стекло толщиной 19 мм', text: 'Короткое видео с участка резки.' }
      ]
    },
    {
      slug: 'promglass', name: 'ПромГласс', handle: '@promglass', perWeek: 7, er: '2,2%', top: 'Скидка на фасадное остекление',
      insight: 'Частые акции, вовлечённость низкая',
      posts: [
        { id: 1180, format: 'Акция', date: '13 нояб.', views: 1500, reactions: 33, er: 2.2, title: 'Скидка на фасадное остекление', text: '−15% до 30 ноября при заказе от 100 м².' },
        { id: 1176, format: 'Акция', date: '12 нояб.', views: 1300, reactions: 18, er: 1.4, title: 'Чёрная пятница уже здесь', text: 'Скидки на всё. Только неделю.' },
        { id: 1171, format: 'Новость', date: '11 нояб.', views: 1100, reactions: 20, er: 1.8, title: 'Мы на выставке в Москве', text: 'Стенд B-14, приходите.' }
      ]
    }
  ],
  zerno: [
    {
      slug: 'bancoffee', name: 'Бан Кофе', handle: '@bancoffee', perWeek: 6, er: '7,0%', top: 'Как заваривать в воронке',
      insight: 'Гайды по заваривке собирают больше всего сохранений',
      posts: [
        { id: 88, format: 'Гайд', date: '12 нояб.', views: 980, reactions: 69, er: 7.0, title: 'Как заваривать в воронке', text: 'Помол, температура, время — в одной карточке.' },
        { id: 85, format: 'Акция', date: '9 нояб.', views: 640, reactions: 12, er: 1.9, title: 'Второй капучино в подарок', text: 'По будням до 11:00.' }
      ]
    }
  ]
}

// ---------- chat ----------
export interface Msg { id: number; from: 'user' | 'bot'; text: string; postId?: number }
export const useChat = () => useState<Record<string, Msg[]>>('chat', () => ({
  sal: [{ id: 1, from: 'bot', text: 'Здравствуйте! Я AI-маркетолог Салаватстекло. Напишите, о чём нужен пост, или выберите задачу ниже.' }],
  zerno: [{ id: 1, from: 'bot', text: 'Здравствуйте! Я AI-маркетолог кофейни «Зерно». Напишите, о чём нужен пост.' }]
}))
