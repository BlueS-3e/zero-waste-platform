import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { BrandHeader } from "@/components/common/BrandHeader";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { getAdminStats } from "@/features/admin/api";
import type { AdminStats } from "@/features/admin/types";
import { useRouter } from "expo-router";

const chartWidth = Math.min(Dimensions.get("window").width - 40, 360);

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || "Unable to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Admin dashboard" showLogout />
      <Text style={styles.subtitle}>Monitor the platform with a simple, clear view of daily activity.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.body}>{error}</Text>
        </Card>
      ) : (
        <>
          <Card style={styles.revenueCard}>
            <View>
              <Text style={styles.revenueLabel}>Total System Revenue</Text>
              <Text style={styles.revenueValue}>₵{stats?.totalRevenue.toFixed(2)}</Text>
            </View>
            <View style={styles.revenueBadge}>
              <Text style={styles.revenueBadgeText}>GHS</Text>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Management portal</Text>
            <View style={styles.menuGrid}>
              <Button title="Manage users" fullWidth variant="primary" onPress={() => router.push("/admin/users")} />
              <Button title="Pickup requests" fullWidth variant="secondary" onPress={() => router.push("/admin/requests")} />
              <Button title="Platform analytics" fullWidth variant="ghost" onPress={() => router.push("/admin/analytics")} />
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Platform overview</Text>
            <View style={styles.statGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statCount}>{stats?.households ?? 0}</Text>
                <Text style={styles.statLabel}>Households</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statCount}>{stats?.collectors ?? 0}</Text>
                <Text style={styles.statLabel}>Collectors</Text>
              </View>
            </View>
            <View style={[styles.statGrid, { marginTop: 16 }]}>
              <View style={styles.statItem}>
                <Text style={styles.statCount}>{stats?.pendingRequests ?? 0}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statCount}>{stats?.completedRequests ?? 0}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Daily Volume</Text>
            <Text style={styles.body}>Snapshot of recent system activity.</Text>
            <LineChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    data: [
                      stats?.pendingRequests ?? 0,
                      stats?.collectedRequests ?? 0,
                      stats?.completedRequests ?? 0,
                      (stats?.pendingRequests ?? 0) + 1,
                      stats?.pendingRequests ?? 0,
                      stats?.collectedRequests ?? 0,
                      stats?.completedRequests ?? 0,
                    ],
                    strokeWidth: 3,
                  },
                ],
              }}
              width={chartWidth}
              height={180}
              chartConfig={{
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                color: () => colors.primary,
                labelColor: () => colors.muted,
                propsForDots: { r: "4", strokeWidth: "2", stroke: colors.primary },
              }}
              bezier
              style={styles.chart}
            />
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 36, gap: 14 },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface },
  cardTitle: { ...typography.title, fontSize: 17, marginBottom: 12 },
  body: { ...typography.body, color: colors.muted, marginBottom: 8 },
  chart: { marginTop: 12, borderRadius: 16 },
  menuGrid: { gap: 10 },

  revenueCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 20
  },
  revenueLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "600", textTransform: "uppercase" },
  revenueValue: { fontSize: 28, color: "#fff", fontWeight: "800", marginTop: 4 },
  revenueBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  revenueBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },

  statGrid: { flexDirection: "row", gap: 12 },
  statItem: { flex: 1, backgroundColor: colors.surfaceLight, padding: 14, borderRadius: 12, alignItems: "center" },
  statCount: { fontSize: 20, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 }
});
