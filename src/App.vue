<script setup>
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import Timer from "./components/Timer.vue";
import { useTimerStore } from "@/stores/timerStore";
const { ipcRenderer } = window.api;

const areNotificationsOn = ref(false);
const timer = ref(null);
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
    // Prawy przycisk myszy jest wciśnięty
    ipcRenderer.send("mouse-move", {
      x: event.movementX,
      y: event.movementY,
    });
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
};

const handleInnerElementClick = (event) => {
  event.stopPropagation(); // Zatrzymaj propagację zdarzenia
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
  </main>
</template>
