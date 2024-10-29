<script setup>
import { ref, watch, watchEffect, onMounted, onUnmounted } from "vue";
import { useTimerStore } from "@/stores/timerStore";
const { ipcRenderer } = window.api;
import { Vue3Spline } from "vue3-spline";

const inputTime = ref("25:00"); //bylo "25:00"
const userInputTime = ref(1500); // było 1500
const emit = defineEmits(["statusChange, sendBreakNotification"]);
const status = ref("Work");
const timerStore = useTimerStore();
const isCountingDown = ref(false);
const delayBeforeBreak = ref(false);
const splineApp = ref(null);

const handleMouseMove = () => {
  if (
    timerStore.areNotificationsOn &&
    !isCountingDown.value &&
    !timerStore.timerPause
  ) {
    changeStatusToWork();
  }
};

onMounted(() => {
  if (!splineApp.value) {
  } else {
    changeStatusToWork();
  }
  ipcRenderer.on("mouse-move", (mousePosition) => {
    if (!delayBeforeBreak.value) {
      handleMouseMove();
    }
  });
  ipcRenderer.on("timer-tick", (timerValue) => {
    updateTimerDisplay(timerValue);
  });
  ipcRenderer.on("timer-done", () => {
    handleTimerDone();
  });

  watchEffect(() => {
    if (!splineApp.value) {
      return; // Skip if splineApp is not ready
    }

    // Now that splineApp is ready, set up the watch for IsPause variable
    watch(
      () => splineApp.value?.getVariable("IsPause"),
      (newValue) => {
        if (newValue) {
          ipcRenderer.send("pause-timer");
        } else {
          ipcRenderer.send("resume-timer");
        }
      }
    );
  });
});

onUnmounted(() => {
  ipcRenderer.removeAllListeners("mouse-move");
  ipcRenderer.removeAllListeners("timer-tick");
  ipcRenderer.removeAllListeners("timer-done");
});

const handleTimerDone = () => {
  if (status.value === "Work") {
    timerStore.timerPause = true;
    delayBeforeBreak.value = true;
    emit("sendBreakNotification");
    setTimeout(() => {
      delayBeforeBreak.value = false;
      timerStore.timerPause = false;
      changeStatusToBreak();
    }, 10000);
  } else {
    changeStatusToWork();
  }
};

const changeStatusToWork = () => {
  status.value = "Work";
  emit("statusChange", status.value);
  splineApp.value?.setVariable("Status", status.value);
  ipcRenderer.send("start-timer", userInputTime.value);
  isCountingDown.value = true;
};

const changeStatusToBreak = () => {
  isCountingDown.value = false;
  status.value = "Break";
  emit("statusChange", status.value);
  splineApp.value?.setVariable("Status", status.value);
  ipcRenderer.send("start-break");
};

const updateTimerDisplay = (timerValue) => {
  if (splineApp.value) {
    const minutes = Math.floor(timerValue / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timerValue % 60).toString().padStart(2, "0");
    inputTime.value = `${minutes}:${seconds}`;
    splineApp.value?.setVariable("TimerValue", inputTime.value);
  } else {
    console.error("splineApp is not initialized 1");
  }
};
</script>

<template>
  <Vue3Spline
    ref="splineApp"
    :scene="{
      url: 'https://draft.spline.design/zgKB5jfgdpNz2I5O/scene.splinecode',
    }"
  />
</template>
