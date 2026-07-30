import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { BrandHeader } from "@/components/common/BrandHeader";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { typography } from "@/theme/typography";
import { getRoleAssignRoute, getRoleHomeRoute } from "@/utils/roleRoutes";

const roleOptions = ["household", "collector"] as const;

type AuthRole = (typeof roleOptions)[number];

export default function RegisterScreen() {
  const router = useRouter();
  const { user, role: currentRole, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AuthRole>("household");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      const homeRoute = getRoleHomeRoute(currentRole);
      router.replace(homeRoute ?? getRoleAssignRoute());
    }
  }, [user, currentRole]);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      const currentProfile = await signUp({
        fullName: name,
        email,
        password,
        role,
      });

      const resolvedRole = currentProfile?.role ?? role;
      const homeRoute = getRoleHomeRoute(resolvedRole);
      router.replace(homeRoute ?? getRoleAssignRoute());
    } catch (err: any) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <BrandHeader title="Create account" logoSize={88} titleSize={28} />
        <Text style={styles.subtitle}>Set up your ZeroWaste profile and choose the role that fits you best.</Text>

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
          Already have an account? <Pressable onPress={() => router.push("/auth/login")}><Text style={styles.link}>Log in</Text></Pressable>
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
    gap: 12,
    maxWidth: 420,
    alignSelf: "center",
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: "center",
    marginBottom: 12,
  },
  footerText: {
    ...typography.body,
    marginTop: 18,
    textAlign: "center",
    color: colors.muted,
  },
  label: {
    ...typography.label,
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
    ...typography.label,
    color: colors.text,
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
