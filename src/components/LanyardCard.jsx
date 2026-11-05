import { useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';

// PENTING: samakan path ini dengan yang dipakai di ProfileHeader.jsx
const images = {
  'profile.jpg': require('../../assets/profile.jpg'),
};

const STRAP = 70; // panjang tali (px)

export default function LanyardCard({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();

  const cardW = Math.min(width - 64, 300);
  const cardH = cardW * 1.4;
  const total = STRAP + 24 + cardH;

  const swing = useSharedValue(50); // sudut ayunan (derajat), awal 50 = intro
  const sway = useSharedValue(0); // angin pelan
  const flip = useSharedValue(0); // 0 depan, 1 belakang

  useEffect(() => {
    // Intro: kartu jatuh berayun ke posisi tengah
    swing.value = withSpring(0, { damping: 4, stiffness: 40, mass: 1 });
    // Ayunan pelan terus-menerus
    sway.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2200 }),
        withTiming(-1.5, { duration: 2200 })
      ),
      -1,
      true
    );
  }, [swing, sway]);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-25, 25])
    .onUpdate((e) => {
      swing.value = Math.max(-40, Math.min(40, e.translationX * 0.25));
    })
    .onEnd((e) => {
      swing.value = withSpring(0, {
        damping: 3,
        stiffness: 40,
        velocity: e.velocityX * 0.05,
      });
    });

  const tap = Gesture.Tap().onEnd(() => {
    flip.value = withSpring(flip.value > 0.5 ? 0 : 1, {
      damping: 14,
      stiffness: 90,
    });
  });

  const gesture = Gesture.Race(pan, tap);

  // Seluruh tali + kartu berputar dengan titik tumpu di ujung atas
  const hangStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -total / 2 },
      { rotate: `${swing.value + sway.value}deg` },
      { translateY: total / 2 },
    ],
  }));

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${flip.value * 180}deg` }],
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateY: `${flip.value * 180 + 180}deg` },
    ],
  }));

  const shineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      Math.abs(swing.value),
      [0, 30],
      [0.08, 0.35],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={[styles.stage, { height: total + spacing.md }]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[{ width: cardW, height: total }, hangStyle]}>
          {/* Tali */}
          <View style={[styles.strap, { height: STRAP }]} />
          {/* Klip logam */}
          <View style={styles.clip} />

          {/* Kartu */}
          <View style={{ width: cardW, height: cardH, marginTop: -6 }}>
            {/* Sisi depan */}
            <Animated.View
              style={[styles.face, { width: cardW, height: cardH }, frontStyle]}
              accessible
              accessibilityLabel={`Kartu identitas ${data.nama}. Ketuk untuk membalik.`}
            >
              <View style={styles.slot} />
              <Image
                source={images[data.foto]}
                style={[styles.photo, { width: cardW - 48, height: cardW - 48 }]}
                accessibilityLabel={`Foto profil ${data.nama}`}
              />
              <Text style={styles.name}>{data.nama}</Text>
              <Text style={styles.nim}>NIM: {data.nim}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={2}>
                  {data.profesi}
                </Text>
              </View>
              <Animated.View
                pointerEvents="none"
                style={[styles.shine, shineStyle]}
              />
            </Animated.View>

            {/* Sisi belakang */}
            <Animated.View
              style={[
                styles.face,
                styles.back,
                { width: cardW, height: cardH },
                backStyle,
              ]}
            >
              <View style={styles.slot} />
              <Text style={styles.backTitle}>Tentang Saya</Text>
              <Text style={styles.backText} numberOfLines={9}>
                {data.deskripsi}
              </Text>
              <Text style={styles.hint}>Ketuk untuk membalik</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </GestureDetector>
      <Text style={styles.caption}>Tarik atau ketuk kartunya</Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    stage: {
      alignItems: 'center',
      overflow: 'visible',
    },
    strap: {
      alignSelf: 'center',
      width: 22,
      backgroundColor: colors.primary,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: colors.border,
    },
    clip: {
      alignSelf: 'center',
      width: 34,
      height: 22,
      borderRadius: 8,
      backgroundColor: '#C0C4CC',
      borderWidth: 2,
      borderColor: '#8E939C',
      zIndex: 2,
    },
    face: {
      position: 'absolute',
      top: 0,
      left: 0,
      backfaceVisibility: 'hidden',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    back: { backgroundColor: colors.background },
    slot: {
      width: 56,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.border,
      marginBottom: spacing.xs,
    },
    photo: {
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    name: {
      fontSize: typography.heading,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    nim: {
      fontSize: typography.small,
      color: colors.textMuted,
    },
    badge: {
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    badgeText: {
      fontSize: typography.small,
      fontWeight: '700',
      color: colors.background,
      textAlign: 'center',
    },
    shine: {
      position: 'absolute',
      top: -40,
      left: -80,
      width: 90,
      height: 600,
      backgroundColor: '#FFFFFF',
      transform: [{ rotate: '25deg' }],
    },
    backTitle: {
      fontSize: typography.heading,
      fontWeight: '800',
      color: colors.text,
      alignSelf: 'flex-start',
    },
    backText: {
      fontSize: typography.body,
      lineHeight: 24,
      color: colors.textMuted,
      alignSelf: 'flex-start',
    },
    hint: {
      position: 'absolute',
      bottom: spacing.md,
      fontSize: typography.small,
      color: colors.primary,
      fontWeight: '600',
    },
    caption: {
      fontSize: typography.small,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
  });