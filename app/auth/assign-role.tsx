import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { BrandHeader } from "@/components/common/BrandHeader";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { typography } from "@/theme/typography";
import { getLoginRoute, getRoleHomeRoute } from "@/utils/roleRoutes";

type AuthRole = "household" | "collector";
const roleOptions: AuthRole[] = ["household", "collector"];

export default function AssignRoleScreen() {
  const router = useRouter();
  const { user, role, loading, assignRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AuthRole>("household");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Loading authentication status...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href={getLoginRoute()} />;
  }

  // If the user already has a role, take them home.
  // Prevents role selector from being accessed by mistake.
  if (role) {
    const homeRoute = getRoleHomeRoute(role);
    if (homeRoute) return <Redirect href={homeRoute} />;
  }

  const handleAssignRole = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const assignedProfile = await assignRole(selectedRole);
      const homeRoute = getRoleHomeRoute(assignedProfile?.role ?? selectedRole);
      router.replace(homeRoute ?? "/");
    } catch (err: any) {
      setError(err?.message || "Unable to assign role. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <BrandHeader title="Choose your role" logoSize={88} titleSize={28} />
        <Text style={styles.subtitle}>
          We need your role to take you to the correct dashboard. Select one to continue.
        </Text>

        <View style={styles.roleGrid}>
          {roleOptions.map((option) => {
            const isActive = option === selectedRole;
            return (
              <Pressable
                key={option}
                style={[styles.roleChip, isActive && styles.activeRoleChip]}
                onPress={() => setSelectedRole(option)}
              >
                <Text style={[styles.roleLabel, isActive && styles.activeRoleLabel]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title={submitting ? "Saving role..." : "Continue"}
          fullWidth
          onPress={submitting ? undefined : handleAssignRole}
        />

        <Text style={styles.footerText}>
          If this is not your account, <Text style={styles.link} onPress={() => router.replace(getLoginRoute())}>sign out</Text> and use a different email.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: colors.background,
  },
  card: {
    gap: 14,
    maxWidth: 420,
    alignSelf: "center",
  },
  subtitle: {
    ...typography.subtitle,
    marginBottom: 16,
    textAlign: "center",
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
    justifyContent: "center",
  },
  roleChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
  },
  activeRoleChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleLabel: {
    ...typography.label,
    color: colors.text,
    textTransform: "capitalize",
  },
  activeRoleLabel: {
    color: "#fff",
  },
  error: {
    ...typography.body,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 8,
  },
  footerText: {
    ...typography.body,
    textAlign: "center",
    color: colors.muted,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loaderText: {
    ...typography.body,
    color: colors.text,
  },
});
