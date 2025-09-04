import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({ 
  label,
  placeholder,
  error,
  helper,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const inputContainerStyles = [
    styles.inputContainer,
    styles[`${variant}Container`],
    styles[size],
    error && styles.error,
    fullWidth && styles.fullWidth,
    containerStyle,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input`],
    styles[`${variant}Input`],
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    styles[`${size}Label`],
    labelStyle,
  ];

  const errorStyles = [
    styles.errorText,
    errorStyle,
  ];

  const helperStyles = [
    styles.helperText,
    helperStyle,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={labelStyles}>{label}</Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={inputStyles}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          selectTextOnFocus={false}
          keyboardAppearance="default"
          autoCorrect={false}
          autoCapitalize={props.autoCapitalize || 'none'}
          {...props}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref}
        />
        
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={errorStyles}>{error}</Text>
      )}
      
      {helper && !error && (
        <Text style={helperStyles}>{helper}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.component.margin.medium,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface.primary,
  },
  
  // Variant styles
  defaultContainer: {
    borderColor: colors.border.medium,
  },
  filledContainer: {
    borderColor: colors.border.light,
    backgroundColor: colors.surface.secondary,
  },
  outlinedContainer: {
    borderColor: colors.border.medium,
    backgroundColor: 'transparent',
  },
  
  // Size styles
  small: {
    paddingHorizontal: spacing.component.padding.medium,
    paddingVertical: spacing.component.padding.small,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: spacing.component.padding.large,
    paddingVertical: spacing.component.padding.medium,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: spacing.component.padding.xlarge,
    paddingVertical: spacing.component.padding.large,
    minHeight: 52,
  },
  
  // State styles
  focused: {
    borderColor: colors.primary[500],
    ...spacing.shadow.sm,
  },
  error: {
    borderColor: colors.error[500],
  },
  
  // Input styles
  input: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.regular,
  },
  
  smallInput: {
    fontSize: typography.fontSize.sm,
  },
  mediumInput: {
    fontSize: typography.fontSize.base,
  },
  largeInput: {
    fontSize: typography.fontSize.lg,
  },
  
  defaultInput: {
    // Default styles
  },
  filledInput: {
    // Filled styles
  },
  outlinedInput: {
    // Outlined styles
  },
  
  // Icon styles
  leftIcon: {
    marginRight: spacing.component.gap.small,
  },
  rightIcon: {
    marginLeft: spacing.component.gap.small,
  },
  
  // Label styles
  label: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.component.gap.small,
  },
  
  smallLabel: {
    fontSize: typography.fontSize.sm,
  },
  mediumLabel: {
    fontSize: typography.fontSize.base,
  },
  largeLabel: {
    fontSize: typography.fontSize.lg,
  },
  
  // Helper and error text styles
  helperText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.component.gap.small,
    fontFamily: typography.fontFamily.regular,
  },
  
  errorText: {
    color: colors.error[600],
    fontSize: typography.fontSize.sm,
    marginTop: spacing.component.gap.small,
    fontFamily: typography.fontFamily.regular,
  },
  
  // Layout
  fullWidth: {
    width: '100%',
  },
});
