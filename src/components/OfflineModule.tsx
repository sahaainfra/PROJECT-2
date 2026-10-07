import React, { useState } from 'react';
import {
  Smartphone, Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, Clock,
  Upload, Download, Cloud, CloudOff, Database, FileText, Image, Video,
  MapPin, Camera, Shield, AlertTriangle, XCircle, ChevronRight, MoreVertical,
  HardDrive, Activity, Zap, Lock, Unlock, Eye
} from 'lucide-react';
import {
  offlineDevices, offlineCommands, offlineConflicts, offlineSnapshots,
  mediaUploads, syncStatuses, protocolControlPoints,
  getDeviceStats, getCommandStats, getConflictStats, getMediaUploadStats, getSyncHealthScore,
  type OfflineDevice, type OfflineCommand, type OfflineConflict, type SyncStatus, type MediaUpload
} from '../data/offline';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'smartphone': Smartphone, 'wifi': Wifi, 'wifi-off': WifiOff, 'refresh': RefreshCw,
    'alert': AlertCircle, 'check': CheckCircle, 'clock': Clock, 'upload': Upload,
    'download': Download, 'cloud': Cloud, 'cloud-off': CloudOff, 'database': Database,
    'file': FileText, 'image': Image, 'video': Video, 'map-pin': MapPin,
    'camera': Camera, 'shield': Shield, 'alert-triangle': AlertTriangle,
    'x-circle': XCircle, 'chevron-right': ChevronRight, 'more': MoreVertical,
    'hard-drive': HardDrive, 'activity': Activity, 'zap': Zap, 'lock': Lock,
    'unlock': Unlock, 'eye': Eye,
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

