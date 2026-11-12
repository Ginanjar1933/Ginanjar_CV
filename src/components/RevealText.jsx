import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

function Word({ word, index, style }) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withDelay(
      Math.min(index * 45, 2000),
      withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) })
    );
  }, [index, p]);

  const animated = useAnimatedStyle(() => ({
    opacity: 0.12 + 0.88 * p.value,
    transform: [{ translateY: (1 - p.value) * 8 }],
  }));

  return <Animated.Text style={[style, animated]}>{word} </Animated.Text>;
}

export default function RevealText({ text, style }) {
  const reduced = useReducedMotion();

  if (reduced) return <Text style={style}>{text}</Text>;

  return (
    <View style={styles.wrap} accessible accessibilityLabel={text}>
      {text.split(' ').map((word, i) => (
        <Word key={`${word}-${i}`} word={word} index={i} style={style} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});