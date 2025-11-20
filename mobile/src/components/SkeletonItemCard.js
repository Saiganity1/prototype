import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme';

export default function SkeletonItemCard({ variant = 'grid' }) {
  return (
    <View style={variant === 'grid' ? styles.cardGrid : styles.card}> 
      <View style={variant === 'grid' ? styles.imageGrid : styles.image} />
      {variant !== 'grid' && (
        <View style={styles.textBlock} />
      )}
      <View style={styles.smallLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, marginVertical: spacing.sm, padding: spacing.sm, ...shadow.card },
  cardGrid: { backgroundColor: colors.surface, borderRadius: radius.md, margin: spacing.sm/2, width: '48%', padding: spacing.xs, ...shadow.card },
  image: { height: 120, backgroundColor: colors.border, borderRadius: radius.sm, marginBottom: spacing.sm },
  imageGrid: { height: 100, backgroundColor: colors.border, borderRadius: radius.sm, marginBottom: spacing.xs },
  textBlock: { height: 16, backgroundColor: colors.border, borderRadius: radius.sm, marginBottom: spacing.xs },
  smallLine: { height: 12, backgroundColor: colors.border, borderRadius: radius.sm, width: '60%' }
});
