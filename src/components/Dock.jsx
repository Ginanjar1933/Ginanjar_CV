import { useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';

const SIZE = 46; // ukuran ikon saat diam
const GAP = 6;
const PAD = 10;
const PEAK = 1.55; // skala maksimum saat magnifikasi
const REACH = 90; // jarak pengaruh dari jari (px)
const IDLE = -9999; // tanda: tidak ada sentuhan
const SPRING = { mass: 0.4, damping: 12, stiffness: 180 };

const ICONS = {
  index: 'home',
  about: 'person',
  skills: 'code-slash',
  portfolio: 'briefcase',
  'my-score': 'stats-chart',
  contact: 'mail',
};

function DockItem({ index, name, label, focused, touchX, onPress, colors, styles }) {
  const center = PAD + index * (SIZE + GAP) + SIZE / 2;
  const bounce = useSharedValue(0);

  // Skala tiap ikon bergantung pada jarak jari ke pusat ikon
  const scale = useDerivedValue(() => {
    const distance = Math.abs(touchX.value - center);
    const target =
      touchX.value === IDLE
        ? 1
        : interpolate(distance, [0, REACH], [PEAK, 1], Extrapolation.CLAMP);
    return withSpring(target, SPRING);
  });

  const tileStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value - ((scale.value - 1) * SIZE) / 2 },
      { scale: scale.value },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [1.2, PEAK], [0, 1], Extrapolation.CLAMP),
  }));

  const handlePress = () => {
    bounce.value = withSequence(
      withTiming(-16, { duration: 140 }),
      withSpring(0, { damping: 6, stiffness: 220 })
    );
    onPress();
  };

  return (
    <View style={styles.slot}>
      <Animated.View pointerEvents="none" style={[styles.labelWrap, labelStyle]}>
        <View style={styles.label}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      </Animated.View>

      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          touchX.value = center;
        }}
        onPressOut={() => {
          touchX.value = IDLE;
        }}
        accessibilityRole="tab"
        accessibilityLabel={label}
        accessibilityState={{ selected: focused }}
        hitSlop={4}
        style={styles.pressable}
      >
        <Animated.View style={[styles.tile, focused && styles.tileActive, tileStyle]}>
          <Ionicons
            name={focused ? ICONS[name] : `${ICONS[name]}-outline`}
            size={22}
            color={focused ? colors.background : colors.text}
          />
        </Animated.View>
      </Pressable>

      {focused && <View style={styles.dot} />}
    </View>
  );
}

export default function Dock({ state, descriptors }) {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const touchX = useSharedValue(IDLE);
  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = withSpring(1, { damping: 14, stiffness: 120 });
  }, [enter]);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 90 }],
  }));

  // Navigasi lewat Expo Router: route "index" = "/", sisanya "/nama-route"
  const goTo = (index) => {
    const route = state.routes[index];
    if (!route) return;
    if (state.index !== index) {
      router.navigate(route.name === 'index' ? '/' : `/${route.name}`);
    }
    Haptics.selectionAsync().catch(() => {});
  };

  // Geser jari di atas dock: ikon membesar, lepas jari: pindah ke ikon itu
  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(6)
    .onUpdate((e) => {
      touchX.value = e.x;
    })
    .onEnd((e) => {
      const raw = Math.round((e.x - PAD - SIZE / 2) / (SIZE + GAP));
      const index = Math.min(Math.max(raw, 0), state.routes.length - 1);
      goTo(index);
    })
    .onFinalize(() => {
      touchX.value = IDLE;
    });

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}
    >
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.dock, enterStyle]}>
          {state.routes.map((route, index) => (
            <DockItem
              key={route.key}
              index={index}
              name={route.name}
              label={descriptors[route.key].options.title ?? route.name}
              focused={state.index === index}
              touchX={touchX}
              onPress={() => goTo(index)}
              colors={colors}
              styles={styles}
            />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    // Melayang di atas konten, transparan: tidak ada lagi blok panjang di dasar layar
    wrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: 34, // ruang agar ikon yang membesar tidak terpotong
      alignItems: 'center',
    },
    dock: {
      flexDirection: 'row',
      gap: GAP,
      padding: PAD,
      borderRadius: 30,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    slot: { width: SIZE, height: SIZE, alignItems: 'center' },
    pressable: { width: SIZE, height: SIZE },
    tile: {
      width: SIZE,
      height: SIZE,
      borderRadius: 16,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tileActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    dot: {
      position: 'absolute',
      bottom: -8,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    labelWrap: {
      position: 'absolute',
      bottom: SIZE * PEAK + 6,
      left: -30,
      width: SIZE + 60,
      alignItems: 'center',
    },
    label: {
      backgroundColor: colors.text,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    labelText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.background,
    },
  });