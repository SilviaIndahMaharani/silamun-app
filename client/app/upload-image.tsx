import { useUploadImage } from '@/service/useUploadImage';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UploadImage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { loading, error, uploadImage } = useUploadImage();
  const router = useRouter();
  const navigation = useNavigation();
  const [showRules, setShowRules] = useState(true);

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin akses galeri ditolak");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      const { result, fileUri } = await uploadImage(selectedImage);
      router.push({
        pathname: "/identification-result",
        params: {
          detections: JSON.stringify(result.detections),
          imageUri: fileUri,
        },
      });
    } catch (err: any) {
      Alert.alert("Upload tidak berhasil", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.7 }}
    >
      <Modal visible={showRules} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Aturan Pemilihan Gambar</Text>
              <Text style={styles.modalText}>
                1. Pastikan gambar fokus dan objek jelas terlihat. {"\n"}
                2. Hindari gangguan latar belakang atau refleksi. {"\n"}
                3. Hindari pencahayaan gelap atau objek lain yang mengganggu. {"\n"}
                4. Saat ini SiLamun hanya dapat mengidentifikasi lamun jenis Cymodocea rotundata, Enhalus acoroides, Syringodium isoetifolium, dan Thalassia hemprichii.
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowRules(false)}>
                <Text style={styles.modalButtonText}>Mengerti</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")}>
        <Ionicons name="arrow-back" size={28} color="rgb(0, 94, 103)" />
      </TouchableOpacity>

      {selectedImage ? (
        <View style={styles.previewContainer}>
          <View style={styles.previewTitleWrapper}>
            <Text style={styles.previewTitle}>Preview Foto</Text>
          </View>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={handleUpload}
              style={[styles.actionButton, { backgroundColor: "#0ea5e9" }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.actionButtonText}>Prediksi</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={[
                styles.actionButton,
                {
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#6b7280",
                },
              ]}
            >
              <Text style={[styles.actionButtonText, { color: "#0ea5e9" }]}>Ambil Ulang</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.containerOperCamera}>
          <TouchableOpacity onPress={pickImageFromGallery} style={styles.openCamera}>
            <AntDesign name="picture" size={22} color="rgb(0, 94, 103)" />
            <Text style={styles.textOpenCamera}> Pilih dari Galeri</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
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
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "rgb(128,255,214)",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
    width: "90%",
  },
  modalTitle: {
    color: "rgb(0, 94, 103)",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  modalText: {
    fontSize: 16,
    textAlign: "justify",
    fontFamily: "Poppins-Regular",
  },
  modalButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "rgb(0, 94, 103)",
    fontSize: 16,
    fontWeight: "600",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 30,
  },
  previewTitleWrapper: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  previewTitle: {
    backgroundColor: "rgba(119, 248, 210, 0.95)",
    color: "rgb(0, 94, 103)",
    fontSize: 18,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
    fontFamily: "Poppins-Bold",
  },
  previewImage: {
    width: "100%",
    height: "70%",
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: "cover",
  },
  buttonWrapper: {
    width: "100%",
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  containerOperCamera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openCamera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    width: "60%",
    elevation: 5,
  },
  textOpenCamera: {
    color: "rgb(0, 94, 103)",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-Bold",
    textAlignVertical: "center",
  },
});
