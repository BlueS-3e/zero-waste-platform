import { Platform, TextStyle } from "react-native";
import { colors } from "@/theme/colors";

export const typography = {
  body: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: colors.text,
  } satisfies TextStyle,
  heading: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    fontSize: 24,
    fontWeight: "800" as const,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: colors.primary,
  } satisfies TextStyle,
  title: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    fontSize: 20,
    fontWeight: "700" as const,
    lineHeight: 26,
    letterSpacing: -0.2,
    color: colors.text,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    fontSize: 15,
    fontWeight: "500" as const,
    lineHeight: 22,
    letterSpacing: 0.05,
    color: colors.muted,
  } satisfies TextStyle,
  label: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    fontSize: 13,
    fontWeight: "600" as const,
    lineHeight: 18,
    letterSpacing: 0.06,
    color: colors.text,
  } satisfies TextStyle,
  buttonText: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    fontSize: 15,
    fontWeight: "700" as const,
    lineHeight: 20,
    letterSpacing: 0.04,
  } satisfies TextStyle,
  inputText: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    fontSize: 15,
    fontWeight: "500" as const,
    lineHeight: 20,
    letterSpacing: 0.04,
    color: colors.text,
  } satisfies TextStyle,
};
