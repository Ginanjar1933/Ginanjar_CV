import { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import SkillItem from '../../components/SkillItem';
import SkillLoops from '../../components/SkillLoops';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius, typography } from '../../constants/theme';
import skillsData from '../../../data/skills.json';

export default function Skills() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Screen title="Keterampilan" scroll={false}>
      <FlatList
        data={skillsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <SkillItem skill={item} />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <SkillLoops skills={skillsData} />
          </View>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada keterampilan.</Text>
        }
      />
    </Screen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    list: { padding: spacing.md },
    header: { marginBottom: spacing.md },
    separator: { height: spacing.sm },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
    },
    empty: {
      fontSize: typography.body,
      color: colors.textMuted,
      textAlign: 'center',
      padding: spacing.lg,
    },
  });