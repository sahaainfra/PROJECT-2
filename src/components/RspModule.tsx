import React, { useState } from 'react';
import {
  Smartphone, Tablet, Monitor, Camera, MapPin, QrCode, FileText, PenTool, Mic,
  Wifi, WifiOff, Battery, Signal, Download, RefreshCw, CheckCircle, AlertCircle,
  Clock, Shield, Eye, Settings, Bell, User, ChevronRight, Plus, Trash2, Edit,
  Save, X, Smartphone as PhoneIcon, Tablet as TabletIcon, Monitor as DesktopIcon
} from 'lucide-react';
import {
  devices, shellVariants, captureComponents, pwaConfig, breakpoints, protocolControlPoint,
  getDevicesByUser, getDevicesByPlatform, getShellVariant, getCaptureComponentsByType,
  getDeviceStats, getCaptureComponentStats,
  type Device, type ShellVariant, type CaptureComponent, type DeviceType
} from '../data/rsp';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'smartphone': Smartphone, 'tablet': Tablet, 'monitor': Monitor,
    'camera': Camera, 'map-pin': MapPin, 'qr-code': QrCode, 'file-text': FileText,
    'pen-tool': PenTool, 'mic': Mic, 'wifi': Wifi, 'wifi-off': WifiOff,
    'battery': Battery, 'signal': Signal, 'download': Download, 'refresh': RefreshCw,
    'check': CheckCircle, 'alert': AlertCircle, 'clock': Clock, 'shield': Shield,
    'eye': Eye, 'settings': Settings, 'bell': Bell, 'user': User,
    'chevron-right': ChevronRight, 'plus': Plus, 'trash': Trash2, 'edit': Edit,
    'save': Save, 'x': X,
  };
  const IconComponent = icons[name] || Smartphone;
  return <IconComponent size={size} className={className} />;
}

