import "../global.css";
import { Stack } from "expo-router";
import { ThemeProvider } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade"
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="logo-upload" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="invoices/create/index" />
          <Stack.Screen name="invoices/create/items" />
          <Stack.Screen name="invoices/statuses" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
