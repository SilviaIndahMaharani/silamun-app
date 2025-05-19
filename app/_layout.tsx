import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"), // Font tambahan untuk header
  });

  if (!loaded) {
    // Splash screen sederhana saat font belum dimuat
    return (
      <View style={styles.splashContainer}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.splashText}>Silamun</Text>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? customDarkTheme : customLightTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            headerTitle: "Silamun - Deteksi Lamun",
            headerTitleStyle: styles.headerTitle,
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#00BFFF",
            },
            headerTintColor: "#FFFFFF",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

// Tema kustom untuk aplikasi
const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00BFFF",
    background: "#F0F8FF",
    card: "#00BFFF",
    text: "#000000",
    border: "#00BFFF",
  },
};

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#1E90FF",
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    border: "#1E90FF",
  },
};

// Gaya tambahan
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BFFF",
  },
  logo: {
    width: 150, // Sesuaikan ukuran logo
    height: 150,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 32,
    fontFamily: "SpaceMono",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "SpaceMono",
    fontSize: 20,
    color: "#FFFFFF",
  },
});
