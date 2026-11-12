import { useMemo, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import timelineImages from '../constants/timelineImages';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';
import FoldText from './FoldText';

export default function TimelineItem({ item, isLast }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [open, setOpen] = useState(false);
  const image = timelineImages[item.id];

  return (
    <View style={styles.row}>
      {/* Rel: titik + garis */}
      <View style={styles.rail}>
        <View style={styles.dot}>
          <Ionicons name={item.ikon} size={16} color={colors.background} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={[styles.content, !isLast && styles.contentGap]}>
        <Pressable
          onPress={() => setOpen(!open)}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={`${item.tipe}: ${item.judul}, ${item.instansi}, ${item.periode}. ${
            open ? 'Ketuk untuk menutup detail' : 'Ketuk untuk membuka detail'
          }`}
        >
          {/* Banner gambar */}
          <View style={styles.banner}>
            {image ? (
              <Image source={image} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <>
                <View style={[StyleSheet.absoluteFill, styles.fallback]} />
                <Ionicons
                  name={item.ikon}
                  size={72}
                  color={colors.background}
                  style={styles.bigIcon}
                />
              </>
            )}
            <View style={styles.shade} />
            <View style={styles.chips}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item.periode}</Text>
              </View>
              {item.aktif && (
                <View style={[styles.chip, styles.chipActive]}>
                  <Text style={styles.chipText}>Sekarang</Text>
                </View>
              )}
            </View>
          </View>

          {/* Isi */}
          <View style={styles.body}>
            <Text style={styles.type}>{item.tipe}</Text>
            <Text style={styles.title}>{item.judul}</Text>
            <Text style={styles.place}>{item.instansi}</Text>

            {open && (
              <Animated.View
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(150)}
                style={styles.detail}
              >
                <FoldText
                  text={item.deskripsi ?? ''}
                  style={styles.desc}
                  lineHeight={24}
                  focusReplay={false}
                />
                {item.catatan ? (
                  <Text style={styles.note}>{item.catatan}</Text>
                ) : null}
              </Animated.View>
            )}

            <View style={styles.hintRow}>
              <Text style={styles.hint}>{open ? 'Tutup' : 'Ketuk untuk detail'}</Text>
              <Ionicons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.primary}
              />
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.md },
    rail: { width: 32, alignItems: 'center' },
    dot: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    line: {
      flex: 1,
      width: 2,
      backgroundColor: colors.border,
      marginTop: spacing.xs,
    },
    content: { flex: 1 },
    contentGap: { paddingBottom: spacing.lg },
    card: {
      backgroundColor: colors.background,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    pressed: { opacity: 0.85 },
    banner: { height: 110, justifyContent: 'flex-end' },
    fallback: { backgroundColor: colors.primary, opacity: 0.9 },
    bigIcon: { position: 'absolute', right: spacing.md, top: spacing.sm, opacity: 0.35 },
    shade: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)',
    },
    chips: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.sm,
    },
    chip: {
      backgroundColor: 'rgba(0,0,0,0.65)',
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    chipActive: { backgroundColor: colors.success },
    chipText: {
      fontSize: typography.small,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    body: { padding: spacing.md, gap: spacing.xs },
    type: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.primary,
    },
    title: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.text,
    },
    place: {
      fontSize: typography.small,
      color: colors.textMuted,
    },
    detail: { gap: spacing.xs, marginTop: spacing.xs },
    desc: {
      fontSize: typography.body,
      lineHeight: 24,
      color: colors.textMuted,
    },
    note: {
      fontSize: typography.small,
      fontStyle: 'italic',
      color: colors.textMuted,
    },
    hintRow: {
      minHeight: 32,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    hint: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.primary,
    },
  });