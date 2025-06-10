import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.menuGrid}>
        <Link href="/take-photo" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Feather name="camera" size={32} color="#0099A8" />
            </View>
            <Text style={styles.menuText}>Ambil Foto</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/upload-image" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Feather name="upload" size={32} color="#0099A8" />
            </View>
            <Text style={styles.menuText}>Unggah Gambar</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/seagrass-types" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons name="sea" size={32} color="#0099A8" />
            </View>
            <Text style={styles.menuText}>Spesies Lamun</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/developer" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle-outline" size={32} color="#0099A8" />
            </View>
            <Text style={styles.menuText}>Informasi</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const ITEM_SIZE = width * 0.4;

const styles = StyleSheet.create({
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.8,
    },
  container: {
    flex: 1,
    backgroundColor: "#0099A8",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 64,
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "85%",
  },
  menuItem: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "rgba(173, 255, 237, 0.7)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 2,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    opacity: 0.9,
  },
  menuText: {
    fontSize: 15,
    color: "#006D77",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
  },
});
