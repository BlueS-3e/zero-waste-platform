import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { createRequest } from "@/features/requests/api";

const wasteOptions = ["Household", "Plastic", "Organic", "Electronic", "Bulk"];

export default function RequestPickupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [wasteType, setWasteType] = useState(wasteOptions[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      setError("Please sign in to submit a pickup request.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createRequest({
        household_id: user.id,
        waste_type: wasteType,
        description,
        location,
      });
      router.push("/(household)/track-request");
    } catch (err: any) {
      setError(err.message || "Unable to submit pickup request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Request pickup</Text>
      <Text style={styles.subtitle}>Share the details and a collector will be matched soon.</Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Waste type</Text>
        <View style={styles.optionGrid}>
          {wasteOptions.map((option) => {
            const active = option === wasteType;
            return (
              <Pressable
                key={option}
                style={[styles.optionChip, active && styles.activeOptionChip]}
                onPress={() => setWasteType(option)}
              >
                <Text style={[styles.optionLabel, active && styles.activeOptionLabel]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <Input placeholder="Description" value={description} onChangeText={setDescription} />
        <Input placeholder="Location" value={location} onChangeText={setLocation} />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={loading ? "Submitting..." : "Submit request"} fullWidth onPress={handleSubmit} disabled={loading} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: { gap: 12 },
  label: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 4 },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  activeOptionChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeOptionLabel: {
    color: "#fff",
  },
  error: {
    color: "#c62828",
    marginBottom: 12,
  },
});
