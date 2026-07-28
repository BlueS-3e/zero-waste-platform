import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { colors } from "@/theme/colors";

export default function RateCollectorScreen() {
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rate collector</Text>
      <Text style={styles.subtitle}>Leave feedback after a pickup.</Text>

      <Card style={styles.card}>
        <Input placeholder="Rating (1-5)" value={rating} onChangeText={setRating} keyboardType="numeric" />
        <Input placeholder="Feedback" value={note} onChangeText={setNote} />
        <Button title="Submit review" onPress={() => undefined} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 4 },
  card: { gap: 8 },
});
