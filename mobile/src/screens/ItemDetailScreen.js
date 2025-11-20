import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, ScrollView, StyleSheet, Pressable, Modal } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { fetchItem } from '../api/client';
import { colors, spacing, radius } from '../theme';
import { formatDate } from '../utils/format';


export default function ItemDetailScreen({ route }) {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating] = useState(false); // retained for layout consistency (no toggle now)
  const [showImage, setShowImage] = useState(false);
  const [scale, setScale] = useState(1);
  const [focal, setFocal] = useState({ x: 0, y: 0 });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      setScale(e.scale);
      setFocal({ x: e.focalX, y: e.focalY });
    })
    .onEnd(() => {
      // ease back if too small or too large
      setScale(s => Math.min(Math.max(s, 1), 4));
    });

  async function load() {
    setLoading(true);
    try {
      const data = await fetchItem(id);
      // Ensure full image URL if relative
      const image = data.image ? (data.image.startsWith('http') ? data.image : `http://127.0.0.1:8000${data.image}`) : null;
      setItem({ ...data, image });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  // Removed claimed toggle: only backend admin changes claimed state now.

  useEffect(() => { load(); }, [id]);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!item) return <View style={styles.center}><Text>Item not found.</Text></View>;

  const foundDate = formatDate(item.date_found);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.imageHeroWrapper}>
        <Pressable onPress={() => item.image && setShowImage(true)} style={{flex:1}}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.imageHero} />
          ) : (
            <View style={[styles.imageHero, styles.imageFallback]}><Text style={styles.imageFallbackText}>No Image</Text></View>
          )}
        </Pressable>
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle} numberOfLines={2}>{item.name}</Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.categoryChip}><Text style={styles.categoryChipText}>{item.category}</Text></View>
            <View style={[styles.statusChip, item.claimed ? styles.claimed : styles.unclaimed]}>
              <Text style={styles.statusChipText}>{item.claimed ? 'Claimed' : 'Unclaimed'}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identifier</Text>
        <Text style={styles.label}>Unique ID:</Text>
        <Text style={styles.value}>{item.uuid}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.label}>Found Date:</Text>
        <Text style={styles.value}>{foundDate}</Text>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{item.description || 'No description provided.'}</Text>
        <Text style={styles.label}>Posted By:</Text>
        <Text style={styles.value}>{item.user_name}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.value}>Status: <Text style={item.claimed ? styles.inlineClaimed : styles.inlineUnclaimed}>{item.claimed ? 'Claimed' : 'Unclaimed'}</Text></Text>
        <Text style={styles.note}>Only administrators can change claimed status in the backend.</Text>
      </View>
      <Modal visible={showImage} transparent animationType="fade" onRequestClose={() => setShowImage(false)}>
        <View style={styles.fullImageContainer}>
          <Pressable style={styles.fullImageBackdrop} onPress={() => { setShowImage(false); setScale(1); }} />
          {item.image && (
            <GestureDetector gesture={pinch}>
              <Image
                source={{ uri: item.image }}
                style={[styles.fullImage, { transform: [{ scale }] }]}
                resizeMode="contain"
              />
            </GestureDetector>
          )}
          <Pressable style={styles.closeButton} onPress={() => { setShowImage(false); setScale(1); }}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  imageHeroWrapper: { height: 300, position: 'relative', marginBottom: spacing.lg },
  imageHero: { width: '100%', height: '100%' },
  imageFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.border },
  imageFallbackText: { color: colors.textMuted },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroContent: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg },
  heroTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: spacing.sm },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center' },
  categoryChip: { backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, marginRight: spacing.sm },
  categoryChipText: { fontSize: 12, fontWeight: '600', color: colors.text, textTransform: 'capitalize' },
  statusChip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill },
  claimed: { backgroundColor: colors.success },
  unclaimed: { backgroundColor: colors.warning },
  statusChipText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  section: { backgroundColor: colors.surface, marginHorizontal: spacing.md, marginBottom: spacing.lg, padding: spacing.md, borderRadius: radius.md, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.sm, color: colors.text },
  label: { fontSize: 13, fontWeight: '600', marginTop: spacing.sm, color: colors.textMuted },
  value: { fontSize: 14, color: colors.text, marginTop: 2 },
  inlineClaimed: { color: colors.success, fontWeight: '600' },
  inlineUnclaimed: { color: colors.warning, fontWeight: '600' },
  toggleButton: { marginTop: spacing.md, backgroundColor: colors.primary, paddingVertical: spacing.sm, borderRadius: radius.md, alignItems: 'center' },
  toggleButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  note: { marginTop: spacing.sm, fontSize: 12, color: colors.textMuted },
  fullImageContainer: { flex:1, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', padding: spacing.lg },
  fullImageBackdrop: { ...StyleSheet.absoluteFillObject },
  fullImage: { width: '100%', height: '80%' },
  closeButton: { position:'absolute', top: spacing.lg, right: spacing.lg, backgroundColor: colors.overlay, paddingVertical:6, paddingHorizontal:14, borderRadius: radius.pill },
  closeButtonText: { color:'#fff', fontWeight:'600' },
});
