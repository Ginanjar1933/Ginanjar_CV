import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import Screen from '../../components/Screen';
import ProjectCard from '../../components/ProjectCard';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius, typography } from '../../constants/theme';
import projectsData from '../../../data/projects.json';

const SEMUA = 'Semua';

export default function Portfolio() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(SEMUA);

  const allTags = [SEMUA, ...new Set(projectsData.flatMap((p) => p.tags))];

  const keyword = query.trim().toLowerCase();
  const filtered = projectsData.filter((p) => {
    const cocokTag = activeTag === SEMUA || p.tags.includes(activeTag);
    const cocokKata =
      keyword === '' ||
      p.judul.toLowerCase().includes(keyword) ||
      p.deskripsi.toLowerCase().includes(keyword);
    return cocokTag && cocokKata;
  });

  const resetFilter = () => {
    setQuery('');
    setActiveTag(SEMUA);
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.field}>
        <Text style={styles.label}>Cari proyek</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Ketik judul atau kata kunci"
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <View style={styles.chips}>
        {allTags.map((tag) => {
          const selected = tag === activeTag;
          return (
            <Pressable
              key={tag}
              onPress={() => setActiveTag(tag)}
              style={[styles.chip, selected && styles.chipActive]}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${tag}`}
              accessibilityState={{ selected }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.count}>
        Menampilkan {filtered.length} dari {projectsData.length} proyek
      </Text>
    </View>
  );

  return (
    <Screen title="Portofolio" scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProjectCard project={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Tidak ada proyek yang cocok dengan pencarianmu.
            </Text>
            <Pressable
              onPress={resetFilter}
              style={styles.resetButton}
              accessibilityRole="button"
              accessibilityLabel="Reset pencarian dan filter"
            >
              <Text style={styles.resetText}>Reset filter</Text>
            </Pressable>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    list: { padding: spacing.md },
    separator: { height: spacing.md },
    header: { gap: spacing.md, marginBottom: spacing.md },
    field: { gap: spacing.xs },
    label: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.text,
    },
    input: {
      minHeight: 44,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.body,
      color: colors.text,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    chip: {
      minHeight: 44,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
    },
    chipActive: { backgroundColor: colors.primary },
    chipText: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.primary,
    },
    chipTextActive: { color: colors.background },
    count: {
      fontSize: typography.small,
      color: colors.textMuted,
    },
    empty: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
    },
    emptyText: {
      fontSize: typography.body,
      color: colors.textMuted,
      textAlign: 'center',
    },
    resetButton: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
    },
    resetText: {
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.primary,
    },
  });