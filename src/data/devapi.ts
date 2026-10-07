// Part 18 — API, Integration & Developer Platform
// OAuth2/OIDC, API versioning, rate limiting, bulk operations, developer portal

export type ClientType = 'confidential' | 'public' | 'api_key';
export type ClientStatus = 'requested' | 'security_review' | 'approved' | 'active' | 'suspended' | 'revoked';
export type ApiVersionStatus = 'beta' | 'ga' | 'deprecated' | 'retired';
export type BulkJobStatus = 'pending' | 'validating' | 'preview' | 'importing' | 'completed' | 'failed';
export type BulkJobType = 'import' | 'export';

export interface ApiClient {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  type: ClientType;
  scopes: string[];
  companyScope: string[];
  ipAllowlist: string[];
  status: ClientStatus;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  requestCount24h: number;
  errorRate24h: number;
}

export interface ApiCredential {
  id: string;
  clientId: string;
  secretRef: string;
  createdAt: string;
  rotatedAt?: string;
  expiresAt?: string;
}

export interface ApiVersion {
  id: string;
  api: string;
  version: string;
  status: ApiVersionStatus;
  releasedAt: string;
  sunsetAt?: string;
  changelog: string;
  breakingChanges: string[];
  deprecatedFeatures: string[];
}

export interface ApiAuditLog {
  id: string;
  clientId: string;
  clientName: string;
  userId?: string;
  route: string;
  method: string;
  status: number;
  latencyMs: number;
  records: number;
  correlationId: string;
  timestamp: string;
  ipAddress: string;
}

