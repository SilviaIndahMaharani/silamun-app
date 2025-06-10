import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={true}/>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="take-photo" options={{ headerShown: false }}/>
        <Stack.Screen name="identification-result" options={{ headerShown: false }}/>
        <Stack.Screen name="upload-image" options={{ headerShown: false }}/>
        <Stack.Screen name="seagrass-types" options={{ headerShown: false }}/>
        <Stack.Screen name="seagrass-types/[id]" options={{ headerShown: false }}/>
        <Stack.Screen name="developer" options={{ headerShown: false }}/>
      </Stack>
    </SafeAreaProvider>
  );
}