import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TiltCard from './TiltCard';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function ProjectCard({ project }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TiltCard>
      <View
        style={styles.card}
        accessible
        accessibilityLabel={`${project.judul}, tahun ${project.tahun}. ${project.deskripsi}`}
      >
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name={project.ikon} size={24} color={colors.primary} />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{project.judul}</Text>
            <Text style={styles.year}>{project.tahun}</Text>
          </View>
        </View>

        <Text style={styles.desc}>{project.deskripsi}</Text>

        <View style={styles.tags}>
          {project.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TiltCard>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleBox: { flex: 1 },
    title: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.text,
    },
    year: {
      fontSize: typography.small,
      color: colors.textMuted,
    },
    desc: {
      fontSize: typography.body,
      lineHeight: 24,
      color: colors.textMuted,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    tag: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    tagText: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.primary,
    },
  });