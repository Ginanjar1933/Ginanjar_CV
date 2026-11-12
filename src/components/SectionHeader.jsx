import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TechTitle from './TechTitle';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../constants/theme';

export default function SectionHeader({ title, onPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <TechTitle style={styles.title}>{title}</TechTitle>
      <Pressable
        onPress={onPress}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={`Lihat semua ${title}`}
      >
        <Text style={styles.action}>Lihat semua</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    title: { flex: 1 },
    button: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    action: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.primary,
    },
  });