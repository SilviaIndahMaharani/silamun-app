import { useUploadImage } from '@/service/useUploadImage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  View
} from 'react-native';
import { useFonts } from 'expo-font';

export default function UploadImage() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [preprocessedPhoto, setPreprocessedPhoto] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(true);
  const { loading, uploadImage, preprocess } = useUploadImage();
  const router = useRouter();

  if (!fontsLoaded) return null;

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Izin kamera ditolak');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setCapturedPhoto(uri);

      try {
        const { result } = await preprocess(uri);
        setPreprocessedPhoto(`data:image/jpeg;base64,${result.preprocessed_base64}`);
      } catch (err: any) {
        Alert.alert("Gagal Preprocess", err.message);
      }
    }
  };

const handleUpload = async () => {
  if (!capturedPhoto) return;

  try {
    const { result } = await uploadImage(capturedPhoto);
    router.push({
      pathname: '/identification-result',
      params: {
        detections: JSON.stringify(result.detections),
        imageUri: preprocessedPhoto, 
      },
    });
  } catch (err: any) {
    Alert.alert('Upload Gagal', err.message);
  }
};

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.7 }}
    >
            <Image
        source={require("../assets/images/logo_umrah.png")} // ganti sesuai path file-mu
        style={styles.topRightLogo}
      />



      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
        <Ionicons name="arrow-back" size={28} color="rgb(0, 94, 103)" />
      </TouchableOpacity>

      {capturedPhoto ? (
        <View style={styles.previewContainer}>
          <View style={styles.previewTitleWrapper}>
            <Text style={styles.previewTitle}>Pratinjau</Text>
          </View>
          <View style={styles.comparisonWrapper}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Sebelum</Text>
              <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Sesudah</Text>
              {preprocessedPhoto ? (
                <Image source={{ uri: preprocessedPhoto }} style={styles.previewImage} />
              ) : (
                <View style={[styles.previewImage, styles.emptyPreprocess]}>
                  <Text style={{ color: "#888" }}>Belum diproses</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={handleUpload}
              style={[styles.actionButton, { backgroundColor: '#0ea5e9' }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.actionButtonText}>Prediksi</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCapturedPhoto(null);
                setPreprocessedPhoto(null);
              }}
              style={[styles.actionButton, {
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#6b7280',
              }]}
            >
              <Text style={[styles.actionButtonText, { color: '#0ea5e9' }]}>Ambil Ulang</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.containerOperCamera}>
          <TouchableOpacity onPress={openCamera} style={styles.openCamera}>
            <Ionicons name="camera" size={40} color="rgb(0, 94, 103)" />
            <Text style={styles.textOpenCamera}>  Buka Kamera</Text>
          </TouchableOpacity>
           <View style={styles.rulesBox}>
      <View style={styles.modalHeader}>
        <Ionicons name="information-circle-outline" size={22} color="rgb(0, 94, 103)" />
        <Text style={styles.rulesTitle}>Aturan Pengambilan Foto</Text>
      </View>
      <View style={styles.divider} />
      {[
        "Pastikan gambar fokus dan objek jelas terlihat.",
        "Gunakan pencahayaan yang cukup dan hindari bayangan.",
        "Hindari gangguan latar belakang atau refleksi.",
        "Ambil gambar saat lamun tidak bergerak dan stabil.",
        "Hindari pencahayaan gelap atau objek lain yang mengganggu.",
        "Gunakan sudut yang tepat agar objek terlihat jelas.",
        "Saat ini SiLamun hanya dapat mengidentifikasi lamun jenis Cymodocea rotundata, Enhalus acoroides, Syringodium isoetifolium, dan Thalassia hemprichii.",
      ].map((rule, index) => (
        <View key={index} style={styles.bulletItem}>
          <Ionicons name="leaf-outline" size={16} color="rgb(0, 94, 103)" style={{ marginRight: 6 }} />
          <Text style={styles.bulletText}>{rule}</Text>
        </View>
      ))}
    </View>
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
    topRightLogo: {
  position: "absolute",
  top: 40,
  right: 20,
  width: 40,
  height: 40,
  zIndex: 20,
},
rulesBox: {
  marginTop: 20,
  backgroundColor: '#E0FFFA',
  borderRadius: 16,
  padding: 16,
  width: '85%',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
},
rulesTitle: {
  fontSize: 16,
  color: 'rgb(0, 94, 103)',
  fontFamily: 'Poppins-Bold',
  marginLeft: 8,
},

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(119, 248, 210, 0.8)',
    borderRadius: 20,
    padding: 6,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgb(128,255,214)',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    color: 'rgb(0, 94, 103)',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'justify',
    fontFamily: 'Poppins-Regular',
  },
  modalButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'rgb(0, 94, 103)',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 30,
  },
  previewTitleWrapper: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewTitle: {
    backgroundColor: 'rgba(119, 248, 210, 0.95)',
    color: 'rgb(0, 94, 103)',
    fontSize: 18,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
    fontFamily: 'Poppins-Bold',
  },
  comparisonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 24,
    marginTop: 60,
    width: "100%",
  },
  comparisonItem: {
    flex: 1,
    alignItems: "center",
  },
  comparisonLabel: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    color: "#0ea5e9",
    marginBottom: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 8,
    elevation: 2,
  },
  previewImage: {
    height: 220,
    width: "100%",
    borderRadius: 16,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: "#0ea5e9",
    backgroundColor: "#f0f0f0",
  },
  emptyPreprocess: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  containerOperCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openCamera: {
  backgroundColor: "#fff",
  width: 150,
  height: 150,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  elevation: 1,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  },
  textOpenCamera: {
  color: "#004B4E",
  fontSize: 19,
  fontWeight: "600",
  fontFamily: "Poppins-Bold",
  marginTop: 8,
  textAlign: "center",
  },
  modalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 8,
},
divider: {
  height: 1,
  backgroundColor: '#006D77',
  marginVertical: 10,
  opacity: 0.3,
},
bulletItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 10,
},
bulletText: {
  flex: 1,
  fontSize: 15,
  fontFamily: 'Poppins-Regular',
  color: '#003C3C',
  lineHeight: 22,
},

});