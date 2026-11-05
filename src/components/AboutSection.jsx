import { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function AboutSection({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        Tentang Saya
      </Text>

      <Text style={styles.body} numberOfLines={expanded ? undefined : 3}>
        {data.deskripsi}
      </Text>

      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
        accessibilityState={{ expanded }}
      >
        <Text style={styles.buttonText}>
          {expanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
        </Text>
      </Pressable>
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
    button: {
      minHeight: 44,
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.primary,
    },
  });