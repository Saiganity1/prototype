import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable, StyleSheet, TextInput } from 'react-native';
import ItemCard from '../components/ItemCard';
import { fetchItems } from '../api/client';
import SkeletonItemCard from '../components/SkeletonItemCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, categories } from '../theme';
import CategoryTag from '../components/CategoryTag';

export default function FeedScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  async function load(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const targetPage = reset ? 1 : page;
      const data = await fetchItems(targetPage);
      const results = data.results || data; // fallback if pagination misconfigured
      const normalized = results.map(i => ({
        ...i,
        image: i.image ? (i.image.startsWith('http') ? i.image : `http://127.0.0.1:8000${i.image}`) : null
      }));
      if (reset) {
        setItems(normalized);
        setPage(1);
      } else {
        setItems(prev => [...prev, ...normalized.filter(n => !prev.some(p => p.id === n.id))]);
      }
      setHasMore(!!data.next);
      if (reset) setHasMore(!!data.next);
    } catch (e) {
      console.warn(e.message);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }

  function refreshAll() {
    setPage(1);
    load(true);
  }

  function loadMore() {
    if (!hasMore || loading) return;
    setPage(p => p + 1);
  }

  useEffect(() => { (async () => {
    // restore category
    try { const savedCat = await AsyncStorage.getItem('activeCategory'); if (savedCat) setActiveCat(savedCat); } catch {}
    load(true);
  })(); }, []);

  useEffect(() => { if (page > 1) load(false); }, [page]);

  useEffect(() => { AsyncStorage.setItem('activeCategory', activeCat).catch(()=>{}); }, [activeCat]);

  const filtered = useMemo(() => {
    let base = items;
    if (activeCat === 'claimed') {
      base = base.filter(i => i.claimed);
    } else if (activeCat !== 'all') {
      base = base.filter(i => i.category === activeCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(i => (i.name && i.name.toLowerCase().includes(q)) || (i.description && i.description.toLowerCase().includes(q)));
    }
    return base;
  }, [items, activeCat, search]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.postButton} onPress={() => navigation.navigate('New Item')}>
          <Text style={styles.postButtonText}>+ Post</Text>
        </Pressable>
      </View>
      <TextInput
        placeholder="Search items..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        returnKeyType="search"
      />
      <View style={styles.filterRow}>
        {categories.map(cat => (
          <CategoryTag
            key={cat.key}
            label={cat.label}
            active={activeCat === cat.key}
            onPress={() => setActiveCat(cat.key)}
          />
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ItemCard variant="grid" item={item} onPress={(it) => navigation.navigate('Item Detail', { id: it.id })} />
        )}
        contentContainerStyle={filtered.length === 0 && !loading ? { flexGrow: 1 } : { paddingBottom: spacing.lg }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshAll} />}
        onEndReachedThreshold={0.3}
  onEndReached={() => { if (!items.length) return; if (hasMore && !loading) loadMore(); }}
        ListEmptyComponent={!loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyBody}>Try another category or post the first item.</Text>
          </View>
        )}
        ListFooterComponent={loading && !initialLoading ? <Text style={styles.loadingMore}>Loading more...</Text> : null}
      />
      {initialLoading && (
        <View style={styles.skeletonOverlay} pointerEvents="none">
          <View style={styles.skeletonRow}>
            <SkeletonItemCard variant="grid" />
            <SkeletonItemCard variant="grid" />
          </View>
          <View style={styles.skeletonRow}>
            <SkeletonItemCard variant="grid" />
            <SkeletonItemCard variant="grid" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: spacing.md },
  postButton: { backgroundColor: colors.primary, paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: 999 },
  postButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  search: { backgroundColor:'#fff', borderWidth:1, borderColor: colors.border, borderRadius:999, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.sm },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  emptyState: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  emptyBody: { fontSize: 14, color: colors.textMuted },
  loadingMore: { textAlign:'center', paddingVertical: spacing.md, color: colors.textMuted },
  skeletonOverlay: { position:'absolute', top: 140, left:0, right:0 },
  skeletonRow: { flexDirection:'row', justifyContent:'space-between' },
});
