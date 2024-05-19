const { app, BrowserWindow, screen, ipcMain } = require("electron/main");
const path = require("node:path");
let win;
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
}, 100); // Sprawdzanie pozycji myszy co 100ms
