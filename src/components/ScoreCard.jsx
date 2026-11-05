import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function ScoreCard({ nilai, grade, totalLP }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <View
        style={styles.scoreBox}
        accessible
        accessibilityLabel={`Current score ${nilai}, grade ${grade}`}
      >
        <Text style={styles.smallLight}>Current Score</Text>
        <Text style={styles.bigScore}>{nilai}</Text>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeText}>Grade {grade}</Text>
        </View>
      </View>

      <View
        style={styles.lpBox}
        accessible
        accessibilityLabel={`Learning points ${totalLP.toLocaleString('id-ID')} LP`}
      >
        <Text style={styles.small}>Learning Points</Text>
        <Text style={styles.lpValue}>{totalLP.toLocaleString('id-ID')}</Text>
        <Text style={styles.small}>LP</Text>
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.md },
    scoreBox: {
      flex: 3,
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      padding: spacing.md,
      alignItems: 'center',
      gap: spacing.xs,
    },
    smallLight: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.background,
    },
    bigScore: {
      fontSize: 56,
      fontWeight: '800',
      color: colors.background,
    },
    gradeBadge: {
      backgroundColor: colors.background,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    gradeText: {
      fontSize: typography.small,
      fontWeight: '700',
      color: colors.primary,
    },
    lpBox: {
      flex: 2,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    small: {
      fontSize: typography.small,
      color: colors.textMuted,
      textAlign: 'center',
    },
    lpValue: {
      fontSize: typography.title,
      fontWeight: '800',
      color: colors.text,
    },
  });