import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function IdentificationResult() {
  const navigation = useNavigation();
  const { detections, imageUri } = useLocalSearchParams<{
    detections?: string;
    imageUri?: string;
  }>();

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Parse detection results, fallback to [] if parsing fails
  const parsedDetections: any[] = detections
    ? (() => {
        try {
          return JSON.parse(detections);
        } catch {
          return [];
        }
      })()
    : [];

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => setImageSize({ width, height }),
        () => setImageSize({ width: 0, height: 0 })
      );
    }
  }, [imageUri]);

  const screenWidth = Dimensions.get("window").width;
  const scaleFactor = imageSize.width
    ? (screenWidth - 32) / imageSize.width
    : 1;

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.backgroundImage}
    >
            <Image
        source={require("../assets/images/logo_umrah.png")} // ganti sesuai path file-mu
        style={styles.topRightLogo}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="rgb(0, 94, 103)" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.Title}>Hasil Identifikasi</Text>

        {!imageUri || !imageSize.width ? (
          <Text style={styles.noDetectionText}>Gambar tidak tersedia</Text>
        ) : (
          <View
  style={[styles.imageFrame, {
    width: "100%",
    height: imageSize.height * scaleFactor,
    marginVertical: 16,
  }]}
>
  <Image
    source={{ uri: imageUri }}
    style={styles.image}
    resizeMode="cover"
  />
  {parsedDetections.map((det, i) => {
    const [x1, y1, x2, y2] = det.box;
    const boxStyle = {
      position: "absolute" as const,
      left: x1 * scaleFactor,
      top: y1 * scaleFactor,
      width: (x2 - x1) * scaleFactor,
      height: (y2 - y1) * scaleFactor,
      borderWidth: 2,
      borderColor: "#0000FF",
      borderRadius: 4,
      backgroundColor: "rgba(0, 145, 255, 0.2)",
    };
    return (
      <View key={i} style={boxStyle}>
        <View style={styles.boxLabelWrapper}>
          <Text style={styles.boxLabel}>
            {det.label} ({(det.score * 100).toFixed(1)}%)
          </Text>
        </View>
      </View>
    );
  })}
</View>
        )}

        {parsedDetections.length === 0 && (
          <Text style={styles.noDetectionText}>Tidak ada deteksi ditemukan</Text>
        )}

 {parsedDetections.map((det, i) => (
  <View key={i} style={{ marginBottom: 24 }}>
    {/* Jenis dan Keyakinan */}
    <View style={styles.subCard}>
      <Text style={styles.detectionTitle}>Deteksi {i + 1}</Text>
      <Text style={styles.subCardTitle}>📈 Hasil Utama</Text>
      <Text style={styles.label}>Jenis Lamun</Text>
      <Text style={styles.value}>{det.data_lamun?.nama ?? "-"}</Text>
      <Text style={styles.label}>Keyakinan</Text>
      <Text style={styles.value}>{(det.score * 100).toFixed(2)}%</Text>
    </View>

    {/* Genetik */}
    <View style={styles.subCard}>
      <Text style={styles.subCardTitle}>🧬 Genetik</Text>
      <Text style={styles.label}>Genus</Text>
      <Text style={styles.value}>{det.data_lamun?.Genus ?? "-"}</Text>
      <Text style={styles.label}>Spesies</Text>
      <Text style={styles.value}>{det.data_lamun?.Species ?? "-"}</Text>
    </View>

    {/* Morfologi */}
    <View style={styles.subCard}>
      <Text style={styles.subCardTitle}>🌿 Morfologi</Text>
      <Text style={styles.label}>Daun</Text>
      <Text style={styles.value}>{det.data_lamun?.Daun ?? "-"}</Text>
      <Text style={styles.label}>Rhizoma</Text>
      <Text style={styles.value}>{det.data_lamun?.Rhizoma ?? "-"}</Text>
      <Text style={styles.label}>Akar</Text>
      <Text style={styles.value}>{det.data_lamun?.Akar ?? "-"}</Text>
    </View>

    {/* Keterangan */}
    <View style={styles.subCard}>
      <Text style={styles.subCardTitle}>📄 Keterangan</Text>
      <Text style={styles.value}>{det.data_lamun?.Keterangan ?? "-"}</Text>
    </View>
  </View>
))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  detectionTitle: {
  fontSize: 18,
  fontFamily: "Poppins-Bold",
  color: "#007B7F",
  backgroundColor: "#E0FAF7",
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 10,
  marginBottom: 12,
  alignSelf: "flex-start",
},
  topRightLogo: {
  position: "absolute",
  top: 40,
  right: 20,
  width: 40,
  height: 40,
  zIndex: 20,
},
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    opacity: 0.92,
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
  Title: {
  backgroundColor: "#77F8D2",
  paddingVertical: 10,
  paddingHorizontal: 24,
  borderRadius: 14,
  marginTop: 24,
  alignSelf: "center",
  fontSize: 20,
  color: "#005C62",
  fontFamily: "Poppins-Bold",
  textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    paddingTop: 10,
    flexGrow: 1,
  },

  subCard: {
  backgroundColor: "#F7FFFE",
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 20,
  marginBottom: 14,
  borderLeftWidth: 4,
  borderLeftColor: "#00B6A0",
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 4,
  elevation: 2,
},

subCardTitle: {
  fontSize: 16,
  fontFamily: "Poppins-SemiBold",
  color: "#007B7F",
  marginBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: "#C8F1EB",
  paddingBottom: 4,
},

card: {
  backgroundColor: "rgba(255, 255, 255, 0.95)", // lebih terang dan elegan
  borderRadius: 18,
  paddingVertical: 20,
  paddingHorizontal: 24,
  marginBottom: 32,
  borderWidth: 1,
  borderColor: "#77F8D2",

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 4,
},
label: {
  fontFamily: "Poppins-SemiBold",
  fontSize: 15.5,
  color: "#007B7F",
  marginTop: 12,
  marginBottom: 2,
},

value: {
  fontSize: 14,
  color: "#444",
  fontFamily: "Poppins-Regular",
  marginBottom: 6,
  lineHeight: 20,
},

  noDetectionText: {
  backgroundColor: "#C11B17",
  paddingVertical: 10,
  paddingHorizontal: 24,
  borderRadius: 14,
  marginTop: 24,
  alignSelf: "center",
  fontSize: 20,
  color: "#ffff",
  fontFamily: "Poppins-Bold",
  textAlign: "center",
  },
  imageFrame: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#77F8D2",
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  boxLabelWrapper: {
    backgroundColor: "rgba(34, 0, 255, 0.85)",
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 2,
    maxWidth: "100%",
  },
  boxLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Poppins-Regular",
  },
});