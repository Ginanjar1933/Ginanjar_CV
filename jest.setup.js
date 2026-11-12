// Penyimpanan lokal tiruan (di memori)
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) => (key in store ? store[key] : null)),
      setItem: jest.fn(async (key, value) => {
        store[key] = value;
      }),
      removeItem: jest.fn(async (key) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        store = {};
      }),
    },
  };
});

// Ikon: tidak perlu dirender saat tes
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

// Reanimated tiruan: animasi langsung ke nilai akhir
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: { View, Text, createAnimatedComponent: (c) => c },
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: (fn) => fn(),
    useDerivedValue: (fn) => ({ value: fn() }),
    useAnimatedProps: (fn) => fn(),
    withTiming: (v) => v,
    withDelay: (_d, v) => v,
    Easing: { out: (f) => f, inOut: (f) => f, cubic: () => 0 },
    useReducedMotion: () => true,
  };
});

// TechTitle memakai SVG + gesture; cukup diganti teks biasa saat tes
jest.mock('./src/components/TechTitle', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }) => React.createElement(Text, null, children),
  };
});