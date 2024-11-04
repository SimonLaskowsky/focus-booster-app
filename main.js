const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  Notification,
  Tray,
  Menu,
  nativeImage,
} = require("electron/main");

const path = require("node:path");
const sound = require("sound-play");
let win;
let timer;
let timerValue;
let pauseTime;

// Ładujemy dzwięk powiadomienia i ikone przed wszystkimi procesami aby uniknąć delay'u
const soundFilePath = path.join(__dirname, "metal-pipe.mp3");
const iconFilePath = path.join(__dirname, "icon.png");
// Ustawiamy nazwę aplikacji wysyłaną w powiadomieniu
app.setAppUserModelId("Clocky");

console.log("ikona", iconFilePath);

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    resizable: false,
  });

  win.loadFile("dist/index.html");

  win.setOverlayIcon(iconFilePath, "Overlay Icon Description");
}

// app.setUserTasks([]);

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Dodajemy globalny listener dla zdarzeń myszy
// ipcMain.on("right-mouse-down", () => {
//   isRightMouseDown = true;
// });

// ipcMain.on("right-mouse-up", () => {
//   isRightMouseDown = false;
// });

ipcMain.on("mouse-move", (event, { x, y }) => {
  if (win) {
    // Przesuń okno
    const position = win.getPosition();
    // win.setPosition(position[0] + x, position[1] + y);
    // win.setSize(600, 500);
    // win.setBounds({
    //   x: position[0] + x,
    //   y: position[1] + y,
    //   width: 600,
    //   height: 500,
    // });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

let lastMousePosition = { x: null, y: null };
setInterval(() => {
  if (win) {
    let currentMousePosition = screen.getCursorScreenPoint();

    if (
      lastMousePosition.x !== currentMousePosition.x ||
      lastMousePosition.y !== currentMousePosition.y
    ) {
      // Wysyłanie informacji o ruchu myszy do procesu renderowania
      win.webContents.send("mouse-move", currentMousePosition);

      // Aktualizacja ostatniej pozycji myszy
      lastMousePosition = currentMousePosition;
    }
  }
}, 100);

// Ask for notification permission
let notificationsPermissionGranted = true;
ipcMain.on("request-notification-permission", (event) => {
  notificationsPermissionGranted = true;
  event.reply("notification-permission-granted");
});

// Send notification
ipcMain.on("send-notification", (event, title, body) => {
  if (notificationsPermissionGranted) {
    const notification = new Notification({
      title,
      body,
      silent: true,
    });
    sound.play(soundFilePath);
    notification.show();
  }
});

// Timer
ipcMain.on("start-timer", (event, startValue) => {
  timerValue = startValue;
  if (!timer) {
    timer = setInterval(() => {
      timerValue--;
      win.webContents.send("timer-tick", timerValue);
      if (timerValue <= 0) {
        clearInterval(timer);
        timer = null;
        win.webContents.send("timer-done");
      }
    }, 1000);
  }
});

ipcMain.on("stop-timer", () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

ipcMain.on("pause-timer", () => {
  if (timer) {
    // Zapisz pozostały czas timera
    pauseTime = timerValue;
    // Zatrzymaj timer
    clearInterval(timer);
    timer = null;
  }
});

ipcMain.on("resume-timer", () => {
  if (!timer && pauseTime !== undefined) {
    // Ustaw timerValue na pozostały czas
    timerValue = pauseTime;
    // Wznów timer
    timer = setInterval(() => {
      timerValue--;
      win.webContents.send("timer-tick", timerValue);
      if (timerValue <= 0) {
        clearInterval(timer);
        timer = null;
        win.webContents.send("timer-done");
      }
    }, 1000);
  }
});
