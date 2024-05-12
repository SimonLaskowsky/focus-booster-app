<script setup>
const props = defineProps({
  startTime: Date,
});

const formatTime = (time) => {
  if (time instanceof Date) {
    return time.toLocaleTimeString().slice(0, 5);
  }
  return "Invalid Date";
};
</script>
<template>
  <div class="notification">
    <div class="notification-time-wrapper">
      <div class="time-start">{{ formatTime(startTime) }}</div>
      <div class="time-spend">12:23:09</div>
    </div>
    <div class="notification-info-title">Focus time</div>
    <div class="notification-info">Focus time is good, fr</div>
  </div>
</template>
