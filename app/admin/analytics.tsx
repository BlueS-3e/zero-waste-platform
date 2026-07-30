import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/authStore";
import { getAdminStats } from "@/features/admin/api";
import type { AdminStats } from "@/features/admin/types";

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
      <Text style={styles.subtitle}>Track trends and understand how the platform is performing.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Card>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.body}>{error}</Text>
        </Card>
      ) : (
        <>
          <Card>
            <Text style={styles.cardTitle}>Active platform metrics</Text>
            <Text style={styles.body}>Monitor households, collectors, and request health.</Text>
            <View style={styles.metricRow}>
              <View style={styles.metricBlock}>
                <Text style={styles.metricValue}>{stats?.households ?? 0}</Text>
                <Text style={styles.metricLabel}>Households</Text>
              </View>
              <View style={styles.metricBlock}>
                <Text style={styles.metricValue}>{stats?.collectors ?? 0}</Text>
                <Text style={styles.metricLabel}>Collectors</Text>
              </View>
            </View>
            <View style={styles.metricRow}>
              <View style={styles.metricBlock}>
                <Text style={styles.metricValue}>{stats?.pendingRequests ?? 0}</Text>
                <Text style={styles.metricLabel}>Pending</Text>
              </View>
              <View style={styles.metricBlock}>
                <Text style={styles.metricValue}>{stats?.completedRequests ?? 0}</Text>
                <Text style={styles.metricLabel}>Completed</Text>
              </View>
            </View>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Activity snapshot</Text>
            <BarChart
              data={{
                labels: ["Households", "Collectors", "Pending", "Completed"],
                datasets: [{ data: [stats?.households ?? 0, stats?.collectors ?? 0, stats?.pendingRequests ?? 0, stats?.completedRequests ?? 0] }],
              }}
              width={chartWidth}
              height={220}              yAxisLabel=""
              yAxisSuffix=""              chartConfig={{
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                color: () => colors.primary,
                labelColor: () => colors.text,
                fillShadowGradient: colors.primary,
                fillShadowGradientOpacity: 1,
                barPercentage: 0.8,
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
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  logoutButton: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999 },
  logoutText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 10 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  metricRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 12 },
  metricBlock: { flex: 1, backgroundColor: colors.surfaceLight, borderRadius: 16, padding: 14, alignItems: "center" },
  metricValue: { fontSize: 24, fontWeight: "800", color: colors.primary },
  metricLabel: { fontSize: 13, color: colors.muted, marginTop: 4 },
  chart: { marginTop: 12, borderRadius: 16 },
});
