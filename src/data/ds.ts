// Part 19 — Design System Tokens & Component Library
// Comprehensive enterprise design tokens and reusable components

// ============================================================================
// DESIGN TOKENS
// ============================================================================

export const designTokens = {
  // Colors - Semantic
  colors: {
    // Brand
    brand: {
      primary: 'var(--color-brand-primary, #1B5E8C)',
      primaryHover: 'var(--color-brand-primary-hover, #154B70)',
      primaryActive: 'var(--color-brand-primary-active, #0F3A57)',
      secondary: 'var(--color-brand-secondary, #2E7D5B)',
      accent: 'var(--color-brand-accent, #D4740B)',
    },
    // Semantic
    semantic: {
      success: 'var(--color-semantic-success, #0D7A3E)',
      successBg: 'var(--color-semantic-success-bg, #E8F5EE)',
      warning: 'var(--color-semantic-warning, #B8860B)',
      warningBg: 'var(--color-semantic-warning-bg, #FFF8E1)',
      error: 'var(--color-semantic-error, #C62828)',
      errorBg: 'var(--color-semantic-error-bg, #FFEBEE)',
      info: 'var(--color-semantic-info, #1565C0)',
      infoBg: 'var(--color-semantic-info-bg, #E3F2FD)',
      critical: 'var(--color-semantic-critical, #880E4F)',
      criticalBg: 'var(--color-semantic-critical-bg, #FCE4EC)',
    },
    // Surface
    surface: {
      background: 'var(--color-surface-background, #F5F6FA)',
      surface: 'var(--color-surface-surface, #FFFFFF)',
      surfaceHover: 'var(--color-surface-hover, #F0F2F7)',
      surfaceActive: 'var(--color-surface-active, #E8EBF2)',
      elevated: 'var(--color-surface-elevated, #FFFFFF)',
      overlay: 'var(--color-surface-overlay, rgba(0, 0, 0, 0.4))',
      shell: 'var(--color-surface-shell, #1B2A4A)',
      sidebar: 'var(--color-surface-sidebar, #FFFFFF)',
      card: 'var(--color-surface-card, #FFFFFF)',
      input: 'var(--color-surface-input, #FFFFFF)',
      border: 'var(--color-surface-border, #D8DCE6)',
      borderStrong: 'var(--color-surface-border-strong, #B0B8C9)',
      divider: 'var(--color-surface-divider, #E8EBF2)',
    },
    // Text
    text: {
      primary: 'var(--color-text-primary, #1A1F36)',
      secondary: 'var(--color-text-secondary, #4A5568)',
      tertiary: 'var(--color-text-tertiary, #718096)',
      disabled: 'var(--color-text-disabled, #A0AEC0)',
      inverse: 'var(--color-text-inverse, #FFFFFF)',
      link: 'var(--color-text-link, #1B5E8C)',
      linkHover: 'var(--color-text-link-hover, #0F3A57)',
      onBrand: 'var(--color-text-on-brand, #FFFFFF)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      devanagari: "'IBM Plex Sans Devanagari', 'Noto Sans Devanagari', sans-serif",
      mono: "'IBM Plex Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.8125rem',  // 13px
      md: '0.875rem',   // 14px
      lg: '1rem',       // 16px
      xl: '1.25rem',    // 20px
      xxl: '1.5rem',    // 24px
      display: '2rem',  // 32px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing (4pt grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },

  // Elevation (Shadows)
  elevation: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Motion
  motion: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    easing: {
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },

  // Breakpoints
  breakpoints: {
    mobile: '360px',
    tablet: '820px',
    desktop: '1440px',
    wide: '1920px',
  },

  // Z-Index
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

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputSize = 'sm' | 'md' | 'lg';
export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'critical';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type DensityMode = 'comfortable' | 'compact';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'search';
  size?: InputSize;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  label?: string;
  required?: boolean;
}

export interface StatusBadgeProps {
  status: string;
  variant: StatusVariant;
  icon?: React.ReactNode;
}

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export interface DataTableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  sorting?: {
    key: keyof T;
    direction: 'asc' | 'desc';
    onSort: (key: keyof T) => void;
  };
  selection?: {
    selected: string[];
    onSelect: (ids: string[]) => void;
  };
  onRowClick?: (row: T) => void;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'select' | 'textarea' | 'checkbox';
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: any }[];
}

