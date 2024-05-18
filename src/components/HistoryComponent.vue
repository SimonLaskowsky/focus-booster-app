<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useTimerStore } from "@/stores/timerStore";
const props = defineProps({
  startTime: Date,
  title: String,
  currentComponentId: Number,
  activeComponentId: Number,
});
const timerStore = useTimerStore();
const timeSpent = ref(0);
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    if (timerStore.timerPause) return;
    timeSpent.value += 1;
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

watch(
  () => props.activeComponentId,
  (newVal) => {
    if (props.currentComponentId !== newVal) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
);

const formatTime = (time) => {
  if (time instanceof Date && !isNaN(time)) {
    return time.toLocaleTimeString().slice(0, 5);
  }
  return "Invalid Date";
};

const formatTimeSpent = (timeDiff) => {
  let hours = Math.floor(timeDiff / 3600)
    .toString()
    .padStart(2, "0");
  let minutes = Math.floor((timeDiff % 3600) / 60)
    .toString()
    .padStart(2, "0");
  let seconds = (timeDiff % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
</script>
<template>
  <div class="notification">
    <div class="notification-time-wrapper">
      <div class="time-start">{{ formatTime(props.startTime) }}</div>
      <div class="time-spend">{{ formatTimeSpent(timeSpent) }}</div>
    </div>
    <div class="notification-info-title">{{ title }}</div>
    <div class="notification-info">Focus time is good, fr</div>
  </div>
</template>
