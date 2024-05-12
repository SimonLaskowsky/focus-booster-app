<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  areNotificationsOn: Boolean,
});

const localAreNotificationsOn = ref(props.areNotificationsOn);

watch(
  () => props.areNotificationsOn,
  (newValue) => {
    localAreNotificationsOn.value = newValue;
  }
);

const buttonControlInfo = ref("pause");
const emit = defineEmits(["click"]);

const handleControlButtonClick = () => {
  if (localAreNotificationsOn.value) {
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
