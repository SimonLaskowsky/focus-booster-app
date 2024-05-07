<script setup>
import { ref, defineExpose, watch } from "vue";
import { debounce } from "lodash";

const timerPause = ref(false);
const timerIsOn = ref(false);
const timerSeconds = ref(10); // 25 min
const inputTime = ref("00:10");
const userInputTime = ref(10000);
const emit = defineEmits(["timerIsOnChange", "sendBreakNotification"]);

const props = defineProps({
  areNotificationsOn: Boolean,
});

const localNotificationsOn = ref(props.areNotificationsOn);

const resetTimer = (time) => {
  setTimeout(() => {
    timerSeconds.value = userInputTime.value; // 25 min
    timerIsOn.value = false;
    emit("timerIsOnChange", timerIsOn.value);
  }, time);
};

const countDown = () => {
  if (
    timerPause.value ||
    timerSeconds.value <= 0 ||
    !localNotificationsOn.value
  )
    return;
  timerIsOn.value = true;
  emit("timerIsOnChange", timerIsOn.value);
  setTimeout(() => {
    timerSeconds.value--;
    if (timerSeconds.value <= 0) {
      emit("sendBreakNotification");
      resetTimer(3000); // 30 sec
    } else {
      countDown();
    }
  }, 1000);
};

defineExpose({
  countDown,
});

// Watchers
watch(
  () => props.areNotificationsOn,
  (newValue) => {
    localNotificationsOn.value = newValue;
  }
);

const updateTimerSeconds = (newValue) => {
  const parts = newValue.split(":");
  if (parts.length === 2) {
    const newTime = +parts[0] * 60 + +parts[1];
    if (timerPause.value) {
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
  if (!timerPause.value) {
    const minutes = Math.floor(newValue / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (newValue % 60).toString().padStart(2, "0");
    inputTime.value = `${minutes}:${seconds}`;
  }
});

const pauseTimer = () => {
  timerPause.value = true;
};

const resumeTimer = () => {
  timerPause.value = false;
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
