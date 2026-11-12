import { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import TechTitle from './TechTitle';
import FoldText from './FoldText';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

const PREVIEW_WORDS = 18;

export default function AboutSection({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [expanded, setExpanded] = useState(false);

  const words = data.deskripsi.split(' ');
  const shown = expanded
    ? data.deskripsi
    : words.slice(0, PREVIEW_WORDS).join(' ') + (words.length > PREVIEW_WORDS ? '…' : '');

  return (
    <View style={styles.card}>
      <TechTitle>Tentang Saya</TechTitle>

      <FoldText
        key={expanded ? 'full' : 'short'}
        text={shown}
        style={styles.body}
        lineHeight={24}
        focusReplay={false}
      />

      {words.length > PREVIEW_WORDS && (
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
      )}
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
    body: {
      fontSize: typography.body,
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