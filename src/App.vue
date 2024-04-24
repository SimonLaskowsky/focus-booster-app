<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { debounce } from 'lodash';

const mouseHasMoved = ref(false);
const areNotificationsOn = ref(false);
const timerIsOn = ref(false);
const timerSeconds = ref(10); // 25 min
const inputTime = ref('00:10');
const timerPause = ref(false);
const userInputTime = ref(10000)

// Funkcje pomocnicze
const sendBreakNotification = () => {
  if (!areNotificationsOn.value) return;

  const notification = new Notification('Zrób sobie przerwę', {
    body: 'Rozprostuj kości, napij się wody, poodychaj świeżym powietrzem. Jak wrócisz do komputera wznowie odliczanie przed kolejną przerwą :>',
  });

  notification.onclick = () => {
    // Logika po kliknięciu w powiadomienie
  };
};

const resetTimer = (time) => {
  setTimeout(() => {
    timerSeconds.value = userInputTime.value; // 25 min
    timerIsOn.value = false;
  }, time);
};

const countDown = () => {
  if (timerPause.value || timerSeconds.value <= 0) return;

  timerIsOn.value = true;
  setTimeout(() => {
    timerSeconds.value--;
    if (timerSeconds.value <= 0) {
      sendBreakNotification();
      resetTimer(3000); // 30 sec
    } else {
      countDown();
    }
  }, 1000);
};

// Obsługa zdarzeń
const handleMouseMove = () => {
  if (!timerIsOn.value) {
    mouseHasMoved.value = true;
    countDown();
  }
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});

// Watchers
const updateTimerSeconds = (newValue) => {
  const parts = newValue.split(':');
  if (parts.length === 2) {
    const newTime = (+parts[0]) * 60 + (+parts[1]);
    if (timerPause.value) {
      userInputTime.value = newTime; // Aktualizacja wartości wprowadzonej przez użytkownika
    }
    timerSeconds.value = newTime; // Aktualizacja bieżącego czasu timera
  }
};

watch(inputTime, updateTimerSeconds, { immediate: false });

const debouncedUpdateTimerSeconds = debounce((newValue) => {
  const parts = newValue.split(':');
  if (parts.length === 2) {
    timerSeconds.value = (+parts[0]) * 60 + (+parts[1]);
  }
}, 500);

watch(inputTime, debouncedUpdateTimerSeconds);

watch(timerSeconds, (newValue) => {
  if (!timerPause.value) {
    const minutes = Math.floor(newValue / 60).toString().padStart(2, '0');
    const seconds = (newValue % 60).toString().padStart(2, '0');
    inputTime.value = `${minutes}:${seconds}`;
  }
});

// Pozostałe funkcje
const pauseTimer = () => {
  timerPause.value = true;
};

const resumeTimer = () => {
  timerPause.value = false;
  countDown();
};

const askForNotificationsPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        areNotificationsOn.value = true;
      }
    });
  } else {
    alert('Powiadomienia nie są wspierane przez tę przeglądarkę');
  }
};
</script>

<template>
  <main>
    <!-- TODO: Make them components -->
    <!-- Ask for notification component -->
    <div v-if="areNotificationsOn" class="notification-ask">
      Zezwól na powiadomienia, aby Twój asystent koncentracji mógł poinformować 
      Cię o czasie na odpoczynek :>
      <button @click="askForNotificationsPermission">Aktywuj powiadomienia</button>
    </div>
    <!-- Timer component -->
    <input type="text" class="counter" v-model="inputTime" pattern="\d{2}:\d{2}" @focus="pauseTimer" @blur="resumeTimer">
  </main>
</template>