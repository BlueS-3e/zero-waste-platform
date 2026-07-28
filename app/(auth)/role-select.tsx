import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function RoleSelectScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.title}>Choose your role</Text>
        <Text style={styles.subtitle}>Pick the experience that fits you best.</Text>

        <Button title="Household" fullWidth onPress={() => router.push("/(household)/dashboard")} />
        <Button title="Collector" fullWidth variant="secondary" onPress={() => router.push("/(collector)/dashboard")} />
        <Button title="Admin" fullWidth variant="ghost" onPress={() => router.push("/(admin)/dashboard")} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  card: {
    gap: 18,
    maxWidth: 420,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 12,
  },
});
