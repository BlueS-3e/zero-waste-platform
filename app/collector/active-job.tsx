import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, Linking, Platform } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { getActiveRequestForCollector, updateRequestStatus, declineRequest, confirmPayment } from "@/features/requests/api";
import type { WasteRequest } from "@/features/requests/types";
import { typography } from "@/theme/typography";

import { BrandHeader } from "@/components/common/BrandHeader";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function ActiveJobScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeRequest, setActiveRequest] = useState<WasteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActiveJob = async () => {
    if (!user) return;
    setError(null);
    setLoading(true);

    try {
      const data = await getActiveRequestForCollector(user.id);
      setActiveRequest(data);
    } catch (err: any) {
      setError(err.message || "Unable to load active job.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveJob();
  }, [user]);

  const handleUpdateStatus = async (newStatus: any) => {
    if (!activeRequest) return;
    setError(null);

    try {
      const updated = await updateRequestStatus(activeRequest.id, newStatus);
      setActiveRequest(updated);
    } catch (err: any) {
      setError(err.message || `Unable to update status to ${newStatus}.`);
    }
  };

  const handleConfirmPayment = async () => {
    if (!activeRequest) return;
    setError(null);

    const performConfirm = async () => {
      try {
        await confirmPayment(activeRequest.id);
        if (Platform.OS === 'web') {
          window.alert("Job Finalized: Payment confirmed and job marked as completed.");
        } else {
          Alert.alert("Job Finalized", "Payment confirmed and job marked as completed.");
        }
        setActiveRequest(null);
      } catch (err: any) {
        setError(err.message || "Unable to confirm payment.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Confirm you have received the payment from the household?")) {
        performConfirm();
      }
    } else {
      Alert.alert(
        "Confirm Payment?",
        "Are you sure you have received the payment for this collection?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes, Paid", onPress: performConfirm }
        ]
      );
    }
  };

  const handleOpenNavigation = () => {
    if (!activeRequest) return;

    const label = encodeURIComponent("Pickup Location");
    let url = "";

    if (activeRequest.location_lat != null && activeRequest.location_lng != null) {
      const lat = activeRequest.location_lat;
      const lng = activeRequest.location_lng;
      url = Platform.select({
        ios: `maps:0,0?q=${label}@${lat},${lng}`,
        android: `geo:0,0?q=${lat},${lng}(${label})`,
        web: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      }) || "";
    } else if (activeRequest.address) {
      const query = encodeURIComponent(activeRequest.address);
      url = Platform.select({
        ios: `maps:0,0?q=${query}`,
        android: `geo:0,0?q=${query}`,
        web: `https://www.google.com/maps/search/?api=1&query=${query}`
      }) || "";
    }

    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open maps application.");
        }
      });
    } else {
      Alert.alert("No Location", "No address or GPS coordinates available for this request.");
    }
  };

  const handleCallHousehold = () => {
    if (!activeRequest?.phone) {
      Alert.alert("No number provided", "The household didn't provide a contact number for this request.");
      return;
    }

    const url = `tel:${activeRequest.phone}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Your device does not support making phone calls.");
      }
    });
  };

  const handleDeclineJob = () => {
    if (!activeRequest) return;

    const performDecline = async () => {
      try {
        await declineRequest(activeRequest.id);
        if (Platform.OS === 'web') {
          window.alert("Job Released: This pickup is now back in the pending pool.");
        } else {
          Alert.alert("Job Released", "This pickup is now back in the pending pool.");
        }
        setActiveRequest(null);
      } catch (err: any) {
        setError(err.message || "Unable to decline job.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to release this job? It will be made available to other collectors.")) {
        performDecline();
      }
    } else {
      Alert.alert(
        "Decline Job?",
        "Are you sure you want to release this job? It will be made available to other collectors.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Decline & Release",
            style: "destructive",
            onPress: performDecline
          }
        ]
      );
    }
  };

  const renderWorkflowButtons = () => {
    if (!activeRequest) return null;

    if (activeRequest.status === "accepted") {
      return (
        <View style={styles.buttonGroup}>
          <Button title="Start Navigating" fullWidth onPress={handleOpenNavigation} />
          <Button title="Arrived at Location" fullWidth variant="secondary" onPress={() => handleUpdateStatus("in_progress")} />
          <Button title="Call Household" fullWidth variant="ghost" onPress={handleCallHousehold} />
          <Button title="Decline Job" fullWidth variant="ghost" onPress={handleDeclineJob} style={{ marginTop: 8 }} />
        </View>
      );
    }

    if (activeRequest.status === "in_progress") {
      return (
        <View style={styles.buttonGroup}>
          <Button title="Mark Waste Collected" fullWidth onPress={() => handleUpdateStatus("collected")} />
          <Button title="Call Household" fullWidth variant="ghost" onPress={handleCallHousehold} />
          <Button title="Decline Job" fullWidth variant="ghost" onPress={handleDeclineJob} style={{ marginTop: 8 }} />
        </View>
      );
    }

    if (activeRequest.status === "collected") {
      return (
        <View style={styles.buttonGroup}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoText}>Awaiting payment from household...</Text>
          </View>
          <Button title="Confirm Payment Received (₵)" fullWidth onPress={handleConfirmPayment} />
          <Button title="Call Household" fullWidth variant="ghost" onPress={handleCallHousehold} />
        </View>
      );
    }

    return null;
  };

  const getStatusStep = () => {
    if (!activeRequest) return 0;
    switch (activeRequest.status) {
      case "accepted": return 1;
      case "in_progress": return 2;
      case "collected": return 3;
      case "completed": return 4;
      default: return 0;
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Active job" showLogout showBack />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}

      {activeRequest ? (
        <>
          <View style={styles.stepperContainer}>
            <View style={[styles.step, getStatusStep() >= 1 && styles.stepActive]}>
              <Text style={[styles.stepText, getStatusStep() >= 1 && styles.stepTextActive]}>Accepted</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.step, getStatusStep() >= 2 && styles.stepActive]}>
              <Text style={[styles.stepText, getStatusStep() >= 2 && styles.stepTextActive]}>Arrived</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.step, getStatusStep() >= 3 && styles.stepActive]}>
              <Text style={[styles.stepText, getStatusStep() >= 3 && styles.stepTextActive]}>Collected</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.step, getStatusStep() >= 4 && styles.stepActive]}>
              <Text style={[styles.stepText, getStatusStep() >= 4 && styles.stepTextActive]}>Done</Text>
            </View>
          </View>

          <Card style={styles.activeCard}>
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>{activeRequest.waste_type} Pickup</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeRequest.status.replace('_', ' ')}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{activeRequest.address || "Fetching address..."}</Text>
            </View>

            {activeRequest.description && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Note:</Text>
                <Text style={styles.value}>{activeRequest.description}</Text>
              </View>
            )}

            <View style={styles.divider} />

            {renderWorkflowButtons()}
          </Card>

          {activeRequest.location_lat != null && activeRequest.location_lng != null ? (
            <Card style={styles.mapCard}>
              <Text style={styles.mapLabel}>Pickup Destination</Text>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: activeRequest.location_lat,
                  longitude: activeRequest.location_lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{ latitude: activeRequest.location_lat, longitude: activeRequest.location_lng }}
                  title="Pickup Location"
                  pinColor={colors.primary}
                />
              </MapView>
            </Card>
          ) : (
            <Card style={styles.noGpsCard}>
              <View style={styles.noGpsIcon}>
                <Text style={{ fontSize: 24 }}>📍</Text>
              </View>
              <Text style={styles.noGpsTitle}>No GPS coordinates provided</Text>
              <Text style={styles.noGpsText}>
                The household provided a text address instead. Use the "Start Navigating" button to search for this location or call the household for directions.
              </Text>
            </Card>
          )}
        </>
      ) : !loading ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No active job</Text>
          <Text style={styles.emptySubtitle}>Visit the "Available Requests" screen to pick up your next task.</Text>
          <Button title="Browse Requests" variant="secondary" onPress={() => router.push("/collector/available-requests")} />
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 40, gap: 16 },
  error: { color: colors.danger, textAlign: "center", marginBottom: 8, ...typography.body },

  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 4
  },
  step: {
    width: 80,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: "center"
  },
  stepActive: { backgroundColor: colors.primary },
  stepText: { fontSize: 11, fontWeight: "700", color: colors.muted },
  stepTextActive: { color: "#fff" },
  stepLine: { width: 20, height: 2, backgroundColor: colors.border, marginHorizontal: 4 },

  activeCard: { padding: 16, borderRadius: 20, backgroundColor: colors.surface, gap: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  cardTitle: { ...typography.title, fontSize: 18 },
  badge: { backgroundColor: colors.surfaceLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  badgeText: { fontSize: 10, fontWeight: "800", color: colors.primary, textTransform: "uppercase" },

  infoRow: { gap: 2 },
  label: { ...typography.label, color: colors.muted, fontSize: 12 },
  value: { ...typography.body, color: colors.text, fontWeight: "600" },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  buttonGroup: { gap: 10 },
  paymentInfo: { backgroundColor: colors.surfaceLight, padding: 12, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.warning, marginBottom: 4 },
  paymentInfoText: { ...typography.body, fontSize: 13, color: colors.text, fontWeight: "600" },

  mapCard: { padding: 0, overflow: "hidden", borderRadius: 20 },
  mapLabel: { ...typography.label, padding: 16, paddingBottom: 8 },
  map: { width: "100%", height: 240 },

  noGpsCard: { alignItems: "center", padding: 24, gap: 8, backgroundColor: colors.surfaceLight, borderStyle: "dashed", borderWidth: 1, borderColor: colors.border },
  noGpsIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  noGpsTitle: { ...typography.title, fontSize: 16, color: colors.text },
  noGpsText: { ...typography.body, fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 18 },

  emptyCard: { alignItems: "center", padding: 32, gap: 12, marginTop: 40 },
  emptyTitle: { ...typography.title, color: colors.text },
  emptySubtitle: { ...typography.body, color: colors.muted, textAlign: "center", marginBottom: 8 },
});
