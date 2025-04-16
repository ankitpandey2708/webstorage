# Web Storage Demo

This interactive web app demonstrates the use of different browser storage mechanisms:
- **Cookies**
- **Local Storage**
- **Session Storage**
- **IndexedDB**
- **Cache (via Service Worker)**

## Usage
1. Open `index.html` in your browser (preferably via a local server for Service Worker support).
2. Use the controls in each section to set, get, or delete data in the corresponding storage type.
3. The Cache section uses the Cache API and requires Service Worker registration (automatic on page load).

## Files
- `index.html`: Main UI
- `main.js`: Logic for all storage types
- `sw.js`: Service Worker for cache demo
- `style.css`: Styling

## Note
- For full functionality (especially Cache/Service Worker), open via `http://localhost` using a local server (e.g., VSCode Live Server, Python's `http.server`, etc.)