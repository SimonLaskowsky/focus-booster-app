<script setup>
import { ref, defineEmits } from "vue";

const areNotificationsOn = ref(false);
const emit = defineEmits(["notificationsChange"]);

const askForNotificationsPermission = () => {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        areNotificationsOn.value = true;
        emit("notificationsChange", areNotificationsOn.value);
      }
    });
  } else {
    alert("Powiadomienia nie są wspierane przez tę przeglądarkę");
  }
};
</script>
<template>
  <div class="notification" v-if="!areNotificationsOn">
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
