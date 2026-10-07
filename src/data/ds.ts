// Part 19 — Design System Tokens, Components & Patterns
// Enterprise UI/UX foundation for the Construction ERP

// ===== DESIGN TOKENS =====
export const designTokens = {
  colors: {
    // Brand colors
    brand: {
      primary: '#1B5E8C',
      primaryHover: '#154B70',
      primaryActive: '#0F3A57',
      secondary: '#2E7D5B',
      accent: '#D4740B',
    },
    // Semantic colors
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
    // Surface colors
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
    // Text colors
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
  },
  typography: {
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyDevanagari: "'IBM Plex Sans Devanagari', 'Noto Sans Devanagari', sans-serif",
    mono: "'IBM Plex Mono', 'Fira Code', monospace",
    sizes: {
      xs: '0.75rem',
      sm: '0.8125rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      display: '2rem',
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
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
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  },
  breakpoints: {
    mobile: '360px',
    tablet: '820px',
    desktop: '1440px',
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

// ===== COMPONENT CATALOGUE =====
export interface Component {
  id: string;
  name: string;
  category: 'basic' | 'form' | 'data' | 'feedback' | 'navigation' | 'layout' | 'protocol';
  description: string;
  variants: string[];
  states: string[];
  accessibility: string[];
  responsive: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export const components: Component[] = [
  // Basic Components
  {
    id: 'button',
    name: 'Button',
    category: 'basic',
    description: 'Primary action trigger with multiple variants',
    variants: ['primary', 'secondary', 'tertiary', 'danger', 'ghost'],
    states: ['default', 'hover', 'focus', 'active', 'disabled', 'loading'],
    accessibility: ['Keyboard navigable', 'ARIA labels', 'Focus visible'],
    responsive: {
      mobile: 'Full width on mobile',
      tablet: 'Auto width',
      desktop: 'Auto width',
    },
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'basic',
    description: 'Status indicator with semantic colors',
    variants: ['success', 'warning', 'error', 'info', 'neutral', 'critical'],
    states: ['default', 'with-icon', 'with-count'],
    accessibility: ['Screen reader text', 'Color contrast AA'],
    responsive: {
      mobile: 'Compact size',
      tablet: 'Standard size',
      desktop: 'Standard size',
    },
  },
  {
    id: 'icon',
    name: 'Icon',
    category: 'basic',
    description: 'Semantic icon system with consistent sizing',
    variants: ['sm', 'md', 'lg', 'xl'],
    states: ['default', 'hover', 'active'],
    accessibility: ['Alt text', 'ARIA labels', 'Focus indicators'],
    responsive: {
      mobile: '20px minimum',
      tablet: '24px standard',
      desktop: '24px standard',
    },
  },

  // Form Components
  {
    id: 'input',
    name: 'Input',
    category: 'form',
    description: 'Text input with validation and help text',
    variants: ['text', 'number', 'email', 'password', 'search'],
    states: ['default', 'focus', 'error', 'disabled', 'readonly'],
    accessibility: ['Label association', 'Error announcements', 'Autocomplete'],
    responsive: {
      mobile: 'Full width',
      tablet: 'Auto width',
      desktop: 'Auto width',
    },
  },
  {
    id: 'select',
    name: 'Select',
    category: 'form',
    description: 'Dropdown selection with search and multi-select',
    variants: ['single', 'multi', 'searchable', 'grouped'],
    states: ['default', 'open', 'disabled', 'loading'],
    accessibility: ['Keyboard navigation', 'ARIA combobox', 'Option announcements'],
    responsive: {
      mobile: 'Full screen modal',
      tablet: 'Dropdown',
      desktop: 'Dropdown',
    },
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'form',
    description: 'Multi-select toggle with label',
    variants: ['default', 'indeterminate'],
    states: ['unchecked', 'checked', 'indeterminate', 'disabled'],
    accessibility: ['Label association', 'Space key toggle', 'ARIA checked'],
    responsive: {
      mobile: '44px touch target',
      tablet: 'Standard size',
      desktop: 'Standard size',
    },
  },
  {
    id: 'datepicker',
    name: 'Date Picker',
    category: 'form',
    description: 'Date selection with financial year support',
    variants: ['single', 'range', 'with-time'],
    states: ['default', 'open', 'disabled', 'error'],
    accessibility: ['Calendar navigation', 'Keyboard shortcuts', 'Date announcements'],
    responsive: {
      mobile: 'Full screen calendar',
      tablet: 'Popover',
      desktop: 'Popover',
    },
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'form',
    description: 'Multi-line text input with character count',
    variants: ['default', 'resizable', 'auto-grow'],
    states: ['default', 'focus', 'error', 'disabled'],
    accessibility: ['Label association', 'Character count', 'Error announcements'],
    responsive: {
      mobile: 'Full width',
      tablet: 'Auto width',
      desktop: 'Auto width',
    },
  },

  // Data Display Components
  {
    id: 'datatable',
    name: 'DataTable',
    category: 'data',
    description: 'Advanced data grid with sorting, filtering, pagination',
    variants: ['default', 'compact', 'expandable', 'selectable'],
    states: ['loading', 'empty', 'error', 'default'],
    accessibility: ['Keyboard navigation', 'ARIA grid', 'Column headers', 'Row selection'],
    responsive: {
      mobile: 'Horizontal scroll, sticky first column',
      tablet: 'Responsive columns',
      desktop: 'Full table',
    },
  },
  {
    id: 'card',
    name: 'Card',
    category: 'data',
    description: 'Content container with header, body, footer',
    variants: ['default', 'elevated', 'outlined', 'interactive'],
    states: ['default', 'hover', 'selected', 'disabled'],
    accessibility: ['Focus management', 'ARIA landmarks'],
    responsive: {
      mobile: 'Full width',
      tablet: 'Auto width',
      desktop: 'Auto width',
    },
  },
  {
    id: 'kpivalue',
    name: 'KPI Value',
    category: 'data',
    description: 'Key performance indicator display with trend',
    variants: ['default', 'with-trend', 'with-target', 'compact'],
    states: ['default', 'positive', 'negative', 'neutral'],
    accessibility: ['Value announcements', 'Trend descriptions'],
    responsive: {
      mobile: 'Stacked layout',
      tablet: 'Horizontal layout',
      desktop: 'Horizontal layout',
    },
  },
  {
    id: 'statusbadge',
    name: 'Status Badge',
    category: 'data',
    description: 'Semantic status indicator for workflow states',
    variants: ['success', 'warning', 'error', 'info', 'neutral', 'critical'],
    states: ['default', 'with-icon', 'with-tooltip'],
    accessibility: ['Status announcements', 'Color contrast'],
    responsive: {
      mobile: 'Compact',
      tablet: 'Standard',
      desktop: 'Standard',
    },
  },

  // Feedback Components
  {
    id: 'alert',
    name: 'Alert',
    category: 'feedback',
    description: 'Important message with action',
    variants: ['info', 'success', 'warning', 'error'],
    states: ['default', 'dismissible', 'with-action'],
    accessibility: ['Role alert', 'Dismiss button', 'Action focus'],
    responsive: {
      mobile: 'Full width',
      tablet: 'Auto width',
      desktop: 'Auto width',
    },
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'feedback',
    description: 'Temporary notification message',
    variants: ['info', 'success', 'warning', 'error'],
    states: ['entering', 'visible', 'exiting'],
    accessibility: ['Live region', 'Auto-dismiss', 'Manual dismiss'],
    responsive: {
      mobile: 'Bottom stacked',
      tablet: 'Top right',
      desktop: 'Top right',
    },
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'feedback',
    description: 'Dialog overlay with focus trap',
    variants: ['default', 'confirmation', 'form', 'fullscreen'],
    states: ['opening', 'open', 'closing'],
    accessibility: ['Focus trap', 'Escape to close', 'ARIA dialog', 'Backdrop click'],
    responsive: {
      mobile: 'Fullscreen',
      tablet: 'Centered',
      desktop: 'Centered',
    },
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'feedback',
    description: 'Contextual help on hover/focus',
    variants: ['top', 'bottom', 'left', 'right'],
    states: ['hidden', 'visible'],
    accessibility: ['ARIA describedby', 'Keyboard accessible', 'Delay timing'],
    responsive: {
      mobile: 'Tap to show',
      tablet: 'Hover to show',
      desktop: 'Hover to show',
    },
  },

  // Navigation Components
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    description: 'Tabbed interface for content sections',
    variants: ['default', 'pills', 'underline'],
    states: ['default', 'active', 'disabled', 'loading'],
    accessibility: ['ARIA tabs', 'Keyboard navigation', 'Panel association'],
    responsive: {
      mobile: 'Scrollable tabs',
      tablet: 'Standard tabs',
      desktop: 'Standard tabs',
    },
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'navigation',
    description: 'Hierarchical navigation path',
    variants: ['default', 'with-icons'],
    states: ['default', 'truncated'],
    accessibility: ['ARIA navigation', 'Current page indicator'],
    responsive: {
      mobile: 'Collapsed with dropdown',
      tablet: 'Standard',
      desktop: 'Standard',
    },
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'navigation',
    description: 'Page navigation for data sets',
    variants: ['default', 'compact', 'with-jump'],
    states: ['default', 'disabled'],
    accessibility: ['ARIA navigation', 'Page announcements', 'Keyboard navigation'],
    responsive: {
      mobile: 'Previous/Next only',
      tablet: 'Compact',
      desktop: 'Full pagination',
    },
  },

  // Layout Components
  {
    id: 'grid',
    name: 'Grid',
    category: 'layout',
    description: 'Responsive grid system',
    variants: ['1-col', '2-col', '3-col', '4-col', 'auto'],
    states: ['default'],
    accessibility: ['Logical reading order'],
    responsive: {
      mobile: 'Single column',
      tablet: '2-3 columns',
      desktop: 'Up to 4 columns',
    },
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'layout',
    description: 'Vertical/horizontal spacing container',
    variants: ['vertical', 'horizontal', 'wrap'],
    states: ['default'],
    accessibility: ['Logical order'],
    responsive: {
      mobile: 'Stacked',
      tablet: 'Configurable',
      desktop: 'Configurable',
    },
  },

  // Protocol Components
  {
    id: 'gatestatuspanel',
    name: 'Gate Status Panel',
    category: 'protocol',
    description: 'Protocol control point status display',
    variants: ['default', 'compact', 'detailed'],
    states: ['pass', 'warn', 'fail', 'blocked'],
    accessibility: ['Status announcements', 'Action guidance'],
    responsive: {
      mobile: 'Collapsible',
      tablet: 'Side panel',
      desktop: 'Side panel',
    },
  },
  {
    id: 'exceptionrequestdialog',
    name: 'Exception Request Dialog',
    category: 'protocol',
    description: 'Dialog for requesting protocol exceptions',
    variants: ['default'],
    states: ['draft', 'submitting', 'submitted'],
    accessibility: ['Form labels', 'Error messages', 'Focus management'],
    responsive: {
      mobile: 'Fullscreen',
      tablet: 'Modal',
      desktop: 'Modal',
    },
  },
  {
    id: 'reasoncodepicker',
    name: 'Reason Code Picker',
    category: 'protocol',
    description: 'Selection component for reason codes',
    variants: ['default', 'with-narrative'],
    states: ['default', 'selected', 'error'],
    accessibility: ['Search', 'Keyboard navigation', 'Selection announcements'],
    responsive: {
      mobile: 'Fullscreen picker',
      tablet: 'Dropdown',
      desktop: 'Dropdown',
    },
  },
  {
    id: 'compliancescorebadge',
    name: 'Compliance Score Badge',
    category: 'protocol',
    description: 'Visual compliance score indicator',
    variants: ['default', 'compact', 'detailed'],
    states: ['excellent', 'good', 'fair', 'poor'],
    accessibility: ['Score announcements', 'Trend descriptions'],
    responsive: {
      mobile: 'Compact',
      tablet: 'Standard',
      desktop: 'Standard',
    },
  },
];

// ===== PAGE TEMPLATES =====
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  components: string[];
  useCases: string[];
  responsive: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export const pageTemplates: PageTemplate[] = [
  {
    id: 'list-report',
    name: 'List Report',
    description: 'Data listing with filters, sorting, and bulk actions',
    components: ['DataTable', 'FilterBar', 'Pagination', 'Button', 'StatusBadge'],
    useCases: ['Project list', 'Purchase orders', 'Material inventory', 'Employee directory'],
    responsive: {
      mobile: 'Single column, stacked filters',
      tablet: 'Side filters, responsive table',
      desktop: 'Top filters, full table',
    },
  },
  {
    id: 'object-page',
    name: 'Object Page',
    description: 'Detailed view of a single entity with tabs and actions',
    components: ['Card', 'Tabs', 'StatusBadge', 'Button', 'KPIValue', 'GateStatusPanel'],
    useCases: ['Project details', 'Purchase order view', 'Employee profile', 'Site information'],
    responsive: {
      mobile: 'Stacked sections, collapsible tabs',
      tablet: 'Side panel, tabbed content',
      desktop: 'Header + tabs + side panel',
    },
  },
  {
    id: 'worklist',
    name: 'Worklist / Inbox',
    description: 'Task queue with list and detail split view',
    components: ['DataTable', 'Card', 'StatusBadge', 'Button', 'Tabs'],
    useCases: ['My approvals', 'Pending tasks', 'Exception requests', 'Violation queue'],
    responsive: {
      mobile: 'List view, tap for detail',
      tablet: 'Split view 40/60',
      desktop: 'Split view 30/70',
    },
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'Multi-step form with progress indicator',
    components: ['Stepper', 'Form', 'Button', 'Alert'],
    useCases: ['Project creation', 'Purchase order creation', 'Employee onboarding', 'Vendor registration'],
    responsive: {
      mobile: 'Vertical stepper, one step at a time',
      tablet: 'Horizontal stepper, compact form',
      desktop: 'Horizontal stepper, full form',
    },
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Widget grid with KPIs and charts',
    components: ['Card', 'KPIValue', 'Chart', 'StatusBadge', 'Grid'],
    useCases: ['Home dashboard', 'Project overview', 'Financial summary', 'Operations monitor'],
    responsive: {
      mobile: 'Single column widgets',
      tablet: '2-column grid',
      desktop: '3-4 column grid',
    },
  },
  {
    id: 'analytical-page',
    name: 'Analytical Page',
    description: 'Data analysis with filters, charts, and drill-down',
    components: ['FilterBar', 'Chart', 'DataTable', 'Card', 'Button'],
    useCases: ['Cost analysis', 'Progress tracking', 'Resource utilization', 'Variance reports'],
    responsive: {
      mobile: 'Stacked charts, simplified filters',
      tablet: 'Side-by-side charts',
      desktop: 'Multi-panel layout',
    },
  },
  {
    id: 'settings-page',
    name: 'Settings Page',
    description: 'Configuration form with sections',
    components: ['Form', 'Tabs', 'Button', 'Alert'],
    useCases: ['User preferences', 'System configuration', 'Integration settings', 'Notification preferences'],
    responsive: {
      mobile: 'Stacked sections',
      tablet: 'Side navigation, content area',
      desktop: 'Side navigation, content area',
    },
  },
  {
    id: 'mobile-capture',
    name: 'Mobile Capture Page',
    description: 'Form optimized for field data collection',
    components: ['Form', 'Camera', 'GPS', 'QRScanner', 'Button'],
    useCases: ['Attendance marking', 'Inspection capture', 'Material receipt', 'Safety incident report'],
    responsive: {
      mobile: 'Full screen, large touch targets',
      tablet: 'Optimized for touch',
      desktop: 'Not applicable',
    },
  },
];

// ===== PROTOCOL CONTROL POINT =====
export const protocolControlPoint = {
  id: 'CP-DS-01',
  stage: 'VERIFY',
  control: 'Every transactional form includes the Gate-status panel and Accountability tab components',
  enforcement: 'BLOCK (UI review gate)',
  status: 'OBSERVE',
};

// ===== HELPER FUNCTIONS =====
export function getComponentsByCategory(category: string): Component[] {
  return components.filter(c => c.category === category);
}

export function getComponentStats(): { total: number; byCategory: Record<string, number> } {
  const byCategory = components.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { total: components.length, byCategory };
}

export function getPageTemplateStats(): { total: number; byUseCase: number } {
  return {
    total: pageTemplates.length,
    byUseCase: pageTemplates.reduce((sum, t) => sum + t.useCases.length, 0),
  };
}
