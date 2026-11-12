import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import LogoLoop from './LogoLoop';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius } from '../constants/theme';

export default function SkillLoops({ skills }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const mid = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, mid);
  const rowB = skills.slice(mid);

  return (
    <View style={styles.card}>
      <LogoLoop logos={rowA} direction="left" speed={38} />
      {rowB.length > 0 && <LogoLoop logos={rowB} direction="right" speed={30} />}
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
      paddingVertical: spacing.md,
      gap: spacing.sm,
      overflow: 'hidden',
    },
  });