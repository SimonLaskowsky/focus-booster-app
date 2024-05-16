<script setup>
import { ref, defineExpose, watch } from "vue";
import { onMounted, onUnmounted } from "vue";
import { debounce } from "lodash";

//const timerPause = ref(false);
const timerIsOn = ref(false);
const timerSeconds = ref(10); // 25 min
const inputTime = ref("00:10");
const userInputTime = ref(10000);
const emit = defineEmits([
  "timerIsOnChange",
  "sendBreakNotification",
  "statusChange",
]);
const status = ref("Work");
const breakTime = ref(5);

const props = defineProps({
  areNotificationsOn: Boolean,
  timerPause: Boolean,
});

const localNotificationsOn = ref(props.areNotificationsOn);
const localTimerPause = ref(props.timerPause);

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});

// Watchers
watch(
  () => props.areNotificationsOn,
  (newValue) => {
    if (newValue) localNotificationsOn.value = newValue;
  }
);

watch(
  () => props.timerPause,
  (newValue) => {
    localTimerPause.value = newValue;
    if (!newValue) {
      resumeTimer();
    }
  }
);

//If user moved mouse
const handleMouseMove = () => {
  // Check are notifications on
  if (localNotificationsOn.value) {
    if (status.value === "Break") {
      status.value = "Work";
      emit("statusChange", status.value);
      timerSeconds.value = userInputTime.value;
    } else if (!timerIsOn.value && status.value === "Work") {
      timerIsOn.value = true; // Set timerIsOn to true
      emit("timerIsOnChange", timerIsOn.value); // Emit an event with the new timerIsOn value
      emit("statusChange", status.value); // Emit an event with the new status
      countDown(); // Start the timer
    }
  } else {
    return;
  }
};

const countDown = () => {
  if (status.value === "Work") {
    if (localTimerPause.value || timerSeconds.value <= 0) return;
    timerIsOn.value = true;
    emit("timerIsOnChange", timerIsOn.value);
    setTimeout(() => {
      timerSeconds.value--;
      if (timerSeconds.value <= 0) {
        emit("sendBreakNotification");
        status.value = "Break"; // Change status to "break"
        emit("statusChange", status.value); // Emit an event with the new status
        breakTime.value = 0; // Reset break time
        countDown(); // Start the break timer immediately
      } else {
        countDown();
      }
    }, 1000);
  } else if (status.value === "Break") {
    if (localTimerPause.value || !localNotificationsOn.value) return;
    timerIsOn.value = true;
    emit("timerIsOnChange", timerIsOn.value);
    setTimeout(() => {
      breakTime.value++; // Increase break time
      countDown();
    }, 1000);
  }
};

const resetTimer = (time) => {
  timerIsOn.value = false;
  emit("timerIsOnChange", timerIsOn.value);
  setTimeout(() => {
    timerSeconds.value = time;
    if (status.value === "Break") {
      countDown(); // Start the break counter immediately
    }
  }, 1000);
};

defineExpose({
  countDown,
});

const updateTimerSeconds = (newValue) => {
  const parts = newValue.split(":");
  if (parts.length === 2) {
    const newTime = +parts[0] * 60 + +parts[1];
    if (localTimerPause.value) {
      userInputTime.value = newTime; // Aktualizacja wartości wprowadzonej przez użytkownika
    }
    timerSeconds.value = newTime; // Aktualizacja bieżącego czasu timera
  }
};

watch(inputTime, updateTimerSeconds, { immediate: false });

const debouncedUpdateTimerSeconds = debounce((newValue) => {
  const parts = newValue.split(":");
  if (parts.length === 2) {
    timerSeconds.value = +parts[0] * 60 + +parts[1];
  }
}, 500);

watch(inputTime, debouncedUpdateTimerSeconds);

watch(timerSeconds, (newValue) => {
  if (!localTimerPause.value) {
    const minutes = Math.floor(newValue / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (newValue % 60).toString().padStart(2, "0");
    inputTime.value = `${minutes}:${seconds}`;
  }
});

const pauseTimer = () => {
  localTimerPause.value = true;
};

const resumeTimer = () => {
  localTimerPause.value = false;
  countDown();
};
</script>
<template>
  <input
    type="text"
    class="counter"
    v-model="inputTime"
    pattern="\d{2}:\d{2}"
    @focus="pauseTimer"
    @blur="resumeTimer"
  />
</template>
