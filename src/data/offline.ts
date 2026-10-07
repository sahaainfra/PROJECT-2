// Part 22 — Offline-First Field Mobile Engine
// Offline sync, command queue, conflict resolution, and media capture

export type CommandStatus = 'QUEUED' | 'SENDING' | 'ACCEPTED' | 'REJECTED' | 'CONFLICT' | 'RESOLVED';
export type DeviceStatus = 'PENDING' | 'TRUSTED' | 'REVOKED';
export type SyncStatusType = 'Offline' | 'Queued' | 'Syncing' | 'Synced' | 'Conflict' | 'Failed';
export type ConflictResolution = 'keep_mine' | 'keep_server' | 'merge';
export type CommandType = 'create' | 'update' | 'delete' | 'media_upload';
export type SnapshotScope = 'projects' | 'sites' | 'wbs' | 'boq' | 'items' | 'employees' | 'equipment' | 'tasks' | 'checklists' | 'drawings';

export interface OfflineDevice {
  id: string;
  deviceId: string;
  userId: string;
  userName: string;
  appVersion: string;
  snapshotVersion: number;
  lastSyncAt?: string;
  status: DeviceStatus;
  registeredAt: string;
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
  platform: string;
  osVersion: string;
  storageUsed: number;
  storageQuota: number;
  pendingCommands: number;
}

export interface OfflineCommand {
  id: string;
  commandId: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  userName: string;
  type: CommandType;
  entityType: string;
  entityId: string;
  payloadHash: string;
  payload: Record<string, any>;
  baseVersions: Record<string, number>;
  deviceTime: string;
  serverReceiptTime?: string;
  gpsCoordinates?: { lat: number; lng: number; accuracy: number };
  status: CommandStatus;
  resultCode?: string;
  resultMessage?: string;
  recordRef?: string;
  retryCount: number;
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
}

export interface OfflineConflict {
  id: string;
  commandId: string;
  command: OfflineCommand;
  recordType: string;
  recordId: string;
  recordName: string;
  serverVersion: number;
  clientBaseVersion: number;
  fields: {
    field: string;
    serverValue: any;
    clientValue: any;
    resolved: boolean;
    resolution?: ConflictResolution;
  }[];
  status: 'detected' | 'pending_resolution' | 'resolved';
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: ConflictResolution;
  resolutionNotes?: string;
}

export interface OfflineSnapshot {
  id: string;
  userId: string;
  userName: string;
  scope: SnapshotScope[];
  version: number;
  generatedAt: string;
  sizeBytes: number;
  lastAccessedAt: string;
  isFresh: boolean;
  ageHours: number;
}

export interface MediaUpload {
  id: string;
  fileId: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  userName: string;
  fileName: string;
  fileType: 'image' | 'video' | 'document';
  mimeType: string;
  sizeBytes: number;
  chunksTotal: number;
  chunksReceived: number;
  hash: string;
  status: 'uploading' | 'paused' | 'completed' | 'failed';
  progress: number;
  commandId?: string;
  entityType?: string;
  entityId?: string;
  metadata: {
    capturedAt: string;
    gpsCoordinates?: { lat: number; lng: number };
    watermark?: { project: string; date: string; user: string };
    compressionProfile: string;
  };
  createdAt: string;
  completedAt?: string;
}

