import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      await signIn({ email, password });
      router.push("/(auth)/role-select");
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.title}>ZeroWaste</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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
          New here? <Link href="/(auth)/register" style={styles.link}>Create an account</Link>
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  card: {
    gap: 18,
    maxWidth: 420,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 16,
  },
  footerText: {
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
