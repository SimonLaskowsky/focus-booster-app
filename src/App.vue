<script setup>
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import NotificationsNotifier from "./components/NotificationsNotifier.vue";
import Timer from "./components/Timer.vue";
import ControlButton from "./components/ControlButton.vue";
import HistoryComponent from "./components/HistoryComponent.vue";
import { useTimerStore } from "@/stores/timerStore";
const { ipcRenderer } = window.api;

const areNotificationsOn = ref(false);
const timer = ref(null); // timer component
const timerPause = ref(false);
const timerHistory = ref([]);
const currentSessionIndex = ref(null);
const timerStore = useTimerStore();

onMounted(() => {
  window.addEventListener("mousedown", (event) => {
    if (event.button === 2) {
      // Prawy przycisk myszy
      ipcRenderer.send("right-mouse-down");
    }
  });

  window.addEventListener("mouseup", (event) => {
    if (event.button === 2) {
      // Prawy przycisk myszy
      ipcRenderer.send("right-mouse-up");
    }
  });
  window.addEventListener("mousemove", (event) => {
    if (event.buttons === 2) {
      // Prawy przycisk myszy jest wciśnięty
      ipcRenderer.send("mouse-move", {
        x: event.movementX,
        y: event.movementY,
      });
    }
  });
});

onUnmounted(() => {
  window.removeAllListeners("mousedown");
  window.removeAllListeners("mouseup");
  window.removeAllListeners("mousemove");
});

// Funkcje pomocnicze
const sendBreakNotification = () => {
  if (!timerStore.areNotificationsOn) return;
  window.electron.sendNotification(
    "Minął odliczany czas!",
    "Sugeruje zrobienie sobie krótkiej przerwy, jak tylko wrócisz do pracy automatucznie zaczne odliczać czas ponownie 🥰"
  );

  //notification.onclick = () => {
  // Logika po kliknięciu w powiadomienie
  //};
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

const handlePanelClick = (event) => {
  event.currentTarget.classList.toggle("slide-down");
  console.log("siemson"); // Wywołaj dowolną logikę po kliknięciu
};

const handleInnerElementClick = (event) => {
  event.stopPropagation(); // Zatrzymaj propagację zdarzenia
  console.log("Kliknięto w element wewnątrz panel-wrapper!");
  // Tutaj możesz wywołać inną logikę po kliknięciu
};
</script>

<template>
  <main>
    <div class="timer-wrapper">
      <Timer
        ref="timer"
        @statusChange="handleStatusChange"
        @userStartedWorking="handleUserStaredWorking"
        @sendBreakNotification="sendBreakNotification"
      />
    </div>
    <NotificationsNotifier @click="handleInnerElementClick" />
    <!-- <div class="panel-wrapper" @click="handlePanelClick">
      <ControlButton @click="togglePause" />
      <p>Recent activity</p>
      <div class="panel-info">
        <HistoryComponent
          v-for="(entry, index) in timerHistory"
          :key="index"
          :startTime="entry.startTime"
          :title="entry.status"
          :currentComponentId="index"
          :activeComponentId="currentSessionIndex"
        />
      </div>
    </div> -->
  </main>
</template>
