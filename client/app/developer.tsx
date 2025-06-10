import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function DeveloperScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });
  const router = useRouter();

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="arrow-back" size={28} color="rgb(0, 94, 103)" />
        </TouchableOpacity>

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <Image
            source={require("../assets/images/developer.jpg")}
            style={styles.circle}
            resizeMode="cover"
          />
          <Text style={styles.developedBy}>Dikembangkan oleh</Text>
          <Text style={styles.name}>Silvia Indah Maharani</Text>

          <Text style={styles.copyrightLabel}>Hak Cipta</Text>
          <Text style={styles.copyright}>
            © 2025 by Silvia Indah Maharani.{"\n"}
            All Rights Reserved.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 4,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 40,
  },
  appName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginTop: 8,
    marginBottom: 40,
  },
  card: {
    backgroundColor: "rgba(173, 255, 237, 0.7)",
    width: width * 0.85,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  circle: {
    width: 70,
    height: 70,
    backgroundColor: "#ffffff",
    borderRadius: 35,
    marginBottom: 16,
  },
  developedBy: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#004B50",
  },
  name: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#004B50",
    marginBottom: 30,
  },
  copyrightLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: "#333",
    alignSelf: "flex-start",
  },
  copyright: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#333",
    alignSelf: "flex-start",
    marginTop: 4,
  },
});
