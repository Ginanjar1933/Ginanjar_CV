import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import CountUp from './CountUp';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function ProgressIndicator({ label, persen }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(persen, {
      duration: 1100,
      easing: Easing.out(Easing.cubic),
    });
  }, [persen, fill]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value}%` }));

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: persen }}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <CountUp
          to={persen}
          duration={1100}
          format={(n) => `${n}%`}
          style={styles.percent}
        />
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrap: { gap: spacing.xs },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.text,
    },
    percent: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.primary,
    },
    track: {
      height: 10,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.full,
      backgroundColor: colors.primary,
    },
  });