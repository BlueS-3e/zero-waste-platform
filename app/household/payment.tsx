import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";
import { useAuth } from "@/store/authStore";
import { getRequestsByHousehold } from "@/features/requests/api";
import { initiateMobileMoneyPayment, MobileMoneyOperator } from "@/features/payments/api";
import { typography } from "@/theme/typography";

import { BrandHeader } from "@/components/common/BrandHeader";

export default function PaymentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [operator, setOperator] = useState<MobileMoneyOperator>("MTN");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<string>("27.00");
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const requests = await getRequestsByHousehold(user.id);
        const active = requests.find(r => r.status !== 'completed' && r.status !== 'cancelled') || requests[0];
        if (active) setRequestId(active.id);
      } catch {
        // ignore
      }
    };
    load();
  }, [user]);

  const handleSubmit = async () => {
    const numeric = parseFloat(amount);
    if (!phone || isNaN(numeric) || numeric <= 0) {
      Alert.alert("Invalid input", "Please provide a phone number and a valid amount in GHS.");
      return;
    }

    if (phone.length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid Ghana mobile number.");
      return;
    }

    setLoading(true);
    try {
      await initiateMobileMoneyPayment({
        requestId,
        householdId: user?.id,
        operator,
        phone,
        amount: numeric,
      });

      Alert.alert(
        "Payment Initiated",
        `A prompt has been sent to your ${operator} phone (${phone}). Please enter your PIN to authorize ₵${numeric.toFixed(2)}.`
      );
      router.replace("/household/track-request");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Unable to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Mobile Payment" showLogout showBack />
      <Text style={styles.subtitle}>Pay for your waste collection using Mobile Money (₵ GHS).</Text>

      <Card style={styles.card}>
        <View style={styles.feeBreakdown}>
          <Text style={styles.feeTitle}>Payment Summary</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Collection Service</Text>
            <Text style={styles.feeValue}>₵25.00</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Platform Service Fee</Text>
            <Text style={styles.feeValue}>₵2.00</Text>
          </View>
          <View style={styles.feeDivider} />
          <View style={styles.feeRow}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalValue}>₵27.00</Text>
          </View>
        </View>

        <View style={styles.collectorInfo}>
          <Text style={styles.collectorLabel}>Paying to Collector MoMo:</Text>
          <Text style={styles.collectorNumber}>024 123 9876 (ZeroWaste Collector)</Text>
        </View>

        <Text style={styles.label}>Select Your Network</Text>
        <View style={styles.operatorRow}>
          <Pressable
            style={[styles.operatorBtn, operator === "MTN" && styles.operatorBtnActive]}
            onPress={() => setOperator("MTN")}
          >
            <Text style={[styles.operatorText, operator === "MTN" && styles.operatorTextActive]}>MTN</Text>
          </Pressable>
          <Pressable
            style={[styles.operatorBtn, operator === "Vodafone" && styles.operatorBtnActive]}
            onPress={() => setOperator("Vodafone")}
          >
            <Text style={[styles.operatorText, operator === "Vodafone" && styles.operatorTextActive]}>Telecel</Text>
          </Pressable>
          <Pressable
            style={[styles.operatorBtn, operator === "Tigo" && styles.operatorBtnActive]}
            onPress={() => setOperator("Tigo")}
          >
            <Text style={[styles.operatorText, operator === "Tigo" && styles.operatorTextActive]}>AT</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Phone Number</Text>
        <Input placeholder="e.g. 0241234567" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} />

        <Text style={styles.label}>Amount (GHS)</Text>
        <Input placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Standard fees may apply based on your network operator.</Text>
        </View>

        <Button title={loading ? "Processing..." : "Authorize Payment"} onPress={handleSubmit} fullWidth disabled={loading} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 36, gap: 12 },
  subtitle: { ...typography.subtitle, marginBottom: 4 },
  card: { gap: 14, padding: 20, borderRadius: 20 },
  label: { ...typography.label, color: colors.text, marginTop: 4 },
  operatorRow: { flexDirection: "row", gap: 8, justifyContent: "space-between", marginBottom: 4 },
  operatorBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.surfaceLight
  },
  operatorBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  operatorText: { ...typography.label, color: colors.text },
  operatorTextActive: { color: "#fff" },
  infoBox: { backgroundColor: "#FFF9C4", padding: 12, borderRadius: 10, marginBottom: 4 },
  infoText: { fontSize: 11, color: "#827717", textAlign: "center", lineHeight: 16 },

  feeBreakdown: { backgroundColor: colors.surfaceLight, padding: 16, borderRadius: 16, borderStyle: "dashed", borderWidth: 1, borderColor: colors.border, marginBottom: 4 },
  feeTitle: { ...typography.label, color: colors.muted, marginBottom: 10, textTransform: "uppercase", fontSize: 11 },
  feeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  feeLabel: { ...typography.body, fontSize: 13, color: colors.text },
  feeValue: { ...typography.body, fontSize: 13, fontWeight: "600" },
  feeDivider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  totalLabel: { ...typography.body, fontWeight: "800", color: colors.text },
  totalValue: { ...typography.body, fontWeight: "800", color: colors.primary, fontSize: 16 },

  collectorInfo: { padding: 12, backgroundColor: "#E3F2FD", borderRadius: 12, marginBottom: 4 },
  collectorLabel: { fontSize: 10, color: "#1976D2", fontWeight: "700", textTransform: "uppercase" },
  collectorNumber: { fontSize: 14, fontWeight: "700", color: "#0D47A1", marginTop: 2 },
});
