import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TimelineItem from './TimelineItem';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';
import TechTitle from './TechTitle';

export default function ExperienceSection({ items }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <TechTitle size={20}>Pendidikan & Pengalaman</TechTitle>

      <View>
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
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
      gap: spacing.md,
    },
    title: {
      fontSize: typography.heading,
      fontWeight: '700',
      color: colors.text,
    },
  });