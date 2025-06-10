import { fetchGetAllSeagrass } from "@/service/api";
import useFetch from "@/service/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";

const screenWidth = Dimensions.get("window").width;

export default function SeagrassTypes() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const router = useRouter();
  const { data: seagrassTypes, loading, error } = useFetch(fetchGetAllSeagrass);

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.backgroundImage}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
        <Ionicons name="arrow-back" size={24} color="rgb(0, 94, 103)" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={seagrassTypes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            const imageUrl = `http://195.200.15.181:5006${item.imgSRC}`;

            return (
              <View style={styles.card}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.Species}</Text>
                  <Text style={styles.cardDescription} numberOfLines={3}>
                    {item.Keterangan}
                  </Text>
                  <Link
                    href={{
                      pathname: "/seagrass-types/[id]",
                      params: { id: item.id.toString() },
                    }}
                    asChild
                  >
                    <TouchableOpacity style={styles.detailButton}>
                      <Text style={styles.detailButtonText}>Lihat Detail</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            );
          }}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(119, 248, 210, 0.8)",
    borderRadius: 20,
    padding: 6,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 64,
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 140,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "#b3fef2",
    borderRadius: 20,
    padding: 10,
    width: (screenWidth - 36) / 2,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#005e67",
    textAlign: "center",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#005e67",
    textAlign: "center",
    marginBottom: 6,
  },
  detailButton: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  detailButtonText: {
    fontSize: 12,
    color: "#005e67",
    fontFamily: "Poppins-Regular",
  },
});
