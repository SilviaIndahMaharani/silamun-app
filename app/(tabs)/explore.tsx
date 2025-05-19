import { View, Text, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jelajahi Dunia Lamun</Text>
      <Text style={styles.description}>
        Pelajari lebih lanjut tentang lamun dan bagaimana aplikasi ini dapat membantu mendeteksinya.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
});