// --- Reset input fields on page load ---
window.addEventListener('DOMContentLoaded', () => {
    [
        'cookie-key', 'cookie-value',
        'local-key', 'local-value',
        'session-key', 'session-value',
        'idb-key', 'idb-value',
        'cache-key', 'cache-value'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    // Call all get* functions to display all storage values on load
    getCookie();
    getLocalStorage();
    getSessionStorage();
    getIndexedDB();
    getCache();
});

// --- Cookies ---
function setCookie() {
    const k = document.getElementById('cookie-key').value;
    const v = document.getElementById('cookie-value').value;
    if (k === '') {
        document.getElementById('cookie-result').innerText = 'key cant be empty';
        return;
    }
    document.cookie = `${k}=${v};path=/;`;
    document.getElementById('cookie-result').innerText = `Set cookie: ${k}=${v}`;
}
function getCookie() {
    const k = document.getElementById('cookie-key').value;
    const cookies = document.cookie.split(';').map(c => c.trim());
    if (k === '') {
        // Get all cookies
        if (cookies.length === 1 && cookies[0] === '') {
            document.getElementById('cookie-result').innerText = 'No items found.';
            return;
        }
        let result = 'All Cookies:\n';
        cookies.forEach(c => {
            const [key, value] = c.split('=');
            result += `${key}: ${value}\n`;
        });
        document.getElementById('cookie-result').innerText = result;
    } else {
        const found = cookies.find(c => c.startsWith(k + '='));
        document.getElementById('cookie-result').innerText = found ? `Value: ${found.split('=')[1]}` : 'Not found.';
    }
}
function deleteCookie() {
    const k = document.getElementById('cookie-key').value;
    if (k === '') {
        // Delete all cookies
        const cookies = document.cookie.split(';').map(c => c.trim());
        cookies.forEach(c => {
            const key = c.split('=')[0];
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        document.getElementById('cookie-result').innerText = 'Deleted all cookies.';
    } else {
        document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.getElementById('cookie-result').innerText = `Deleted cookie: ${k}`;
    }
}
// --- Local Storage ---
function setLocalStorage() {
    const k = document.getElementById('local-key').value;
    const v = document.getElementById('local-value').value;
    if (k === '') {
        document.getElementById('local-result').innerText = 'key cant be empty';
        return;
    }
    localStorage.setItem(k, v);
    document.getElementById('local-result').innerText = `Set localStorage: ${k}=${v}`;
}
function getLocalStorage() {
    const k = document.getElementById('local-key').value;
    if (k === '') {
        if (localStorage.length === 0) {
            document.getElementById('local-result').innerText = 'No items found.';
            return;
        }
        let result = 'All Local Storage:\n';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            result += `${key}: ${localStorage.getItem(key)}\n`;
        }
        document.getElementById('local-result').innerText = result;
    } else {
        const v = localStorage.getItem(k);
        document.getElementById('local-result').innerText = v ? `Value: ${v}` : 'Not found.';
    }
}
function deleteLocalStorage() {
    const k = document.getElementById('local-key').value;
    if (k === '') {
        localStorage.clear();
        document.getElementById('local-result').innerText = 'Deleted all localStorage items.';
    } else {
        localStorage.removeItem(k);
        document.getElementById('local-result').innerText = `Deleted localStorage: ${k}`;
    }
}
// --- Session Storage ---
function setSessionStorage() {
    const k = document.getElementById('session-key').value;
    const v = document.getElementById('session-value').value;
    if (k === '') {
        document.getElementById('session-result').innerText = 'key cant be empty';
        return;
    }
    sessionStorage.setItem(k, v);
    document.getElementById('session-result').innerText = `Set sessionStorage: ${k}=${v}`;
}
function getSessionStorage() {
    const k = document.getElementById('session-key').value;
    if (k === '') {
        if (sessionStorage.length === 0) {
            document.getElementById('session-result').innerText = 'No items found.';
            return;
        }
        let result = 'All Session Storage:\n';
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            result += `${key}: ${sessionStorage.getItem(key)}\n`;
        }
        document.getElementById('session-result').innerText = result;
    } else {
        const v = sessionStorage.getItem(k);
        document.getElementById('session-result').innerText = v ? `Value: ${v}` : 'Not found.';
    }
}
function deleteSessionStorage() {
    const k = document.getElementById('session-key').value;
    if (k === '') {
        sessionStorage.clear();
        document.getElementById('session-result').innerText = 'Deleted all sessionStorage items.';
    } else {
        sessionStorage.removeItem(k);
        document.getElementById('session-result').innerText = `Deleted sessionStorage: ${k}`;
    }
}
// --- IndexedDB ---
const DB_NAME = 'DemoDB';
const STORE_NAME = 'KeyValueStore';
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
async function setIndexedDB() {
    const k = document.getElementById('idb-key').value;
    const v = document.getElementById('idb-value').value;
    if (k === '') {
        document.getElementById('idb-result').innerText = 'key cant be empty';
        return;
    }
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(v, k);
    tx.oncomplete = () => document.getElementById('idb-result').innerText = `Set IndexedDB: ${k}=${v}`;
    tx.onerror = () => document.getElementById('idb-result').innerText = 'Error setting value';
}
async function getIndexedDB() {
    const k = document.getElementById('idb-key').value;
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    if (k === '') {
        // Get all keys and values
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAllKeys();
        req.onsuccess = () => {
            const keys = req.result;
            if (!keys || keys.length === 0) {
                document.getElementById('idb-result').innerText = 'No items found.';
                return;
            }
            let result = 'All IndexedDB:\n';
            let pending = keys.length;
            keys.forEach(key => {
                const valueReq = store.get(key);
                valueReq.onsuccess = () => {
                    result += `${key}: ${valueReq.result}\n`;
                    pending--;
                    if (pending === 0) {
                        document.getElementById('idb-result').innerText = result;
                    }
                };
                valueReq.onerror = () => {
                    result += `${key}: [Error reading value]\n`;
                    pending--;
                    if (pending === 0) {
                        document.getElementById('idb-result').innerText = result;
                    }
                };
            });
        };
        req.onerror = () => document.getElementById('idb-result').innerText = 'Error getting all values';
    } else {
        const req = tx.objectStore(STORE_NAME).get(k);
        req.onsuccess = () => document.getElementById('idb-result').innerText = req.result ? `Value: ${req.result}` : 'Not found.';
        req.onerror = () => document.getElementById('idb-result').innerText = 'Error getting value';
    }
}
async function deleteIndexedDB() {
    const k = document.getElementById('idb-key').value;
    if (k === '') {
        // Delete the entire database directly
        const dbDeleteReq = indexedDB.deleteDatabase(DB_NAME);
        dbDeleteReq.onsuccess = () => {
            document.getElementById('idb-result').innerText = 'Deleted all IndexedDB items and database.';
        };
        dbDeleteReq.onerror = () => {
            document.getElementById('idb-result').innerText = 'Error deleting database.';
        };
    } else {
        // Delete a single key as before
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(k);
        tx.oncomplete = () => document.getElementById('idb-result').innerText = `Deleted IndexedDB: ${k}`;
        tx.onerror = () => document.getElementById('idb-result').innerText = 'Error deleting value';
    }
}
// --- Cache (Service Worker) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}
async function setCache() {
    const k = document.getElementById('cache-key').value;
    const v = document.getElementById('cache-value').value;
    if (k === '') {
        document.getElementById('cache-result').innerText = 'key cant be empty';
        return;
    }
    const cache = await caches.open('demo-cache');
    const response = new Response(v);
    await cache.put(k, response);
    document.getElementById('cache-result').innerText = `Cached: ${k}`;
}
async function getCache() {
    const k = document.getElementById('cache-key').value;
    const cache = await caches.open('demo-cache');
    if (k === '') {
        const requests = await cache.keys();
        if (!requests || requests.length === 0) {
            document.getElementById('cache-result').innerText = 'No items found.';
            return;
        }
        let result = 'All Cache:\n';
        for (const req of requests) {
            const response = await cache.match(req);
            const text = await response.text();
            result += `${req.url}: ${text}\n`;
        }
        document.getElementById('cache-result').innerText = result;
    } else {
        const response = await cache.match(k);
        if (response) {
            const text = await response.text();
            document.getElementById('cache-result').innerText = `Value: ${text}`;
        } else {
            document.getElementById('cache-result').innerText = 'Not found.';
        }
    }
}
async function deleteCache() {
    const k = document.getElementById('cache-key').value;
    const cache = await caches.open('demo-cache');
    if (k === '') {
        const requests = await cache.keys();
        if (!requests || requests.length === 0) {
            document.getElementById('cache-result').innerText = 'No cached items to delete.';
            return;
        }
        for (const req of requests) {
            await cache.delete(req);
        }
        document.getElementById('cache-result').innerText = 'Deleted all cached items.';
    } else {
        await cache.delete(k);
        document.getElementById('cache-result').innerText = `Deleted from cache: ${k}`;
    }
}
// --- Check Size Functions ---
function checkCookieSize() {
    const cookies = document.cookie;
    const size = new Blob([cookies]).size / 1024;
    document.getElementById('cookie-result').innerText = `Total size: ${size.toFixed(2)} KB`;
}
function checkLocalStorageSize() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        total += new Blob([key + value]).size;
    }
    document.getElementById('local-result').innerText = `Total size: ${(total / 1024).toFixed(2)} KB`;
}
function checkSessionStorageSize() {
    let total = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        total += new Blob([key + value]).size;
    }
    document.getElementById('session-result').innerText = `Total size: ${(total / 1024).toFixed(2)} KB`;
}
async function checkIndexedDBSize() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAllKeys();
    req.onsuccess = async () => {
        const keys = req.result;
        let total = 0;
        for (const key of keys) {
            const valueReq = store.get(key);
            await new Promise(res => {
                valueReq.onsuccess = () => {
                    const value = valueReq.result;
                    total += new Blob([String(key) + String(value)]).size;
                    res();
                };
            });
        }
        document.getElementById('idb-result').innerText = `Total size: ${(total / 1024).toFixed(2)} KB`;
    };
    req.onerror = () => document.getElementById('idb-result').innerText = 'Error calculating size';
}
async function checkCacheSize() {
    const cache = await caches.open('demo-cache');
    const requests = await cache.keys();
    let total = 0;
    for (const req of requests) {
        const response = await cache.match(req);
        const text = await response.text();
        total += new Blob([req.url + text]).size;
    }
    document.getElementById('cache-result').innerText = `Total size: ${(total / 1024).toFixed(2)} KB`;
}
