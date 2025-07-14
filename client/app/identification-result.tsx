import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function IdentificationResult() {
  const navigation = useNavigation();
  const { detectionsOriginal, detectionsCLAHE, imageUri, originalUri } = useLocalSearchParams<{
    detectionsOriginal?: string;
    detectionsCLAHE?: string;
    imageUri?: string;
    originalUri?: string;
  }>();

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [renderedImageSize, setRenderedImageSize] = useState({ width: 0, height: 0 });
  const [slideIndex, setSlideIndex] = useState(0);

  const parsedOriginalDetections = detectionsOriginal ? JSON.parse(detectionsOriginal) : [];
  const parsedCLAHEDetections = detectionsCLAHE ? JSON.parse(detectionsCLAHE) : [];

  useEffect(() => {
    if (originalUri) {
      Image.getSize(
        originalUri,
        (width, height) => setImageSize({ width, height }),
        () => setImageSize({ width: 0, height: 0 })
      );
    }
  }, [originalUri]);

  const screenWidth = Dimensions.get("window").width;

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setSlideIndex(index);
  };

  const renderDetectionImage = (uri: string | undefined, detections: any[], label: string) => {
    if (!uri) return null;

    const width = screenWidth - 32;
    const height = imageSize.width ? imageSize.height * (width / imageSize.width) : 200;

    return (
      <View style={{ marginBottom: 32 }}>
        <Text style={styles.imageLabel}>{label}</Text>
        <View style={[styles.imageFrame, { width, height, alignSelf: "center" }]}>
          <Image
            source={{ uri }}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setRenderedImageSize({ width, height });
            }}
          />
          {detections.map((det, i) => {
            const [x1, y1, x2, y2] = det.box;
            const scaleX = renderedImageSize.width / imageSize.width;
            const scaleY = renderedImageSize.height / imageSize.height;
            return (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: x1 * scaleX,
                  top: y1 * scaleY,
                  width: (x2 - x1) * scaleX,
                  height: (y2 - y1) * scaleY,
                  borderWidth: 2,
                  borderColor: "#5740d4ff",
                  backgroundColor: "rgba(130, 99, 255, 0.2)",
                  borderRadius: 4,
                }}
              >
                <View style={styles.boxLabelWrapper}>
                  <Text style={styles.boxLabel}>
                    {det.label} ({(det.score * 100).toFixed(1)}%)
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        {/* Indikator slide */}
        <View style={styles.slideIndicator}>
          {[0, 1].map((i) => (
            <View key={i} style={[styles.dot, slideIndex === i ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>

        {/* Info Deteksi */}
        {detections.length === 0 ? (
          <Text style={styles.noDetectionText}>Tidak ada deteksi ditemukan</Text>
        ) : (
          detections.map((det, idx) => (
            <View key={idx} style={{ marginTop: 12 }}>
              <View style={styles.subCard}>
                <Text style={styles.detectionTitle}>Deteksi {idx + 1}</Text>
                <Text style={styles.subCardTitle}>📈 Hasil Utama</Text>
                <Text style={styles.label}>Jenis Lamun</Text>
                <Text style={styles.value}>{det.data_lamun?.nama ?? "-"}</Text>
                <Text style={styles.label}>Keyakinan</Text>
                <Text style={styles.value}>{(det.score * 100).toFixed(2)}%</Text>
              </View>

              <View style={styles.subCard}>
                <Text style={styles.subCardTitle}>🧬 Genetik</Text>
                <Text style={styles.label}>Genus</Text>
                <Text style={styles.value}>{det.data_lamun?.Genus ?? "-"}</Text>
                <Text style={styles.label}>Spesies</Text>
                <Text style={styles.value}>{det.data_lamun?.Species ?? "-"}</Text>
              </View>

              <View style={styles.subCard}>
                <Text style={styles.subCardTitle}>🌿 Morfologi</Text>
                <Text style={styles.label}>Daun</Text>
                <Text style={styles.value}>{det.data_lamun?.Daun ?? "-"}</Text>
                <Text style={styles.label}>Rhizoma</Text>
                <Text style={styles.value}>{det.data_lamun?.Rhizoma ?? "-"}</Text>
                <Text style={styles.label}>Akar</Text>
                <Text style={styles.value}>{det.data_lamun?.Akar ?? "-"}</Text>
              </View>

              <View style={styles.subCard}>
                <Text style={styles.subCardTitle}>📄 Keterangan</Text>
                <Text style={styles.value}>{det.data_lamun?.Keterangan ?? "-"}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <ImageBackground source={require("../assets/images/background.png")} style={styles.backgroundImage}>
      <Image source={require("../assets/images/logo_umrah.png")} style={styles.topRightLogo} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="rgb(0, 94, 103)" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.Title}>Hasil Deteksi</Text>

        {/* SLIDER */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16} style={{ marginTop: 20 }}>
          <View style={{ width: screenWidth, paddingHorizontal: 16 }}>{renderDetectionImage(originalUri, parsedOriginalDetections, "Gambar Asli")}</View>
          <View style={{ width: screenWidth, paddingHorizontal: 16 }}>{renderDetectionImage(imageUri, parsedCLAHEDetections, "Gambar Setelah Preprocessing")}</View>
        </ScrollView>
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
  imageLabel: {
    fontSize: 18,
    color: "#00555dff",
    backgroundColor: "#E0FAF7",
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginTop: 16,
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
  slideIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: "#00B6A0",
  },
  dotInactive: {
    backgroundColor: "#C8F1EB",
  },
});
