import { Stack } from "expo-router";
import { AuthProvider } from "@/store/authStore";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(household)" />
        <Stack.Screen name="(collector)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </AuthProvider>
  );
}
