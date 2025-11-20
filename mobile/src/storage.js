import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToken(token) {
  try { await AsyncStorage.setItem('authToken', token); } catch {}
}

export async function getToken() {
  try { return await AsyncStorage.getItem('authToken'); } catch { return null; }
}

export async function clearToken() {
  try { await AsyncStorage.removeItem('authToken'); } catch {}
}
