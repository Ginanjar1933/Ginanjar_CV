import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function TimelineItem({ item, isLast }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${item.tipe}: ${item.judul}, ${item.instansi}, ${item.periode}. ${item.deskripsi}`}
    >
      <View style={styles.rail}>
        <View style={styles.dot}>
          <Ionicons name={item.ikon} size={16} color={colors.background} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={[styles.content, !isLast && styles.contentGap]}>
        <Text style={styles.period}>{item.periode}</Text>
        <Text style={styles.title}>{item.judul}</Text>
        <Text style={styles.place}>{item.instansi}</Text>
        <Text style={styles.desc}>{item.deskripsi}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.md },
    rail: { width: 32, alignItems: 'center' },
    dot: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    line: {
      flex: 1,
      width: 2,
      backgroundColor: colors.border,
      marginTop: spacing.xs,
    },
    content: { flex: 1, gap: spacing.xs },
    contentGap: { paddingBottom: spacing.lg },
    period: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.primary,
    },
    title: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.text,
    },
    place: {
      fontSize: typography.small,
      color: colors.textMuted,
    },
    desc: {
      fontSize: typography.body,
      lineHeight: 24,
      color: colors.textMuted,
    },
  });