import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  onPress,
  style,
  disabled = false,
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}`],
    disabled && styles.disabled,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
  },
  
  // Variant styles
  default: {
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  elevated: {
    ...spacing.shadow.md,
    borderWidth: 0,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  filled: {
    backgroundColor: colors.surface.secondary,
    borderWidth: 0,
  },
  
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: spacing.component.padding.small,
  },
  paddingMedium: {
    padding: spacing.component.padding.medium,
  },
  paddingLarge: {
    padding: spacing.component.padding.large,
  },
  
  // Margin variants
  marginNone: {
    margin: 0,
  },
  marginSmall: {
    margin: spacing.component.margin.small,
  },
  marginMedium: {
    margin: spacing.component.margin.medium,
  },
  marginLarge: {
    margin: spacing.component.margin.large,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
});
