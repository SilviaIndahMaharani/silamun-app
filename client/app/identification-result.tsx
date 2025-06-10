import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

  const screenWidth = Dimensions.get('window').width;
  const scaleFactor = imageSize.width ? screenWidth / imageSize.width : 1;
  const scaledHeight = imageSize.height * scaleFactor;

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.backgroundImage}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="rgb(0, 94, 103)" />
      </TouchableOpacity>

       <View style={styles.TitleWrapper}>
            <Text style={styles.Title}>Hasil Identifikasi</Text>
        </View>

      {imageUri && imageSize.width > 0 && (
        <View style={[styles.imageContainer, { height: scaledHeight }]}>
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: scaledHeight, borderRadius: 16 }}
            resizeMode="cover"
          />
          {parsedDetections.map((det, i) => {
            const [x1, y1, x2, y2] = det.box;
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: x1 * scaleFactor,
                  top: y1 * scaleFactor,
                  width: (x2 - x1) * scaleFactor,
                  height: (y2 - y1) * scaleFactor,
                  borderWidth: 2,
                  borderColor: 'red',
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                }}
              >
                <Text style={styles.boxLabel}>
                  {det.label} ({(det.score * 100).toFixed(1)}%)
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!imageUri || !imageSize.width ? (
          <Text style={styles.noDetectionText}>Gambar tidak tersedia</Text>
        ) : parsedDetections.length === 0 ? (
          <Text style={styles.noDetectionText}>Tidak ada deteksi ditemukan.</Text>
        ) : (
          <View style={styles.card}>
            {parsedDetections.map((det, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Text style={styles.label}>
                  Jenis Lamun: <Text style={styles.value}>{det.data_lamun?.nama ?? 'Tidak ditemukan'}</Text>
                </Text>
                <Text style={styles.label}>
                  Keyakinan: <Text style={styles.value}>{(det.score * 100).toFixed(2)}%</Text>
                </Text>
                <Text style={styles.label}>
                  Genus: <Text style={styles.value}>{det.data_lamun?.Genus ?? 'Tidak ditemukan'}</Text>
                </Text>
                <Text style={styles.label}>
                  Spesies: <Text style={styles.value}>{det.data_lamun?.Species ?? 'Tidak ditemukan'}</Text>
                </Text>
                <Text style={styles.label}>
                  Daun: <Text style={styles.value}>{det.data_lamun?.Daun ?? 'Tidak ditemukan'}</Text>
                </Text>
                <Text style={styles.label}>
                  Rhizoma: <Text style={styles.value}>{det.data_lamun?.Rhizoma ?? 'Tidak ditemukan'}</Text>
                </Text>
                <Text style={styles.label}>
                  Akar: <Text style={styles.value}>{det.data_lamun?.Akar ?? 'Tidak ditemukan'}</Text>
                </Text> 
                <Text style={styles.label}>
                  Keterangan: <Text style={styles.value}>{det.data_lamun?.Keterangan ?? 'Tidak ditemukan'}</Text>
                </Text> 
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  imageContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
    marginTop: 100,
    paddingHorizontal: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    paddingTop: 20,
  },
 TitleWrapper: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  Title: {
    backgroundColor: "rgba(119, 248, 210, 0.95)",
    color: "rgb(0, 94, 103)",
    fontSize: 18,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
    fontFamily: "Poppins-Bold",
  },
  noDetectionText: {
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderColor: '#007B7F',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  boxLabel: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    color: '#fff',
    backgroundColor: 'rgba(255,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#005C62',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#d0f0ed',
    paddingTop: 8,
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginTop: 2,
  },
});
