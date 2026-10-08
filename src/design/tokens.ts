// Enterprise Design Tokens — DS-4, DS-5, DS-9
// Construction ERP Program Baseline (Part 00)

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type DensityMode = 'compact' | 'cozy' | 'touch';

export interface DesignTokens {
  // Brand
  brand: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    secondary: string;
    accent: string;
  };
  // Semantic
  semantic: {
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    error: string;
    errorBg: string;
    info: string;
    infoBg: string;
    critical: string;
    criticalBg: string;
  };
  // Surface
  surface: {
    background: string;
    surface: string;
    surfaceHover: string;
    surfaceActive: string;
    elevated: string;
    overlay: string;
    shell: string;
    sidebar: string;
    card: string;
    input: string;
    border: string;
    borderStrong: string;
    divider: string;
  };
  // Text
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    link: string;
    linkHover: string;
    onBrand: string;
  };
  // Shell
  shell: {
    height: string;
    background: string;
    text: string;
    sidebarWidth: string;
    sidebarCollapsedWidth: string;
  };
  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  // Radius
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  // Shadow
  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  // Typography
  font: {
    family: string;
    familyDevanagari: string;
    mono: string;
    sizeXs: string;
    sizeSm: string;
    sizeMd: string;
    sizeLg: string;
    sizeXl: string;
    sizeXxl: string;
    sizeDisplay: string;
    weightLight: number;
    weightRegular: number;
    weightMedium: number;
    weightSemibold: number;
    weightBold: number;
    lineHeight: number;
    lineHeightTight: number;
  };
  // Motion
  motion: {
    fast: string;
    normal: string;
    slow: string;
    easeOut: string;
    easeInOut: string;
  };
  // Z-index
  zIndex: {
    base: number;
    dropdown: number;
    sticky: number;
    overlay: number;
    modal: number;
    popover: number;
    toast: number;
  };
}

export const lightTokens: DesignTokens = {
  brand: {
    primary: '#1B5E8C',
    primaryHover: '#154B70',
    primaryActive: '#0F3A57',
    secondary: '#2E7D5B',
    accent: '#D4740B',
  },
  semantic: {
    success: '#0D7A3E',
    successBg: '#E8F5EE',
    warning: '#B8860B',
    warningBg: '#FFF8E1',
    error: '#C62828',
    errorBg: '#FFEBEE',
    info: '#1565C0',
    infoBg: '#E3F2FD',
    critical: '#880E4F',
    criticalBg: '#FCE4EC',
  },
  surface: {
    background: '#F5F6FA',
    surface: '#FFFFFF',
    surfaceHover: '#F0F2F7',
    surfaceActive: '#E8EBF2',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.4)',
    shell: '#1B2A4A',
    sidebar: '#FFFFFF',
    card: '#FFFFFF',
    input: '#FFFFFF',
    border: '#D8DCE6',
    borderStrong: '#B0B8C9',
    divider: '#E8EBF2',
  },
  text: {
    primary: '#1A1F36',
    secondary: '#4A5568',
    tertiary: '#718096',
    disabled: '#A0AEC0',
    inverse: '#FFFFFF',
    link: '#1B5E8C',
    linkHover: '#0F3A57',
    onBrand: '#FFFFFF',
  },
  shell: {
    height: '56px',
    background: '#1B2A4A',
    text: '#FFFFFF',
    sidebarWidth: '260px',
    sidebarCollapsedWidth: '64px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  },
  font: {
    family: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    familyDevanagari: "'IBM Plex Sans Devanagari', 'Noto Sans Devanagari', sans-serif",
    mono: "'IBM Plex Mono', 'Fira Code', monospace",
    sizeXs: '0.75rem',
    sizeSm: '0.8125rem',
    sizeMd: '0.875rem',
    sizeLg: '1rem',
    sizeXl: '1.25rem',
    sizeXxl: '1.5rem',
    sizeDisplay: '2rem',
    weightLight: 300,
    weightRegular: 400,
    weightMedium: 500,
    weightSemibold: 600,
    weightBold: 700,
    lineHeight: 1.5,
    lineHeightTight: 1.25,
  },
  motion: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    popover: 500,
    toast: 600,
  },
};

