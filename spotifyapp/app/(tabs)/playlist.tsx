import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function PlaylistsScreen() {
  const router = useRouter();

  const playlists = [
    { id: 1, name: 'Top Hits', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Chill Hits', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'On Repeat', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Discover Weekly', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Playlists</Text>
        <View style={styles.row}>
          {playlists.map((pl) => (
            <TouchableOpacity
              key={pl.id}
              style={styles.playlistCard}
              onPress={() => router.push(`/songs/${pl.id}`)} // ✅ navigate
            >
              <Image source={{ uri: pl.image }} style={styles.playlistImage} />
              <Text style={styles.playlistName}>{pl.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  playlistCard: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 10,
    width: 150,
    marginBottom: 15,
  },
  playlistImage: { width: '100%', height: 120, borderRadius: 8 },
  playlistName: { color: '#fff', fontWeight: 'bold', marginTop: 8 },
});
