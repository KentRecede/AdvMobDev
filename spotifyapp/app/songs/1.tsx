import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function SongsScreen() {
  const { id } = useLocalSearchParams(); // playlist id
  const [songs, setSongs] = useState<string[]>(['Song A', 'Song B', 'Song C']);
  const [input, setInput] = useState('');

  // History for undo/redo
  const [history, setHistory] = useState<string[][]>([]);
  const [future, setFuture] = useState<string[][]>([]);

  const saveHistory = (newSongs: string[]) => {
    setHistory([...history, songs]);
    setFuture([]);
    setSongs(newSongs);
  };

  const addSong = () => {
    if (!input.trim()) return;
    saveHistory([...songs, input]);
    setInput('');
  };

  const deleteSong = (index: number) => {
    const newSongs = songs.filter((_, i) => i !== index);
    saveHistory(newSongs);
  };

  const updateSong = (index: number, newName: string) => {
    const newSongs = songs.map((s, i) => (i === index ? newName : s));
    saveHistory(newSongs);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture([songs, ...future]);
    setHistory(history.slice(0, -1));
    setSongs(prev);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory([...history, songs]);
    setFuture(future.slice(1));
    setSongs(next);
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Playlist #{id}</Text>

      {/* Add Song */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a song..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSong}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Song List */}
      <FlatList
        data={songs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.songRow}>
            <Text style={styles.songText}>{item}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => updateSong(index, item + ' (Edited)')}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteSong(index)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Undo / Redo */}
      <View style={styles.undoRedoRow}>
        <TouchableOpacity style={styles.undoRedoBtn} onPress={undo}>
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.undoRedoBtn} onPress={redo}>
          <Text style={styles.buttonText}>Redo</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  inputRow: { flexDirection: 'row', marginBottom: 15 },
  input: {
    flex: 1,
    backgroundColor: '#111',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: { backgroundColor: '#1DB954', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  songRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  songText: { color: '#fff' },
  actions: { flexDirection: 'row', gap: 15 },
  actionText: { color: '#1DB954', fontWeight: 'bold' },
  undoRedoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  undoRedoBtn: {
    flex: 1,
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
});
