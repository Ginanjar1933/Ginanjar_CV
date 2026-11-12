import { useEffect, useId, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  useReducedMotion,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

export default function LogoLoop({
  logos,
  speed = 40,
  direction = 'left',
  gap = 12,
  fadeColor,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, gap), [colors, gap]);
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fade = fadeColor ?? colors.surface;

  const base = reduced ? 0 : direction === 'left' ? speed : -speed;
  const baseSV = useSharedValue(base);
  const x = useSharedValue(0);
  const vel = useSharedValue(base);
  const dragging = useSharedValue(false);
  const rowW = useSharedValue(0);

  useEffect(() => {
    baseSV.value = base;
  }, [base, baseSV]);

  // Jalan terus: kecepatan perlahan kembali ke kecepatan dasar
  useFrameCallback((frame) => {
    const w = rowW.value;
    if (dragging.value || w <= 0) return;
    const dt = (frame.timeSincePreviousFrame ?? 16) / 1000;
    vel.value += (baseSV.value - vel.value) * Math.min(1, dt / 0.5);
    x.value = (((x.value + vel.value * dt) % w) + w) % w;
  });

  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-20, 20])
    .onBegin(() => {
      dragging.value = true;
      vel.value = 0;
    })
    .onUpdate((e) => {
      const w = rowW.value;
      if (w > 0) x.value = (((x.value - e.changeX) % w) + w) % w;
      vel.value = Math.max(-1500, Math.min(1500, -e.velocityX));
    })
    .onFinalize(() => {
      dragging.value = false;
    });

  const moveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -x.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        style={styles.wrap}
        accessible
        accessibilityLabel={`Keterampilan: ${logos.map((l) => l.nama).join(', ')}`}
      >
        <Animated.View
          style={[styles.track, moveStyle]}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          {[0, 1, 2].map((copy) => (
            <View
              key={copy}
              style={styles.row}
              onLayout={
                copy === 0
                  ? (e) => {
                      rowW.value = e.nativeEvent.layout.width;
                    }
                  : undefined
              }
            >
              {logos.map((item) => (
                <View key={item.id} style={styles.chip}>
                  <MaterialCommunityIcons
                    name={item.ikon}
                    size={22}
                    color={item.warna ?? colors.primary}
                  />
                  <Text style={styles.text}>{item.nama}</Text>
                </View>
              ))}
            </View>
          ))}
        </Animated.View>

        {/* Tepi memudar */}
        <Svg
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          width="100%"
          height="100%"
        >
          <Defs>
            <LinearGradient id={`l${uid}`} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={fade} stopOpacity="1" />
              <Stop offset="1" stopColor={fade} stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id={`r${uid}`} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={fade} stopOpacity="0" />
              <Stop offset="1" stopColor={fade} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="14%" height="100%" fill={`url(#l${uid})`} />
          <Rect x="86%" y="0" width="14%" height="100%" fill={`url(#r${uid})`} />
        </Svg>
      </View>
    </GestureDetector>
  );
}

const createStyles = (colors, gap) =>
  StyleSheet.create({
    wrap: { overflow: 'hidden', paddingVertical: spacing.xs },
    track: { flexDirection: 'row', width: 6000 },
    row: { flexDirection: 'row', flexShrink: 0 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginRight: gap,
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