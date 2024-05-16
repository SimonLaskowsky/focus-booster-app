<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
const props = defineProps({
  startTime: Date,
  title: String,
  currentComponentId: Number,
});

let startTime = ref(null);
let timeSpent = ref("00:00:00");
let timer = null;
let componentId = ref(null);

const formatTime = (time) => {
  if (time instanceof Date) {
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

watch(
  () => props.currentComponentId,
  (newVal, oldVal) => {
    if (oldVal !== null) {
      clearInterval(timer);
    }
    startTime.value = new Date();
    componentId.value = newVal;
    timer = setInterval(() => {
      let now = new Date();
      let timeDiff = Math.floor((now - startTime.value) / 1000); // convert to seconds
      timeSpent.value = formatTimeSpent(timeDiff);
    }, 1000);
  }
);

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
<template>
  <div class="notification">
    <div class="notification-time-wrapper">
      <div class="time-start">{{ formatTime(startTime) }}</div>
      <div class="time-spend">{{ timeSpent }}</div>
    </div>
    <div class="notification-info-title">{{ title }}</div>
    <div class="notification-info">Focus time is good, fr</div>
  </div>
</template>