// Progress Bar component
function ProgressBar({ progress, status }: { progress: number; status: string }) {
  const getColor = () => {
    if (status === 'completed') return 'bg-emerald-500';
    if (status === 'failed') return 'bg-red-500';
    if (status === 'paused') return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full bg-[var(--surface-hover)] rounded-full h-2 overflow-hidden">
      <div
        className={`h-full ${getColor()} transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function OfflineModule() {
  const [activeTab, setActiveTab] = useState<'sync-status' | 'devices' | 'commands' | 'conflicts' | 'media' | 'snapshots'>('sync-status');
  const [selectedDevice, setSelectedDevice] = useState<OfflineDevice | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<OfflineCommand | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<OfflineConflict | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaUpload | null>(null);

  const tabs = [
    { id: 'sync-status', label: 'Sync Status', icon: 'activity' },
    { id: 'devices', label: 'Devices', icon: 'smartphone' },
    { id: 'commands', label: 'Command Queue', icon: 'database' },
    { id: 'conflicts', label: 'Conflicts', icon: 'alert-triangle' },
    { id: 'media', label: 'Media Uploads', icon: 'upload' },
    { id: 'snapshots', label: 'Snapshots', icon: 'download' },
  ];

  const deviceStats = getDeviceStats();
  const commandStats = getCommandStats();
  const conflictStats = getConflictStats();
  const mediaStats = getMediaUploadStats();
  const syncHealth = getSyncHealthScore();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Offline Engine</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 22 · ff.offline</p>
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

        {/* SYNC STATUS TAB */}
        {activeTab === 'sync-status' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sync Status Overview</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Real-time synchronization status across all field devices</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Sync Health</p>
                <p className={`text-2xl font-bold mt-1 ${syncHealth >= 80 ? 'text-emerald-600' : syncHealth >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {syncHealth}%
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{syncStatuses.filter(s => s.status === 'Synced').length} devices synced</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending Commands</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{commandStats.queued}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Waiting to sync</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Active Conflicts</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{conflictStats.pending}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Need resolution</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Uploading Media</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{mediaStats.uploading}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Files in progress</p>
              </div>
            </div>

            {/* Device Sync Status */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Device Sync Status</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {syncStatuses.map(sync => (
                  <div key={sync.deviceId} className="p-4 hover:bg-[var(--surface-hover)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          sync.status === 'Synced' ? 'bg-emerald-100 text-emerald-600' :
                          sync.status === 'Syncing' ? 'bg-blue-100 text-blue-600' :
                          sync.status === 'Conflict' ? 'bg-amber-100 text-amber-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          <Icon name={sync.status === 'Synced' ? 'check' : sync.status === 'Syncing' ? 'refresh' : 'alert'} size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{sync.deviceName}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{sync.deviceId}</p>
                        </div>
                      </div>
                      <StatusChip
                        status={sync.status}
                        variant={
                          sync.status === 'Synced' ? 'success' :
                          sync.status === 'Syncing' ? 'info' :
                          sync.status === 'Conflict' ? 'warning' :
                          'error'
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Last Sync</p>
                        <p className="text-xs text-[var(--text-primary)] mt-1">
                          {sync.lastSyncAt ? new Date(sync.lastSyncAt).toLocaleString() : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                        <p className="text-xs text-[var(--text-primary)] mt-1">{sync.pendingCommands} commands</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Snapshot Age</p>
                        <p className={`text-xs mt-1 ${sync.snapshotAge > 24 ? 'text-amber-600 font-medium' : 'text-[var(--text-primary)]'}`}>
                          {sync.snapshotAge.toFixed(1)} hours
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Network</p>
                        <p className="text-xs text-[var(--text-primary)] mt-1 flex items-center gap-1">
                          <Icon name={sync.networkType === 'wifi' ? 'wifi' : sync.networkType === 'offline' ? 'wifi-off' : 'zap'} size={12} />
                          {sync.networkType.toUpperCase()}
                          {sync.bandwidthEstimate && <span className="text-[var(--text-tertiary)]">({sync.bandwidthEstimate} Mbps)</span>}
                        </p>
                      </div>
                    </div>

                    {(sync.conflicts > 0 || sync.uploadingMedia > 0) && (
                      <div className="mt-3 pt-3 border-t border-[var(--divider)] flex items-center gap-4">
                        {sync.conflicts > 0 && (
                          <div className="flex items-center gap-2 text-xs text-amber-600">
                            <AlertTriangle size={14} />
                            <span>{sync.conflicts} conflict{sync.conflicts > 1 ? 's' : ''} need resolution</span>
                          </div>
                        )}
                        {sync.uploadingMedia > 0 && (
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <Upload size={14} />
                            <span>{sync.uploadingMedia} media file{sync.uploadingMedia > 1 ? 's' : ''} uploading</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Control Points */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[var(--brand-primary)]" />
                Protocol Control Points
              </h3>
              <div className="space-y-3">
                {protocolControlPoints.map(cp => (
                  <div key={cp.id} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-mono font-medium text-[var(--brand-primary)] shrink-0">{cp.id}</span>
                    <StatusChip status={cp.stage} variant="info" />
                    <span className="text-sm text-[var(--text-primary)] flex-1">{cp.control}</span>
                    <StatusChip status={cp.status} variant="warning" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DEVICES TAB */}
        {activeTab === 'devices' && !selectedDevice && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Offline Devices</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{deviceStats.total} devices registered · {deviceStats.trusted} trusted</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + Register Device
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Trusted</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{deviceStats.trusted}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{deviceStats.pending}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Revoked</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{deviceStats.revoked}</p>
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
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Storage</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Pending</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {offlineDevices.map(device => (
                    <tr key={device.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedDevice(device)}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{device.deviceId}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">v{device.appVersion}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{device.userName}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                          {device.platform} {device.osVersion}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={device.status}
                          variant={
                            device.status === 'TRUSTED' ? 'success' :
                            device.status === 'PENDING' ? 'warning' :
                            'error'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-xs text-[var(--text-primary)]">{(device.storageUsed / 1000000000).toFixed(1)} GB</p>
                        <p className="text-xs text-[var(--text-tertiary)]">/ {(device.storageQuota / 1000000000).toFixed(0)} GB</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-xs font-medium ${device.pendingCommands > 0 ? 'text-blue-600' : 'text-[var(--text-tertiary)]'}`}>
                          {device.pendingCommands}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {device.lastSyncAt ? new Date(device.lastSyncAt).toLocaleString() : 'Never'}
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
                    <Icon name="smartphone" size={24} className="text-[var(--brand-primary)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedDevice.deviceId}</h2>
                    <StatusChip
                      status={selectedDevice.status}
                      variant={
                        selectedDevice.status === 'TRUSTED' ? 'success' :
                        selectedDevice.status === 'PENDING' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">User: {selectedDevice.userName}</p>
                </div>
                <div className="flex gap-2">
                  {selectedDevice.status === 'TRUSTED' && (
                    <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Revoke
                    </button>
                  )}
                  {selectedDevice.status === 'PENDING' && (
                    <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                      Approve
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Platform</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDevice.platform} {selectedDevice.osVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">App Version</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">v{selectedDevice.appVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Snapshot Version</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">v{selectedDevice.snapshotVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Registered</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedDevice.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Storage</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">Used</span>
                    <span className="text-[var(--text-primary)]">{(selectedDevice.storageUsed / 1000000000).toFixed(2)} GB / {(selectedDevice.storageQuota / 1000000000).toFixed(0)} GB</span>
                  </div>
                  <div className="w-full bg-[var(--surface-hover)] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand-primary)] transition-all"
                      style={{ width: `${(selectedDevice.storageUsed / selectedDevice.storageQuota) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {selectedDevice.revokedAt && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs font-medium text-red-700 mb-1">Device Revoked</p>
                    <p className="text-xs text-red-600">Revoked on {new Date(selectedDevice.revokedAt).toLocaleString()} by {selectedDevice.revokedBy}</p>
                    {selectedDevice.revokeReason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {selectedDevice.revokeReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMANDS TAB */}
        {activeTab === 'commands' && !selectedCommand && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Command Queue</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{commandStats.total} commands · {commandStats.queued} queued · {commandStats.accepted} accepted</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{commandStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Queued</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{commandStats.queued}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Accepted</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{commandStats.accepted}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Rejected</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{commandStats.rejected}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Conflict</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{commandStats.conflict}</p>
              </div>
            </div>

            {/* Command List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Command ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Entity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Device Time</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Retries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {offlineCommands.map(cmd => (
                    <tr key={cmd.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedCommand(cmd)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{cmd.commandId.substring(0, 12)}...</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{cmd.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-[var(--text-primary)]">{cmd.entityType}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{cmd.entityId}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{cmd.userName}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={cmd.status}
                          variant={
                            cmd.status === 'ACCEPTED' ? 'success' :
                            cmd.status === 'QUEUED' || cmd.status === 'SENDING' ? 'info' :
                            cmd.status === 'CONFLICT' ? 'warning' :
                            'error'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(cmd.deviceTime).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{cmd.retryCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMMAND DETAIL */}
        {activeTab === 'commands' && selectedCommand && (
          <div className="space-y-6">
            <button onClick={() => setSelectedCommand(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to commands
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedCommand.commandId}</span>
                    <StatusChip
                      status={selectedCommand.status}
                      variant={
                        selectedCommand.status === 'ACCEPTED' ? 'success' :
                        selectedCommand.status === 'QUEUED' || selectedCommand.status === 'SENDING' ? 'info' :
                        selectedCommand.status === 'CONFLICT' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedCommand.entityType} - {selectedCommand.type}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Entity: {selectedCommand.entityId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">User</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedCommand.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Device</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedCommand.deviceName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Device Time</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedCommand.deviceTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Server Receipt</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                    {selectedCommand.serverReceiptTime ? new Date(selectedCommand.serverReceiptTime).toLocaleString() : '—'}
                  </p>
                </div>
              </div>

              {selectedCommand.gpsCoordinates && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">GPS Coordinates</h3>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--surface-hover)]">
                    <MapPin size={16} className="text-[var(--text-tertiary)]" />
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {selectedCommand.gpsCoordinates.lat.toFixed(6)}, {selectedCommand.gpsCoordinates.lng.toFixed(6)} (±{selectedCommand.gpsCoordinates.accuracy}m)
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Payload</h3>
                <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedCommand.payload, null, 2)}
                </pre>
              </div>

              {selectedCommand.resultCode && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Result</h3>
                  <div className={`p-3 rounded-lg ${
                    selectedCommand.status === 'ACCEPTED' ? 'bg-emerald-50 border border-emerald-200' :
                    selectedCommand.status === 'REJECTED' ? 'bg-red-50 border border-red-200' :
                    'bg-amber-50 border border-amber-200'
                  }`}>
                    <p className="text-xs font-mono font-medium mb-1">{selectedCommand.resultCode}</p>
                    {selectedCommand.resultMessage && (
                      <p className="text-xs">{selectedCommand.resultMessage}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONFLICTS TAB */}
        {activeTab === 'conflicts' && !selectedConflict && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sync Conflicts</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{conflictStats.total} conflicts · {conflictStats.pending} pending resolution</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{conflictStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{conflictStats.pending}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Resolved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{conflictStats.resolved}</p>
              </div>
            </div>

            {/* Conflict List */}
            <div className="space-y-4">
              {offlineConflicts.map(conflict => (
                <div
                  key={conflict.id}
                  className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] cursor-pointer"
                  onClick={() => setSelectedConflict(conflict)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="alert-triangle" size={20} className="text-amber-600" />
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{conflict.recordType} - {conflict.recordName}</h3>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)]">Command: {conflict.commandId}</p>
                    </div>
                    <StatusChip
                      status={conflict.status.replace('_', ' ')}
                      variant={
                        conflict.status === 'resolved' ? 'success' :
                        conflict.status === 'pending_resolution' ? 'warning' :
                        'error'
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-[var(--text-tertiary)]">Server Version</p>
                      <p className="font-medium text-[var(--text-primary)] mt-1">v{conflict.serverVersion}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">Client Version</p>
                      <p className="font-medium text-[var(--text-primary)] mt-1">v{conflict.clientBaseVersion}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">Fields in Conflict</p>
                      <p className="font-medium text-amber-600 mt-1">{conflict.fields.length}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--divider)]">
                    <p className="text-xs text-[var(--text-tertiary)]">Detected: {new Date(conflict.detectedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONFLICT DETAIL */}
        {activeTab === 'conflicts' && selectedConflict && (
          <div className="space-y-6">
            <button onClick={() => setSelectedConflict(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to conflicts
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="alert-triangle" size={24} className="text-amber-600" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedConflict.recordType} Conflict</h2>
                    <StatusChip
                      status={selectedConflict.status.replace('_', ' ')}
                      variant={
                        selectedConflict.status === 'resolved' ? 'success' :
                        selectedConflict.status === 'pending_resolution' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedConflict.recordName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Server Version</p>
                  <p className="text-lg font-bold text-[var(--text-primary)] mt-1">v{selectedConflict.serverVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Client Base Version</p>
                  <p className="text-lg font-bold text-[var(--text-primary)] mt-1">v{selectedConflict.clientBaseVersion}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Field Conflicts</h3>
                <div className="space-y-3">
                  {selectedConflict.fields.map((field, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-[var(--border)]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-mono font-medium text-[var(--brand-primary)]">{field.field}</p>
                        {field.resolved && (
                          <StatusChip status="Resolved" variant="success" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 rounded bg-blue-50 border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Server Value</p>
                          <p className="text-sm text-blue-900">{JSON.stringify(field.serverValue)}</p>
                        </div>
                        <div className="p-2 rounded bg-amber-50 border border-amber-200">
                          <p className="text-xs text-amber-700 mb-1">Client Value</p>
                          <p className="text-sm text-amber-900">{JSON.stringify(field.clientValue)}</p>
                        </div>
                      </div>
                      {field.resolution && (
                        <div className="mt-2 p-2 rounded bg-emerald-50 border border-emerald-200">
                          <p className="text-xs text-emerald-700">Resolution: <span className="font-medium capitalize">{field.resolution.replace('_', ' ')}</span></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedConflict.status === 'resolved' && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Resolution Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Resolved By</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedConflict.resolvedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Resolved At</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                        {selectedConflict.resolvedAt ? new Date(selectedConflict.resolvedAt).toLocaleString() : '—'}
                      </p>
                    </div>
                  </div>
                  {selectedConflict.resolutionNotes && (
                    <div className="mt-3">
                      <p className="text-xs text-[var(--text-tertiary)]">Notes</p>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedConflict.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedConflict.status === 'pending_resolution' && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                      Keep Mine
                    </button>
                    <button className="flex-1 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                      Keep Server
                    </button>
                    <button className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
                      Merge
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MEDIA UPLOADS TAB */}
        {activeTab === 'media' && !selectedMedia && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Media Uploads</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{mediaStats.total} uploads · {mediaStats.uploading} in progress · {mediaStats.completed} completed</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{mediaStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Uploading</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{mediaStats.uploading}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Completed</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{mediaStats.completed}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{mediaStats.failed}</p>
              </div>
            </div>

            {/* Media List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">File</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Size</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Progress</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Entity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {mediaUploads.map(media => (
                    <tr key={media.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedMedia(media)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon name={media.fileType === 'image' ? 'image' : media.fileType === 'video' ? 'video' : 'file'} size={16} className="text-[var(--text-tertiary)]" />
                          <span className="text-xs text-[var(--text-primary)] truncate max-w-[200px]">{media.fileName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{media.fileType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{media.userName}</td>
                      <td className="px-4 py-3 text-right text-xs text-[var(--text-primary)]">{(media.sizeBytes / 1000000).toFixed(1)} MB</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ProgressBar progress={media.progress} status={media.status} />
                          <span className="text-xs text-[var(--text-tertiary)] w-10">{media.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={media.status}
                          variant={
                            media.status === 'completed' ? 'success' :
                            media.status === 'uploading' ? 'info' :
                            media.status === 'paused' ? 'warning' :
                            'error'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {media.entityType} #{media.entityId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MEDIA DETAIL */}
        {activeTab === 'media' && selectedMedia && (
          <div className="space-y-6">
            <button onClick={() => setSelectedMedia(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to media uploads
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={selectedMedia.fileType === 'image' ? 'image' : selectedMedia.fileType === 'video' ? 'video' : 'file'} size={24} className="text-[var(--brand-primary)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedMedia.fileName}</h2>
                    <StatusChip
                      status={selectedMedia.status}
                      variant={
                        selectedMedia.status === 'completed' ? 'success' :
                        selectedMedia.status === 'uploading' ? 'info' :
                        selectedMedia.status === 'paused' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{(selectedMedia.sizeBytes / 1000000).toFixed(2)} MB · {selectedMedia.mimeType}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Upload Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">Chunks</span>
                    <span className="text-[var(--text-primary)]">{selectedMedia.chunksReceived} / {selectedMedia.chunksTotal}</span>
                  </div>
                  <ProgressBar progress={selectedMedia.progress} status={selectedMedia.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">User</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedMedia.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Device</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedMedia.deviceName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Entity</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedMedia.entityType} #{selectedMedia.entityId}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Captured At</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedMedia.metadata.capturedAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedMedia.metadata.gpsCoordinates && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">GPS Coordinates</h3>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--surface-hover)]">
                    <MapPin size={16} className="text-[var(--text-tertiary)]" />
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {selectedMedia.metadata.gpsCoordinates.lat.toFixed(6)}, {selectedMedia.metadata.gpsCoordinates.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              )}

              {selectedMedia.metadata.watermark && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Watermark</h3>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-[var(--text-tertiary)]">Project</p>
                      <p className="text-[var(--text-primary)] mt-1">{selectedMedia.metadata.watermark.project}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">Date</p>
                      <p className="text-[var(--text-primary)] mt-1">{selectedMedia.metadata.watermark.date}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">User</p>
                      <p className="text-[var(--text-primary)] mt-1">{selectedMedia.metadata.watermark.user}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SNAPSHOTS TAB */}
        {activeTab === 'snapshots' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Offline Snapshots</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{offlineSnapshots.length} snapshots · Local data cache for offline operations</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Size</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Freshness</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Generated</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Accessed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {offlineSnapshots.map(snapshot => (
                    <tr key={snapshot.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{snapshot.userName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-[var(--brand-primary)]">v{snapshot.version}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {snapshot.scope.slice(0, 3).map(s => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{s}</span>
                          ))}
                          {snapshot.scope.length > 3 && (
                            <span className="text-xs text-[var(--text-tertiary)]">+{snapshot.scope.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[var(--text-primary)]">{(snapshot.sizeBytes / 1000000).toFixed(1)} MB</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={snapshot.isFresh ? 'Fresh' : 'Stale'}
                          variant={snapshot.isFresh ? 'success' : 'warning'}
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(snapshot.generatedAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(snapshot.lastAccessedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