// StatusChip component
function StatusChip({ status, variant }: { status: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }) {
  const colors = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

// Shell Preview Component
function ShellPreview({ variant, device }: { variant: ShellVariant; device: DeviceType }) {
  const dimensions = {
    mobile: { width: '360px', height: '640px' },
    tablet: { width: '820px', height: '1024px' },
    desktop: { width: '100%', height: '600px' },
  };

  return (
    <div
      className="border-2 border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)]"
      style={{ width: dimensions[device].width, height: dimensions[device].height }}
    >
      {/* Header */}
      <div className="h-14 bg-[var(--shell-bg)] text-[var(--shell-text)] flex items-center px-4 gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">ERP</span>
        </div>
        <span className="font-semibold text-sm">Construction ERP</span>
        <div className="flex-1" />
        <Icon name="bell" size={18} />
        <Icon name="user" size={18} />
      </div>

      {/* Content Area */}
      <div className="flex flex-1" style={{ height: 'calc(100% - 56px)' }}>
        {/* Navigation */}
        {variant.navigationType === 'sidebar' && (
          <div className="w-64 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3">
            <div className="space-y-1">
              {variant.primaryActions.map((action, idx) => (
                <button key={idx} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]">
                  <Icon name="chevron-right" size={16} />
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {variant.navigationType === 'rail' && (
          <div className="w-16 border-r border-[var(--border)] bg-[var(--sidebar-bg)] py-3">
            <div className="space-y-2">
              {variant.primaryActions.slice(0, 5).map((action, idx) => (
                <button key={idx} className="w-full flex flex-col items-center gap-1 px-2 py-3 text-xs rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]">
                  <Icon name="chevron-right" size={20} />
                  <span className="text-[10px]">{action}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[var(--surface-hover)]">
              <p className="text-xs text-[var(--text-tertiary)] mb-2">Content Area</p>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 rounded bg-[var(--surface)] border border-[var(--border)]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {variant.navigationType === 'bottom-nav' && (
        <div className="h-16 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-around">
          {variant.primaryActions.map((action, idx) => (
            <button key={idx} className="flex flex-col items-center gap-1 px-3 py-2">
              <Icon name="chevron-right" size={20} className="text-[var(--text-tertiary)]" />
              <span className="text-[10px] text-[var(--text-tertiary)]">{action}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Capture Component Preview
function CapturePreview({ component }: { component: CaptureComponent }) {
  const icons: Record<string, string> = {
    camera: 'camera',
    gps: 'map-pin',
    qr: 'qr-code',
    barcode: 'qr-code',
    file: 'file-text',
    signature: 'pen-tool',
    voice: 'mic',
  };

  return (
    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card-bg)]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-white">
          <Icon name={icons[component.type]} size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{component.name}</h4>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{component.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Permissions</p>
          <div className="flex flex-wrap gap-1">
            {component.permissions.map(perm => (
              <span key={perm} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">{perm}</span>
            ))}
            {component.permissions.length === 0 && (
              <span className="text-xs text-[var(--text-tertiary)]">None required</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Device Support</p>
          <div className="flex gap-2">
            {component.mobileOptimized && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <Icon name="smartphone" size={12} /> Mobile
              </span>
            )}
            {component.tabletOptimized && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 flex items-center gap-1">
                <Icon name="tablet" size={12} /> Tablet
              </span>
            )}
            {component.desktopOptimized && (
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 flex items-center gap-1">
                <Icon name="monitor" size={12} /> Desktop
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RspModule() {
  const [activeTab, setActiveTab] = useState<'shells' | 'devices' | 'capture' | 'pwa' | 'breakpoints'>('shells');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedShell, setSelectedShell] = useState<ShellVariant | null>(null);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>('mobile');

  const tabs = [
    { id: 'shells', label: 'Shell Variants', icon: 'monitor' },
    { id: 'devices', label: 'Device Management', icon: 'smartphone' },
    { id: 'capture', label: 'Capture Components', icon: 'camera' },
    { id: 'pwa', label: 'PWA Configuration', icon: 'download' },
    { id: 'breakpoints', label: 'Responsive Breakpoints', icon: 'tablet' },
  ];

  const deviceStats = getDeviceStats();
  const captureStats = getCaptureComponentStats();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Responsive Shell</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 21 · ff.rsp</p>
        </div>
        <nav className="space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                activeTab === t.id
                  ? 'bg-[var(--brand-primary)] text-white font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Mobile tab selector */}
        <div className="lg:hidden mb-4">
          <select
            value={activeTab}
            onChange={e => setActiveTab(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
          >
            {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {/* SHELL VARIANTS TAB */}
        {activeTab === 'shells' && !selectedShell && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Shell Variants</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Device-specific application shells optimized for each form factor</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Mobile Shell</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">360px</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Bottom navigation</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Tablet Shell</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">820px</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Navigation rail</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Desktop Shell</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">1440px</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Full sidebar</p>
              </div>
            </div>

            {/* Shell Variants List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shellVariants.map(variant => (
                <div
                  key={variant.id}
                  className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] cursor-pointer"
                  onClick={() => setSelectedShell(variant)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      variant.device === 'mobile' ? 'bg-blue-100 text-blue-600' :
                      variant.device === 'tablet' ? 'bg-purple-100 text-purple-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      <Icon name={variant.device} size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{variant.name}</h3>
                      <p className="text-xs text-[var(--text-tertiary)] capitalize">{variant.device}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-3">{variant.description}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Navigation</p>
                      <p className="text-xs text-[var(--text-primary)] capitalize">{variant.navigationType.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Touch Target</p>
                      <p className="text-xs text-[var(--text-primary)]">{variant.touchTargetSize}px</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Protocol Control Point */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[var(--brand-primary)]" />
                Protocol Control Point
              </h3>
              <div className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                <span className="text-xs font-mono font-medium text-[var(--brand-primary)] shrink-0">{protocolControlPoint.id}</span>
                <StatusChip status={protocolControlPoint.stage} variant="info" />
                <span className="text-sm text-[var(--text-primary)] flex-1">{protocolControlPoint.control}</span>
                <StatusChip status={protocolControlPoint.status} variant="warning" />
              </div>
            </div>
          </div>
        )}

        {/* SHELL DETAIL */}
        {activeTab === 'shells' && selectedShell && (
          <div className="space-y-6">
            <button onClick={() => setSelectedShell(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to shell variants
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={selectedShell.device} size={24} className="text-[var(--brand-primary)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedShell.name}</h2>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedShell.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Device Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedShell.device}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Navigation</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedShell.navigationType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Touch Target</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedShell.touchTargetSize}px</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Font Size</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedShell.fontSize}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Primary Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedShell.primaryActions.map((action, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700">{action}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Secondary Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedShell.secondaryActions.map((action, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--surface-hover)] text-[var(--text-secondary)]">{action}</span>
                  ))}
                </div>
              </div>

              {/* Shell Preview */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Shell Preview</h3>
                <div className="flex justify-center">
                  <ShellPreview variant={selectedShell} device={selectedShell.device} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEVICES TAB */}
        {activeTab === 'devices' && !selectedDevice && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Device Management</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{deviceStats.total} registered devices · {deviceStats.trusted} trusted</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total Devices</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{deviceStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Mobile</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{deviceStats.mobile}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Tablet</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{deviceStats.tablet}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Desktop</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{deviceStats.desktop}</p>
              </div>
            </div>

            {/* Device List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Device</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Platform</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Screen</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Trusted</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {devices.map(device => (
                    <tr key={device.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedDevice(device)}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{device.deviceName}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{device.deviceId}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{device.userName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon name={device.platform === 'android' ? 'smartphone' : device.platform === 'ios' ? 'smartphone' : 'monitor'} size={16} className="text-[var(--text-tertiary)]" />
                          <span className="text-xs text-[var(--text-secondary)] capitalize">{device.platform}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {device.screenWidth}×{device.screenHeight}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {device.isTrusted ? (
                          <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {new Date(device.lastSeenAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEVICE DETAIL */}
        {activeTab === 'devices' && selectedDevice && (
          <div className="space-y-6">
            <button onClick={() => setSelectedDevice(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to devices
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={selectedDevice.platform === 'android' || selectedDevice.platform === 'ios' ? 'smartphone' : 'monitor'} size={24} className="text-[var(--brand-primary)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedDevice.deviceName}</h2>
                    {selectedDevice.isTrusted && (
                      <StatusChip status="Trusted" variant="success" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">Device ID: {selectedDevice.deviceId}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)]">
                    Revoke
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">User</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDevice.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Platform</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedDevice.platform}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">OS Version</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDevice.osVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Browser</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDevice.browser}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Screen Size</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDevice.screenWidth}×{selectedDevice.screenHeight}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Pixel Ratio</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDevice.pixelRatio}x</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">App Version</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDevice.appVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Registered</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedDevice.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Last Seen</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedDevice.lastSeenAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Push Token</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1 font-mono text-xs">
                      {selectedDevice.pushToken || 'Not configured'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAPTURE COMPONENTS TAB */}
        {activeTab === 'capture' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Capture Components</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{captureStats.total} components · {captureStats.mobile} mobile-optimized</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Mobile Optimized</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{captureStats.mobile}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Tablet Optimized</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{captureStats.tablet}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Desktop Optimized</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{captureStats.desktop}</p>
              </div>
            </div>

            {/* Capture Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {captureComponents.map(component => (
                <CapturePreview key={component.id} component={component} />
              ))}
            </div>
          </div>
        )}

        {/* PWA TAB */}
        {activeTab === 'pwa' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">PWA Configuration</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Progressive Web App manifest and service worker configuration</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Manifest Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">App Name</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{pwaConfig.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Short Name</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{pwaConfig.shortName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Display Mode</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{pwaConfig.display}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Orientation</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{pwaConfig.orientation}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Theme Color</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: pwaConfig.themeColor }} />
                    <p className="text-sm font-mono text-[var(--text-primary)]">{pwaConfig.themeColor}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Background Color</p>
                  <div className="flex items-center-ga-2 mt-1">
                    <div className="w-6 h-6 rounded border border-[var(--border)]" style={{ backgroundColor: pwaConfig.backgroundColor }} />
                    <p className="text-sm font-mono text-[var(--text-primary)]">{pwaConfig.backgroundColor}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Icons</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {pwaConfig.icons.map((icon, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[var(--surface-hover)] text-center">
                      <div className="w-12 h-12 rounded bg-[var(--brand-primary)] mx-auto mb-1" />
                      <p className="text-[10px] text-[var(--text-tertiary)]">{icon.sizes}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Service Worker</h4>
                <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                  <p className="text-xs font-mono text-[var(--text-primary)]">{pwaConfig.serviceWorker}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BREAKPOINTS TAB */}
        {activeTab === 'breakpoints' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Responsive Breakpoints</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{breakpoints.length} breakpoints defined for responsive layouts</p>
            </div>

            <div className="space-y-4">
              {breakpoints.map((bp, idx) => (
                <div key={idx} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] capitalize">{bp.name}</h3>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        {bp.minWidth}px - {bp.maxWidth === 9999 ? '∞' : `${bp.maxWidth}px`}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg ${
                      bp.name === 'mobile' ? 'bg-blue-100 text-blue-700' :
                      bp.name === 'tablet' ? 'bg-purple-100 text-purple-700' :
                      bp.name === 'desktop' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <span className="text-xs font-medium">{bp.columns} columns</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Gutter</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{bp.gutter}px</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Margin</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{bp.margin}px</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Width Range</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                        {bp.maxWidth - bp.minWidth}px
                      </p>
                    </div>
                  </div>

                  {/* Visual representation */}
                  <div className="mt-4 pt-4 border-t border-[var(--divider)]">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-[var(--brand-primary)] rounded"
                        style={{ width: `${(bp.maxWidth === 9999 ? 1920 : bp.maxWidth) / 1920 * 100}%` }}
                      />
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {bp.maxWidth === 9999 ? '1920px+' : `${bp.maxWidth}px`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
