<script setup>
import { ref } from "vue";
import { useTimerStore } from "@/stores/timerStore";

const timerStore = useTimerStore();
const buttonControlInfo = ref("pause");
const emit = defineEmits(["click"]);

const handleControlButtonClick = () => {
  if (timerStore.areNotificationsOn) {
    buttonControlInfo.value =
      buttonControlInfo.value === "play" ? "pause" : "play";
    emit("click");
  }
};
</script>
<template>
  <button class="control-button" @click="handleControlButtonClick">
    {{ buttonControlInfo }}
  </button>
</template>
