import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { radius } from '../constants/theme';

export default function TiltCard({ children, max = 9 }) {
  const w = useSharedValue(1);
  const h = useSharedValue(1);
  const rx = useSharedValue(0);
  const ry = useSharedValue(0);
  const glare = useSharedValue(0);

  const gesture = Gesture.Tap()
    .maxDuration(60000)
    .onBegin((e) => {
      ry.value = withSpring((e.x / w.value - 0.5) * 2 * max);
      rx.value = withSpring(-(e.y / h.value - 0.5) * 2 * max);
      glare.value = withTiming(1, { duration: 150 });
    })
    .onFinalize(() => {
      rx.value = withSpring(0, { damping: 8 });
      ry.value = withSpring(0, { damping: 8 });
      glare.value = withTiming(0, { duration: 300 });
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${rx.value}deg` },
      { rotateY: `${ry.value}deg` },
      { scale: 1 - glare.value * 0.02 },
    ],
  }));

  const glareStyle = useAnimatedStyle(() => ({
    opacity: glare.value * 0.12,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={cardStyle}
        onLayout={(e) => {
          w.value = e.nativeEvent.layout.width;
          h.value = e.nativeEvent.layout.height;
        }}
      >
        {children}
        <Animated.View pointerEvents="none" style={[styles.glare, glareStyle]} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  glare: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
  },
});