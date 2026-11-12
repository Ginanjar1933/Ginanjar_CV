import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SkillItem from './SkillItem';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';
import TechTitle from './TechTitle';

export default function SkillsSection({ skills }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <TechTitle>Keterampilan</TechTitle>

      {skills.map((skill) => (
        <SkillItem key={skill.id} skill={skill} />
      ))}
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
      gap: spacing.xs,
    },
    title: {
      fontSize: typography.heading,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.xs,
    },
  });