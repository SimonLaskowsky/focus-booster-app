<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { debounce, delay, set } from "lodash";
import { useTimerStore } from "@/stores/timerStore";

const timerSeconds = ref(0);
const inputTime = ref("25:00");
const userInputTime = ref(1500);
const emit = defineEmits(["statusChange"]);
const status = ref("Work");
const breakTime = ref(5);
const timerStore = useTimerStore();
const isCountingDown = ref(false);
const delayBeforeBreak = ref(false);

const handleMouseMove = () => {
  // If user has notifications enabled and timer isnt already counting and also there is no pause
  if (
    timerStore.areNotificationsOn &&
    !isCountingDown.value &&
    !timerStore.timerPause
  ) {
    changeStatusToWork();
    countDown();
  }
};

onMounted(() => {
  // If delayBeforeBreak is true we dont want to listen
  if (!delayBeforeBreak.value) {
    window.addEventListener("mousemove", handleMouseMove);
  }
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});

// Watch for changes in timerPause
// watch(
//   () => timerStore.timerPause,
//   (newValue) => {
//     if (!newValue) {
//       resumeTimer();
//     }
//   }
// );

// Helper functions
const changeStatusToWork = () => {
  status.value = "Work";
  emit("statusChange", status.value);
  timerSeconds.value = userInputTime.value;
};

// Countdown logic
const countDown = () => {
  // If timer is paused, do nothing
  if (timerStore.timerPause) {
    isCountingDown.value = false; // Add this line
    return;
  }
  // Counter is going flag
  isCountingDown.value = true;

  // If status is work and timer is going
  if (status.value === "Work" && timerSeconds.value > 0) {
    setTimeout(() => {
      //check if timer is paused
      if (timerStore.timerPause) {
        isCountingDown.value = false;
        return;
      }
      timerSeconds.value--;
      countDown();
    }, 1000);
    // If status is break and timer is going
  } else if (status.value === "Break" && timerSeconds.value > 0) {
    setTimeout(() => {
      changeStatusToWork();
      breakTime.value++;
      countDown();
    }, 1000);
    // If status is break and timer is done
  } else if (status.value === "Break" && timerSeconds.value === 0) {
    changeStatusToWork();
    countDown();
  } else {
    //dobra ogar:
    //timer wlasnie osiagnal 0 ale zanim damy break
    //czekamy 5 sekund i jezeli po 5 sekundach jest ruch to work a jak still brak to break
    // If status is work and timer is done
    isCountingDown.value = false;
    timerStore.timerPause = true;
    delayBeforeBreak.value = true;
    setTimeout(() => {
      delayBeforeBreak.value = false;
      timerStore.timerPause = false;
      changeStatusToBreak();
    }, 5000);
  }
};

const changeStatusToBreak = () => {
  isCountingDown.value = false;
  status.value = "Break";
  emit("statusChange", status.value);
  breakTime.value = 0;
};

// Update timer seconds based on input
const updateTimerSeconds = (newValue) => {
  const parts = newValue.split(":");
  if (parts.length === 2) {
    const newTime = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    timerSeconds.value = newTime;
  }
};

watch(inputTime, updateTimerSeconds);

// Watch for timerSeconds changes
watch(timerSeconds, (newValue) => {
  const minutes = Math.floor(newValue / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (newValue % 60).toString().padStart(2, "0");
  inputTime.value = `${minutes}:${seconds}`;
});

// Resume timer function
const resumeTimer = () => {
  if (timerStore.areNotificationsOn) {
    timerStore.timerPause = false;
    countDown();
  }
};
</script>

<template>
  <input
    type="text"
    class="counter"
    v-model="inputTime"
    pattern="\d{2}:\d{2}"
    @focus="timerStore.pauseTimer"
    @blur="resumeTimer"
  />
</template>
