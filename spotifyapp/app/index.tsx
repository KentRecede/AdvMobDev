import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import SpotifyLogo from '@/assets/images/spotifylogo.png';
import { useRouter } from 'expo-router';   // ✅ import router

export default function SpotifyLoginScreen() {
  const router = useRouter();  // ✅ initialize router

  return (
    <ThemedView style={styles.container}>
      {/* Spotify Logo */}
      <Image source={SpotifyLogo} style={styles.logo} />

      <Text style={styles.appName}>Spotify</Text>

      {/* Username & Password */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
      />

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign In → Go to Profile */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push('/playlist')}   // ✅ navigate to Profile
      >
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      {/* Social Login */}
      <Text style={styles.orText}>or sign up with</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialIcon}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialIcon}>f</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up → Go to SignUp screen */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>  {/* ✅ navigate */}
          <Text style={styles.signupLink}> Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Logo */}
      <Text style={styles.footer}>Spotify</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },
  appName: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 30,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  forgotPassword: {
    color: '#888',
    alignSelf: 'flex-end',
    marginBottom: 25,
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: '#888',
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  socialIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupText: {
    color: '#888',
  },
  signupLink: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
});
