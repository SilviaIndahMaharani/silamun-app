import { useFetchSeagrassDetails } from '@/service/useFetch';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SeagrassDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: seagrassDetails,
    loading: isLoading,
    error,
  } = useFetchSeagrassDetails(id as string);

  const imageUrl = seagrassDetails?.imgSRC
    ? `http://195.200.15.181:5003/${seagrassDetails.imgSRC}`
    : null;

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
        <Ionicons name="arrow-back" size={26} color="#003c43" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{seagrassDetails?.nama}</Text>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.detailCard}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#003c43" />
          ) : error ? (
            <Text style={styles.errorText}>Terjadi kesalahan: {error.message}</Text>
          ) : (
            <>
              <Text style={styles.label}>Deskripsi:</Text>
              <Text style={styles.text}>{seagrassDetails?.dekripsi ?? '-'}</Text>
              <Text style={styles.label}>Ekologi:</Text>
              <Text style={styles.text}>{seagrassDetails?.ekologi ?? '-'}</Text>
              <Text style={styles.label}>Manfaat:</Text>
              <Text style={styles.text}>{seagrassDetails?.manfaat ?? '-'}</Text>
              <Text style={styles.label}>Penyebaran:</Text>
              <Text style={styles.text}>{seagrassDetails?.penyebaran ?? '-'}</Text>
            </>
          )}
        </View>
      </ScrollView>
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
  container: {
    padding: 16,
    paddingTop: 80,
    alignItems: 'center',
  },
 backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(119, 248, 210, 0.8)",
    borderRadius: 20,
    padding: 6,
  },
  card: {
    backgroundColor: '#a1f0d9',
    width: '100%',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003c43',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  detailCard: {
    backgroundColor: '#a1f0d9cc',
    width: '100%',
    borderRadius: 20,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#003c43',
    marginTop: 8,
  },
  text: {
    color: '#003c43',
    textAlign: 'justify',
  },
  errorText: {
    color: '#900',
    fontStyle: 'italic',
  },
});
