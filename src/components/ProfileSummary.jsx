import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import TechTitle from './TechTitle';
import FoldText from './FoldText';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function ProfileSummary({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <TechTitle>Ringkasan</TechTitle>
      <FoldText text={data.deskripsi} style={styles.body} lineHeight={26} />
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
      color: colors.text,
    },
  });