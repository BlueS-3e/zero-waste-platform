import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@/theme/colors";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function Button({
  title,
  onPress,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === "secondary"
          ? styles.secondary
          : variant === "ghost"
          ? styles.ghost
          : styles.primary,
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={variant === "ghost" ? styles.ghostLabel : styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 22,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  ghostLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
