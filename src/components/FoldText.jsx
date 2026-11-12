import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

function Piece({ word, index, run, stagger, duration, angle, perspective, lineHeight, textStyle }) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = 0;
    p.value = withDelay(
      Math.min(index * stagger * 1000, 2500),
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, [run, index, stagger, duration, p]);

  const animated = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.value * 1.6),
    transform: [
      { perspective },
      { translateY: -lineHeight / 2 }, // engsel di tepi atas
      { rotateX: `${-(1 - p.value) * angle}deg` },
      { translateY: lineHeight / 2 },
    ],
  }));

  return (
    <Animated.View style={[{ height: lineHeight }, animated]}>
      <Text style={[textStyle, { lineHeight }]}>{word} </Text>
    </Animated.View>
  );
}

export default function FoldText({
  text,
  style,
  lineHeight = 26,
  stagger = 0.035,
  duration = 650,
  angle = 92,
  perspective = 700,
  focusReplay = true,
}) {
  const reduced = useReducedMotion();
  const [run, setRun] = useState(0);
  const first = useRef(true);

  // Putar ulang animasi setiap kali layar/tab ini dibuka
  useFocusEffect(
    useCallback(() => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (focusReplay) setRun((r) => r + 1);
    }, [focusReplay])
  );

  if (reduced) return <Text style={[style, { lineHeight }]}>{text}</Text>;

  return (
    <View style={styles.wrap} accessible accessibilityLabel={text}>
      {text.split(' ').map((word, i) => (
        <Piece
          key={`${word}-${i}`}
          word={word}
          index={i}
          run={run}
          stagger={stagger}
          duration={duration}
          angle={angle}
          perspective={perspective}
          lineHeight={lineHeight}
          textStyle={style}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});