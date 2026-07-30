import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/authStore";
import { getAllProfiles } from "@/features/admin/api";
import type { Profile } from "@/features/auth/types";

import { BrandHeader } from "@/components/common/BrandHeader";

export default function AdminUsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const profiles = await getAllProfiles();
        setUsers(profiles);
      } catch (err: any) {
        setError(err?.message || "Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Users" showLogout showBack />
      <Text style={styles.subtitle}>Manage households, collectors, and admins in one place.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Card>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.body}>{error}</Text>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <Text style={styles.cardTitle}>No users found</Text>
          <Text style={styles.body}>There are no users in the system yet.</Text>
        </Card>
      ) : (
        users.map((user) => (
          <Card key={user.id} style={styles.card}>
            <Text style={styles.cardTitle}>{user.full_name ?? user.email}</Text>
            <Text style={styles.body}>Email: {user.email}</Text>
            <Text style={styles.body}>Role: {user.role}</Text>
            <Text style={styles.body}>Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 8 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
