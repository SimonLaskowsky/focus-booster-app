<script setup>
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import Timer from "./components/Timer.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import { useTimerStore } from "@/stores/timerStore";
const { ipcRenderer } = window.api;

const areNotificationsOn = ref(false);
const timer = ref(null);
const timerPause = ref(false);
const timerHistory = ref([]);
const currentSessionIndex = ref(null);
const timerStore = useTimerStore();
const showSettings = ref(false);

const iconColor = ref('#333'); // Domyślny kolor ikon (gdy tło jest nieprzezroczyste)

onMounted(() => {
  window.addEventListener("mousedown", (event) => {
    if (event.button === 2) {
      ipcRenderer.send("right-mouse-down");
    }
  });

  window.addEventListener("mouseup", (event) => {
    if (event.button === 2) {
      ipcRenderer.send("right-mouse-up");
    }
  });

  window.addEventListener("mousemove", (event) => {
    ipcRenderer.send("mouse-move", {
      x: event.movementX,
      y: event.movementY,
    });
  });

  document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });

  document.getElementById('menu-btn').addEventListener('click', (event) => {
    ipcRenderer.send('show-menu', { x: event.x, y: event.y });
  });

  // Nasłuchiwanie na otwarcie ustawień
  ipcRenderer.on('open-settings', () => {
    showSettings.value = true;
  });

  // Nasłuchiwanie na zmianę stanu transparentności
  ipcRenderer.on('transparency-state', (event, isTransparent) => {
    iconColor.value = isTransparent ? 'white' : '#333';
    console.log(isTransparent);
  });
});

onUnmounted(() => {
  window.removeAllListeners("mousedown");
  window.removeAllListeners("mouseup");
  window.removeAllListeners("mousemove");
  ipcRenderer.removeAllListeners('open-settings');
  ipcRenderer.removeAllListeners('transparency-state');
});

// Reszta funkcji bez zmian
const closeSettings = () => {
  showSettings.value = false;
};

const sendBreakNotification = () => {
  if (!timerStore.areNotificationsOn) return;
  window.electron.sendNotification(
    "Minął odliczany czas!",
    "Sugeruje zrobienie sobie krótkiej przerwy, jak tylko wrócisz do pracy automatucznie zaczne odliczać czas ponownie 🥰"
  );
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
      panel.scrollTop = -1000 * currentSessionIndex.value;
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
  event.stopPropagation();
};
</script>

<template>
  <div id="titlebar">
    <button id="menu-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="4" y1="8" x2="20" y2="8" :stroke="iconColor" stroke-width="1" stroke-linecap="round"/>
        <line x1="4" y1="16" x2="16" y2="16" :stroke="iconColor" stroke-width="1" stroke-linecap="round"/>
      </svg>
    </button>
    <button id="close-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="6" y1="6" x2="18" y2="18" :stroke="iconColor" stroke-width="1" stroke-linecap="round"/>
        <line x1="6" y1="18" x2="18" y2="6" :stroke="iconColor" stroke-width="1" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
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
  <SettingsPanel v-if="showSettings" @close="closeSettings" />
</template>