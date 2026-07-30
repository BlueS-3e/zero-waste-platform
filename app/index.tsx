// Landing / role router: redirects based on auth state + role
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { useAuth } from "@/store/authStore";
import { colors } from "@/theme/colors";
import { getLoginRoute, getRoleAssignRoute, getRoleHomeRoute } from "@/utils/roleRoutes";

export default function Index() {
  const { role, loading, error, isAuthenticated, needsRole } = useAuth();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Configuration Error</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={getLoginRoute()} />;
  }

  if (needsRole) {
    return <Redirect href={getRoleAssignRoute()} />;
  }

  const homeRoute = getRoleHomeRoute(role);
  if (homeRoute) {
    return <Redirect href={homeRoute} />;
  }

  return <Redirect href={getRoleAssignRoute()} />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
});
