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
  <div v-if="!areNotificationsOn">
    <p>
      Zezwól na powiadomienia, aby Twój asystent koncentracji mógł poinformować
      Cię o czasie na odpoczynek :>
    </p>
    <button @click="askForNotificationsPermission">
      Aktywuj powiadomienia
    </button>
  </div>
</template>
