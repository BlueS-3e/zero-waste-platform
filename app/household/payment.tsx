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

import { BrandHeader } from "@/components/common/BrandHeader";

export default function PaymentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [operator, setOperator] = useState<MobileMoneyOperator>("MTN");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<string>("2.50");
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const requests = await getRequestsByHousehold(user.id);
        const active = requests[0];
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
      Alert.alert("Invalid input", "Please provide a phone number and a valid amount.");
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

      Alert.alert("Payment initiated", "Please confirm the payment on your mobile device.");
      router.replace("/household/track-request");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Unable to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader title="Payment" showLogout showBack />
      <Text style={styles.subtitle}>Choose your operator and confirm the payment on your phone.</Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Operator</Text>
        <View style={styles.operatorRow}>
          <Button title="MTN" variant={operator === "MTN" ? "primary" : "ghost"} onPress={() => setOperator("MTN")} />
          <Button title="Vodafone" variant={operator === "Vodafone" ? "primary" : "ghost"} onPress={() => setOperator("Vodafone" as MobileMoneyOperator)} />
          <Button title="Tigo" variant={operator === "Tigo" ? "primary" : "ghost"} onPress={() => setOperator("Tigo" as MobileMoneyOperator)} />
        </View>

        <Text style={styles.label}>Phone number</Text>
        <Input placeholder="e.g. 024XXXXXXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Amount (USD)</Text>
        <Input placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />

        <Button title={loading ? "Starting payment..." : "Pay now"} onPress={handleSubmit} fullWidth disabled={loading} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36, gap: 12 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: { gap: 12 },
  label: { fontSize: 13, color: colors.text, marginTop: 8, marginBottom: 6 },
  operatorRow: { flexDirection: "row", gap: 8, justifyContent: "space-between", marginBottom: 8 },
});
