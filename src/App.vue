<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import NotificationsNotifier from "./components/NotificationsNotifier.vue";
import Timer from "./components/Timer.vue";
import ControlButton from "./components/ControlButton.vue";
import HistoryComponent from "./components/HistoryComponent.vue";

const areNotificationsOn = ref(false);
const timerIsOn = ref(false);
const timer = ref(null); // timer component
const timerPause = ref(false);
const timerHistory = ref([]);
const currentSessionIndex = ref(null);

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

const handleNotificationChange = (newValue) => {
  areNotificationsOn.value = newValue;
};

const handleTimerIsOnChange = (newValue) => {
  timerIsOn.value = newValue;
};

const handleUserStaredWorking = () => {
  const startTime = new Date();
  timerHistory.value.push({ startTime });
};

const handleStatusChange = (newStatus) => {
  timerHistory.value.push({
    startTime: new Date(),
    status: newStatus,
  });
  currentSessionIndex.value++;
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
        @statusChange="handleStatusChange"
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
          :title="entry.status"
          :currentComponentId="index"
          :activeComponentId="currentSessionIndex"
          :timerPause="timerPause"
        />
      </div>
    </div>
  </main>
</template>
