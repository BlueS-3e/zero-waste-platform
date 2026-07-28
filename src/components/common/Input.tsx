import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/theme/colors";

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
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});
