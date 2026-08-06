import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { BrandHeader } from "@/components/common/BrandHeader";
import { typography } from "@/theme/typography";

export default function EarningsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="My Earnings" showLogout showBack />
      <Text style={styles.subtitle}>Track your performance and daily payouts in Ghana Cedis.</Text>

      <Card style={styles.statsCard}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>₵142.50</Text>
          <Text style={styles.statLabel}>Today's Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>6</Text>
          <Text style={styles.statLabel}>Jobs Completed</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Recent Payouts</Text>

      <Card style={styles.historyCard}>
        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyTitle}>Plastic Collection</Text>
            <Text style={styles.historyDate}>Today, 10:30 AM</Text>
          </View>
          <Text style={styles.historyAmount}>+₵15.00</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyTitle}>Bulk Waste</Text>
            <Text style={styles.historyDate}>Yesterday, 4:15 PM</Text>
          </View>
          <Text style={styles.historyAmount}>+₵80.00</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyTitle}>Household Waste</Text>
            <Text style={styles.historyDate}>Yesterday, 9:00 AM</Text>
          </View>
          <Text style={styles.historyAmount}>+₵25.00</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 40, gap: 16 },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  sectionTitle: { ...typography.title, fontSize: 18, marginTop: 8 },

  statsCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center"
  },
  statBlock: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4, fontWeight: "600" },
  statDivider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.2)" },

  historyCard: { padding: 0, overflow: "hidden", borderRadius: 20 },
  historyItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  historyTitle: { ...typography.body, fontWeight: "700" },
  historyDate: { ...typography.label, color: colors.muted, marginTop: 2 },
  historyAmount: { fontSize: 16, fontWeight: "800", color: colors.success },
  divider: { height: 1, backgroundColor: colors.border },
});
