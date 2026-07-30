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
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.body}>{error}</Text>
        </Card>
      ) : (
        <>
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
            <Text style={styles.body}>Households: {stats?.households ?? 0}</Text>
            <Text style={styles.body}>Collectors: {stats?.collectors ?? 0}</Text>
            <Text style={styles.body}>Pending requests: {stats?.pendingRequests ?? 0}</Text>
            <Text style={styles.body}>Completed requests: {stats?.completedRequests ?? 0}</Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Requests trend</Text>
            <Text style={styles.body}>Weekly activity for pickups and completed jobs.</Text>
            <LineChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    data: [
                      stats?.pendingRequests ?? 0,
                      stats?.pendingRequests ?? 0,
                      stats?.pendingRequests ?? 0,
                      stats?.pendingRequests ?? 0,
                      stats?.pendingRequests ?? 0,
                      stats?.pendingRequests ?? 0,
                      stats?.completedRequests ?? 0,
                    ],
                    strokeWidth: 3,
                  },
                ],
              }}
              width={chartWidth}
              height={210}
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
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface },
  cardTitle: { ...typography.title, marginBottom: 8 },
  body: { ...typography.body, color: colors.muted },
  chart: { marginTop: 12, borderRadius: 16 },
  menuGrid: { gap: 10, marginTop: 4 },
});
