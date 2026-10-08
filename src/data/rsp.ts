// Part 21 — Mobile + Tablet + Desktop Experience (Responsive Shell)
// Device-specific interaction patterns, PWA, and capture components

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DevicePlatform = 'android' | 'ios' | 'windows' | 'macos' | 'linux';
export type ConnectivityStatus = 'online' | 'offline' | 'slow' | 'unstable';
export type CaptureType = 'camera' | 'gps' | 'qr' | 'barcode' | 'file' | 'signature' | 'voice';

export interface Device {
  id: string;
  deviceId: string;
  userId: string;
  userName: string;
  platform: DevicePlatform;
  appVersion: string;
  pushToken?: string;
  registeredAt: string;
  lastSeenAt: string;
  isTrusted: boolean;
  revokedAt?: string;
  deviceName: string;
  osVersion: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
}

export interface ShellVariant {
  id: string;
  device: DeviceType;
  name: string;
  description: string;
  navigationType: 'bottom-nav' | 'rail' | 'sidebar';
  headerType: 'top-bar' | 'rail-header' | 'full-header';
  primaryActions: string[];
  secondaryActions: string[];
  touchTargetSize: number;
  fontSize: string;
  spacing: string;
}

export interface CaptureComponent {
  id: string;
  type: CaptureType;
  name: string;
  description: string;
  permissions: string[];
  constraints: {
    maxSize?: number;
    minWidth?: number;
    minHeight?: number;
    accuracy?: number;
    formats?: string[];
  };
  mobileOptimized: boolean;
  tabletOptimized: boolean;
  desktopOptimized: boolean;
}

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
  themeColor: string;
  backgroundColor: string;
  icons: { src: string; sizes: string; type: string }[];
  serviceWorker: string;
  scope: string;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  columns: number;
  gutter: number;
  margin: number;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== DEVICES =====
export const devices: Device[] = [
  {
    id: 'dev-001', deviceId: 'device-abc-123', userId: 'user-015', userName: 'Ravi Sharma',
    platform: 'android', appVersion: '1.2.3', pushToken: 'fcm-token-001',
    registeredAt: '2024-01-10T09:00:00Z', lastSeenAt: '2024-01-16T15:45:00Z',
    isTrusted: true, deviceName: 'Samsung Galaxy S21', osVersion: 'Android 13',
    browser: 'Chrome 120', screenWidth: 360, screenHeight: 800, pixelRatio: 3
  },
  {
    id: 'dev-002', deviceId: 'device-def-456', userId: 'user-010', userName: 'Rajesh Kumar',
    platform: 'ios', appVersion: '1.2.3', pushToken: 'apns-token-002',
    registeredAt: '2024-01-05T10:00:00Z', lastSeenAt: '2024-01-16T15:30:00Z',
    isTrusted: true, deviceName: 'iPhone 13', osVersion: 'iOS 17.2',
    browser: 'Safari 17', screenWidth: 390, screenHeight: 844, pixelRatio: 3
  },
  {
    id: 'dev-003', deviceId: 'device-ghi-789', userId: 'user-020', userName: 'Amit Shah',
    platform: 'android', appVersion: '1.2.3',
    registeredAt: '2024-01-08T14:00:00Z', lastSeenAt: '2024-01-16T14:00:00Z',
    isTrusted: true, deviceName: 'Samsung Galaxy Tab S7', osVersion: 'Android 12',
    browser: 'Chrome 120', screenWidth: 820, screenHeight: 1180, pixelRatio: 2
  },
  {
    id: 'dev-004', deviceId: 'device-jkl-012', userId: 'user-001', userName: 'Rajesh Kumar',
    platform: 'windows', appVersion: '1.2.3',
    registeredAt: '2024-01-01T09:00:00Z', lastSeenAt: '2024-01-16T15:45:00Z',
    isTrusted: true, deviceName: 'Office Desktop', osVersion: 'Windows 11',
    browser: 'Chrome 120', screenWidth: 1920, screenHeight: 1080, pixelRatio: 1
  },
  {
    id: 'dev-005', deviceId: 'device-mno-345', userId: 'user-022', userName: 'Vikram Desai',
    platform: 'macos', appVersion: '1.2.3',
    registeredAt: '2024-01-03T11:00:00Z', lastSeenAt: '2024-01-16T15:40:00Z',
    isTrusted: true, deviceName: 'MacBook Pro', osVersion: 'macOS 14',
    browser: 'Safari 17', screenWidth: 1440, screenHeight: 900, pixelRatio: 2
  },
];

// ===== SHELL VARIANTS =====
export const shellVariants: ShellVariant[] = [
  {
    id: 'shell-001', device: 'mobile', name: 'Mobile Shell',
    description: 'Bottom navigation with 5 role-configurable items + More menu',
    navigationType: 'bottom-nav', headerType: 'top-bar',
    primaryActions: ['Home', 'DPR', 'Tasks', 'Chat', 'More'],
    secondaryActions: ['Approvals', 'Notifications', 'Profile', 'Settings', 'Help'],
    touchTargetSize: 44, fontSize: '14px', spacing: '16px'
  },
  {
    id: 'shell-002', device: 'tablet', name: 'Tablet Shell',
    description: 'Navigation rail with optional secondary pane for detail view',
    navigationType: 'rail', headerType: 'rail-header',
    primaryActions: ['Dashboard', 'Projects', 'Approvals', 'Reports', 'Settings'],
    secondaryActions: ['Notifications', 'Profile', 'Help'],
    touchTargetSize: 48, fontSize: '15px', spacing: '20px'
  },
  {
    id: 'shell-003', device: 'desktop', name: 'Desktop Shell',
    description: 'Full sidebar with header bar, multi-panel layouts, keyboard shortcuts',
    navigationType: 'sidebar', headerType: 'full-header',
    primaryActions: ['Dashboard', 'Projects', 'Procurement', 'Inventory', 'Finance', 'HR', 'Quality', 'Reports'],
    secondaryActions: ['Settings', 'Admin', 'Help', 'Profile'],
    touchTargetSize: 32, fontSize: '14px', spacing: '16px'
  },
];

