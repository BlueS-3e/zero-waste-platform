import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { createRequest } from "@/features/requests/api";
import * as Location from "expo-location";

import { BrandHeader } from "@/components/common/BrandHeader";

const wasteOptions = ["Household", "Plastic", "Organic", "Electronic", "Bulk"];

export default function RequestPickupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [wasteType, setWasteType] = useState(wasteOptions[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
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
        address: location || undefined,
        location_lat: locationLat ?? null,
        location_lng: locationLng ?? null,
      });
      router.push("/household/track-request");
    } catch (err: any) {
      setError(err.message || "Unable to submit pickup request.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required to use this feature.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      setLocationLat(lat);
      setLocationLng(lng);
      setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (err: any) {
      Alert.alert("Location error", err?.message || "Unable to get current location.");
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Request pickup" showLogout showBack />
      <Text style={styles.subtitle}>Share the details and we’ll connect you with a collector in no time.</Text>

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
        <Button title="Use my location" fullWidth variant="ghost" onPress={handleUseMyLocation} />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={loading ? "Submitting..." : "Submit request"} fullWidth onPress={handleSubmit} disabled={loading} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
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
