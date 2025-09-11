import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Profile Avatar */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>View Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15, alignItems: 'center' },

  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  name: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  email: { color: '#888', fontSize: 14 },

  actions: { width: '100%', marginTop: 20 },
  actionButton: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  actionText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  logoutButton: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
