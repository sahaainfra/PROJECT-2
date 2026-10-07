// Part 04 — Core Services Data
// Technical Console — DS-32, hidden from business users

export interface ServiceHook {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'validation' | 'audit' | 'event' | 'notification' | 'document' | 'numbering' | 'utility';
  status: 'active' | 'stub' | 'planned';
  partOwner: string;
  usageCount: number;
  lastUsed?: string;
}

export interface OutboxMetric {
  timestamp: string;
  pending: number;
  published: number;
  failed: number;
  deadLetter: number;
  avgLatencyMs: number;
}

export interface JobMetric {
  jobId: string;
  jobName: string;
  type: 'scheduled' | 'on-demand';
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
  status: 'idle' | 'running' | 'failed';
  successRate: number;
  avgDurationMs: number;
  totalRuns: number;
}

export interface NumberSeriesStatus {
  key: string;
  docType: string;
  fy: string;
  currentValue: number;
  prefix: string;
  lastGenerated?: string;
  generatedBy?: string;
}

export interface ErrorStat {
  code: string;
  message: string;
  count: number;
  lastOccurrence: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// ===== SERVICE HOOKS =====
export const serviceHooks: ServiceHook[] = [
  { id: 'hook-auth', name: 'authorize()', description: 'Four-layer authorization check (UI → API → Service → Data)', category: 'auth', status: 'stub', partOwner: 'Part 06', usageCount: 1247, lastUsed: '2024-01-16T14:30:00Z' },
  { id: 'hook-validate', name: 'validate()', description: 'Schema validation shared by frontend and backend', category: 'validation', status: 'active', partOwner: 'Part 04', usageCount: 3421, lastUsed: '2024-01-16T14:32:00Z' },
  { id: 'hook-audit', name: 'audit()', description: 'Records all changes for compliance (SA-7)', category: 'audit', status: 'stub', partOwner: 'Part 07', usageCount: 892, lastUsed: '2024-01-16T14:31:00Z' },
  { id: 'hook-emit', name: 'emit()', description: 'Transactional outbox event publishing', category: 'event', status: 'stub', partOwner: 'Part 11', usageCount: 456, lastUsed: '2024-01-16T14:28:00Z' },
  { id: 'hook-notify', name: 'notify()', description: 'Multi-channel notification dispatch', category: 'notification', status: 'stub', partOwner: 'Part 16', usageCount: 234, lastUsed: '2024-01-16T14:25:00Z' },
  { id: 'hook-attach', name: 'attach()', description: 'Document upload with virus scanning', category: 'document', status: 'stub', partOwner: 'Part 10', usageCount: 178, lastUsed: '2024-01-16T14:20:00Z' },
  { id: 'hook-nextNumber', name: 'nextNumber()', description: 'Concurrency-safe document numbering (SA-12)', category: 'numbering', status: 'active', partOwner: 'Part 04', usageCount: 567, lastUsed: '2024-01-16T14:33:00Z' },
  { id: 'svc-transaction', name: 'withTransaction()', description: 'Business write + audit + outbox in one atomic operation', category: 'audit', status: 'active', partOwner: 'Part 04', usageCount: 892, lastUsed: '2024-01-16T14:31:00Z' },
  { id: 'svc-error', name: 'createErrorEnvelope()', description: 'Standardized error responses (SA-17)', category: 'validation', status: 'active', partOwner: 'Part 04', usageCount: 45, lastUsed: '2024-01-16T14:15:00Z' },
  { id: 'svc-health', name: 'checkHealth()', description: 'System health check for all dependencies', category: 'utility', status: 'active', partOwner: 'Part 04', usageCount: 1440, lastUsed: '2024-01-16T14:33:00Z' },
  { id: 'util-money', name: 'formatMoney()', description: 'Indian currency formatting with decimal precision', category: 'utility', status: 'active', partOwner: 'Part 04', usageCount: 5678, lastUsed: '2024-01-16T14:33:00Z' },
  { id: 'util-decimal', name: 'decimalAdd/Sub/Mul/Div()', description: 'Precision-safe arithmetic for financial calculations', category: 'utility', status: 'active', partOwner: 'Part 04', usageCount: 8934, lastUsed: '2024-01-16T14:33:00Z' },
  { id: 'util-fy', name: 'getCurrentFY() / isInFY()', description: 'Financial year utilities (April-March)', category: 'utility', status: 'active', partOwner: 'Part 04', usageCount: 2341, lastUsed: '2024-01-16T14:33:00Z' },
];

// ===== OUTBOX METRICS =====
export const outboxMetrics: OutboxMetric[] = [
  { timestamp: '2024-01-16T14:00:00Z', pending: 0, published: 12, failed: 0, deadLetter: 0, avgLatencyMs: 45 },
  { timestamp: '2024-01-16T13:00:00Z', pending: 2, published: 8, failed: 0, deadLetter: 0, avgLatencyMs: 52 },
  { timestamp: '2024-01-16T12:00:00Z', pending: 0, published: 15, failed: 1, deadLetter: 0, avgLatencyMs: 38 },
  { timestamp: '2024-01-16T11:00:00Z', pending: 0, published: 6, failed: 0, deadLetter: 0, avgLatencyMs: 41 },
  { timestamp: '2024-01-16T10:00:00Z', pending: 1, published: 9, failed: 0, deadLetter: 0, avgLatencyMs: 55 },
];

// ===== JOB METRICS =====
export const jobMetrics: JobMetric[] = [
  { jobId: 'job-outbox-relay', jobName: 'Outbox Relay Worker', type: 'scheduled', schedule: '*/5 * * * *', lastRun: '2024-01-16T14:30:00Z', nextRun: '2024-01-16T14:35:00Z', status: 'idle', successRate: 99.8, avgDurationMs: 120, totalRuns: 288 },
  { jobId: 'job-health-check', jobName: 'Health Check', type: 'scheduled', schedule: '*/1 * * * *', lastRun: '2024-01-16T14:33:00Z', nextRun: '2024-01-16T14:34:00Z', status: 'idle', successRate: 100, avgDurationMs: 45, totalRuns: 1440 },
  { jobId: 'job-cleanup', jobName: 'Session Cleanup', type: 'scheduled', schedule: '0 3 * * *', lastRun: '2024-01-16T03:00:00Z', nextRun: '2024-01-17T03:00:00Z', status: 'idle', successRate: 100, avgDurationMs: 3200, totalRuns: 16 },
  { jobId: 'job-backup', jobName: 'Database Backup', type: 'scheduled', schedule: '0 1 * * *', lastRun: '2024-01-16T01:00:00Z', nextRun: '2024-01-17T01:00:00Z', status: 'idle', successRate: 100, avgDurationMs: 45000, totalRuns: 16 },
  { jobId: 'job-report-snapshot', jobName: 'Report Snapshot', type: 'scheduled', schedule: '0 2 * * 0', lastRun: '2024-01-14T02:00:00Z', nextRun: '2024-01-21T02:00:00Z', status: 'idle', successRate: 100, avgDurationMs: 12000, totalRuns: 3 },
];

// ===== NUMBER SERIES =====
export const numberSeriesStatus: NumberSeriesStatus[] = [
  { key: 'acme:global:PO:2024-25', docType: 'PO', fy: '2024-25', currentValue: 893, prefix: 'PO/2024-25/', lastGenerated: '2024-01-16T14:33:00Z', generatedBy: 'user-001' },
  { key: 'acme:global:PR:2024-25', docType: 'PR', fy: '2024-25', currentValue: 234, prefix: 'PR/2024-25/', lastGenerated: '2024-01-16T11:20:00Z', generatedBy: 'user-002' },
  { key: 'acme:global:GRN:2024-25', docType: 'GRN', fy: '2024-25', currentValue: 1205, prefix: 'GRN/2024-25/', lastGenerated: '2024-01-16T13:45:00Z', generatedBy: 'user-003' },
  { key: 'acme:global:MI:2024-25', docType: 'MI', fy: '2024-25', currentValue: 4521, prefix: 'MI/2024-25/', lastGenerated: '2024-01-16T14:10:00Z', generatedBy: 'user-003' },
  { key: 'acme:global:Bill:2024-25', docType: 'Bill', fy: '2024-25', currentValue: 447, prefix: 'B/2024-25/', lastGenerated: '2024-01-16T10:30:00Z', generatedBy: 'user-004' },
  { key: 'acme:prj-001:WO:2024-25', docType: 'WO', fy: '2024-25', currentValue: 89, prefix: 'WO/PRJ-001/2024-25/', lastGenerated: '2024-01-15T16:00:00Z', generatedBy: 'user-001' },
];

// ===== ERROR CODES =====
export const errorCodes: ErrorStat[] = [
  { code: 'VALIDATION_ERROR', message: 'Request validation failed', count: 23, lastOccurrence: '2024-01-16T14:15:00Z', severity: 'warning' },
  { code: 'PERMISSION_DENIED', message: 'User lacks required permission', count: 8, lastOccurrence: '2024-01-16T13:45:00Z', severity: 'warning' },
  { code: 'NOT_FOUND', message: 'Requested resource not found', count: 12, lastOccurrence: '2024-01-16T14:00:00Z', severity: 'info' },
  { code: 'DUPLICATE_NUMBER', message: 'Number series collision detected', count: 0, lastOccurrence: '', severity: 'error' },
  { code: 'OUTBOX_PUBLISH_FAILED', message: 'Event publishing failed after retries', count: 1, lastOccurrence: '2024-01-16T12:30:00Z', severity: 'error' },
  { code: 'INTERNAL_ERROR', message: 'Unexpected server error', count: 2, lastOccurrence: '2024-01-15T09:00:00Z', severity: 'critical' },
  { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests', count: 5, lastOccurrence: '2024-01-16T11:00:00Z', severity: 'warning' },
  { code: 'CONFLICT', message: 'Optimistic locking conflict', count: 3, lastOccurrence: '2024-01-16T10:15:00Z', severity: 'warning' },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-CORE-01', stage: 'VERIFY', control: 'Shared service transaction helper invokes protocol.check before commit for any controllable action', enforcement: 'BLOCK (framework guarantee)', status: 'OBSERVE' },
  { id: 'CP-CORE-02', stage: 'RECORD', control: 'Action ledger hook invoked for every lifecycle action through shared services', enforcement: 'BLOCK (framework guarantee)', status: 'OBSERVE' },
];

// ===== SAMPLE MODULE (Reference Implementation) =====
export const sampleModuleActions = [
  { action: 'sample.create', stage: 'EXECUTE', controllable: true, hooks: ['authorize', 'validate', 'audit', 'emit', 'nextNumber'] },
  { action: 'sample.update', stage: 'EXECUTE', controllable: true, hooks: ['authorize', 'validate', 'audit', 'emit'] },
  { action: 'sample.approve', stage: 'EXECUTE', controllable: true, hooks: ['authorize', 'validate', 'audit', 'emit'] },
  { action: 'sample.delete', stage: 'EXECUTE', controllable: true, hooks: ['authorize', 'audit', 'emit'] },
  { action: 'sample.view', stage: 'VERIFY', controllable: false, hooks: ['authorize'] },
];
