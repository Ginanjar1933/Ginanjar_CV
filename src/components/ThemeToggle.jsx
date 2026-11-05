import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { radius } from "../constants/theme";

export default function ThemeToggle() {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={[
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      accessibilityRole="switch"
      accessibilityLabel="Mode gelap"
      accessibilityState={{ checked: isDark }}
    >
      <Ionicons
        name={isDark ? "moon" : "sunny"}
        size={22}
        color={colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
