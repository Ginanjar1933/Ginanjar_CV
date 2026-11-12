import { useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

// type: 'loading' | 'error' | 'empty'
export default function StateView({ type, message, actionLabel, onAction }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      {type === 'loading' && (
        <ActivityIndicator size="large" color={colors.primary} />
      )}
      <Text
        style={[styles.text, type === 'error' && styles.errorText]}
        accessibilityRole={type === 'error' ? 'alert' : undefined}
      >
        {message}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      padding: spacing.lg,
    },
    text: {
      fontSize: typography.body,
      color: colors.textMuted,
      textAlign: 'center',
    },
    errorText: { color: colors.danger },
    button: {
      minHeight: 48,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
    },
    buttonText: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.background,
    },
  });