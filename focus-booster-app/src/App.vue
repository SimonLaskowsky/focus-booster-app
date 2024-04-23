<script setup>
import HelloWorld from './components/HelloWorld.vue';
import { onMounted, onUnmounted, ref } from 'vue';

  const mouseHasMoved = ref(false);
  const areNotificationsOn = ref(false);
  const timerIsOn = ref(false)
  const timerSeconds = ref(1500); //25 min

  //Ask for notifications permission
  const askForNotificationsPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          areNotificationsOn.value = true;
        }
      });
    } else {
      alert('Powiadomienia nie są wspierane przez tę przeglądarkę');
    }
  }

  //Handle mouse movement (activate anytime mouse is moving)
  const handleMouseMove = () => {
    if(!timerIsOn.value){
      mouseHasMoved.value = true;
      countDown()
    }
  }

  //Listen for mouse movement
  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  })

  onUnmounted(() => {
    window.removeEventListener('mouseover', handleMouseMove);
  })

  //Countdown timer
  const countDown = () => {
    timerIsOn.value = true;
    if (timerSeconds.value > 0) {
      setTimeout(() => {
        timerSeconds.value--;
        timerDisplay.value = formatTime(timerSeconds.value);
        countDown();
      }, 1000);
    } else { //Timer stopped due to end of time
      //Send notification about taking the rest
      if (areNotificationsOn) {
      
        const notification = new Notification('Zrób sobie przerwę', {
          body: 'Rozprostuj kości, napij się wody, poodychaj świeżym powietrzem. Jak wrócisz do komputera wznowie odliczanie przed kolejną przerwą :>',
          // Możesz dodać więcej opcji, jak ikona, dźwięk itp.
        });
        // Opcjonalnie, możesz dodać obsługę kliknięcia w powiadomienie
        notification.onclick = () => {
          // Logika, która zostanie wykonana po kliknięciu w powiadomienie
        };
      }
      resetTimer(30000) // 30 sec
    }
  }

  //Resets timer after delay so user have some time to take a break before we start listening on moves
  const resetTimer = (time) => {
    setTimeout(() => {
      timerSeconds.value = 1500 
      timerIsOn.value = false
    }, time)
  }

  //Format our time to MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  };
  //Variable with formated time to show users
  const timerDisplay = ref(formatTime(timerSeconds.value));

</script>

<template>
  <main>
    <div v-if="areNotificationsOn" class="notification-ask">
      <p>
        Zezwól na powiadomienia aby Twój astent koncetracji mógł poinformować 
        Cię o czasie na odpoczynek :>
      </p>
      <button @click="askForNotificationsPermission">Aktywuj powiadomienia</button>
    </div>
    <h1 class="wrapper green">
      {{ timerDisplay }}
    </h1>
    <!-- <HelloWorld  msg="{{ timerCount }}" /> -->
  </main>
</template>

<style scoped>
  .wrapper{
    text-align: center;
  }
</style>
