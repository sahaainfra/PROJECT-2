// Part 07 — Audit, Security & Governance Foundation
// Append-only, tamper-evident audit engine with hash chaining

export type AuditAction = 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'restore' | 'login' | 'logout' | 'export' | 'print' | 'view_sensitive';
export type SecurityEventType = 'brute_force' | 'permission_denied_spike' | 'privileged_change' | 'export_bulk' | 'impossible_travel' | 'token_reuse' | 'new_device_login';
export type SecurityEventStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_POSITIVE';
export type LoginResult = 'success' | 'fail' | 'locked';
export type LoginMethod = 'password' | 'sso' | 'otp';

export interface AuditLogEntry {
  id: string;
  correlationId: string;
  userId: string;
  userName: string;
  userRole: string;
  companyId: string;
  projectId?: string;
  siteId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  deviceId?: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  action: AuditAction;
  timestamp: string;
  reason?: string;
  reasonCode?: string;
  workflowInstanceId?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  changedFields?: string[];
  hash: string;
  previousHash: string;
  verified: boolean;
}

export interface AuditFieldChange {
  id: string;
  auditId: string;
  field: string;
  oldValue: any;
  newValue: any;
  masked: boolean;
}

export interface LoginHistory {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  deviceId: string;
  deviceName: string;
  result: LoginResult;
  method: LoginMethod;
  geoHint?: string;
  failureReason?: string;
}