// ===== CAPTURE COMPONENTS =====
export const captureComponents: CaptureComponent[] = [
  {
    id: 'cap-001', type: 'camera', name: 'Camera Capture',
    description: 'Multi-photo capture with compression and annotation',
    permissions: ['camera'], constraints: { maxSize: 500000, minWidth: 1600, minHeight: 1200 },
    mobileOptimized: true, tabletOptimized: true, desktopOptimized: false
  },
  {
    id: 'cap-002', type: 'gps', name: 'GPS Capture',
    description: 'Location capture with accuracy display and mock-location detection',
    permissions: ['geolocation'], constraints: { accuracy: 50 },
    mobileOptimized: true, tabletOptimized: true, desktopOptimized: false
  },
  {
    id: 'cap-003', type: 'qr', name: 'QR Code Scanner',
    description: 'QR code and barcode scanning for material tracking',
    permissions: ['camera'], constraints: { formats: ['QR_CODE', 'EAN_13', 'CODE_128'] },
    mobileOptimized: true, tabletOptimized: true, desktopOptimized: false
  },
  {
    id: 'cap-004', type: 'barcode', name: 'Barcode Scanner',
    description: 'Barcode scanning for inventory and equipment',
    permissions: ['camera'], constraints: { formats: ['EAN_13', 'EAN_8', 'UPC_A', 'CODE_128'] },
    mobileOptimized: true, tabletOptimized: true, desktopOptimized: false
  },
  {
    id: 'cap-005', type: 'file', name: 'File Picker',
    description: 'Document and image file selection',
    permissions: [], constraints: { maxSize: 10000000, formats: ['pdf', 'jpg', 'png', 'xlsx', 'docx'] },
    mobileOptimized: true, tabletOptimized: true, desktopOptimized: true
  },
  {
    id: 'cap-006', type: 'signature', name: 'Signature Pad',
    description: 'Digital signature capture for approvals',
    permissions: [], constraints: { minWidth: 300, minHeight: 150 },
    mobileOptimized: true, tabletOptimized: true, desktopOptimized: true
  },
  {
    id: 'cap-007', type: 'voice', name: 'Voice to Text',
    description: 'Voice input for comments and notes',
    permissions: ['microphone'], constraints: {},
    mobileOptimized: true, tabletOptimized: true, desktopOptimized: false
  },
];

// ===== PWA CONFIGURATION =====
export const pwaConfig: PWAConfig = {
  name: 'Construction ERP',
  shortName: 'ERP',
  description: 'Integrated Construction ERP System',
  startUrl: '/',
  display: 'standalone',
  orientation: 'any',
  themeColor: '#1B5E8C',
  backgroundColor: '#FFFFFF',
  icons: [
    { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
    { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
    { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
    { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
    { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
    { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
  serviceWorker: '/service-worker.js',
  scope: '/',
};

// ===== RESPONSIVE BREAKPOINTS =====
export const breakpoints: ResponsiveBreakpoint[] = [
  { name: 'mobile', minWidth: 0, maxWidth: 767, columns: 4, gutter: 16, margin: 16 },
  { name: 'tablet', minWidth: 768, maxWidth: 1023, columns: 8, gutter: 20, margin: 24 },
  { name: 'desktop', minWidth: 1024, maxWidth: 1439, columns: 12, gutter: 24, margin: 32 },
  { name: 'wide', minWidth: 1440, maxWidth: 9999, columns: 12, gutter: 24, margin: 48 },
];

// ===== PROTOCOL CONTROL POINT =====
export const protocolControlPoint: ProtocolControlPoint = {
  id: 'CP-RSP-01',
  stage: 'EXECUTE',
  control: 'Field-critical protocol actions (gate status, exception request, emergency execution, approvals) fully usable at 360 px',
  enforcement: 'BLOCK (UI acceptance)',
  status: 'OBSERVE',
};

// ===== HELPER FUNCTIONS =====
export function getDevicesByUser(userId: string): Device[] {
  return devices.filter(d => d.userId === userId);
}

export function getDevicesByPlatform(platform: DevicePlatform): Device[] {
  return devices.filter(d => d.platform === platform);
}

export function getShellVariant(device: DeviceType): ShellVariant | null {
  return shellVariants.find(s => s.device === device) || null;
}

export function getCaptureComponentsByType(type: CaptureType): CaptureComponent[] {
  return captureComponents.filter(c => c.type === type);
}

export function getDeviceStats(): { total: number; mobile: number; tablet: number; desktop: number; trusted: number } {
  return {
    total: devices.length,
    mobile: devices.filter(d => d.screenWidth < 768).length,
    tablet: devices.filter(d => d.screenWidth >= 768 && d.screenWidth < 1024).length,
    desktop: devices.filter(d => d.screenWidth >= 1024).length,
    trusted: devices.filter(d => d.isTrusted).length,
  };
}

export function getCaptureComponentStats(): { total: number; mobile: number; tablet: number; desktop: number } {
  return {
    total: captureComponents.length,
    mobile: captureComponents.filter(c => c.mobileOptimized).length,
    tablet: captureComponents.filter(c => c.tabletOptimized).length,
    desktop: captureComponents.filter(c => c.desktopOptimized).length,
  };
}
