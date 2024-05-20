const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  Notification,
} = require("electron/main");

const path = require("node:path");
let win;
let timer;
let timerValue;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadFile("dist/index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
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
      win.webContents.send("mouse-moved", currentMousePosition);

      // Aktualizacja ostatniej pozycji myszy
      lastMousePosition = currentMousePosition;
    }
  }
}, 100);

// Ask for notification permission
let notificationsPermissionGranted = false;
ipcMain.on("request-notification-permission", (event) => {
  notificationsPermissionGranted = true;
  event.reply("notification-permission-granted");
});

// Send notification
ipcMain.on("send-notification", (event, title, body) => {
  if (notificationsPermissionGranted) {
    const notification = new Notification({ title, body });
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
      console.log("timer is going baby", timerValue);
      if (timerValue <= 0) {
        clearInterval(timer);
        timer = null;
        win.webContents.send("timer-done");
        console.log("timer is done baby");
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
