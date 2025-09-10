import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function PlaylistsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Good Morning Section */}
        <Text style={styles.sectionTitle}>Good morning</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.playlistCardSmall}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.playlistImageSmall} />
            <Text style={styles.playlistTextSmall}>Top Hits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playlistCardSmall}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.playlistImageSmall} />
            <Text style={styles.playlistTextSmall}>Chill Hits</Text>
          </TouchableOpacity>
        </View>

        {/* Made For You */}
        <Text style={styles.sectionTitle}>Made For You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.playlistCard}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.playlistImage} />
            <Text style={styles.playlistName}>On Repeat</Text>
            <Text style={styles.playlistDesc}>Songs you can’t get enough of.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playlistCard}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.playlistImage} />
            <Text style={styles.playlistName}>Discover Weekly</Text>
            <Text style={styles.playlistDesc}>Fresh music picked for you.</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Popular Playlists */}
        <Text style={styles.sectionTitle}>Popular playlists</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.playlistCard}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.playlistImage} />
            <Text style={styles.playlistName}>Feelin’ Good</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playlistCard}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.playlistImage} />
            <Text style={styles.playlistName}>Pumped Pop</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  playlistCardSmall: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
    flex: 1,
  },
  playlistImageSmall: { width: 40, height: 40, marginRight: 10 },
  playlistTextSmall: { color: '#fff', fontSize: 14 },
  playlistCard: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 10,
    width: 140,
    marginRight: 15,
  },
  playlistImage: { width: '100%', height: 120, borderRadius: 8 },
  playlistName: { color: '#fff', fontWeight: 'bold', marginTop: 8 },
  playlistDesc: { color: '#888', fontSize: 12 },
});
