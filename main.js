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
    // Load existing storage data on page load for visibility
    setTimeout(() => {
        getCookie();
        getLocalStorage();
        getSessionStorage();
        getIndexedDB();
        getCache();
    }, 100); // Small delay for better UX
});

// --- Utility functions for UI states ---
function showLoading(elementId, message = 'Loading...') {
    const element = document.getElementById(elementId);
    element.innerHTML = `<span style="color: var(--color-text-muted);">${message}</span>`;
    element.style.opacity = '0.7';
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    element.style.opacity = '1';
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<span style="color: var(--color-error); font-weight: 500;">⚠ ${message}</span>`;
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<span style="color: var(--color-success); font-weight: 500;">✓ ${message}</span>`;
}

function formatDataList(data, type = 'data') {
    if (!data || data.length === 0) {
        return `<span style="color: var(--color-text-muted); font-style: italic;">No ${type} available</span>`;
    }

    return data.map(item => {
        const key = item.key || item[0] || 'Unknown';
        const value = item.value || item[1] || 'No value';
        return `<div style="margin-bottom: 4px; padding: 4px; background: var(--color-surface); border-radius: 4px;"><strong>${key}:</strong> ${value}</div>`;
    }).join('');
}

// --- Cookies ---
function setCookie() {
    const k = document.getElementById('cookie-key').value.trim();
    const v = document.getElementById('cookie-value').value.trim();

    if (k === '') {
        showError('cookie-result', 'Cookie key cannot be empty');
        return;
    }

    showLoading('cookie-result');
    try {
        document.cookie = `${k}=${v};path=/;max-age=86400`; // 24 hours
        showSuccess('cookie-result', `Cookie set: ${k}=${v}`);
        document.getElementById('cookie-key').value = '';
        document.getElementById('cookie-value').value = '';
    } catch (error) {
        showError('cookie-result', 'Failed to set cookie: ' + error.message);
    }
    hideLoading('cookie-result');
}
function getCookie() {
    const k = document.getElementById('cookie-key').value.trim();
    const cookies = document.cookie.split(';').map(c => c.trim()).filter(c => c);
    const formattedData = [];

    if (k === '') {
        // Get all cookies
        if (cookies.length === 0) {
            document.getElementById('cookie-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">No cookies stored</span>';
            return;
        }

        cookies.forEach(c => {
            const [key, value] = c.split('=');
            formattedData.push({ key, value });
        });

        document.getElementById('cookie-result').innerHTML = `
            <div style="margin-bottom: 8px; font-weight: 500;">All Cookies (${formattedData.length}):</div>
            ${formatDataList(formattedData, 'cookies')}
        `;
    }
}
function deleteCookie() {
    const k = document.getElementById('cookie-key').value.trim();
    showLoading('cookie-result', 'Deleting...');

    setTimeout(() => { // Simulate async operation
        try {
            if (k === '') {
                // Delete all cookies
                const cookies = document.cookie.split(';').map(c => c.trim());
                let deletedCount = 0;
                cookies.forEach(c => {
                    if (c) {
                        const key = c.split('=')[0];
                        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        deletedCount++;
                    }
                });

                if (deletedCount > 0) {
                    showSuccess('cookie-result', `Deleted all ${deletedCount} cookies successfully`);
                    // Reload cookie display
                    setTimeout(() => getCookie(), 200);
                } else {
                    document.getElementById('cookie-result').innerHTML = '<span style="color: var(--color-text-secondary); font-style: italic;">No cookies to delete</span>';
                }

                // Reset form
                document.getElementById('cookie-key').value = '';
                document.getElementById('cookie-value').value = '';
            } else {
                document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                showSuccess('cookie-result', `Deleted cookie: "${k}"`);
                // Reload cookie display
                setTimeout(() => getCookie(), 200);
            }
        } catch (error) {
            showError('cookie-result', 'Failed to delete cookie: ' + error.message);
        }
    }, 100); // Small delay to show loading state
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
    if (localStorage.length === 0) {
        document.getElementById('local-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">No local storage data</span>';
        return;
    }

    const formattedData = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        formattedData.push({ key, value: localStorage.getItem(key) });
    }

    document.getElementById('local-result').innerHTML = `
        <div style="margin-bottom: 8px; font-weight: 500;">Local Storage (${formattedData.length} items):</div>
        ${formatDataList(formattedData, 'local storage items')}
    `;
}
function deleteLocalStorage() {
    const k = document.getElementById('local-key').value;
    if (k === '') {
        localStorage.clear();
        document.getElementById('local-result').innerText = 'Deleted all localStorage items.';
        // Reload display
        setTimeout(() => getLocalStorage(), 200);
    } else {
        localStorage.removeItem(k);
        document.getElementById('local-result').innerText = `Deleted localStorage: ${k}`;
        // Reload display
        setTimeout(() => getLocalStorage(), 200);
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
    if (sessionStorage.length === 0) {
        document.getElementById('session-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">No session storage data</span>';
        return;
    }

    const formattedData = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        formattedData.push({ key, value: sessionStorage.getItem(key) });
    }

    document.getElementById('session-result').innerHTML = `
        <div style="margin-bottom: 8px; font-weight: 500;">Session Storage (${formattedData.length} items):</div>
        ${formatDataList(formattedData, 'session storage items')}
    `;
}
function deleteSessionStorage() {
    const k = document.getElementById('session-key').value;
    if (k === '') {
        sessionStorage.clear();
        document.getElementById('session-result').innerText = 'Deleted all sessionStorage items.';
        // Reload display
        setTimeout(() => getSessionStorage(), 200);
    } else {
        sessionStorage.removeItem(k);
        document.getElementById('session-result').innerText = `Deleted sessionStorage: ${k}`;
        // Reload display
        setTimeout(() => getSessionStorage(), 200);
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
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAllKeys();

        req.onsuccess = async () => {
            const keys = req.result;
            if (!keys || keys.length === 0) {
                document.getElementById('idb-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">No IndexedDB data</span>';
                return;
            }

            const formattedData = [];
            for (const key of keys) {
                const valueReq = store.get(key);
                valueReq.onsuccess = () => {
                    formattedData.push({ key, value: valueReq.result });
                    if (formattedData.length === keys.length) {
                        document.getElementById('idb-result').innerHTML = `
                            <div style="margin-bottom: 8px; font-weight: 500;">IndexedDB (${formattedData.length} items):</div>
                            ${formatDataList(formattedData, 'IndexedDB items')}
                        `;
                    }
                };
            }
        };

        req.onerror = () => {
            document.getElementById('idb-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">IndexedDB not accessible</span>';
        };
    } catch (error) {
        document.getElementById('idb-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">Error loading IndexedDB data</span>';
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
    try {
        const cache = await caches.open('demo-cache');
        const requests = await cache.keys();

        if (!requests || requests.length === 0) {
            document.getElementById('cache-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">No cache data</span>';
            return;
        }

        const formattedData = [];
        for (const req of requests) {
            const response = await cache.match(req);
            if (response) {
                const text = await response.text();
                formattedData.push({ key: req.url, value: text });
            }
        }

        document.getElementById('cache-result').innerHTML = `
            <div style="margin-bottom: 8px; font-weight: 500;">Cache (${formattedData.length} items):</div>
            ${formatDataList(formattedData, 'cached items')}
        `;
    } catch (error) {
        document.getElementById('cache-result').innerHTML = '<span style="color: var(--color-text-muted); font-style: italic;">Error loading cache data</span>';
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

// --- Decision Tree Functions ---
function showStorageChoice(type) {
    const resultDiv = document.getElementById('decision-result');
    const recommendedTypeDiv = document.getElementById('recommended-type');
    const explanationDiv = document.getElementById('decision-explanation');

    const recommendations = {
        'user-auth': {
            type: 'Cookies',
            explanation: 'Cookies are perfect for authentication data that needs to be sent with every HTTP request to your server. They can be configured with secure flags and appropriate expiration times for session management.'
        },
        'user-preferences': {
            type: 'Local Storage',
            explanation: 'User preferences like theme settings, language choices, or UI customizations should persist across browser sessions. Local Storage provides ample space (~5-10MB) and doesn\'t expire unless manually cleared.'
        },
        'form-data': {
            type: 'Session Storage',
            explanation: 'For unsaved form data or temporary UI state, Session Storage is ideal. It automatically clears when the tab is closed, preventing data persistence issues.'
        },
        'complex-data': {
            type: 'IndexedDB',
            explanation: 'For complex data structures requiring querying or storing files/objects, IndexedDB provides a powerful client-side database with transactional support and much larger storage capacity (50MB+).'
        },
        'offline-content': {
            type: 'Cache API',
            explanation: 'When building Progressive Web Apps or applications that need offline functionality, the Cache API (with Service Workers) allows programmatic storage of HTTP requests and responses.'
        },
        'tracking': {
            type: 'Cookies',
            explanation: 'For analytics, tracking, and marketing purposes, cookies are traditionally used. However, consider modern privacy regulations (GDPR, CCPA) and obtain proper user consent before implementation.'
        }
    };

    const recommendation = recommendations[type];
    if (!recommendation) return;

    recommendedTypeDiv.textContent = recommendation.type;
    explanationDiv.textContent = recommendation.explanation;

    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
