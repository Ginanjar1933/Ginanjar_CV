import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

const GLYPHS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

// spacing kecil = kolom rapat. Kolom per lapisan = lebar layar / spacing
const LAYERS = [
  { spacing: 8, font: 9, opacity: 0.35, min: 9000, max: 15000, length: 18 },
  { spacing: 12, font: 12, opacity: 0.6, min: 6500, max: 10000, length: 14 },
  { spacing: 18, font: 16, opacity: 0.95, min: 4000, max: 7000, length: 11 },
];

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function Column({ x, layer, screenH, color, head, reduced }) {
  const lineH = layer.font * 1.3;
  const colH = lineH * layer.length;
  const y = useSharedValue(-colH);

  // Pecah kolom jadi 3 segmen (ekor, tengah, dekat kepala) + 1 huruf kepala
  const parts = useMemo(() => {
    const g = Array.from({ length: layer.length }, randomGlyph);
    const a = Math.floor(layer.length * 0.4);
    const b = Math.floor(layer.length * 0.75);
    return {
      tail: g.slice(0, a).join('\n'),
      mid: g.slice(a, b).join('\n'),
      near: g.slice(b, layer.length - 1).join('\n'),
      head: g[layer.length - 1],
    };
  }, [layer.length]);

  useEffect(() => {
    if (reduced) {
      y.value = Math.random() * screenH * 0.8;
      return;
    }
    const duration = layer.min + Math.random() * (layer.max - layer.min);
    y.value = withDelay(
      Math.random() * 5000,
      withRepeat(
        withTiming(screenH + colH, { duration, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, [reduced, screenH, colH, layer.min, layer.max, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  const base = { fontFamily: MONO, fontSize: layer.font, lineHeight: lineH, color };

  return (
    <Animated.View
      style={[styles.column, { left: x, opacity: layer.opacity }, style]}
    >
      <Text style={[base, { opacity: 0.25 }]}>{parts.tail}</Text>
      <Text style={[base, { opacity: 0.55 }]}>{parts.mid}</Text>
      <Text style={[base, { opacity: 0.85 }]}>{parts.near}</Text>
      <Text
        style={[
          base,
          {
            color: head,
            textShadowColor: color,
            textShadowRadius: 8,
            textShadowOffset: { width: 0, height: 0 },
          },
        ]}
      >
        {parts.head}
      </Text>
    </Animated.View>
  );
}

export default function TerminalRain() {
  const { isDark, colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();

  // Ungu seperti referensi di mode gelap, warna primary di mode terang
  const tint = isDark ? '#A78BFA' : colors.primary;
  const head = isDark ? '#FFFFFF' : colors.text;

  const columns = useMemo(() => {
    const result = [];
    LAYERS.forEach((layer, li) => {
      const count = Math.floor(width / layer.spacing);
      for (let i = 0; i < count; i++) {
        result.push({
          key: `${li}-${i}`,
          layer,
          x: i * layer.spacing + Math.random() * 2,
        });
      }
    });
    return result;
  }, [width]);

  return (
    <View
      pointerEvents="none"
      style={styles.fill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {columns.map((c) => (
        <Column
          key={c.key}
          x={c.x}
          layer={c.layer}
          screenH={height}
          color={tint}
          head={head}
          reduced={reduced}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', opacity: 0.55 },
  column: { position: 'absolute', top: 0, alignItems: 'center' },
});