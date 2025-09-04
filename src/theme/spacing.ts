export const spacing = {
  // Base spacing units (4px grid system)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
  
  // Semantic spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  
  // Component-specific spacing
  component: {
    padding: {
      small: 12,
      medium: 16,
      large: 24,
      xlarge: 32,
    },
    margin: {
      small: 8,
      medium: 16,
      large: 24,
      xlarge: 32,
    },
    gap: {
      small: 8,
      medium: 16,
      large: 24,
      xlarge: 32,
    },
  },
  
  // Layout spacing
  layout: {
    screen: {
      padding: 20,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    section: {
      marginBottom: 32,
      padding: 20,
    },
    card: {
      padding: 16,
      marginBottom: 16,
    },
    list: {
      itemSpacing: 12,
      sectionSpacing: 24,
    },
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  
  // Shadows
  shadow: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 25,
      elevation: 12,
    },
  },
};
