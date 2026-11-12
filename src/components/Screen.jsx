import { useMemo } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ThemeToggle from './ThemeToggle';
import TerminalRain from './TerminalRain';
import TechTitle from './TechTitle';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../constants/theme';

export default function Screen({ title, children, scroll = true }) {
  const { isDark, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TerminalRain />

      <View style={styles.topBar}>
        <TechTitle size={28} style={styles.title}>
          {title}
        </TechTitle>
        <ThemeToggle />
      </View>

      {scroll ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.flex}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    title: { flex: 1 },
    container: { padding: spacing.md, gap: spacing.md },
  });