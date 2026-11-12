import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function SkillItem({ skill }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${skill.nama}, ${skill.kategori}, level ${skill.level}`}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          name={skill.ikon}
          size={26}
          color={skill.warna ?? colors.primary}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{skill.nama}</Text>
        <Text style={styles.category}>{skill.kategori}</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{skill.level}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { flex: 1 },
    name: {
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.text,
    },
    category: {
      fontSize: typography.small,
      color: colors.textMuted,
    },
    badge: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    badgeText: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.primary,
    },
  });