export const darkTokens: DesignTokens = {
  ...lightTokens,
  brand: {
    primary: '#4DA3D4',
    primaryHover: '#6BB5DE',
    primaryActive: '#8DC7E8',
    secondary: '#4CAF7D',
    accent: '#F0A040',
  },
  semantic: {
    success: '#4CAF7D',
    successBg: '#1A3D2A',
    warning: '#F0A040',
    warningBg: '#3D3018',
    error: '#EF5350',
    errorBg: '#3D1A1A',
    info: '#42A5F5',
    infoBg: '#1A2D3D',
    critical: '#F06292',
    criticalBg: '#3D1A2D',
  },
  surface: {
    background: '#0F1419',
    surface: '#1A2030',
    surfaceHover: '#232B3E',
    surfaceActive: '#2C3550',
    elevated: '#232B3E',
    overlay: 'rgba(0, 0, 0, 0.6)',
    shell: '#0A0E14',
    sidebar: '#141B26',
    card: '#1A2030',
    input: '#232B3E',
    border: '#2C3550',
    borderStrong: '#3D4A66',
    divider: '#232B3E',
  },
  text: {
    primary: '#E8ECF4',
    secondary: '#A0AEC0',
    tertiary: '#718096',
    disabled: '#4A5568',
    inverse: '#1A1F36',
    link: '#4DA3D4',
    linkHover: '#8DC7E8',
    onBrand: '#FFFFFF',
  },
  shell: {
    height: '56px',
    background: '#0A0E14',
    text: '#E8ECF4',
    sidebarWidth: '260px',
    sidebarCollapsedWidth: '64px',
  },
  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.2)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.3)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.6), 0 10px 10px -5px rgba(0,0,0,0.4)',
  },
};

export const highContrastTokens: DesignTokens = {
  ...lightTokens,
  brand: {
    primary: '#0040A0',
    primaryHover: '#003080',
    primaryActive: '#002060',
    secondary: '#006030',
    accent: '#C05000',
  },
  semantic: {
    success: '#006030',
    successBg: '#D0F0D0',
    warning: '#806000',
    warningBg: '#FFF0B0',
    error: '#A00000',
    errorBg: '#FFD0D0',
    info: '#003090',
    infoBg: '#D0E0FF',
    critical: '#600030',
    criticalBg: '#FFD0E0',
  },
  surface: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHover: '#F0F0F0',
    surfaceActive: '#E0E0E0',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shell: '#000000',
    sidebar: '#F5F5F5',
    card: '#FFFFFF',
    input: '#FFFFFF',
    border: '#000000',
    borderStrong: '#000000',
    divider: '#333333',
  },
  text: {
    primary: '#000000',
    secondary: '#1A1A1A',
    tertiary: '#333333',
    disabled: '#666666',
    inverse: '#FFFFFF',
    link: '#0040A0',
    linkHover: '#002060',
    onBrand: '#FFFFFF',
  },
  shell: {
    height: '56px',
    background: '#000000',
    text: '#FFFFFF',
    sidebarWidth: '260px',
    sidebarCollapsedWidth: '64px',
  },
};

export function getTokens(theme: ThemeMode): DesignTokens {
  switch (theme) {
    case 'dark': return darkTokens;
    case 'high-contrast': return highContrastTokens;
    default: return lightTokens;
  }
}

export function getDensityScale(density: DensityMode) {
  switch (density) {
    case 'compact':
      return { spacing: 0.75, minHeight: '32px', padding: '8px' };
    case 'touch':
      return { spacing: 1.25, minHeight: '48px', padding: '16px' };
    default: // cozy
      return { spacing: 1, minHeight: '40px', padding: '12px' };
  }
}