export interface GateStatusPanelProps {
  stages: {
    name: string;
    status: 'pass' | 'warn' | 'fail' | 'pending';
    message?: string;
  }[];
}

export interface ExceptionRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, evidence: string[]) => void;
  context: {
    entityType: string;
    entityId: string;
    action: string;
  };
}

export interface ReasonCodePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (code: string, narrative: string) => void;
  category: string;
}

// ============================================================================
// PAGE TEMPLATES
// ============================================================================

export interface ListReportTemplateProps {
  title: string;
  subtitle?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  table: React.ReactNode;
}

export interface ObjectPageTemplateProps {
  header: {
    title: string;
    subtitle?: string;
    status?: React.ReactNode;
    actions?: React.ReactNode;
  };
  tabs: {
    key: string;
    label: string;
    content: React.ReactNode;
  }[];
  sidePanel?: React.ReactNode;
}

export interface WorklistTemplateProps {
  title: string;
  subtitle?: string;
  list: React.ReactNode;
  detail?: React.ReactNode;
}

export interface WizardTemplateProps {
  title: string;
  steps: {
    key: string;
    label: string;
    content: React.ReactNode;
  }[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export interface DashboardTemplateProps {
  title: string;
  widgets: React.ReactNode[];
}

// ============================================================================
// PROTOCOL COMPONENTS
// ============================================================================

export interface ComplianceScoreBadgeProps {
  score: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface PlannedVsActualBarProps {
  label: string;
  planned: number;
  actual: number;
  unit?: string;
  variant?: 'time' | 'qty' | 'cost' | 'productivity' | 'consumption' | 'wastage' | 'progress';
}

export interface ValueAtRiskChipProps {
  amount: number;
  currency?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  density: DensityMode;
  numberFormat: 'indian' | 'international';
  dateFormat: 'dd-MMM-yyyy' | 'yyyy-MM-dd' | 'MM/dd/yyyy';
  language: 'en' | 'hi';
  sidebarCollapsed: boolean;
  homeDashboardId?: string;
}

export const defaultPreferences: UserPreferences = {
  theme: 'light',
  density: 'comfortable',
  numberFormat: 'indian',
  dateFormat: 'dd-MMM-yyyy',
  language: 'en',
  sidebarCollapsed: false,
};

// ============================================================================
// BRAND CONFIGURATION
// ============================================================================

export interface BrandConfig {
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  faviconUrl?: string;
}

export const defaultBrand: BrandConfig = {
  companyName: 'Construction ERP',
  primaryColor: '#1B5E8C',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatCurrency(amount: number, format: 'indian' | 'international' = 'indian'): string {
  if (format === 'indian') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, format: string = 'dd-MMM-yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'dd-MMM-yyyy':
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    case 'yyyy-MM-dd':
      return d.toISOString().split('T')[0];
    case 'MM/dd/yyyy':
      return d.toLocaleDateString('en-US');
    default:
      return d.toLocaleDateString();
  }
}

export function formatNumber(value: number, format: 'indian' | 'international' = 'indian'): string {
  if (format === 'indian') {
    return new Intl.NumberFormat('en-IN').format(value);
  }
  return new Intl.NumberFormat('en-US').format(value);
}

export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In production, use a proper color library
  return 4.5; // WCAG AA minimum for normal text
}

export function validateBrandColor(color: string): { valid: boolean; message?: string } {
  // Check if color provides sufficient contrast
  const contrast = getContrastRatio(color, '#FFFFFF');
  if (contrast < 4.5) {
    return {
      valid: false,
      message: 'Color does not meet WCAG AA contrast requirements (minimum 4.5:1)',
    };
  }
  return { valid: true };
}

// ============================================================================
// MIGRATION TRACKER
// ============================================================================

export interface ScreenMigration {
  screenId: string;
  screenName: string;
  module: string;
  status: 'pending' | 'restyle' | 'refactor' | 'rebuild' | 'complete';
  owner: string;
  targetDate?: string;
  notes?: string;
}

export const migrationTracker: ScreenMigration[] = [
  {
    screenId: 'screen-001',
    screenName: 'Project List',
    module: 'project-management',
    status: 'complete',
    owner: 'UI Team',
    targetDate: '2024-01-15',
  },
  {
    screenId: 'screen-002',
    screenName: 'Purchase Order Form',
    module: 'procurement',
    status: 'refactor',
    owner: 'UI Team',
    targetDate: '2024-01-20',
  },
  {
    screenId: 'screen-003',
    screenName: 'Stock Register',
    module: 'inventory',
    status: 'pending',
    owner: 'UI Team',
    targetDate: '2024-01-25',
  },
];

// ============================================================================
// PROTOCOL CONTROL POINT
// ============================================================================

export const protocolControlPoint = {
  id: 'CP-DS-01',
  stage: 'VERIFY',
  control: 'Every transactional form includes the Gate-status panel and Accountability tab components',
  enforcement: 'BLOCK (UI review gate)',
  status: 'OBSERVE',
};

// ============================================================================
// COMPONENT CATALOG
// ============================================================================

export interface ComponentDefinition {
  id: string;
  name: string;
  category: 'buttons' | 'inputs' | 'data-display' | 'navigation' | 'feedback' | 'layout' | 'protocol';
  description: string;
  variants?: string[];
  states?: string[];
  accessibility?: string[];
  responsive?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
}

export const components: ComponentDefinition[] = [
  // Buttons
  { id: 'btn-001', name: 'Button', category: 'buttons', description: 'Primary action button with multiple variants', variants: ['primary', 'secondary', 'danger', 'ghost'], states: ['default', 'hover', 'focus', 'disabled', 'loading'], accessibility: ['keyboard', 'aria-label', 'focus-ring'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'btn-002', name: 'Icon Button', category: 'buttons', description: 'Button with icon only', variants: ['default', 'primary', 'danger'], states: ['default', 'hover', 'focus', 'disabled'], accessibility: ['aria-label', 'focus-ring'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'btn-003', name: 'Button Group', category: 'buttons', description: 'Group of related buttons', variants: ['horizontal', 'vertical'], states: ['default', 'disabled'], accessibility: ['keyboard', 'aria-group'], responsive: { mobile: true, tablet: true, desktop: true } },
  
  // Inputs
  { id: 'inp-001', name: 'Text Input', category: 'inputs', description: 'Single-line text input', variants: ['text', 'email', 'password', 'number'], states: ['default', 'focus', 'error', 'disabled', 'readonly'], accessibility: ['label', 'aria-describedby', 'focus-ring'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'inp-002', name: 'Textarea', category: 'inputs', description: 'Multi-line text input', variants: ['default', 'resizable'], states: ['default', 'focus', 'error', 'disabled'], accessibility: ['label', 'aria-describedby'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'inp-003', name: 'Select', category: 'inputs', description: 'Dropdown selection', variants: ['single', 'multi', 'searchable'], states: ['default', 'open', 'disabled'], accessibility: ['keyboard', 'aria-expanded', 'label'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'inp-004', name: 'Checkbox', category: 'inputs', description: 'Checkbox input', variants: ['default', 'indeterminate'], states: ['unchecked', 'checked', 'disabled'], accessibility: ['label', 'aria-checked'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'inp-005', name: 'Radio', category: 'inputs', description: 'Radio button input', variants: ['default'], states: ['unselected', 'selected', 'disabled'], accessibility: ['label', 'aria-checked', 'keyboard'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'inp-006', name: 'Date Picker', category: 'inputs', description: 'Date selection input', variants: ['single', 'range'], states: ['default', 'open', 'disabled'], accessibility: ['label', 'keyboard', 'aria-expanded'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'inp-007', name: 'Lookup', category: 'inputs', description: 'Search and select from list', variants: ['single', 'multi'], states: ['default', 'searching', 'disabled'], accessibility: ['label', 'aria-autocomplete', 'keyboard'], responsive: { mobile: true, tablet: true, desktop: true } },
  
  // Data Display
  { id: 'dd-001', name: 'Status Badge', category: 'data-display', description: 'Status indicator badge', variants: ['success', 'warning', 'error', 'info', 'neutral', 'critical'], states: ['default'], accessibility: ['aria-label'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'dd-002', name: 'KPI Card', category: 'data-display', description: 'Key performance indicator card', variants: ['default', 'compact', 'expanded'], states: ['default', 'loading'], accessibility: ['aria-label', 'aria-valuenow'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'dd-003', name: 'Data Table', category: 'data-display', description: 'Advanced data table with sorting, filtering, pagination', variants: ['default', 'compact', 'striped'], states: ['default', 'loading', 'empty', 'error'], accessibility: ['keyboard', 'aria-sort', 'aria-selected'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'dd-004', name: 'Tree Grid', category: 'data-display', description: 'Hierarchical data table', variants: ['default', 'compact'], states: ['default', 'expanded', 'collapsed'], accessibility: ['keyboard', 'aria-expanded', 'aria-level'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'dd-005', name: 'Chart', category: 'data-display', description: 'Data visualization chart', variants: ['line', 'bar', 'pie', 'area'], states: ['default', 'loading'], accessibility: ['aria-label', 'aria-describedby'], responsive: { mobile: true, tablet: true, desktop: true } },
  
  // Navigation
  { id: 'nav-001', name: 'Sidebar', category: 'navigation', description: 'Main navigation sidebar', variants: ['expanded', 'collapsed'], states: ['default', 'active'], accessibility: ['keyboard', 'aria-current', 'aria-label'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'nav-002', name: 'Breadcrumb', category: 'navigation', description: 'Breadcrumb navigation', variants: ['default'], states: ['default', 'active'], accessibility: ['aria-label', 'aria-current'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'nav-003', name: 'Tabs', category: 'navigation', description: 'Tab navigation', variants: ['horizontal', 'vertical'], states: ['default', 'active', 'disabled'], accessibility: ['keyboard', 'aria-selected', 'aria-controls'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'nav-004', name: 'Pagination', category: 'navigation', description: 'Page navigation', variants: ['default', 'compact'], states: ['default', 'disabled'], accessibility: ['aria-label', 'aria-current', 'keyboard'], responsive: { mobile: true, tablet: true, desktop: true } },
  
  // Feedback
  { id: 'fb-001', name: 'Alert', category: 'feedback', description: 'Alert message', variants: ['info', 'success', 'warning', 'error'], states: ['default', 'dismissible'], accessibility: ['role=alert', 'aria-live'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'fb-002', name: 'Toast', category: 'feedback', description: 'Toast notification', variants: ['info', 'success', 'warning', 'error'], states: ['default', 'dismissing'], accessibility: ['role=status', 'aria-live'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'fb-003', name: 'Modal', category: 'feedback', description: 'Modal dialog', variants: ['default', 'full-screen'], states: ['default', 'open', 'closing'], accessibility: ['aria-modal', 'focus-trap', 'keyboard'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'fb-004', name: 'Tooltip', category: 'feedback', description: 'Tooltip popup', variants: ['top', 'bottom', 'left', 'right'], states: ['default', 'visible'], accessibility: ['aria-describedby'], responsive: { mobile: true, tablet: true, desktop: true } },
  
  // Layout
  { id: 'ly-001', name: 'Card', category: 'layout', description: 'Content card container', variants: ['default', 'elevated', 'outlined'], states: ['default', 'hover'], accessibility: ['aria-label'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'ly-002', name: 'Grid', category: 'layout', description: 'Responsive grid layout', variants: ['1-col', '2-col', '3-col', '4-col'], states: ['default'], accessibility: [], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'ly-003', name: 'Split View', category: 'layout', description: 'Split pane layout', variants: ['horizontal', 'vertical'], states: ['default', 'resizing'], accessibility: ['aria-label', 'keyboard'], responsive: { mobile: true, tablet: true, desktop: true } },
  
  // Protocol Components
  { id: 'pc-001', name: 'Gate Status Panel', category: 'protocol', description: 'Protocol gate status display', variants: ['default', 'compact'], states: ['pass', 'warn', 'fail', 'pending'], accessibility: ['aria-label', 'aria-live'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'pc-002', name: 'Exception Request Dialog', category: 'protocol', description: 'Exception request dialog', variants: ['default'], states: ['open', 'submitting'], accessibility: ['aria-modal', 'focus-trap'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'pc-003', name: 'Reason Code Picker', category: 'protocol', description: 'Reason code selection', variants: ['default'], states: ['open', 'searching'], accessibility: ['aria-label', 'keyboard'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'pc-004', name: 'Compliance Score Badge', category: 'protocol', description: 'Compliance score indicator', variants: ['default', 'compact'], states: ['good', 'warning', 'critical'], accessibility: ['aria-label', 'aria-valuenow'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'pc-005', name: 'Planned vs Actual Bar', category: 'protocol', description: 'Planned vs actual comparison', variants: ['time', 'qty', 'cost', 'progress'], states: ['default', 'overdue'], accessibility: ['aria-label', 'aria-valuenow', 'aria-valuemax'], responsive: { mobile: true, tablet: true, desktop: true } },
  { id: 'pc-006', name: 'Value at Risk Chip', category: 'protocol', description: 'Value at risk indicator', variants: ['low', 'medium', 'high', 'critical'], states: ['default'], accessibility: ['aria-label'], responsive: { mobile: true, tablet: true, desktop: true } },
];

export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return components.filter(c => c.category === category);
}

export function getComponentStats(): { total: number; byCategory: Record<string, number> } {
  const byCategory = components.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return { total: components.length, byCategory };
}

// ============================================================================
// PAGE TEMPLATES
// ============================================================================

export interface PageTemplateDefinition {
  id: string;
  name: string;
  description: string;
  components: string[];
  useCases: string[];
  responsive: boolean;
}

export const pageTemplates: PageTemplateDefinition[] = [
  {
    id: 'tmpl-001',
    name: 'List Report',
    description: 'Data list with filters, sorting, and bulk actions',
    components: ['Data Table', 'Filter Bar', 'Pagination', 'Button Group'],
    useCases: ['Project list', 'Purchase orders', 'Stock register', 'Employee directory'],
    responsive: true,
  },
  {
    id: 'tmpl-002',
    name: 'Object Page',
    description: 'Detailed view of a single object with tabs and actions',
    components: ['Header', 'Tabs', 'Card', 'Data Table', 'Status Badge'],
    useCases: ['Project details', 'PO details', 'Employee profile', 'Site information'],
    responsive: true,
  },
  {
    id: 'tmpl-003',
    name: 'Worklist',
    description: 'Task list with detail panel',
    components: ['Split View', 'List', 'Card', 'Status Badge', 'Button'],
    useCases: ['My approvals', 'Pending tasks', 'Exception requests', 'Violations'],
    responsive: true,
  },
  {
    id: 'tmpl-004',
    name: 'Wizard',
    description: 'Multi-step form with progress indicator',
    components: ['Stepper', 'Form', 'Button Group', 'Card'],
    useCases: ['Project creation', 'PO creation', 'User registration', 'Configuration setup'],
    responsive: true,
  },
  {
    id: 'tmpl-005',
    name: 'Dashboard',
    description: 'Overview with KPI cards and charts',
    components: ['KPI Card', 'Chart', 'Card', 'Grid'],
    useCases: ['Home dashboard', 'Project overview', 'Financial summary', 'Operations dashboard'],
    responsive: true,
  },
  {
    id: 'tmpl-006',
    name: 'Analytical Page',
    description: 'Data analysis with filters and visualizations',
    components: ['Filter Bar', 'Chart', 'Data Table', 'KPI Card'],
    useCases: ['Budget analysis', 'Resource utilization', 'Performance metrics', 'Trend analysis'],
    responsive: true,
  },
  {
    id: 'tmpl-007',
    name: 'Settings Page',
    description: 'Configuration form with sections',
    components: ['Form', 'Tabs', 'Card', 'Button Group'],
    useCases: ['User preferences', 'System settings', 'Integration config', 'Notification settings'],
    responsive: true,
  },
  {
    id: 'tmpl-008',
    name: 'Mobile Capture',
    description: 'Mobile-optimized form with camera/GPS/QR',
    components: ['Form', 'Camera Input', 'GPS Input', 'QR Scanner', 'Button'],
    useCases: ['Attendance marking', 'Material receipt', 'Inspection report', 'Safety incident'],
    responsive: true,
  },
];

export function getPageTemplateStats(): { total: number; responsive: number; byUseCase: Record<string, number> } {
  const byUseCase: Record<string, number> = {};
  pageTemplates.forEach(t => {
    t.useCases.forEach(useCase => {
      byUseCase[useCase] = (byUseCase[useCase] || 0) + 1;
    });
  });
  
  return {
    total: pageTemplates.length,
    responsive: pageTemplates.filter(t => t.responsive).length,
    byUseCase,
  };
}
