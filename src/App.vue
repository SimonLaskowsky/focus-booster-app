<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import NotificationsNotifier from "./components/NotificationsNotifier.vue";
import Timer from "./components/Timer.vue";

const mouseHasMoved = ref(false);
const areNotificationsOn = ref(false);
const timerIsOn = ref(false);
const timer = ref(null); // timer component

// Funkcje pomocnicze
const sendBreakNotification = () => {
  if (!areNotificationsOn.value) return;

  const notification = new Notification("Zrób sobie przerwę", {
    body: "Rozprostuj kości, napij się wody, poodychaj świeżym powietrzem. Jak wrócisz do komputera wznowie odliczanie przed kolejną przerwą :>",
  });

  notification.onclick = () => {
    // Logika po kliknięciu w powiadomienie
  };
};

// Obsługa zdarzeń
const handleMouseMove = () => {
  if (!timerIsOn.value) {
    mouseHasMoved.value = true;
    timer.value.countDown();
  }
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});

const handleNotificationChange = (newValue) => {
  areNotificationsOn.value = newValue;
};

const handleTimerIsOnChange = (newValue) => {
  timerIsOn.value = newValue;
};
</script>

<template>
  <main>
    <div class="timer-wrapper">
      <Timer
        ref="timer"
        :areNotificationsOn="areNotificationsOn"
        @timerIsOnChange="handleTimerIsOnChange"
        @sendBreakNotification="sendBreakNotification"
      />
    </div>
    <div class="panel-wrapper">
      <p>Recent activities</p>
      <div class="panel-info">
        <NotificationsNotifier
          @notificationsChange="handleNotificationChange"
        />
      </div>
    </div>
  </main>
</template>
