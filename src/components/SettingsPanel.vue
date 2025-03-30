<script setup>
import { ref } from 'vue';
const { ipcRenderer } = window.api;

const timerValue = ref(1500); // Domyślny czas pracy w sekundach (25 minut)
const isTransparent = ref(false); // Domyślnie transparentność wyłączona

// Funkcja do zapisywania nowego czasu
const saveTime = () => {
  const newTime = parseInt(document.getElementById('time-input').value, 10);
  if (!isNaN(newTime) && newTime > 0) {
    timerValue.value = newTime;
    ipcRenderer.send('start-timer', timerValue.value); // Opcjonalnie: uruchom timer od razu
  }
};

// Funkcja do przełączania transparentności
const toggleTransparency = () => {
  isTransparent.value = !isTransparent.value;
  ipcRenderer.send('toggle-transparency');
};
</script>

<template>
    <div class="settings-panel">
    <h2>Settings</h2>
    <!-- <div class="setting">
      <button @click="toggleTransparency">
        {{ isTransparent ? 'Wyłącz transparentność' : 'Włącz transparentność' }}
      </button>
    </div> -->
    <div class="info"> 
        
        <p>
            <span style="font-weight: 600;">A simple timer with break functionality:</span>
            <span style="white-space: pre-line; margin-top: 3px; margin-bottom: 3px;">⌛Counts down a set time (default 25 minutes).</span>
            <span style="white-space: pre-line; margin-top: 3px; margin-bottom: 3px;">📩Sends a notification for a break when the time is up.</span>
            Listens for 5 seconds:
            <ul>
                <li>If you step away, it switches to "Break" mode and waits for your return to restart.</li>
                <li>If you stay, it automatically restarts the countdown.</li>
            </ul>
            Manual pause available via buttons at the top.
        </p>
    </div>
    <div class="setting">
        <div class="time-setting">
            <label for="time-input">Work time:</label>
            <input id="time-input" type="number" :value="timerValue" min="1" />
        </div>
        <button @click="saveTime">Save</button>
    </div>
    <!-- <div class="setting">
        <div class="time-setting">
            <label for="time-input">Dźwięk powiadomienia</label>
            <input id="time-input" type="number" :value="timerValue" min="1" />
        </div>
    </div> -->
    <button class="close-btn" @click="$emit('close')">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="6" y1="6" x2="18" y2="18" stroke="#333" stroke-width="1" stroke-linecap="round"/>
        <line x1="6" y1="18" x2="18" y2="6" stroke="#333" stroke-width="1" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  z-index: 1000;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 500;
  font-family: "Raleway", sans-serif;
  font-optical-sizing: auto;
  line-height: 22px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.settings-panel::-webkit-scrollbar {
  display: none;
}

h2 {
  margin: 10px 0px;
}

.info p {
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
}

.info p ul li::marker {
    color: #d1d0d0;
    font-weight: 600;
    font-size: 16px;
}

.info ul {
    margin-top: 3px;
    margin-bottom: 3px;
    padding-left: 15px;
}

.info,
.setting{
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    color: #4b4b4e;
}

.setting {
  display: flex;
  gap: 10px;
  align-items: center;
    justify-content: space-between;
  width: -webkit-fill-available;
}

.time-setting {
    display: flex;
    gap: 5px;
    align-items: center;
    width: -webkit-fill-available;
}

input {
  padding: 7px;
  font-size: 16px;
  width: 60px;
  border: 2px solid #f5f5f5;
  border-radius: 10px;
  font-size: 14px; 
  font-weight: 500;
  font-family: "Raleway", sans-serif;
  font-optical-sizing: auto;
  line-height: 22px;
  color: #4b4b4e;
  transition: 0.4s ease-in-out;
}

input:focus {
  outline: none;
  border-color: #d1d0d0;
}

button {
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 15px;
  background-color: #88d388;
  border: none;
  color: white;
  font-weight: 600;
  transition: opacity 0.4s ease-in-out;
  font-family: "Raleway", sans-serif;
  font-optical-sizing: auto;
  line-height: 22px;
}

button:hover {
  opacity: 0.8;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
}
</style>