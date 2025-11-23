import { Platform } from 'react-native';
// Allow override via Expo env (e.g. EXPO_PUBLIC_API_BASE_URL) or fallback to local dev
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'; // For production set EXPO_PUBLIC_API_BASE_URL=https://your-service.onrender.com

export async function fetchItems(page = 1) {
  const res = await fetch(`${BASE_URL}/api/items/?page=${page}`);
  if (!res.ok) throw new Error('Failed to load items');
  return await res.json(); // paginated: {count, next, previous, results}
}

export async function fetchItem(id) {
  const res = await fetch(`${BASE_URL}/api/items/${id}/`);
  if (!res.ok) throw new Error('Failed to load item');
  return await res.json();
}

export async function createItem(token, data) {
  const form = new FormData();
  // Primitive fields
  form.append('name', data.name);
  form.append('category', data.category);
  if (data.description) form.append('description', data.description);
  form.append('date_found', data.date_found);
  // Image (if provided)
  if (data.image && data.image.uri) {
    if (Platform.OS === 'web') {
      // Convert to Blob for web fetch compatibility
      const blob = await uriToBlob(data.image.uri);
      form.append('image', blob, data.image.name || 'upload.jpg');
    } else {
      form.append('image', {
        uri: data.image.uri,
        name: data.image.name || 'upload.jpg',
        type: data.image.type || 'image/jpeg'
      });
    }
  }
  const res = await fetch(`${BASE_URL}/api/items/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` },
    body: form,
  });
  if (!res.ok) {
    let detail = await safeRead(res);
    console.log('Item POST failed', res.status, detail);
    throw new Error(detail || `Failed to create item (${res.status})`);
  }
  return await res.json();
}

async function uriToBlob(uri){
  const res = await fetch(uri);
  return await res.blob();
}

async function safeRead(res){
  try {
    const text = await res.text();
    try {
      const js = JSON.parse(text);
      if (js.detail) return js.detail;
      if (typeof js === 'object' && js !== null) {
        // Flatten field errors {field: [msg,...]}
        return Object.entries(js).map(([k,v]) => `${k}: ${Array.isArray(v)? v.join('; '): v}`).join('\n');
      }
      return text;
    } catch { return text; }
  } catch { return ''; }
}

export async function ping() {
  try {
    const res = await fetch(`${BASE_URL}/api/items/`);
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function register(username, password) {
  const res = await fetch(`${BASE_URL}/api/items/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Registration failed');
  return await res.json();
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/api/items/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return await res.json();
}

export async function updateItemClaimed(token, id, claimed) {
  const form = new FormData();
  form.append('claimed', claimed ? 'true' : 'false');
  const res = await fetch(`${BASE_URL}/api/items/${id}/`, {
    method: 'PATCH',
    headers: { 'Authorization': `Token ${token}` },
    body: form,
  });
  if (!res.ok) {
    let detail = await safeRead(res);
    console.log('Claim update failed', res.status, detail);
    throw new Error(detail || `Failed to update claimed (${res.status})`);
  }
  return await res.json();
}