export interface ActiveSession {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastSeenAt: string;
  isActive: boolean;
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userName?: string;
  title: string;
  description: string;
  details: Record<string, any>;
  timestamp: string;
  status: SecurityEventStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface ReasonCode {
  code: string;
  module: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
}

export interface HashChainVerification {
  id: string;
  runAt: string;
  startId: string;
  endId: string;
  totalRecords: number;
  verifiedCount: number;
  brokenCount: number;
  brokenIds: string[];
  status: 'success' | 'partial' | 'failed';
  runBy: string;
}

// ===== AUDIT LOG (Sample Data with Hash Chain) =====
export const auditLog: AuditLogEntry[] = [
  {
    id: 'audit-001', correlationId: 'corr-001', userId: 'user-001', userName: 'Rajesh Kumar', userRole: 'Super Admin',
    companyId: 'comp-001', sessionId: 'sess-001', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120',
    entityType: 'Project', entityId: 'prj-001', entityName: 'Metro Tower Phase II', action: 'create',
    timestamp: '2024-01-15T10:30:00Z', reason: 'New project approved by management',
    before: undefined,
    after: { code: 'PRJ-001', name: 'Metro Tower Phase II', status: 'Active', budget: 450000000 },
    changedFields: ['code', 'name', 'status', 'budget'],
    hash: 'a1b2c3d4e5f6', previousHash: '000000000000', verified: true,
  },
  {
    id: 'audit-002', correlationId: 'corr-002', userId: 'user-010', userName: 'Rajesh Kumar', userRole: 'Project Manager',
    companyId: 'comp-001', projectId: 'prj-001', sessionId: 'sess-002', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0 Chrome/120',
    entityType: 'PurchaseOrder', entityId: 'po-001', entityName: 'PO-2024-0892', action: 'create',
    timestamp: '2024-01-15T11:15:00Z', reason: 'Material requirement for foundation work',
    before: undefined,
    after: { number: 'PO-2024-0892', supplier: 'Steel India Ltd.', amount: 1250000, status: 'Pending Approval' },
    changedFields: ['number', 'supplier', 'amount', 'status'],
    hash: 'b2c3d4e5f6g7', previousHash: 'a1b2c3d4e5f6', verified: true,
  },
  {
    id: 'audit-003', correlationId: 'corr-003', userId: 'user-002', userName: 'Priya Sharma', userRole: 'Management / CFO',
    companyId: 'comp-001', projectId: 'prj-001', sessionId: 'sess-003', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 Chrome/120',
    entityType: 'PurchaseOrder', entityId: 'po-001', entityName: 'PO-2024-0892', action: 'approve',
    timestamp: '2024-01-15T14:30:00Z', reason: 'Approved as per budget allocation', reasonCode: 'BUDGET_APPROVED',
    before: { status: 'Pending Approval' },
    after: { status: 'Approved' },
    changedFields: ['status'],
    hash: 'c3d4e5f6g7h8', previousHash: 'b2c3d4e5f6g7', verified: true,
  },
  {
    id: 'audit-004', correlationId: 'corr-004', userId: 'user-015', userName: 'Ravi Sharma', userRole: 'Site Engineer',
    companyId: 'comp-001', projectId: 'prj-001', siteId: 'site-001', sessionId: 'sess-004', ipAddress: '192.168.1.103', userAgent: 'Mozilla/5.0 Mobile Safari',
    entityType: 'GRN', entityId: 'grn-001', entityName: 'GRN-2024-1205', action: 'create',
    timestamp: '2024-01-16T09:45:00Z', reason: 'Material received at site',
    before: undefined,
    after: { number: 'GRN-2024-1205', poRef: 'PO-2024-0892', quantity: 5.0, material: 'TMT Bar 16mm', status: 'Received' },
    changedFields: ['number', 'poRef', 'quantity', 'material', 'status'],
    hash: 'd4e5f6g7h8i9', previousHash: 'c3d4e5f6g7h8', verified: true,
  },
  {
    id: 'audit-005', correlationId: 'corr-005', userId: 'user-022', userName: 'Vikram Desai', userRole: 'Accounts Manager',
    companyId: 'comp-001', sessionId: 'sess-005', ipAddress: '192.168.1.104', userAgent: 'Mozilla/5.0 Chrome/120',
    entityType: 'Employee', entityId: 'emp-045', entityName: 'Amit Sharma', action: 'view_sensitive',
    timestamp: '2024-01-16T10:30:00Z', reason: 'Payroll processing',
    before: undefined, after: undefined,
    changedFields: ['salary', 'bankAccount'],
    hash: 'e5f6g7h8i9j0', previousHash: 'd4e5f6g7h8i9', verified: true,
  },
  {
    id: 'audit-006', correlationId: 'corr-006', userId: 'user-001', userName: 'Rajesh Kumar', userRole: 'Super Admin',
    companyId: 'comp-001', sessionId: 'sess-006', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120',
    entityType: 'Role', entityId: 'role-003', entityName: 'Project Manager', action: 'update',
    timestamp: '2024-01-16T11:00:00Z', reason: 'Added permission for site geofence view', reasonCode: 'PERMISSION_UPDATE',
    before: { permissionCount: 36 },
    after: { permissionCount: 38 },
    changedFields: ['permissionCount'],
    hash: 'f6g7h8i9j0k1', previousHash: 'e5f6g7h8i9j0', verified: true,
  },
  {
    id: 'audit-007', correlationId: 'corr-007', userId: 'user-010', userName: 'Rajesh Kumar', userRole: 'Project Manager',
    companyId: 'comp-001', projectId: 'prj-001', sessionId: 'sess-007', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0 Chrome/120',
    entityType: 'Project', entityId: 'prj-001', entityName: 'Metro Tower Phase II', action: 'update',
    timestamp: '2024-01-16T14:00:00Z', reason: 'Revised completion date due to monsoon delay', reasonCode: 'SCHEDULE_CHANGE',
    before: { plannedFinish: '2024-12-31' },
    after: { plannedFinish: '2025-02-28' },
    changedFields: ['plannedFinish'],
    hash: 'g7h8i9j0k1l2', previousHash: 'f6g7h8i9j0k1', verified: true,
  },
  {
    id: 'audit-008', correlationId: 'corr-008', userId: 'user-021', userName: 'Neha Gupta', userRole: 'Store Keeper',
    companyId: 'comp-001', projectId: 'prj-001', siteId: 'site-001', sessionId: 'sess-008', ipAddress: '192.168.1.105', userAgent: 'Mozilla/5.0 Chrome/120',
    entityType: 'StockIssue', entityId: 'mi-001', entityName: 'MI-2024-4521', action: 'create',
    timestamp: '2024-01-16T15:30:00Z', reason: 'Material issued for column casting',
    before: undefined,
    after: { number: 'MI-2024-4521', material: 'Cement OPC 53', quantity: 100, unit: 'bags', issuedTo: 'Ravi Sharma' },
    changedFields: ['number', 'material', 'quantity', 'unit', 'issuedTo'],
    hash: 'h8i9j0k1l2m3', previousHash: 'g7h8i9j0k1l2', verified: true,
  },
];

// ===== LOGIN HISTORY =====
export const loginHistory: LoginHistory[] = [
  { id: 'login-001', userId: 'user-001', userName: 'Rajesh Kumar', timestamp: '2024-01-16T09:00:00Z', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120', deviceId: 'dev-001', deviceName: 'Office Desktop', result: 'success', method: 'password', geoHint: 'Mumbai, IN' },
  { id: 'login-002', userId: 'user-010', userName: 'Rajesh Kumar', timestamp: '2024-01-16T09:15:00Z', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0 Chrome/120', deviceId: 'dev-002', deviceName: 'Project Laptop', result: 'success', method: 'password', geoHint: 'Mumbai, IN' },
  { id: 'login-003', userId: 'user-099', userName: 'Unknown User', timestamp: '2024-01-16T09:20:00Z', ipAddress: '203.0.113.50', userAgent: 'Mozilla/5.0 Firefox/121', deviceId: 'dev-unknown', deviceName: 'Unknown Device', result: 'fail', method: 'password', geoHint: 'Unknown', failureReason: 'Invalid credentials' },
  { id: 'login-004', userId: 'user-099', userName: 'Unknown User', timestamp: '2024-01-16T09:21:00Z', ipAddress: '203.0.113.50', userAgent: 'Mozilla/5.0 Firefox/121', deviceId: 'dev-unknown', deviceName: 'Unknown Device', result: 'fail', method: 'password', geoHint: 'Unknown', failureReason: 'Invalid credentials' },
  { id: 'login-005', userId: 'user-099', userName: 'Unknown User', timestamp: '2024-01-16T09:22:00Z', ipAddress: '203.0.113.50', userAgent: 'Mozilla/5.0 Firefox/121', deviceId: 'dev-unknown', deviceName: 'Unknown Device', result: 'locked', method: 'password', geoHint: 'Unknown', failureReason: 'Account locked after 3 failed attempts' },
  { id: 'login-006', userId: 'user-015', userName: 'Ravi Sharma', timestamp: '2024-01-16T09:30:00Z', ipAddress: '10.0.0.50', userAgent: 'Mozilla/5.0 Mobile Safari', deviceId: 'dev-003', deviceName: 'iPhone 13', result: 'success', method: 'otp', geoHint: 'Mumbai, IN' },
  { id: 'login-007', userId: 'user-002', userName: 'Priya Sharma', timestamp: '2024-01-16T10:00:00Z', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 Chrome/120', deviceId: 'dev-004', deviceName: 'CFO Laptop', result: 'success', method: 'sso', geoHint: 'Mumbai, IN' },
];

// ===== ACTIVE SESSIONS =====
export const activeSessions: ActiveSession[] = [
  { id: 'sess-001', sessionId: 'sess-001', userId: 'user-001', userName: 'Rajesh Kumar', deviceId: 'dev-001', deviceName: 'Office Desktop', deviceType: 'desktop', browser: 'Chrome 120', os: 'Windows 11', ipAddress: '192.168.1.100', location: 'Mumbai, IN', createdAt: '2024-01-16T09:00:00Z', lastSeenAt: '2024-01-16T15:45:00Z', isActive: true },
  { id: 'sess-002', sessionId: 'sess-002', userId: 'user-010', userName: 'Rajesh Kumar', deviceId: 'dev-002', deviceName: 'Project Laptop', deviceType: 'desktop', browser: 'Chrome 120', os: 'macOS 14', ipAddress: '192.168.1.101', location: 'Mumbai, IN', createdAt: '2024-01-16T09:15:00Z', lastSeenAt: '2024-01-16T15:40:00Z', isActive: true },
  { id: 'sess-003', sessionId: 'sess-003', userId: 'user-015', userName: 'Ravi Sharma', deviceId: 'dev-003', deviceName: 'iPhone 13', deviceType: 'mobile', browser: 'Safari 17', os: 'iOS 17', ipAddress: '10.0.0.50', location: 'Mumbai, IN', createdAt: '2024-01-16T09:30:00Z', lastSeenAt: '2024-01-16T15:30:00Z', isActive: true },
  { id: 'sess-004', sessionId: 'sess-004', userId: 'user-002', userName: 'Priya Sharma', deviceId: 'dev-004', deviceName: 'CFO Laptop', deviceType: 'desktop', browser: 'Chrome 120', os: 'Windows 11', ipAddress: '192.168.1.102', location: 'Mumbai, IN', createdAt: '2024-01-16T10:00:00Z', lastSeenAt: '2024-01-16T15:45:00Z', isActive: true },
  { id: 'sess-005', sessionId: 'sess-005', userId: 'user-001', userName: 'Rajesh Kumar', deviceId: 'dev-005', deviceName: 'Home iPad', deviceType: 'tablet', browser: 'Safari 17', os: 'iPadOS 17', ipAddress: '192.168.2.100', location: 'Mumbai, IN', createdAt: '2024-01-15T20:00:00Z', lastSeenAt: '2024-01-15T22:30:00Z', isActive: false, revokedAt: '2024-01-16T08:00:00Z', revokedBy: 'user-001', revokeReason: 'Device no longer in use' },
];

// ===== SECURITY EVENTS =====
export const securityEvents: SecurityEvent[] = [
  {
    id: 'sec-001', type: 'brute_force', severity: 'high', userId: 'user-099',
    title: 'Brute Force Attack Detected',
    description: '3 failed login attempts from IP 203.0.113.50 within 2 minutes',
    details: { ipAddress: '203.0.113.50', attempts: 3, timeWindow: '2 minutes', accountLocked: true },
    timestamp: '2024-01-16T09:22:00Z', status: 'RESOLVED',
    acknowledgedAt: '2024-01-16T09:25:00Z', acknowledgedBy: 'user-001',
    resolvedAt: '2024-01-16T09:30:00Z', resolvedBy: 'user-001',
    resolutionNotes: 'IP blocked for 24 hours. Account unlocked after verification.',
  },
  {
    id: 'sec-002', type: 'privileged_change', severity: 'medium',
    title: 'Role Permission Modified',
    description: 'Super Admin modified Project Manager role permissions',
    details: { roleId: 'role-003', roleName: 'Project Manager', permissionsAdded: 2, permissionsRemoved: 0 },
    timestamp: '2024-01-16T11:00:00Z', status: 'ACKNOWLEDGED',
    acknowledgedAt: '2024-01-16T11:05:00Z', acknowledgedBy: 'user-002',
  },
  {
    id: 'sec-003', type: 'new_device_login', severity: 'low', userId: 'user-015', userName: 'Ravi Sharma',
    title: 'Login from New Device',
    description: 'User logged in from unrecognized mobile device',
    details: { deviceId: 'dev-003', deviceName: 'iPhone 13', ipAddress: '10.0.0.50', location: 'Mumbai, IN' },
    timestamp: '2024-01-16T09:30:00Z', status: 'RESOLVED',
    acknowledgedAt: '2024-01-16T09:35:00Z', acknowledgedBy: 'user-015',
    resolvedAt: '2024-01-16T09:35:00Z', resolvedBy: 'user-015',
    resolutionNotes: 'Confirmed as legitimate device - new phone issued to user.',
  },
  {
    id: 'sec-004', type: 'export_bulk', severity: 'medium', userId: 'user-022', userName: 'Vikram Desai',
    title: 'Bulk Data Export',
    description: 'User exported 500+ employee records',
    details: { entityType: 'Employee', recordCount: 523, format: 'Excel', fieldsIncluded: ['name', 'department', 'salary', 'bankAccount'] },
    timestamp: '2024-01-16T14:00:00Z', status: 'OPEN',
  },
];

// ===== REASON CODES =====
export const reasonCodes: ReasonCode[] = [
  { code: 'BUDGET_APPROVED', module: 'procurement', description: 'Approved as per budget allocation', isSystem: true, isActive: true },
  { code: 'PERMISSION_UPDATE', module: 'iam', description: 'Permission update for operational requirement', isSystem: true, isActive: true },
  { code: 'SCHEDULE_CHANGE', module: 'project', description: 'Schedule change due to external factors', isSystem: true, isActive: true },
  { code: 'EMERGENCY_PROCUREMENT', module: 'procurement', description: 'Emergency procurement for site safety', isSystem: true, isActive: true },
  { code: 'CLIENT_REQUEST', module: 'project', description: 'Change requested by client', isSystem: true, isActive: true },
  { code: 'REGULATORY_COMPLIANCE', module: 'finance', description: 'Required for regulatory compliance', isSystem: true, isActive: true },
  { code: 'ERROR_CORRECTION', module: 'general', description: 'Correction of data entry error', isSystem: true, isActive: true },
  { code: 'PROCESS_DEVIATION', module: 'protocol', description: 'Approved process deviation', isSystem: true, isActive: true },
];

// ===== HASH CHAIN VERIFICATION HISTORY =====
export const verificationHistory: HashChainVerification[] = [
  { id: 'verify-001', runAt: '2024-01-16T02:00:00Z', startId: 'audit-001', endId: 'audit-008', totalRecords: 8, verifiedCount: 8, brokenCount: 0, brokenIds: [], status: 'success', runBy: 'system' },
  { id: 'verify-002', runAt: '2024-01-15T02:00:00Z', startId: 'audit-001', endId: 'audit-006', totalRecords: 6, verifiedCount: 6, brokenCount: 0, brokenIds: [], status: 'success', runBy: 'system' },
  { id: 'verify-003', runAt: '2024-01-14T02:00:00Z', startId: 'audit-001', endId: 'audit-005', totalRecords: 5, verifiedCount: 5, brokenCount: 0, brokenIds: [], status: 'success', runBy: 'system' },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-AUDS-01', stage: 'RECORD', control: 'Audit write failure blocks financial/approval/stock transactions', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-AUDS-02', stage: 'MONITOR', control: 'Hash-chain verification nightly', enforcement: 'MONITOR', status: 'OBSERVE' },
  { id: 'CP-AUDS-03', stage: 'RECORD', control: 'Mandatory reasons captured for PC-7 actions', enforcement: 'BLOCK', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====

export function getAuditLogByEntity(entityType: string, entityId: string): AuditLogEntry[] {
  return auditLog.filter(entry => entry.entityType === entityType && entry.entityId === entityId);
}

export function getAuditLogByUser(userId: string): AuditLogEntry[] {
  return auditLog.filter(entry => entry.userId === userId);
}

export function getAuditLogByDateRange(startDate: string, endDate: string): AuditLogEntry[] {
  return auditLog.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
  });
}

export function getActiveSessionsByUser(userId: string): ActiveSession[] {
  return activeSessions.filter(session => session.userId === userId && session.isActive);
}

export function getSecurityEventsByStatus(status: SecurityEventStatus): SecurityEvent[] {
  return securityEvents.filter(event => event.status === status);
}

export function verifyHashChain(): { valid: boolean; brokenCount: number; brokenIds: string[] } {
  // Simulate hash chain verification
  let previousHash = '000000000000';
  const brokenIds: string[] = [];
  
  for (const entry of auditLog) {
    if (entry.previousHash !== previousHash) {
      brokenIds.push(entry.id);
    }
    previousHash = entry.hash;
  }
  
  return {
    valid: brokenIds.length === 0,
    brokenCount: brokenIds.length,
    brokenIds,
  };
}
