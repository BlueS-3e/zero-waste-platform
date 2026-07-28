import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { colors } from "@/theme/colors";

type CardProps = ViewProps & {
  children: React.ReactNode;
};

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 6,
  },
});
