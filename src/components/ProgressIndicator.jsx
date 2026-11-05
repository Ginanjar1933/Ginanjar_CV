import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function ProgressIndicator({ label, persen }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: persen }}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{persen}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${persen}%` }]} />
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrap: { gap: spacing.xs },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.text,
    },
    percent: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.primary,
    },
    track: {
      height: 10,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.full,
      backgroundColor: colors.primary,
    },
  });