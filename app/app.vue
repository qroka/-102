<template>
  <!--
    All overlays (drawers, menus, toasts) render into #phone-portal inside the phone frame
    (layouts/default.vue), so in the desktop preview they open inside the "phone".
    In Telegram the frame is the whole screen, so nothing changes there.
  -->
  <UApp portal="#phone-portal" :toaster="{ position: 'top-center', duration: 3000 }">
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
  </UApp>
</template>
