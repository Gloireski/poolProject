import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAppDispatch } from '../store';
import { register } from '../store/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function RegisterScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await dispatch(register({ fullName, email, password })).unwrap();
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert('Registration Failed', error || 'Please try again with different credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🚀</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Join the Journey</Text>
          <Text style={styles.subtitle}>
            Create your account to start capturing memories
          </Text>
        </View>

        {/* Form Section */}
        <Card variant="elevated" padding="large" style={styles.formCard}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
            error={errors.fullName}
            fullWidth
          />

          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            fullWidth
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            helper="Must be at least 6 characters"
            fullWidth
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
            fullWidth
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={styles.registerButton}
          />
        </Card>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Button
            title="Sign In"
            onPress={handleLoginPress}
            variant="outline"
            fullWidth
            style={styles.loginButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.layout.screen.paddingHorizontal,
    paddingTop: spacing.layout.screen.paddingVertical,
    paddingBottom: spacing.layout.screen.paddingVertical + 40,
  },
  
  // Header Section
  header: {
    alignItems: 'center',
    marginBottom: spacing.layout.section.marginBottom,
    paddingTop: spacing.layout.screen.paddingVertical,
  },
  
  logoContainer: {
    marginBottom: spacing.component.margin.large,
  },
  
  logo: {
    width: 80,
    height: 80,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.shadow.md,
  },
  
  logoText: {
    fontSize: 40,
  },
  
  title: {
    ...typography.text.heading.h1,
    color: colors.text.primary,
    marginBottom: spacing.component.margin.small,
    textAlign: 'center',
  },
  
  subtitle: {
    ...typography.text.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Form Section
  formCard: {
    marginBottom: spacing.layout.section.marginBottom,
  },
  
  registerButton: {
    marginTop: spacing.component.margin.medium,
  },
  
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.component.margin.large,
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  
  dividerText: {
    ...typography.text.caption.medium,
    color: colors.text.tertiary,
    marginHorizontal: spacing.component.margin.medium,
  },
  
  // Login Section
  loginSection: {
    alignItems: 'center',
    marginBottom: spacing.layout.section.marginBottom,
  },
  
  loginText: {
    ...typography.text.body.medium,
    color: colors.text.secondary,
    marginBottom: spacing.component.margin.medium,
    textAlign: 'center',
  },
  
  loginButton: {
    width: '100%',
  },
  
  // Footer
  footer: {
    alignItems: 'center',
  },
  
  footerText: {
    ...typography.text.caption.medium,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
});
