import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function CategoryTag({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tag,
        active && styles.tagActive,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: '#fff',
  },
  tagActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  textActive: {
    color: '#fff',
  },
});
