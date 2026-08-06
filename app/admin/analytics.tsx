import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/authStore";
import { getAdminStats } from "@/features/admin/api";
import type { AdminStats } from "@/features/admin/types";
import { typography } from "@/theme/typography";

const chartWidth = 340;

import { BrandHeader } from "@/components/common/BrandHeader";

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err: any) {
        setError(err?.message || "Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Analytics" showLogout showBack />
      <Text style={styles.subtitle}>Track platform growth and revenue trends.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Card>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.body}>{error}</Text>
        </Card>
      ) : (
        <>
          <Card style={styles.revenueSummaryCard}>
            <Text style={styles.revenueTitle}>Platform Revenue (₵)</Text>
            <Text style={styles.revenueValue}>₵{stats?.totalRevenue.toFixed(2)}</Text>
            <Text style={styles.revenueSubtitle}>Generated from platform service fees</Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Platform Health</Text>
            <View style={styles.metricGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>{stats?.households}</Text>
                <Text style={styles.metricLab}>Users</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>{stats?.collectors}</Text>
                <Text style={styles.metricLab}>Collectors</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>{stats?.completedRequests}</Text>
                <Text style={styles.metricLab}>Completed</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Request Lifecycle Distribution</Text>
            <BarChart
              data={{
                labels: ["Pending", "Collected", "Completed"],
                datasets: [{ data: [stats?.pendingRequests ?? 0, stats?.collectedRequests ?? 0, stats?.completedRequests ?? 0] }],
              }}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                color: () => colors.primary,
                labelColor: () => colors.text,
                fillShadowGradient: colors.primary,
                fillShadowGradientOpacity: 1,
                barPercentage: 0.7,
                propsForBackgroundLines: { strokeDasharray: "3" },
              }}
              style={styles.chart}
              fromZero
            />
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 36, gap: 16 },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface },
  cardTitle: { ...typography.title, fontSize: 16, marginBottom: 12 },
  body: { color: colors.muted, fontSize: 14 },

  revenueSummaryCard: { backgroundColor: colors.primary, padding: 24, borderRadius: 20 },
  revenueTitle: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "600", textTransform: "uppercase" },
  revenueValue: { fontSize: 32, color: "#fff", fontWeight: "800", marginTop: 4 },
  revenueSubtitle: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 },

  metricGrid: { flexDirection: "row", gap: 10 },
  metricBox: { flex: 1, backgroundColor: colors.surfaceLight, padding: 12, borderRadius: 12, alignItems: "center" },
  metricVal: { fontSize: 18, fontWeight: "800", color: colors.primary },
  metricLab: { fontSize: 10, color: colors.muted, marginTop: 2, textTransform: "uppercase" },

  chart: { marginTop: 8, marginLeft: -12, borderRadius: 16 },
});
