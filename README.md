# Gemini Chat Bulk Deleter / Eliminador Masivo de Chats de Gemini

[Spanish](#español) | [English](#english)

---

## Español

### ⚠️ ¿Por qué este script?
A veces, la opción oficial de "Eliminar actividad" en Google no funciona correctamente o tarda demasiado en reflejar los cambios. Este script automatiza el proceso manual, simulando clics para borrar cada conversación una por una directamente desde la interfaz de Gemini.

### 🚀 Instrucciones de uso
1. Abre **Google Gemini** en tu navegador (Recomendado: **Chrome**).
2. Asegúrate de estar en la barra lateral donde aparecen tus chats antiguos.
3. Presiona `F12` o clic derecho > **Inspeccionar** y ve a la pestaña **Consola (Console)**.
4. Pega el código del archivo `eliminar_chats.js` de este repositorio.
5. Presiona `Enter` y observa el progreso en la consola.

**Nota:** El script tiene un límite de seguridad de 500 chats, pero puedes ejecutarlo las veces que necesites.

---

## English

### ⚠️ Why this script?
Sometimes, Google's official "Delete Activity" option doesn't work properly or takes too long to sync. This script automates the manual process by simulating clicks to delete each conversation one by one directly from the Gemini interface.

### 🚀 How to use
1. Open **Google Gemini** in your browser (Recommended: **Chrome**).
2. Make sure you are on the main page where your chat history is visible.
3. Press `F12` or right-click > **Inspect** and go to the **Console** tab.
4. Paste the code from the `eliminar_chats.js` file found in this repository.
5. Press `Enter` and watch the progress in the console.

**Note:** The script has a safety limit of 500 chats, but you can run it as many times as you need.

---

### 🛠 Technical Details / Detalles Técnicos
- **Language:** JavaScript
- **Safety:** Includes "sleep" functions to avoid being blocked by Google. / Incluye funciones de espera para evitar bloqueos.
- **Improved V2:** Automatically scrolls to load more chats. / Hace scroll automático para cargar más chats.
