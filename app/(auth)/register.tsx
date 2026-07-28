import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";

const roleOptions = ["household", "collector", "admin"] as const;

type AuthRole = (typeof roleOptions)[number];

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AuthRole>("household");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      await signUp({
        fullName: name,
        email,
        password,
        role,
      });

      if (role === "household") {
        router.push("/(household)/dashboard");
      } else if (role === "collector") {
        router.push("/(collector)/dashboard");
      } else {
        router.push("/(admin)/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Set up your ZeroWaste profile and choose your role.</Text>

        <Input placeholder="Full name" value={name} onChangeText={setName} />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.label}>Select your role</Text>
        <View style={styles.roleGrid}>
          {roleOptions.map((option) => {
            const isActive = option === role;
            return (
              <Pressable
                key={option}
                style={[styles.roleChip, isActive && styles.activeRoleChip]}
                onPress={() => setRole(option)}
              >
                <Text style={[styles.roleLabel, isActive && styles.activeRoleLabel]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={loading ? "Creating account..." : "Create account"} fullWidth onPress={loading ? undefined : handleSignUp} />

        <Text style={styles.footerText}>
          Already have an account? <Pressable onPress={() => router.push("/(auth)/login")}><Text style={styles.link}>Log in</Text></Pressable>
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
    gap: 16,
    maxWidth: 420,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 12,
  },
  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: colors.muted,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  roleChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    color: colors.text,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  activeRoleLabel: {
    color: "#fff",
  },
  error: {
    color: "#c62828",
    marginBottom: 8,
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
});
