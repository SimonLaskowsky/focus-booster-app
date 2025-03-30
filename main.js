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
let isTransparent = false;

const soundFilePath = path.join(__dirname, "metal-pipe.mp3");
const iconFilePath = path.join(__dirname, "icon.png");
app.setAppUserModelId("Clocky");

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    transparent: isTransparent,
    frame: false,
    resizable: false,
  });

  win.loadFile("dist/index.html");
  win.setOverlayIcon(iconFilePath, "Overlay Icon Description");
  win.webContents.openDevTools();

  // Wysyłaj stan transparentności po załadowaniu strony
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('transparency-state', isTransparent);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("mouse-move", (event, { x, y }) => {
  if (win) {
    const position = win.getPosition();
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
      win.webContents.send("mouse-move", currentMousePosition);
      lastMousePosition = currentMousePosition;
    }
  }
}, 100);

let notificationsPermissionGranted = true;
ipcMain.on("request-notification-permission", (event) => {
  notificationsPermissionGranted = true;
  event.reply("notification-permission-granted");
});

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
    pauseTime = timerValue;
    clearInterval(timer);
    timer = null;
  }
});

ipcMain.on("resume-timer", () => {
  if (!timer && pauseTime !== undefined) {
    timerValue = pauseTime;
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

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  win.minimize();
});

// Poprawione menu - brak popupu, od razu otwiera ustawienia
ipcMain.on('show-menu', () => {
  win.webContents.send('open-settings'); // Bezpośrednie wywołanie ustawień
});

ipcMain.on('toggle-transparency', () => {
  isTransparent = !isTransparent;
  win.close();
  createWindow();
});