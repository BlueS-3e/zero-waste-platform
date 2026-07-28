import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function AdminRequestsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Requests</Text>
      <Text style={styles.subtitle}>Review and manage pickup requests.</Text>

      <Card>
        <Text style={styles.cardTitle}>Pending requests</Text>
        <Text style={styles.body}>Plastic pickup • 2 pending</Text>
        <Text style={styles.body}>Organic pickup • 1 pending</Text>
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
