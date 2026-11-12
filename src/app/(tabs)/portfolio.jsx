import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import Screen from '../../components/Screen';
import ProjectCard from '../../components/ProjectCard';
import PortfolioWall from '../../components/PortfolioWall';
import StateView from '../../components/StateView';
import { useTheme } from '../../hooks/useTheme';
import { useProjects } from '../../hooks/useProjects';
import { SEMUA, filterProjects, getAllTags } from '../../utils/filterProjects';
import { spacing, radius, typography } from '../../constants/theme';

function PortfolioNative() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(SEMUA);

  const { projects, loading, error, reload } = useProjects();
  const allTags = getAllTags(projects);
  const filtered = filterProjects(projects, query, activeTag);

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
        Menampilkan {filtered.length} dari {projects.length} proyek
      </Text>
    </View>
  );

  if (loading) {
    return (
      <Screen title="Portofolio" scroll={false}>
        <StateView type="loading" message="Memuat portofolio..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen title="Portofolio" scroll={false}>
        <StateView
          type="error"
          message={error}
          actionLabel="Coba lagi"
          onAction={reload}
        />
      </Screen>
    );
  }

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

// Web  -> Drift Wall (klik gambar untuk detail)
// Android/iOS -> daftar proyek + pencarian/filter seperti sebelumnya
export default function Portfolio() {
  if (Platform.OS === 'web') {
    return (
      <Screen title="Portofolio" scroll={false}>
        <PortfolioWall />
      </Screen>
    );
  }
  return <PortfolioNative />;
}