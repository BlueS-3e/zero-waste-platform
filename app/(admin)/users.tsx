import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";

export default function AdminUsersScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Users</Text>
      <Text style={styles.subtitle}>Manage households, collectors, and admins.</Text>

      <Card>
        <Text style={styles.cardTitle}>Registered users</Text>
        <Text style={styles.body}>Household demo</Text>
        <Text style={styles.body}>Collector demo</Text>
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
