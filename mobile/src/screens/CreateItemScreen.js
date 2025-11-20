import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, Platform, Pressable, StyleSheet, Image } from 'react-native';
import { colors, spacing, radius } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import { createItem, register, login, ping } from '../api/client';
import { saveToken, getToken } from '../storage';

export default function CreateItemScreen({ navigation }) {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [token, setToken] = useState(null);
  const [name, setName] = useState('');
  const categories = ['electronics','documents','clothing','accessories','other'];
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [dateFound, setDateFound] = useState(new Date().toISOString().substring(0,10));
  const [image, setImage] = useState(null);

  async function ensureAuth() {
    if (token) return token;
    const stored = await getToken();
    if (stored) { setToken(stored); return stored; }
    try {
      const reg = await register(username, password); // will fail if exists
      setToken(reg.token); saveToken(reg.token); return reg.token;
    } catch (_) {
      const log = await login(username, password);
      setToken(log.token); saveToken(log.token); return log.token;
    }
  }

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({ uri: asset.uri, name: asset.fileName || 'photo.jpg', type: asset.mimeType || 'image/jpeg' });
    }
  }

  async function submit() {
    if (!image) {
      Alert.alert('Image required', 'Please select an image before posting.');
      return;
    }
    try {
      const t = await ensureAuth();
      const payload = { name, category, description, date_found: dateFound };
      if (image) {
        payload.image = { uri: image.uri, name: image.name, type: image.type };
      }
      console.log('Submitting item payload', payload);
      await createItem(t, payload);
      Alert.alert('Item posted');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async function testConnection() {
    const r = await ping();
    if (r.ok) Alert.alert('API Reachable', `Status ${r.status}`);
    else Alert.alert('API Unreachable', r.error || `Status ${r.status}`);
  }

  return (
    <View style={screenStyles.screen}>
      <Text style={screenStyles.title}>Post Found Item</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={screenStyles.input} />
      <Text style={styles.label}>Category</Text>
      <View style={styles.catRow}>
        {categories.map(c => (
          <Pressable key={c} onPress={() => setCategory(c)} style={[styles.catBtn, category===c && styles.catBtnActive]}>
            <Text style={category===c ? styles.catTextActive : styles.catText}>{c}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline style={[screenStyles.input, screenStyles.textArea]} />
      <TextInput placeholder="Date Found (YYYY-MM-DD)" value={dateFound} onChangeText={setDateFound} style={screenStyles.input} />
      <Pressable style={[screenStyles.imagePicker, !image && screenStyles.imagePickerEmpty]} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={screenStyles.preview} />
        ) : (
          <Text style={screenStyles.imagePlaceholderText}>Tap to select image (required)</Text>
        )}
      </Pressable>
      <Pressable style={[screenStyles.submitButton, !image && screenStyles.submitButtonDisabled]} onPress={submit} disabled={!image}>
        <Text style={screenStyles.submitText}>{image ? 'Submit Item' : 'Image Required'}</Text>
      </Pressable>
      <Pressable style={screenStyles.secondaryButton} onPress={testConnection}>
        <Text style={screenStyles.secondaryText}>Test Connection</Text>
      </Pressable>
      <Text style={screenStyles.helper}>Demo user auto registers/logs in. Image is mandatory.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label:{fontWeight:'600', marginBottom:4},
  catRow:{flexDirection:'row', flexWrap:'wrap', marginBottom:12},
  catBtn:{paddingVertical:6,paddingHorizontal:10,borderRadius:16,borderWidth:1,borderColor:'#888',marginRight:6,marginBottom:6},
  catBtnActive:{backgroundColor:'#007AFF',borderColor:'#007AFF'},
  catText:{color:'#333',fontSize:12},
  catTextActive:{color:'#fff',fontSize:12,fontWeight:'600'}
});

const screenStyles = StyleSheet.create({
  screen: { flex:1, padding: spacing.lg, backgroundColor: colors.background },
  title: { fontSize:22, fontWeight:'700', marginBottom: spacing.md, color: colors.text },
  input: { backgroundColor:'#fff', borderWidth:1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm },
  textArea: { height: 110, textAlignVertical:'top' },
  imagePicker: { height:180, backgroundColor:'#fff', borderWidth:1, borderColor: colors.border, borderRadius: radius.md, alignItems:'center', justifyContent:'center', marginBottom: spacing.md, overflow:'hidden' },
  imagePickerEmpty: { borderColor: colors.warning },
  imagePlaceholderText: { color: colors.textMuted, fontSize: 13 },
  preview: { width:'100%', height:'100%' },
  submitButton: { backgroundColor: colors.primary, paddingVertical: spacing.sm, borderRadius: radius.md, alignItems:'center', marginBottom: spacing.sm },
  submitButtonDisabled: { backgroundColor: colors.warning },
  submitText: { color:'#fff', fontWeight:'600', fontSize:15 },
  secondaryButton: { paddingVertical: spacing.sm, alignItems:'center', borderRadius: radius.md, backgroundColor: colors.surface, borderWidth:1, borderColor: colors.border, marginBottom: spacing.sm },
  secondaryText: { color: colors.text, fontWeight:'500' },
  helper: { marginTop: spacing.sm, fontSize:12, color: colors.textMuted },
});
