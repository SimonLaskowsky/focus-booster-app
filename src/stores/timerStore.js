import { defineStore } from "pinia";

export const useTimerStore = defineStore({
  id: "timer",
  state: () => ({
    timerPause: false,
    areNotificationsOn: false,
  }),
  actions: {
    togglePause() {
      if (this.areNotificationsOn) this.timerPause = !this.timerPause;
    },
    pauseTimer() {
      if (this.areNotificationsOn) this.timerPause = true;
    },
    resumeTimer() {
      if (this.areNotificationsOn) this.timerPause = false;
    },
  },
});
