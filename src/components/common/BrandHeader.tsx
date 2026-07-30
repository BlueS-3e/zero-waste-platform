import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { colors } from "@/theme/colors";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/store/authStore";
import { typography } from "@/theme/typography";

type BrandHeaderProps = {
  title: string;
  logoSize?: number;
  titleSize?: number;
  showLogout?: boolean;
  showBack?: boolean;
};

export const BrandHeader = React.memo(function BrandHeader({
  title,
  logoSize = 72,
  titleSize = 24,
  showLogout = false,
  showBack = false,
}: BrandHeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBack ? (
          <Pressable style={styles.backButton} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}

        {showLogout ? (
          <Pressable style={styles.logoutButton} onPress={handleLogout} accessibilityRole="button" accessibilityLabel="Log out">
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.branding}>
        <Logo width={logoSize} height={logoSize} />
        <Text style={[styles.title, { fontSize: titleSize }]} accessibilityRole="header">
          {title}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 8,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 36,
    paddingHorizontal: 4,
  },
  branding: {
    alignItems: "center",
    gap: 8,
    marginTop: -8,
  },
  placeholder: {
    width: 60,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backText: {
    ...typography.label,
    color: colors.primary,
  },
  logoutButton: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    ...typography.label,
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    ...typography.heading,
    textAlign: "center",
  },
});
