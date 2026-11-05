import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function SkillMarquee({ skills, speed = 45 }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const reduced = useReducedMotion();
  const x = useSharedValue(0);
  const [rowW, setRowW] = useState(0);

  useEffect(() => {
    if (!rowW || reduced) return;
    x.value = 0;
    x.value = withRepeat(
      withTiming(-rowW, { duration: (rowW / speed) * 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rowW, speed, reduced, x]);

  const moveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const renderRow = (measure) => (
    <View
      style={styles.row}
      onLayout={measure ? (e) => setRowW(e.nativeEvent.layout.width) : undefined}
    >
      {skills.map((s) => (
        <View key={s.id} style={styles.chip}>
          <Ionicons name={s.ikon} size={18} color={colors.primary} />
          <Text style={styles.text}>{s.nama}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`Keterampilan: ${skills.map((s) => s.nama).join(', ')}`}
    >
      <Animated.View style={[styles.track, { width: rowW ? rowW * 2 : 2400 }, moveStyle]}>
        {renderRow(true)}
        {renderRow(false)}
      </Animated.View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrap: {
      overflow: 'hidden',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingVertical: spacing.md,
    },
    track: { flexDirection: 'row' },
    row: { flexDirection: 'row', flexShrink: 0 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginRight: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    text: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.text,
    },
  });