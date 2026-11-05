import { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import ProjectCard from './ProjectCard';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

const SEMUA = 'Semua';

export default function PortfolioSection({ projects }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(SEMUA);

  const allTags = [SEMUA, ...new Set(projects.flatMap((p) => p.tags))];

  const keyword = query.trim().toLowerCase();
  const filtered = projects.filter((p) => {
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

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        Portofolio
      </Text>

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
        Menampilkan {filtered.length} dari {projects.length} proyek
      </Text>

      {filtered.length > 0 ? (
        filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      ) : (
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
    field: { gap: spacing.xs },
    label: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.text,
    },
    input: {
      minHeight: 44,
      backgroundColor: colors.background,
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
      paddingVertical: spacing.md,
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