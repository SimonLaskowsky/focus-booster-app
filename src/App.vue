<script setup>
import { ref, nextTick } from "vue";
import NotificationsNotifier from "./components/NotificationsNotifier.vue";
import Timer from "./components/Timer.vue";
import ControlButton from "./components/ControlButton.vue";
import HistoryComponent from "./components/HistoryComponent.vue";
import { useTimerStore } from "@/stores/timerStore";

const areNotificationsOn = ref(false);
const timer = ref(null); // timer component
const timerPause = ref(false);
const timerHistory = ref([]);
const currentSessionIndex = ref(null);
const timerStore = useTimerStore();

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
  scrollToTop();
};

const scrollToTop = () => {
  nextTick(() => {
    const panel = document.querySelector(".panel-info");
    if (panel) {
      panel.scrollTop = -1000 * currentSessionIndex.value; // Ustaw scroll na górze
    }
  });
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
        @statusChange="handleStatusChange"
        @userStartedWorking="handleUserStaredWorking"
      />
    </div>
    <div class="panel-wrapper">
      <!-- <ControlButton @click="togglePause" /> -->
      <p>Recent activity</p>
      <div class="panel-info">
        <NotificationsNotifier />
        <HistoryComponent
          v-for="(entry, index) in timerHistory"
          :key="index"
          :startTime="entry.startTime"
          :title="entry.status"
          :currentComponentId="index"
          :activeComponentId="currentSessionIndex"
        />
      </div>
    </div>
  </main>
</template>
