<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
const props = defineProps({
  startTime: Date,
  title: String,
  currentComponentId: Number,
  activeComponentId: Number,
});

const emits = defineEmits(["new-component-created"]);

const timeSpent = ref(0);
let intervalId = null;
let startTime = ref(null);
let timer = null;
let componentId = ref(null);

onMounted(() => {
  intervalId = setInterval(() => {
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
    }
  }
);

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

emits("new-component-created");
</script>
<template>
  <div class="notification">
    <div class="notification-time-wrapper">
      <div class="time-start">{{ formatTime(startTime) }}</div>
      <div class="time-spend">{{ formatTimeSpent(timeSpent) }}</div>
    </div>
    <div class="notification-info-title">{{ title }}</div>
    <div class="notification-info">Focus time is good, fr</div>
  </div>
</template>
