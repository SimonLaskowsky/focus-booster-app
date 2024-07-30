<script setup>
import { useTimerStore } from "@/stores/timerStore";

const timerStore = useTimerStore();

const askForNotificationsPermission = () => {
  window.electron.requestNotificationPermission();
  window.electron.onNotificationPermissionGranted(() => {
    timerStore.areNotificationsOn = true;
  });
};
</script>
<template>
  <div class="notification" v-if="!timerStore.areNotificationsOn">
    <p>
      Aplikacja mierzy domyślnie 25:00 minut, możesz edytować ten czas. Po tym
      czasie dostaniesz powiadomienie o zrobieniu sobie przerwy. Aplikacja
      będzie wiedzieć że wróciłeś z przerwy gdy ruszysz myszką 😉 Aby aplikacja
      zaczęła działać zezwól na powiadomienia przyciskiem poniżej (są potrzebne)
    </p>
    <button @click="askForNotificationsPermission">
      Aktywuj powiadomienia
    </button>
  </div>
</template>
