import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AcademicIdentity from './AcademicIdentity';
import ScoreCard from './ScoreCard';
import ProgressIndicator from './ProgressIndicator';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';
import TechTitle from './TechTitle';

export default function MyScoreSection({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <TechTitle>My Score</TechTitle>

      <AcademicIdentity identitas={data.identitas} />

      <ScoreCard
        nilai={data.currentScore.nilai}
        grade={data.currentScore.grade}
        totalLP={data.learningPoints.total}
      />

      <TechTitle size={18}>Learning Progress</TechTitle>

      {data.progress.map((item) => (
        <ProgressIndicator
          key={item.id}
          label={item.label}
          persen={item.persen}
        />
      ))}

      {data.dummy && (
        <Text style={styles.note}>
          * Data nilai merupakan data dummy untuk keperluan UTS.
        </Text>
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
      gap: spacing.md,
    },
    title: {
      fontSize: typography.heading,
      fontWeight: '700',
      color: colors.text,
    },
    subtitle: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.text,
    },
    note: {
      fontSize: typography.small,
      color: colors.textMuted,
    },
  });