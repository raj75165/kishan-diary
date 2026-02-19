import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

// ── Reusable field component ──────────────────────────────────────────────────

function Field({ label, required, icon, children }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={18} color="#2d5016" style={styles.fieldIcon} />
        {children}
      </View>
    </View>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={16} color="#2d5016" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    farmName: '',
    farmSize: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const { register } = useAuth();

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));

  const handleRegister = async () => {
    const { fullName, email, phone, password, confirmPassword } = formData;
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    // NOTE: In production, password should be hashed before sending to backend.
    const result = await register({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      farmName: formData.farmName.trim() || 'My Farm',
      farmSize: formData.farmSize.trim(),
      location: formData.location.trim(),
      password: formData.password, // SECURITY: Should be hashed in production
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Account Created!', 'Welcome to Kishan Diary 🌾');
    } else {
      Alert.alert('Registration Failed', result.error || 'An error occurred.');
    }
  };

  const inputStyle = (field) => [
    styles.textInput,
    focused === field && { color: '#1a1a1a' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1b3d0a" />

      {/* Green header */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🌾</Text>
        </View>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Set up your Kishan Diary profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Personal Info ── */}
        <View style={styles.card}>
          <SectionHeader icon="person-circle-outline" title="Personal Information" />

          <Field label="Full Name" required icon="person-outline">
            <TextInput
              style={inputStyle('fullName')}
              value={formData.fullName}
              onChangeText={(v) => updateField('fullName', v)}
              placeholder="Your full name"
              placeholderTextColor="#bbb"
              autoCapitalize="words"
              onFocus={() => setFocused('fullName')}
              onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Email Address" required icon="mail-outline">
            <TextInput
              style={inputStyle('email')}
              value={formData.email}
              onChangeText={(v) => updateField('email', v)}
              placeholder="you@example.com"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Phone Number" required icon="call-outline">
            <TextInput
              style={inputStyle('phone')}
              value={formData.phone}
              onChangeText={(v) => updateField('phone', v)}
              placeholder="10-digit mobile number"
              placeholderTextColor="#bbb"
              keyboardType="phone-pad"
              maxLength={10}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
            />
          </Field>
        </View>

        {/* ── Farm Info ── */}
        <View style={[styles.card, { marginTop: 14 }]}>
          <SectionHeader icon="leaf-outline" title="Farm Details (Optional)" />

          <Field label="Farm / Centre Name" icon="home-outline">
            <TextInput
              style={inputStyle('farmName')}
              value={formData.farmName}
              onChangeText={(v) => updateField('farmName', v)}
              placeholder="e.g. Ram Singh Custom Hiring"
              placeholderTextColor="#bbb"
              autoCapitalize="words"
              onFocus={() => setFocused('farmName')}
              onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Total Farm Size" icon="resize-outline">
            <TextInput
              style={inputStyle('farmSize')}
              value={formData.farmSize}
              onChangeText={(v) => updateField('farmSize', v)}
              placeholder="e.g. 25 acres"
              placeholderTextColor="#bbb"
              onFocus={() => setFocused('farmSize')}
              onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Village / District" icon="location-outline">
            <TextInput
              style={inputStyle('location')}
              value={formData.location}
              onChangeText={(v) => updateField('location', v)}
              placeholder="e.g. Ludhiana, Punjab"
              placeholderTextColor="#bbb"
              autoCapitalize="words"
              onFocus={() => setFocused('location')}
              onBlur={() => setFocused(null)}
            />
          </Field>
        </View>

        {/* ── Security ── */}
        <View style={[styles.card, { marginTop: 14 }]}>
          <SectionHeader icon="shield-checkmark-outline" title="Security" />

          <Field label="Password" required icon="lock-closed-outline">
            <TextInput
              style={[inputStyle('password'), { flex: 1 }]}
              value={formData.password}
              onChangeText={(v) => updateField('password', v)}
              placeholder="Min. 6 characters"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
            </TouchableOpacity>
          </Field>

          <Field label="Confirm Password" required icon="lock-closed-outline">
            <TextInput
              style={[inputStyle('confirmPassword'), { flex: 1 }]}
              value={formData.confirmPassword}
              onChangeText={(v) => updateField('confirmPassword', v)}
              placeholder="Re-enter password"
              placeholderTextColor="#bbb"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              onFocus={() => setFocused('confirmPassword')}
              onBlur={() => setFocused(null)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
              <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
            </TouchableOpacity>
          </Field>
        </View>

        {/* Register button */}
        <TouchableOpacity
          style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <Text style={styles.registerBtnText}>Creating account…</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.registerBtnText}>Create Account</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },

  // Header
  header: {
    backgroundColor: '#2d5016',
    paddingTop: 56,
    paddingBottom: 36,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: '#c8e6c9' },

  // Body
  body: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#2d5016' },

  // Field
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  required: { color: '#e53935' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 11,
    backgroundColor: '#fafafa',
    minHeight: 48,
  },
  fieldIcon: { marginLeft: 12, marginRight: 2 },
  textInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontSize: 14, color: '#222' },
  eyeBtn: { paddingHorizontal: 12 },

  // Register button
  registerBtn: {
    backgroundColor: '#2d5016',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#2d5016',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  registerBtnDisabled: { backgroundColor: '#7a9d5f' },
  registerBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  loginText: { fontSize: 14, color: '#888' },
  loginLink: { fontSize: 14, color: '#2d5016', fontWeight: '700' },
});

