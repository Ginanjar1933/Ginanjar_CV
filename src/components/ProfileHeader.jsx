import { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { radius, spacing, typography } from "../constants/theme";

const images = {
  "profile.jpg": require("../../assets/profile.jpg"),
};

export default function ProfileHeader({ data }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Image
        source={images[data.foto]}
        style={styles.avatar}
        accessibilityLabel={`Foto profil ${data.nama}`}
      />
      <Text style={styles.name}>{data.nama}</Text>
      <Text style={styles.nim}>NIM: {data.nim}</Text>
      <Text style={styles.role}>{data.profesi}</Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      alignItems: "center",
      gap: spacing.sm,
    },
    avatar: {
      width: 140,
      height: 140,
      borderRadius: radius.full,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    name: {
      fontSize: typography.heading,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    nim: {
      fontSize: typography.body,
      color: colors.textMuted,
    },
    role: {
      fontSize: typography.body,
      color: colors.primary,
      textAlign: "center",
    },
  });
