import { Platform } from 'react-native';

export const typography = {
  // Font families
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'SF Pro Display-Medium' : 'Roboto-Medium',
    semibold: Platform.OS === 'ios' ? 'SF Pro Display-Semibold' : 'Roboto-Medium',
    bold: Platform.OS === 'ios' ? 'SF Pro Display-Bold' : 'Roboto-Bold',
    mono: Platform.OS === 'ios' ? 'SF Mono' : 'RobotoMono',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Text styles
  text: {
    // Display styles
    display: {
      large: {
        fontSize: 48,
        lineHeight: 56,
        fontWeight: '700' as const,
        letterSpacing: -0.02,
      },
      medium: {
        fontSize: 36,
        lineHeight: 44,
        fontWeight: '700' as const,
        letterSpacing: -0.02,
      },
      small: {
        fontSize: 30,
        lineHeight: 38,
        fontWeight: '600' as const,
        letterSpacing: -0.01,
      },
    },
    
    // Heading styles
    heading: {
      h1: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '700' as const,
        letterSpacing: -0.01,
      },
      h2: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600' as const,
        letterSpacing: -0.01,
      },
      h3: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '600' as const,
        letterSpacing: -0.01,
      },
      h4: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600' as const,
        letterSpacing: -0.01,
      },
    },
    
    // Body styles
    body: {
      large: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '400' as const,
      },
      medium: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400' as const,
      },
      small: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400' as const,
      },
    },
    
    // Label styles
    label: {
      large: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500' as const,
      },
      medium: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500' as const,
      },
      small: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500' as const,
      },
    },
    
    // Caption styles
    caption: {
      large: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400' as const,
      },
      medium: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400' as const,
      },
      small: {
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '400' as const,
      },
    },
  },
};