export interface SyncStatus {
  deviceId: string;
  deviceName: string;
  status: SyncStatusType;
  lastSyncAt?: string;
  pendingCommands: number;
  failedCommands: number;
  conflicts: number;
  uploadingMedia: number;
  snapshotAge: number;
  networkType: 'wifi' | '4g' | '3g' | 'offline';
  bandwidthEstimate?: number;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== OFFLINE DEVICES =====
export const offlineDevices: OfflineDevice[] = [
  {
    id: 'off-dev-001', deviceId: 'device-abc-123', userId: 'user-015', userName: 'Ravi Sharma',
    appVersion: '1.2.3', snapshotVersion: 45, lastSyncAt: '2024-01-16T15:30:00Z',
    status: 'TRUSTED', registeredAt: '2024-01-10T09:00:00Z',
    platform: 'Android', osVersion: '13', storageUsed: 1250000000, storageQuota: 5000000000,
    pendingCommands: 3
  },
  {
    id: 'off-dev-002', deviceId: 'device-def-456', userId: 'user-016', userName: 'Sanjay Verma',
    appVersion: '1.2.3', snapshotVersion: 42, lastSyncAt: '2024-01-16T14:00:00Z',
    status: 'TRUSTED', registeredAt: '2024-01-08T10:00:00Z',
    platform: 'iOS', osVersion: '17.2', storageUsed: 980000000, storageQuota: 5000000000,
    pendingCommands: 0
  },
  {
    id: 'off-dev-003', deviceId: 'device-ghi-789', userId: 'user-017', userName: 'Mohan Lal',
    appVersion: '1.2.2', snapshotVersion: 38, lastSyncAt: '2024-01-15T10:00:00Z',
    status: 'TRUSTED', registeredAt: '2024-01-05T14:00:00Z',
    platform: 'Android', osVersion: '12', storageUsed: 2100000000, storageQuota: 5000000000,
    pendingCommands: 12
  },
  {
    id: 'off-dev-004', deviceId: 'device-jkl-012', userId: 'user-018', userName: 'Kiran Patil',
    appVersion: '1.2.3', snapshotVersion: 40, lastSyncAt: '2024-01-14T16:00:00Z',
    status: 'REVOKED', registeredAt: '2024-01-03T09:00:00Z',
    revokedAt: '2024-01-15T10:00:00Z', revokedBy: 'user-001', revokeReason: 'Device lost',
    platform: 'Android', osVersion: '11', storageUsed: 0, storageQuota: 5000000000,
    pendingCommands: 0
  },
  {
    id: 'off-dev-005', deviceId: 'device-mno-345', userId: 'user-019', userName: 'Ramesh Iyer',
    appVersion: '1.2.3', snapshotVersion: 44, lastSyncAt: '2024-01-16T15:45:00Z',
    status: 'TRUSTED', registeredAt: '2024-01-12T11:00:00Z',
    platform: 'iOS', osVersion: '17.1', storageUsed: 750000000, storageQuota: 5000000000,
    pendingCommands: 1
  },
];

// ===== OFFLINE COMMANDS =====
export const offlineCommands: OfflineCommand[] = [
  {
    id: 'cmd-001', commandId: 'uuid-cmd-001', deviceId: 'device-abc-123', deviceName: 'Samsung Galaxy S21',
    userId: 'user-015', userName: 'Ravi Sharma', type: 'create', entityType: 'DPR', entityId: 'dpr-2024-01-16',
    payloadHash: 'sha256:abc123', payload: { date: '2024-01-16', workDone: 'Foundation excavation completed', manpower: 25 },
    baseVersions: { 'dpr-2024-01-16': 0 }, deviceTime: '2024-01-16T15:30:00Z',
    serverReceiptTime: '2024-01-16T15:35:00Z', gpsCoordinates: { lat: 19.1365, lng: 72.8347, accuracy: 15 },
    status: 'ACCEPTED', resultCode: 'OK', recordRef: 'dpr-2024-01-16', retryCount: 0,
    createdAt: '2024-01-16T15:30:00Z', sentAt: '2024-01-16T15:35:00Z', completedAt: '2024-01-16T15:35:01Z'
  },
  {
    id: 'cmd-002', commandId: 'uuid-cmd-002', deviceId: 'device-abc-123', deviceName: 'Samsung Galaxy S21',
    userId: 'user-015', userName: 'Ravi Sharma', type: 'create', entityType: 'Attendance', entityId: 'att-2024-01-16',
    payloadHash: 'sha256:def456', payload: { date: '2024-01-16', workers: 50, present: 48, absent: 2 },
    baseVersions: { 'att-2024-01-16': 0 }, deviceTime: '2024-01-16T09:00:00Z',
    serverReceiptTime: '2024-01-16T15:40:00Z', gpsCoordinates: { lat: 19.1365, lng: 72.8347, accuracy: 12 },
    status: 'ACCEPTED', resultCode: 'OK', recordRef: 'att-2024-01-16', retryCount: 0,
    createdAt: '2024-01-16T09:00:00Z', sentAt: '2024-01-16T15:40:00Z', completedAt: '2024-01-16T15:40:01Z'
  },
  {
    id: 'cmd-003', commandId: 'uuid-cmd-003', deviceId: 'device-ghi-789', deviceName: 'OnePlus 9',
    userId: 'user-017', userName: 'Mohan Lal', type: 'update', entityType: 'Inspection', entityId: 'insp-045',
    payloadHash: 'sha256:ghi789', payload: { status: 'completed', findings: 'Minor cracks observed', photos: 5 },
    baseVersions: { 'insp-045': 3 }, deviceTime: '2024-01-16T14:00:00Z',
    status: 'CONFLICT', resultCode: 'VERSION_CONFLICT', retryCount: 0,
    createdAt: '2024-01-16T14:00:00Z'
  },
  {
    id: 'cmd-004', commandId: 'uuid-cmd-004', deviceId: 'device-ghi-789', deviceName: 'OnePlus 9',
    userId: 'user-017', userName: 'Mohan Lal', type: 'create', entityType: 'MaterialIssue', entityId: 'mi-2024-01-16-001',
    payloadHash: 'sha256:jkl012', payload: { material: 'Cement', quantity: 100, unit: 'bags', issuedTo: 'Ravi Sharma' },
    baseVersions: { 'mi-2024-01-16-001': 0 }, deviceTime: '2024-01-16T11:00:00Z',
    gpsCoordinates: { lat: 26.9124, lng: 75.7873, accuracy: 20 },
    status: 'QUEUED', retryCount: 0, createdAt: '2024-01-16T11:00:00Z'
  },
  {
    id: 'cmd-005', commandId: 'uuid-cmd-005', deviceId: 'device-mno-345', deviceName: 'iPhone 13',
    userId: 'user-019', userName: 'Ramesh Iyer', type: 'create', entityType: 'SafetyObservation', entityId: 'safe-2024-01-16-001',
    payloadHash: 'sha256:mno345', payload: { observation: 'Unsafe scaffolding', severity: 'high', location: 'Zone A' },
    baseVersions: { 'safe-2024-01-16-001': 0 }, deviceTime: '2024-01-16T15:45:00Z',
    gpsCoordinates: { lat: 13.0050, lng: 80.0458, accuracy: 10 },
    status: 'SENDING', retryCount: 1, createdAt: '2024-01-16T15:45:00Z', sentAt: '2024-01-16T15:46:00Z'
  },
  {
    id: 'cmd-006', commandId: 'uuid-cmd-006', deviceId: 'device-jkl-012', deviceName: 'Samsung Galaxy A52',
    userId: 'user-018', userName: 'Kiran Patil', type: 'create', entityType: 'DPR', entityId: 'dpr-2024-01-14',
    payloadHash: 'sha256:pqr678', payload: { date: '2024-01-14', workDone: 'Plumbing work', manpower: 15 },
    baseVersions: { 'dpr-2024-01-14': 0 }, deviceTime: '2024-01-14T16:00:00Z',
    status: 'REJECTED', resultCode: 'DEVICE_REVOKED', resultMessage: 'Device has been revoked',
    retryCount: 3, createdAt: '2024-01-14T16:00:00Z'
  },
];

// ===== OFFLINE CONFLICTS =====
export const offlineConflicts: OfflineConflict[] = [
  {
    id: 'conflict-001', commandId: 'uuid-cmd-003',
    command: offlineCommands[2],
    recordType: 'Inspection', recordId: 'insp-045', recordName: 'Structural Inspection - Zone B',
    serverVersion: 5, clientBaseVersion: 3,
    fields: [
      { field: 'status', serverValue: 'in_progress', clientValue: 'completed', resolved: false },
      { field: 'findings', serverValue: 'Initial assessment', clientValue: 'Minor cracks observed', resolved: false },
      { field: 'photos', serverValue: 2, clientValue: 5, resolved: false },
    ],
    status: 'pending_resolution', detectedAt: '2024-01-16T14:05:00Z'
  },
  {
    id: 'conflict-002', commandId: 'uuid-cmd-007',
    command: { ...offlineCommands[0], id: 'cmd-007', commandId: 'uuid-cmd-007', entityType: 'DPR', entityId: 'dpr-2024-01-15' },
    recordType: 'DPR', recordId: 'dpr-2024-01-15', recordName: 'Daily Progress Report - Jan 15',
    serverVersion: 2, clientBaseVersion: 1,
    fields: [
      { field: 'manpower', serverValue: 22, clientValue: 25, resolved: true, resolution: 'keep_mine' },
      { field: 'workDone', serverValue: 'Excavation 80%', clientValue: 'Foundation excavation completed', resolved: true, resolution: 'keep_server' },
    ],
    status: 'resolved', detectedAt: '2024-01-15T16:00:00Z',
    resolvedAt: '2024-01-15T16:30:00Z', resolvedBy: 'user-015',
    resolution: 'merge', resolutionNotes: 'Merged manpower count, kept server work description'
  },
];

// ===== OFFLINE SNAPSHOTS =====
export const offlineSnapshots: OfflineSnapshot[] = [
  {
    id: 'snap-001', userId: 'user-015', userName: 'Ravi Sharma',
    scope: ['projects', 'sites', 'wbs', 'boq', 'items', 'employees', 'tasks'],
    version: 45, generatedAt: '2024-01-16T06:00:00Z', sizeBytes: 15000000,
    lastAccessedAt: '2024-01-16T15:30:00Z', isFresh: true, ageHours: 9.5
  },
  {
    id: 'snap-002', userId: 'user-016', userName: 'Sanjay Verma',
    scope: ['projects', 'sites', 'wbs', 'boq', 'items', 'employees', 'tasks', 'checklists'],
    version: 42, generatedAt: '2024-01-16T06:00:00Z', sizeBytes: 18000000,
    lastAccessedAt: '2024-01-16T14:00:00Z', isFresh: true, ageHours: 9.5
  },
  {
    id: 'snap-003', userId: 'user-017', userName: 'Mohan Lal',
    scope: ['projects', 'sites', 'wbs', 'boq', 'items', 'employees', 'equipment'],
    version: 38, generatedAt: '2024-01-15T06:00:00Z', sizeBytes: 12000000,
    lastAccessedAt: '2024-01-16T10:00:00Z', isFresh: false, ageHours: 33.5
  },
  {
    id: 'snap-004', userId: 'user-019', userName: 'Ramesh Iyer',
    scope: ['projects', 'sites', 'wbs', 'boq', 'items', 'employees', 'tasks', 'drawings'],
    version: 44, generatedAt: '2024-01-16T06:00:00Z', sizeBytes: 22000000,
    lastAccessedAt: '2024-01-16T15:45:00Z', isFresh: true, ageHours: 9.5
  },
];

// ===== MEDIA UPLOADS =====
export const mediaUploads: MediaUpload[] = [
  {
    id: 'media-001', fileId: 'file-001', deviceId: 'device-abc-123', deviceName: 'Samsung Galaxy S21',
    userId: 'user-015', userName: 'Ravi Sharma', fileName: 'foundation-excavation.jpg',
    fileType: 'image', mimeType: 'image/jpeg', sizeBytes: 2500000,
    chunksTotal: 5, chunksReceived: 5, hash: 'sha256:media001',
    status: 'completed', progress: 100, commandId: 'uuid-cmd-001', entityType: 'DPR', entityId: 'dpr-2024-01-16',
    metadata: {
      capturedAt: '2024-01-16T15:25:00Z',
      gpsCoordinates: { lat: 19.1365, lng: 72.8347 },
      watermark: { project: 'Metro Tower Phase II', date: '2024-01-16', user: 'Ravi Sharma' },
      compressionProfile: 'high-quality'
    },
    createdAt: '2024-01-16T15:30:00Z', completedAt: '2024-01-16T15:32:00Z'
  },
  {
    id: 'media-002', fileId: 'file-002', deviceId: 'device-abc-123', deviceName: 'Samsung Galaxy S21',
    userId: 'user-015', userName: 'Ravi Sharma', fileName: 'inspection-photos.zip',
    fileType: 'document', mimeType: 'application/zip', sizeBytes: 15000000,
    chunksTotal: 30, chunksReceived: 18, hash: 'sha256:media002',
    status: 'uploading', progress: 60, commandId: 'uuid-cmd-003', entityType: 'Inspection', entityId: 'insp-045',
    metadata: {
      capturedAt: '2024-01-16T14:00:00Z',
      gpsCoordinates: { lat: 19.1365, lng: 72.8347 },
      watermark: { project: 'Metro Tower Phase II', date: '2024-01-16', user: 'Ravi Sharma' },
      compressionProfile: 'standard'
    },
    createdAt: '2024-01-16T14:05:00Z'
  },
  {
    id: 'media-003', fileId: 'file-003', deviceId: 'device-mno-345', deviceName: 'iPhone 13',
    userId: 'user-019', userName: 'Ramesh Iyer', fileName: 'safety-observation.mp4',
    fileType: 'video', mimeType: 'video/mp4', sizeBytes: 45000000,
    chunksTotal: 90, chunksReceived: 45, hash: 'sha256:media003',
    status: 'uploading', progress: 50, commandId: 'uuid-cmd-005', entityType: 'SafetyObservation', entityId: 'safe-2024-01-16-001',
    metadata: {
      capturedAt: '2024-01-16T15:40:00Z',
      gpsCoordinates: { lat: 13.0050, lng: 80.0458 },
      watermark: { project: 'Industrial Park Unit 3', date: '2024-01-16', user: 'Ramesh Iyer' },
      compressionProfile: 'high-quality'
    },
    createdAt: '2024-01-16T15:45:00Z'
  },
  {
    id: 'media-004', fileId: 'file-004', deviceId: 'device-ghi-789', deviceName: 'OnePlus 9',
    userId: 'user-017', userName: 'Mohan Lal', fileName: 'material-receipt.jpg',
    fileType: 'image', mimeType: 'image/jpeg', sizeBytes: 1800000,
    chunksTotal: 4, chunksReceived: 4, hash: 'sha256:media004',
    status: 'completed', progress: 100, commandId: 'uuid-cmd-004', entityType: 'MaterialIssue', entityId: 'mi-2024-01-16-001',
    metadata: {
      capturedAt: '2024-01-16T11:00:00Z',
      gpsCoordinates: { lat: 26.9124, lng: 75.7873 },
      watermark: { project: 'Highway Bridge NH-48', date: '2024-01-16', user: 'Mohan Lal' },
      compressionProfile: 'high-quality'
    },
    createdAt: '2024-01-16T11:05:00Z', completedAt: '2024-01-16T11:06:00Z'
  },
];

// ===== SYNC STATUS =====
export const syncStatuses: SyncStatus[] = [
  {
    deviceId: 'device-abc-123', deviceName: 'Samsung Galaxy S21', status: 'Synced',
    lastSyncAt: '2024-01-16T15:30:00Z', pendingCommands: 0, failedCommands: 0,
    conflicts: 0, uploadingMedia: 1, snapshotAge: 9.5, networkType: 'wifi', bandwidthEstimate: 50
  },
  {
    deviceId: 'device-def-456', deviceName: 'iPhone 13', status: 'Synced',
    lastSyncAt: '2024-01-16T14:00:00Z', pendingCommands: 0, failedCommands: 0,
    conflicts: 0, uploadingMedia: 0, snapshotAge: 9.5, networkType: '4g', bandwidthEstimate: 20
  },
  {
    deviceId: 'device-ghi-789', deviceName: 'OnePlus 9', status: 'Conflict',
    lastSyncAt: '2024-01-16T10:00:00Z', pendingCommands: 12, failedCommands: 0,
    conflicts: 1, uploadingMedia: 0, snapshotAge: 33.5, networkType: '3g', bandwidthEstimate: 5
  },
  {
    deviceId: 'device-jkl-012', deviceName: 'Samsung Galaxy A52', status: 'Failed',
    lastSyncAt: '2024-01-14T16:00:00Z', pendingCommands: 0, failedCommands: 1,
    conflicts: 0, uploadingMedia: 0, snapshotAge: 48, networkType: 'offline'
  },
  {
    deviceId: 'device-mno-345', deviceName: 'iPhone 13 Pro', status: 'Syncing',
    lastSyncAt: '2024-01-16T15:45:00Z', pendingCommands: 1, failedCommands: 0,
    conflicts: 0, uploadingMedia: 1, snapshotAge: 9.5, networkType: 'wifi', bandwidthEstimate: 100
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-OFF-01', stage: 'VERIFY', control: 'Controlled offline action requires snapshot within hard age limit and valid device session', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-OFF-02', stage: 'RECORD', control: 'Every offline command carries device time, server receipt time, GPS (if permitted) and base version', enforcement: 'BLOCK(server)', status: 'OBSERVE' },
  { id: 'CP-OFF-03', stage: 'RECONCILE', control: 'Conflicts on financial/approval/stock data resolved by a human within SLA', enforcement: 'EXCEPTION', status: 'OBSERVE' },
  { id: 'CP-OFF-04', stage: 'MONITOR', control: 'Devices with stale queues (> 24 h unsynced) or repeated rejections', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getDeviceStats(): { total: number; trusted: number; revoked: number; pending: number } {
  return {
    total: offlineDevices.length,
    trusted: offlineDevices.filter(d => d.status === 'TRUSTED').length,
    revoked: offlineDevices.filter(d => d.status === 'REVOKED').length,
    pending: offlineDevices.filter(d => d.status === 'PENDING').length,
  };
}

export function getCommandStats(): { total: number; queued: number; accepted: number; rejected: number; conflict: number } {
  return {
    total: offlineCommands.length,
    queued: offlineCommands.filter(c => c.status === 'QUEUED' || c.status === 'SENDING').length,
    accepted: offlineCommands.filter(c => c.status === 'ACCEPTED').length,
    rejected: offlineCommands.filter(c => c.status === 'REJECTED').length,
    conflict: offlineCommands.filter(c => c.status === 'CONFLICT').length,
  };
}

export function getConflictStats(): { total: number; pending: number; resolved: number } {
  return {
    total: offlineConflicts.length,
    pending: offlineConflicts.filter(c => c.status !== 'resolved').length,
    resolved: offlineConflicts.filter(c => c.status === 'resolved').length,
  };
}

export function getMediaUploadStats(): { total: number; uploading: number; completed: number; failed: number } {
  return {
    total: mediaUploads.length,
    uploading: mediaUploads.filter(m => m.status === 'uploading' || m.status === 'paused').length,
    completed: mediaUploads.filter(m => m.status === 'completed').length,
    failed: mediaUploads.filter(m => m.status === 'failed').length,
  };
}

export function getSyncHealthScore(): number {
  const totalDevices = syncStatuses.length;
  if (totalDevices === 0) return 0;
  
  const healthyDevices = syncStatuses.filter(s => 
    s.status === 'Synced' || s.status === 'Syncing'
  ).length;
  
  return Math.round((healthyDevices / totalDevices) * 100);
}
