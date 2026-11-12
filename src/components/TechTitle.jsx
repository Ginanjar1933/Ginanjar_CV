import { useEffect, useId, useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  Mask,
  Rect,
  Circle,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  withDelay,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TechTitle({ children, size = 22, style }) {
  const { colors } = useTheme();
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const label = String(children);

  const [w, setW] = useState(0);
  const H = Math.round(size * 1.5);
  const R = size * 3.2; // radius lensa

  const width = useSharedValue(0);
  const sweep = useSharedValue(1); // 1 = lensa parkir di luar kanan
  const touch = useSharedValue(0);
  const touchX = useSharedValue(0);

  useEffect(() => {
    width.value = w;
    if (!w || reduced) return;
    sweep.value = 0;
    sweep.value = withDelay(
      350,
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.cubic) })
    );
  }, [w, reduced, width, sweep]);

  const mix = useDerivedValue(() => withTiming(touch.value, { duration: 140 }));

  const cx = useDerivedValue(() => {
    const idle = sweep.value * (width.value + R * 2) - R;
    return idle * (1 - mix.value) + touchX.value * mix.value;
  });

  const lensProps = useAnimatedProps(() => ({ cx: cx.value }));

  const hold = Gesture.Tap()
    .maxDuration(60000)
    .onBegin((e) => {
      touchX.value = e.x;
      touch.value = 1;
    })
    .onFinalize(() => {
      touch.value = 0;
    });

  const baseline = size * 1.1;

  return (
    <GestureDetector gesture={hold}>
      <View
        style={[{ height: H }, style]}
        onLayout={(e) => setW(Math.round(e.nativeEvent.layout.width))}
        accessible
        accessibilityRole="header"
        accessibilityLabel={label}
      >
        {w > 0 && (
          <Svg width={w} height={H}>
            <Defs>
              <RadialGradient id={`w${uid}`}>
                <Stop offset="0" stopColor="#fff" stopOpacity="1" />
                <Stop offset="0.55" stopColor="#fff" stopOpacity="1" />
                <Stop offset="1" stopColor="#fff" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id={`k${uid}`}>
                <Stop offset="0" stopColor="#000" stopOpacity="1" />
                <Stop offset="0.55" stopColor="#000" stopOpacity="1" />
                <Stop offset="1" stopColor="#000" stopOpacity="0" />
              </RadialGradient>

              {/* Mask A: hanya di dalam lensa (untuk garis putus-putus) */}
              <Mask id={`a${uid}`} x="0" y="0" width={w} height={H} maskUnits="userSpaceOnUse">
                <AnimatedCircle animatedProps={lensProps} cy={H / 2} r={R} fill={`url(#w${uid})`} />
              </Mask>

              {/* Mask B: kebalikan, di luar lensa (untuk huruf solid) */}
              <Mask id={`b${uid}`} x="0" y="0" width={w} height={H} maskUnits="userSpaceOnUse">
                <Rect x="0" y="0" width={w} height={H} fill="#fff" />
                <AnimatedCircle animatedProps={lensProps} cy={H / 2} r={R} fill={`url(#k${uid})`} />
              </Mask>
            </Defs>

            {/* Huruf solid */}
            <SvgText
              x={1}
              y={baseline}
              fontSize={size}
              fontWeight="bold"
              fill={colors.text}
              mask={`url(#b${uid})`}
            >
              {label}
            </SvgText>

            {/* Garis putus-putus (outline) */}
            <SvgText
              x={1}
              y={baseline}
              fontSize={size}
              fontWeight="bold"
              fill="none"
              stroke={colors.primary}
              strokeWidth={1.2}
              strokeDasharray="4 2"
              mask={`url(#a${uid})`}
            >
              {label}
            </SvgText>
          </Svg>
        )}
      </View>
    </GestureDetector>
  );
}