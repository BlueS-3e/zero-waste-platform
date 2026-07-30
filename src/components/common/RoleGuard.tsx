import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/store/authStore";
import { colors } from "@/theme/colors";
import { getLoginRoute, getRoleAssignRoute, getRoleHomeRoute } from "@/utils/roleRoutes";
import type { AuthRole } from "@/features/auth/types";

type RoleGuardProps = {
  allowedRole: AuthRole;
};

export function RoleGuard({ allowedRole }: RoleGuardProps) {
  const { role, loading, user, error, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return <Redirect href="/" />;
  }

  if (!isAuthenticated) {
    return <Redirect href={getLoginRoute()} />;
  }

  // If authenticated but role is still missing, we wait.
  // This prevents the guard from prematurely redirecting during profile fetch.
  if (!role) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (role === allowedRole) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  const homeRoute = getRoleHomeRoute(role);
  return <Redirect href={homeRoute ?? getLoginRoute()} />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
