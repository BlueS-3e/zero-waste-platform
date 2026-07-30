import React from "react";
import { Image, StyleSheet, View } from "react-native";

type LogoProps = {
  width?: number;
  height?: number;
};

export const Logo = React.memo(function Logo({ width = 72, height = 72 }: LogoProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={require("../../../assets/images/icon.png")}
        style={{ width, height }}
        resizeMode="contain"
        accessibilityLabel="ZeroWaste Logo"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