export interface BulkJob {
  id: string;
  clientId: string;
  clientName: string;
  type: BulkJobType;
  templateCode: string;
  status: BulkJobStatus;
  fileId?: string;
  reportFileId?: string;
  totalRecords: number;
  processedRecords: number;
  successRecords: number;
  errorRecords: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface RateLimitConfig {
  id: string;
  clientId?: string;
  routeGroup: string;
  requestsPerMinute: number;
  burstLimit: number;
  isActive: boolean;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: string;
  version: string;
  description: string;
  scopes: string[];
  rateLimitGroup: string;
  isDeprecated: boolean;
  deprecationNotice?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== API CLIENTS =====
export const apiClients: ApiClient[] = [
  {
    id: 'client-001', name: 'Vendor Portal Integration', ownerId: 'user-020', ownerName: 'Amit Shah',
    type: 'confidential', scopes: ['procurement.po.view', 'procurement.po.download'],
    companyScope: ['comp-001'], ipAllowlist: ['203.0.113.0/24'], status: 'active',
    createdAt: '2024-01-01', lastUsedAt: '2024-01-16T15:30:00Z', requestCount24h: 1250, errorRate24h: 0.02
  },
  {
    id: 'client-002', name: 'BI Tool Read Access', ownerId: 'user-022', ownerName: 'Vikram Desai',
    type: 'confidential', scopes: ['rpt.dashboard.view', 'rpt.report.view', 'rpt.report.export'],
    companyScope: ['comp-001'], ipAllowlist: ['198.51.100.0/24'], status: 'active',
    createdAt: '2024-01-01', lastUsedAt: '2024-01-16T02:15:00Z', requestCount24h: 450, errorRate24h: 0.01
  },
  {
    id: 'client-003', name: 'Mobile Application', ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    type: 'public', scopes: ['shell.home.view', 'proc.pr.view', 'proc.pr.create', 'inv.grn.view', 'inv.grn.create'],
    companyScope: ['comp-001'], ipAllowlist: [], status: 'active',
    createdAt: '2024-01-01', lastUsedAt: '2024-01-16T15:40:00Z', requestCount24h: 8500, errorRate24h: 0.005
  },
  {
    id: 'client-004', name: 'Partner API - Steel Supplier', ownerId: 'user-020', ownerName: 'Amit Shah',
    type: 'api_key', scopes: ['procurement.po.view'],
    companyScope: ['comp-001'], ipAllowlist: ['192.0.2.0/24'], status: 'active',
    createdAt: '2024-01-05', expiresAt: '2025-01-05', lastUsedAt: '2024-01-16T14:00:00Z', requestCount24h: 320, errorRate24h: 0.03
  },
  {
    id: 'client-005', name: 'Third-Party Accounting Sync', ownerId: 'user-022', ownerName: 'Vikram Desai',
    type: 'confidential', scopes: ['finance.bill.view', 'finance.payment.view'],
    companyScope: ['comp-001'], ipAllowlist: ['198.51.100.50'], status: 'security_review',
    createdAt: '2024-01-15', requestCount24h: 0, errorRate24h: 0
  },
];

// ===== API CREDENTIALS =====
export const apiCredentials: ApiCredential[] = [
  { id: 'cred-001', clientId: 'client-001', secretRef: 'vault://api/client-001-secret', createdAt: '2024-01-01', rotatedAt: '2024-01-10' },
  { id: 'cred-002', clientId: 'client-002', secretRef: 'vault://api/client-002-secret', createdAt: '2024-01-01' },
  { id: 'cred-003', clientId: 'client-003', secretRef: 'vault://api/client-003-secret', createdAt: '2024-01-01', rotatedAt: '2024-01-12' },
  { id: 'cred-004', clientId: 'client-004', secretRef: 'vault://api/client-004-key', createdAt: '2024-01-05', expiresAt: '2025-01-05' },
];

// ===== API VERSIONS =====
export const apiVersions: ApiVersion[] = [
  {
    id: 'ver-001', api: 'projects', version: 'v1', status: 'ga',
    releasedAt: '2024-01-01', changelog: 'Initial stable release',
    breakingChanges: [], deprecatedFeatures: []
  },
  {
    id: 'ver-002', api: 'procurement', version: 'v1', status: 'ga',
    releasedAt: '2024-01-01', changelog: 'Initial stable release',
    breakingChanges: [], deprecatedFeatures: []
  },
  {
    id: 'ver-003', api: 'procurement', version: 'v2', status: 'beta',
    releasedAt: '2024-01-10', changelog: 'Added bulk operations, improved filtering',
    breakingChanges: [], deprecatedFeatures: []
  },
  {
    id: 'ver-004', api: 'inventory', version: 'v1', status: 'ga',
    releasedAt: '2024-01-01', changelog: 'Initial stable release',
    breakingChanges: [], deprecatedFeatures: []
  },
  {
    id: 'ver-005', api: 'finance', version: 'v1', status: 'deprecated',
    releasedAt: '2024-01-01', sunsetAt: '2024-07-01',
    changelog: 'Deprecated in favor of v2 with improved error handling',
    breakingChanges: [], deprecatedFeatures: ['Legacy error format', 'Single-item endpoints']
  },
  {
    id: 'ver-006', api: 'finance', version: 'v2', status: 'ga',
    releasedAt: '2024-01-15', changelog: 'Improved error handling, batch operations',
    breakingChanges: ['Error envelope format changed'], deprecatedFeatures: []
  },
];

// ===== API AUDIT LOG =====
export const apiAuditLog: ApiAuditLog[] = [
  {
    id: 'audit-001', clientId: 'client-001', clientName: 'Vendor Portal Integration',
    route: '/api/v1/procurement/purchase-orders', method: 'GET', status: 200,
    latencyMs: 125, records: 15, correlationId: 'corr-api-001',
    timestamp: '2024-01-16T15:30:00Z', ipAddress: '203.0.113.10'
  },
  {
    id: 'audit-002', clientId: 'client-002', clientName: 'BI Tool Read Access',
    route: '/api/v1/reports/dashboards', method: 'GET', status: 200,
    latencyMs: 340, records: 1, correlationId: 'corr-api-002',
    timestamp: '2024-01-16T02:15:00Z', ipAddress: '198.51.100.25'
  },
  {
    id: 'audit-003', clientId: 'client-003', clientName: 'Mobile Application',
    route: '/api/v1/procurement/purchase-requests', method: 'POST', status: 201,
    latencyMs: 89, records: 1, correlationId: 'corr-api-003',
    timestamp: '2024-01-16T15:40:00Z', ipAddress: '10.0.0.50'
  },
  {
    id: 'audit-004', clientId: 'client-004', clientName: 'Partner API - Steel Supplier',
    route: '/api/v1/procurement/purchase-orders/po-089', method: 'GET', status: 403,
    latencyMs: 12, records: 0, correlationId: 'corr-api-004',
    timestamp: '2024-01-16T14:00:00Z', ipAddress: '192.0.2.15'
  },
  {
    id: 'audit-005', clientId: 'client-001', clientName: 'Vendor Portal Integration',
    route: '/api/v1/procurement/purchase-orders/po-090/download', method: 'GET', status: 200,
    latencyMs: 210, records: 1, correlationId: 'corr-api-005',
    timestamp: '2024-01-16T14:30:00Z', ipAddress: '203.0.113.10'
  },
  {
    id: 'audit-006', clientId: 'client-003', clientName: 'Mobile Application',
    route: '/api/v1/inventory/grn', method: 'POST', status: 400,
    latencyMs: 45, records: 0, correlationId: 'corr-api-006',
    timestamp: '2024-01-16T13:20:00Z', ipAddress: '10.0.0.51'
  },
];

// ===== BULK JOBS =====
export const bulkJobs: BulkJob[] = [
  {
    id: 'job-001', clientId: 'client-002', clientName: 'BI Tool Read Access',
    type: 'export', templateCode: 'FINANCE_REPORT', status: 'completed',
    fileId: 'file-001', reportFileId: 'report-001',
    totalRecords: 5000, processedRecords: 5000, successRecords: 5000, errorRecords: 0,
    startedAt: '2024-01-16T02:00:00Z', completedAt: '2024-01-16T02:15:00Z'
  },
  {
    id: 'job-002', clientId: 'client-001', clientName: 'Vendor Portal Integration',
    type: 'import', templateCode: 'PURCHASE_ORDERS', status: 'completed',
    fileId: 'file-002', reportFileId: 'report-002',
    totalRecords: 150, processedRecords: 150, successRecords: 148, errorRecords: 2,
    startedAt: '2024-01-16T10:00:00Z', completedAt: '2024-01-16T10:05:00Z'
  },
  {
    id: 'job-003', clientId: 'client-003', clientName: 'Mobile Application',
    type: 'import', templateCode: 'ATTENDANCE_BULK', status: 'failed',
    fileId: 'file-003',
    totalRecords: 200, processedRecords: 50, successRecords: 45, errorRecords: 5,
    startedAt: '2024-01-16T09:00:00Z', completedAt: '2024-01-16T09:02:00Z',
    error: 'Validation failed: Invalid employee IDs in rows 51-55'
  },
  {
    id: 'job-004', clientId: 'client-002', clientName: 'BI Tool Read Access',
    type: 'export', templateCode: 'PROJECT_SUMMARY', status: 'importing',
    fileId: 'file-004',
    totalRecords: 10000, processedRecords: 6500, successRecords: 6500, errorRecords: 0,
    startedAt: '2024-01-16T15:00:00Z'
  },
];

// ===== RATE LIMIT CONFIGS =====
export const rateLimitConfigs: RateLimitConfig[] = [
  { id: 'rl-001', routeGroup: 'read', requestsPerMinute: 1000, burstLimit: 100, isActive: true },
  { id: 'rl-002', routeGroup: 'write', requestsPerMinute: 100, burstLimit: 10, isActive: true },
  { id: 'rl-003', routeGroup: 'bulk', requestsPerMinute: 10, burstLimit: 2, isActive: true },
  { id: 'rl-004', clientId: 'client-003', routeGroup: 'read', requestsPerMinute: 2000, burstLimit: 200, isActive: true },
  { id: 'rl-005', clientId: 'client-004', routeGroup: 'read', requestsPerMinute: 500, burstLimit: 50, isActive: true },
];

// ===== API ENDPOINTS =====
export const apiEndpoints: ApiEndpoint[] = [
  { id: 'ep-001', path: '/api/v1/projects', method: 'GET', version: 'v1', description: 'List all projects', scopes: ['org.project.view'], rateLimitGroup: 'read', isDeprecated: false },
  { id: 'ep-002', path: '/api/v1/projects/:id', method: 'GET', version: 'v1', description: 'Get project details', scopes: ['org.project.view'], rateLimitGroup: 'read', isDeprecated: false },
  { id: 'ep-003', path: '/api/v1/procurement/purchase-orders', method: 'GET', version: 'v1', description: 'List purchase orders', scopes: ['procurement.po.view'], rateLimitGroup: 'read', isDeprecated: false },
  { id: 'ep-004', path: '/api/v1/procurement/purchase-orders', method: 'POST', version: 'v1', description: 'Create purchase order', scopes: ['procurement.po.create'], rateLimitGroup: 'write', isDeprecated: false },
  { id: 'ep-005', path: '/api/v2/procurement/purchase-orders', method: 'GET', version: 'v2', description: 'List purchase orders (v2 with enhanced filtering)', scopes: ['procurement.po.view'], rateLimitGroup: 'read', isDeprecated: false },
  { id: 'ep-006', path: '/api/v1/inventory/grn', method: 'POST', version: 'v1', description: 'Create goods receipt note', scopes: ['inventory.grn.create'], rateLimitGroup: 'write', isDeprecated: false },
  { id: 'ep-007', path: '/api/v1/finance/bills', method: 'GET', version: 'v1', description: 'List bills (deprecated)', scopes: ['finance.bill.view'], rateLimitGroup: 'read', isDeprecated: true, deprecationNotice: 'Use /api/v2/finance/bills instead' },
  { id: 'ep-008', path: '/api/v2/finance/bills', method: 'GET', version: 'v2', description: 'List bills with improved error handling', scopes: ['finance.bill.view'], rateLimitGroup: 'read', isDeprecated: false },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-API-01', stage: 'APPROVE', control: 'New external client and scopes approved by data owner + IT Security', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-API-02', stage: 'VERIFY', control: 'No breaking change on a GA version (OpenAPI diff)', enforcement: 'BLOCK(build)', status: 'OBSERVE' },
  { id: 'CP-API-03', stage: 'MONITOR', control: 'Abnormal client behaviour (error spikes, scope probing, volume anomalies)', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getClientStats(): { total: number; active: number; pending: number; suspended: number } {
  return {
    total: apiClients.length,
    active: apiClients.filter(c => c.status === 'active').length,
    pending: apiClients.filter(c => c.status === 'requested' || c.status === 'security_review').length,
    suspended: apiClients.filter(c => c.status === 'suspended' || c.status === 'revoked').length,
  };
}

export function getVersionStats(): { total: number; ga: number; beta: number; deprecated: number } {
  return {
    total: apiVersions.length,
    ga: apiVersions.filter(v => v.status === 'ga').length,
    beta: apiVersions.filter(v => v.status === 'beta').length,
    deprecated: apiVersions.filter(v => v.status === 'deprecated').length,
  };
}

export function getBulkJobStats(): { total: number; completed: number; failed: number; inProgress: number } {
  return {
    total: bulkJobs.length,
    completed: bulkJobs.filter(j => j.status === 'completed').length,
    failed: bulkJobs.filter(j => j.status === 'failed').length,
    inProgress: bulkJobs.filter(j => j.status === 'validating' || j.status === 'preview' || j.status === 'importing').length,
  };
}

export function getApiUsage24h(): number {
  return apiClients.reduce((sum, c) => sum + c.requestCount24h, 0);
}

export function getAverageLatency(): number {
  if (apiAuditLog.length === 0) return 0;
  return Math.round(apiAuditLog.reduce((sum, l) => sum + l.latencyMs, 0) / apiAuditLog.length);
}
