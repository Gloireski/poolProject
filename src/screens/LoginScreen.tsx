import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../store';
import { login } from '../store/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const passwordRef = useRef<any>(null);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert('Login Failed', error || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>📸</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your journey
          </Text>
        </View>

        {/* Form Section */}
        <Card variant="elevated" padding="large" style={styles.formCard}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            error={errors.email}
            fullWidth
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            error={errors.password}
            fullWidth
            ref={passwordRef}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.loginButton}
          />
        </Card>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Register Section */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Button
            title="Create Account"
            onPress={handleRegisterPress}
            variant="outline"
            fullWidth
            style={styles.registerButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
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
    backgroundColor: colors.primary[100],
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
  
  loginButton: {
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
  
  // Register Section
  registerSection: {
    alignItems: 'center',
    marginBottom: spacing.layout.section.marginBottom,
  },
  
  registerText: {
    ...typography.text.body.medium,
    color: colors.text.secondary,
    marginBottom: spacing.component.margin.medium,
    textAlign: 'center',
  },
  
  registerButton: {
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
