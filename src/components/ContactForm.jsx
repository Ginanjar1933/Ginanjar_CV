import { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography } from '../constants/theme';
import TechTitle from './TechTitle';
import { validateContact } from '../utils/validateContact';

const emptyForm = { nama: '', email: '', pesan: '' };

export default function ContactForm() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sukses, setSukses] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setSukses(false);
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = () => {
    const newErrors = validateContact(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSukses(true);
      setForm(emptyForm);
    } else {
      setSukses(false);
    }
  };

  return (
    <View style={styles.card}>
      <TechTitle>Hubungi Saya</TechTitle>

      <View style={styles.field}>
        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={[styles.input, errors.nama && styles.inputError]}
          value={form.nama}
          onChangeText={(text) => handleChange('nama', text)}
          placeholder="Nama lengkap"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          accessibilityLabel="Nama"
        />
        {errors.nama && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {errors.nama}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="nama@email.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email"
        />
        {errors.email && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {errors.email}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Pesan</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.pesan && styles.inputError]}
          value={form.pesan}
          onChangeText={(text) => handleChange('pesan', text)}
          placeholder="Tulis pesan kamu"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Pesan"
        />
        {errors.pesan && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {errors.pesan}
          </Text>
        )}
      </View>

      <Pressable
        onPress={handleSubmit}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Kirim pesan"
      >
        <Text style={styles.buttonText}>Kirim Pesan</Text>
      </Pressable>

      {sukses && (
        <Text style={styles.successText} accessibilityRole="alert">
          Pesan berhasil dikirim. Terima kasih!
        </Text>
      )}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.md,
    },
    title: {
      fontSize: typography.heading,
      fontWeight: '700',
      color: colors.text,
    },
    field: { gap: spacing.xs },
    label: {
      fontSize: typography.small,
      fontWeight: '600',
      color: colors.text,
    },
    input: {
      minHeight: 44,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.body,
      color: colors.text,
    },
    inputError: { borderColor: colors.danger },
    textArea: { minHeight: 120 },
    errorText: {
      fontSize: typography.small,
      color: colors.danger,
    },
    button: {
      minHeight: 48,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: typography.body,
      fontWeight: '700',
      color: colors.background,
    },
    successText: {
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.success,
      textAlign: 'center',
    },
  });