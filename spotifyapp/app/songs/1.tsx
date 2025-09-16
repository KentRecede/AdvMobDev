// playlistBuilder.tsx
import React, { useEffect, useReducer, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView'; // adjust import if not available

/* -------------------------
  Reducer & History model
------------------------- */

type Action =
  | { type: 'ADD'; payload: string }
  | { type: 'REMOVE'; payload: number } // index
  | { type: 'UPDATE'; payload: { index: number; name: string } }
  | { type: 'CLEAR' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_STATE'; payload: HistoryState };

type HistoryState = {
  past: string[][];
  present: string[];
  future: string[][];
};

const initialState: HistoryState = { past: [], present: [], future: [] };

function historyReducer(state: HistoryState, action: Action): HistoryState {
  const { past, present, future } = state;
  switch (action.type) {
    case 'ADD': {
      const next = [...present, action.payload];
      return { past: [...past, present], present: next, future: [] };
    }
    case 'REMOVE': {
      const idx = action.payload;
      const next = present.filter((_, i) => i !== idx);
      return { past: [...past, present], present: next, future: [] };
    }
    case 'UPDATE': {
      const { index, name } = action.payload;
      const next = present.map((s, i) => (i === index ? name : s));
      return { past: [...past, present], present: next, future: [] };
    }
    case 'CLEAR': {
      if (present.length === 0) return state;
      return { past: [...past, present], present: [], future: [] };
    }
    case 'UNDO': {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return { past: newPast, present: previous, future: [present, ...future] };
    }
    case 'REDO': {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return { past: [...past, present], present: next, future: newFuture };
    }
    case 'SET_STATE': {
      return action.payload;
    }
    default:
      return state;
  }
}

/* -------------------------
  Component
------------------------- */

const STORAGE_KEY = '@playlist_history_v1';

export default function PlaylistBuilder() {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  const [text, setText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef<any>(null);

  // load persisted state
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: HistoryState = JSON.parse(raw);
          // basic validation
          if (parsed && Array.isArray(parsed.present)) {
            dispatch({ type: 'SET_STATE', payload: parsed });
          }
        }
      } catch (e) {
        console.warn('Failed to load playlist state', e);
      }
    })();
  }, []);

  // persist on change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save playlist state', e);
      }
    })();
  }, [state]);

  const addSong = () => {
    const name = (text || '').trim();
    if (!name) return;
    dispatch({ type: 'ADD', payload: name });
    setText('');
    Keyboard.dismiss();
  };

  const removeSong = (index: number) => {
    dispatch({ type: 'REMOVE', payload: index });
  };

  const beginEdit = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingText(name);
    setTimeout(() => inputRef.current?.focus?.(), 50);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const newName = editingText.trim();
    if (!newName) {
      Alert.alert('Invalid name');
      return;
    }
    dispatch({ type: 'UPDATE', payload: { index: editingIndex, name: newName } });
    setEditingIndex(null);
    setEditingText('');
  };

  const clearAll = () => {
    Alert.alert('Clear playlist', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => dispatch({ type: 'CLEAR' }) },
    ]);
  };

  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    // animated wrapper uses Reanimated Layout + enter/exit
    return (
      <Animated.View
        key={index}
        entering={FadeIn.duration(220)}
        exiting={FadeOut.duration(180)}
        layout={Layout.springify()}
        style={styles.songRow}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.songText}>{item}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => beginEdit(index, item)}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => removeSong(index)}>
            <Text style={[styles.actionText, { color: '#ff6b6b' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Playlist Builder</Text>

      {/* input / add */}
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          value={editingIndex !== null ? editingText : text}
          onChangeText={(v) => (editingIndex !== null ? setEditingText(v) : setText(v))}
          onSubmitEditing={() => (editingIndex !== null ? saveEdit() : addSong())}
          placeholder={editingIndex !== null ? 'Edit song name' : 'Add a song name'}
          placeholderTextColor="#888"
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: editingIndex !== null ? '#1e90ff' : '#1DB954' }]}
          onPress={() => (editingIndex !== null ? saveEdit() : addSong())}
        >
          <Text style={styles.addButtonText}>{editingIndex !== null ? 'Save' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      {/* actions row */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={undo} style={styles.ctrlBtn}>
          <Text style={styles.ctrlText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={redo} style={styles.ctrlBtn}>
          <Text style={styles.ctrlText}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearAll} style={[styles.ctrlBtn, { backgroundColor: '#2b2b2b' }]}>
          <Text style={[styles.ctrlText, { color: '#ff6b6b' }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* playlist */}
      <FlatList
        style={{ width: '100%', marginTop: 12 }}
        data={state.present}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text style={styles.empty}>Your playlist is empty</Text>}
      />
    </ThemedView>
  );
}

/* -------------------------
  Styles
------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16, alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  inputRow: { flexDirection: 'row', width: '100%', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#111',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '700' },

  controls: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 12 },
  ctrlBtn: { backgroundColor: '#111', padding: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' },
  ctrlText: { color: '#fff', fontWeight: '700' },

  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  songText: { color: '#fff' },
  actions: { flexDirection: 'row', gap: 16 },
  actionText: { color: '#1DB954', fontWeight: '700', marginLeft: 16 },

  empty: { color: '#888', textAlign: 'center', marginTop: 20 },
});
