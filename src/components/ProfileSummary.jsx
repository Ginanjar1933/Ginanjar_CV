import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function ProfileSummary({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        Ringkasan
      </Text>
      <Text style={styles.body} numberOfLines={4}>
        {data.deskripsi}
      </Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    title: {
      fontSize: typography.heading,
      fontWeight: '700',
      color: colors.text,
    },
    body: {
      fontSize: typography.body,
      lineHeight: 24,
      color: colors.textMuted,
    },
  });