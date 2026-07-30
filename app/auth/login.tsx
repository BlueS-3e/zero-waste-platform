import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { BrandHeader } from "@/components/common/BrandHeader";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { typography } from "@/theme/typography";
import { getRoleAssignRoute, getRoleHomeRoute } from "@/utils/roleRoutes";

export default function LoginScreen() {
  const router = useRouter();
  const { user, role, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      const homeRoute = getRoleHomeRoute(role);
      router.replace(homeRoute ?? getRoleAssignRoute());
    }
  }, [user, role]);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const currentProfile = await signIn({ email, password });
      const resolvedRole = currentProfile?.role ?? null;

      const homeRoute = getRoleHomeRoute(resolvedRole);
      router.replace(homeRoute ?? getRoleAssignRoute());
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Card style={[styles.card, loading && styles.cardLoading]}>
        <BrandHeader title="ZeroWaste" logoSize={96} titleSize={32} />
        <Text style={styles.subtitle}>Sign in to continue your ZeroWaste journey</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title={loading ? "Signing in..." : "Continue"} fullWidth onPress={handleSubmit} />

        <Text style={styles.footerText}>
          New here? <Link href="/auth/register" style={styles.link}>Create an account</Link>
        </Text>
      </Card>

      {loading ? (
        <View style={styles.overlay} pointerEvents="box-none">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.overlayText}>Signing you in...</Text>
        </View>
      ) : null}
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
    gap: 12,
    maxWidth: 420,
    alignSelf: "center",
  },
  cardLoading: {
    opacity: 0.72,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.38)",
    gap: 10,
  },
  overlayText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: "center",
    marginBottom: 16,
  },
  footerText: {
    ...typography.body,
    marginTop: 20,
    textAlign: "center",
    color: colors.muted,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
  error: {
    color: colors.danger,
    marginBottom: 8,
    textAlign: "center",
  },
});
