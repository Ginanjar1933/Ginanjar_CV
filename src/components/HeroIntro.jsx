import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DecryptedText from './DecryptedText';
import TypeText from './TypeText';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../constants/theme';

export default function HeroIntro({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.hello}>Halo, saya</Text>
      <DecryptedText text={data.nama} style={styles.name} />
      <View style={styles.row}>
        <Text style={styles.prompt}>{'> '}</Text>
        <TypeText phrases={data.peran} style={styles.role} />
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrap: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
    hello: { fontSize: typography.body, color: colors.textMuted },
    name: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    prompt: { fontSize: typography.body, color: colors.primary, fontWeight: '700' },
    role: { fontSize: typography.body, color: colors.primary, fontWeight: '600' },
  });