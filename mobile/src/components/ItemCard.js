import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { formatDate } from '../utils/format';

export default function ItemCard({ item, onPress, variant = 'list' }) {
  const foundFormatted = formatDate(item.date_found);
  const shortUuid = item.uuid ? String(item.uuid).split('-')[0] : 'N/A';

  return (
    <Pressable
      style={({ pressed }) => [variant === 'grid' ? styles.cardGrid : styles.card, pressed && { opacity: 0.9 }]}
      onPress={() => onPress && onPress(item)}
    >
      <View style={variant === 'grid' ? styles.imageWrapperGrid : styles.imageWrapper}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={variant === 'grid' ? styles.imageGrid : styles.image} />
        ) : (
          <View style={variant === 'grid' ? styles.imagePlaceholderGrid : styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        <View style={variant === 'grid' ? styles.categoryPillGrid : styles.categoryPill}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={variant === 'grid' ? styles.idPillGrid : styles.idPill}>
          <Text style={styles.idText}>#{item.id}</Text>
        </View>
        <View style={[variant === 'grid' ? styles.statusPillGrid : styles.statusPill, item.claimed ? styles.claimed : styles.unclaimed]}>
          <Text style={styles.statusText}>{item.claimed ? 'Claimed' : 'Unclaimed'}</Text>
        </View>
      </View>

      {variant === 'grid' ? (
        <View style={styles.contentGrid}>
          <Text style={styles.titleGrid} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.metaGrid} numberOfLines={1}>Found {foundFormatted}</Text>
          <Text style={styles.metaGridSmall} numberOfLines={1}>UUID {shortUuid}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>Found {foundFormatted}</Text>
          <Text style={styles.metaSmall} numberOfLines={1}>UUID {item.uuid}</Text>
          {item.description ? (
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          ) : (
            <Text style={styles.descMuted}>No description provided.</Text>
          )}
          <Text style={styles.idLine}>ID #{item.id}</Text>
          <Text style={styles.user}>By {item.user_name}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginVertical: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardGrid: {
    backgroundColor: colors.surface,
    margin: spacing.sm / 2,
    borderRadius: radius.md,
    overflow: 'hidden',
    width: '48%',
    ...shadow.card,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
  },
  imageWrapperGrid: {
    position: 'relative',
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGrid: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderGrid: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  categoryPill: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.overlay,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
  },
  categoryPillGrid: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.overlay,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  idPill: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  idPillGrid: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  idText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  statusPill: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  statusPillGrid: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
  },
  claimed: {
    backgroundColor: colors.success,
  },
  unclaimed: {
    backgroundColor: colors.warning,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  contentGrid: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  titleGrid: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  metaSmall: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 6,
  },
  metaGrid: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metaGridSmall: {
    fontSize: 10,
    color: colors.textMuted,
  },
  desc: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  descMuted: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  idLine: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  user: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
});
