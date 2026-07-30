import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

type InputProps = TextInputProps & {
  containerStyle?: object;
};

export function Input({ containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.muted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  input: {
    ...typography.inputText,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.text,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});
