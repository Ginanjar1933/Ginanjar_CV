import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../constants/theme';

export default function AcademicIdentity({ identitas }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const rows = [
    { label: 'Nama', value: identitas.nama },
    { label: 'NIM', value: identitas.nim },
    { label: 'Mata Kuliah', value: identitas.mataKuliah },
    { label: 'Dosen', value: identitas.dosen },
  ];

  return (
    <View style={styles.wrap}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrap: { gap: spacing.sm },
    row: { flexDirection: 'row', gap: spacing.md },
    label: {
      width: 110,
      fontSize: typography.small,
      color: colors.textMuted,
    },
    value: {
      flex: 1,
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.text,
    },
  });