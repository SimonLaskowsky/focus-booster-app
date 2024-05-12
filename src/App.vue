<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import NotificationsNotifier from "./components/NotificationsNotifier.vue";
import Timer from "./components/Timer.vue";
import ControlButton from "./components/ControlButton.vue";
import HistoryComponent from "./components/HistoryComponent.vue";

const mouseHasMoved = ref(false);
const areNotificationsOn = ref(false);
const timerIsOn = ref(false);
const timer = ref(null); // timer component
const timerPause = ref(false);
const timerHistory = ref([]);
const isUserWorking = ref(false);

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
    if (areNotificationsOn.value) {
      handleUserStaredWorking();
    }
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

const handleUserStaredWorking = () => {
  console.log("wywoluje sie");
  const startTime = new Date();
  timerHistory.value.push({ startTime });
};

const togglePause = () => {
  if (areNotificationsOn.value) timerPause.value = !timerPause.value;
};
</script>

<template>
  <main>
    <div class="timer-wrapper">
      <Timer
        ref="timer"
        :areNotificationsOn="areNotificationsOn"
        :timerPause="timerPause"
        @timerIsOnChange="handleTimerIsOnChange"
        @sendBreakNotification="sendBreakNotification"
        @userStartedWorking="handleUserStaredWorking"
      />
    </div>
    <div class="panel-wrapper">
      <ControlButton
        :areNotificationsOn="areNotificationsOn"
        @click="togglePause"
      />
      <p>Recent activity</p>
      <div class="panel-info">
        <NotificationsNotifier
          @notificationsChange="handleNotificationChange"
        />
        <HistoryComponent
          v-for="(entry, index) in timerHistory"
          :key="index"
          :startTime="entry.startTime"
        />
      </div>
    </div>
  </main>
</template>
