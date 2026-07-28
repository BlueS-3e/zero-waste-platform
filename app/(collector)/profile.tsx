import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function CollectorProfileScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your collector account details.</Text>

      <Card>
        <Text style={styles.cardTitle}>Collector account</Text>
        <Text style={styles.body}>Email: collector@zerowaste.app</Text>
        <Text style={styles.body}>Role: Collector</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
