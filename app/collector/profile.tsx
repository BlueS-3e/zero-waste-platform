import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { BrandHeader } from "@/components/common/BrandHeader";
import { useAuth } from "@/store/authStore";

export default function CollectorProfileScreen() {
  const { profile } = useAuth();
  const displayName = profile?.full_name || "Profile";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title={displayName} showLogout showBack />
      <Text style={styles.subtitle}>Your collector account details.</Text>

      <Card>
        <Text style={styles.cardTitle}>Collector account</Text>
        <Text style={styles.body}>Email: {profile?.email || "collector@zerowaste.app"}</Text>
        <Text style={styles.body}>Role: Collector</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
