// Part 11 — Real-time Event Bus & Integration Platform
// Event catalogue, schema registry, subscriptions, DLQ, and integration monitoring

export type EventType = 
  | 'project.created' | 'project.status_changed' | 'boq.version_frozen'
  | 'budget.approved' | 'po.created' | 'po.approved' | 'po.amended'
  | 'grn.posted' | 'stock.issued' | 'stock.reversed'
  | 'dpr.submitted' | 'progress.approved' | 'mb.certified'
  | 'bill.certified' | 'payment.posted' | 'receipt.posted'
  | 'attendance.locked' | 'payroll.posted'
  | 'variation.approved' | 'risk.escalated';

export type SchemaStatus = 'draft' | 'reviewed' | 'published' | 'deprecated' | 'retired';
export type SubscriptionType = 'internal' | 'webhook';
export type SubscriptionStatus = 'active' | 'suspended' | 'disabled';
export type DeliveryStatus = 'pending' | 'delivered' | 'failed' | 'retrying';
export type DLQStatus = 'pending' | 'approved' | 'dry_run' | 'replayed' | 'discarded';

export interface EventDefinition {
  id: string;
  eventType: EventType;
  description: string;
  module: string;
  aggregate: string;
  verb: string;
  payloadSchema: Record<string, any>;
  currentVersion: string;
  publishedAt: string;
  publishedBy: string;
  subscriberCount: number;
  avgDailyVolume: number;
}

export interface SchemaVersion {
  id: string;
  eventType: EventType;
  version: string;
  jsonSchema: Record<string, any>;
  status: SchemaStatus;
  publishedAt?: string;
  sunsetAt?: string;
  changelog: string;
  compatibilityReport?: {
    breaking: string[];
    additive: string[];
    deprecated: string[];
  };
}

export interface Subscription {
  id: string;
  name: string;
  type: SubscriptionType;
  eventTypes: EventType[];
  consumer?: string;
  endpoint?: string;
  secretRef?: string;
  status: SubscriptionStatus;
  owner: string;
  createdAt: string;
  lastEventAt?: string;
  lagSeconds: number;
  errorRate24h: number;
  failureCount: number;
}

export interface Delivery {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  eventId: string;
  eventType: EventType;
  attempt: number;
  status: DeliveryStatus;
  httpStatus?: number;
  latencyMs?: number;
  error?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface DeadLetter {
  id: string;
  consumer: string;
  eventId: string;
  eventType: EventType;
  reason: string;
  payloadHash: string;
  payload: Record<string, any>;
  firstFailedAt: string;
  failureCount: number;
  lastError: string;
  status: DLQStatus;
  replayedAt?: string;
  replayedBy?: string;
  approvedBy?: string;
}

export interface IntegrationMetric {
  subscriptionId: string;
  subscriptionName: string;
  totalEvents24h: number;
  successRate24h: number;
  avgLatencyMs: number;
  dlqSize: number;
  lagSeconds: number;
  lastSuccessAt?: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
}

// ===== EVENT CATALOGUE =====
export const eventCatalogue: EventDefinition[] = [
  {
    id: 'evt-001', eventType: 'project.created', description: 'New project created in the system',
    module: 'org', aggregate: 'Project', verb: 'created',
    payloadSchema: { projectId: 'string', projectCode: 'string', name: 'string', companyId: 'string' },
    currentVersion: '1.2.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 5, avgDailyVolume: 12
  },
  {
    id: 'evt-002', eventType: 'boq.version_frozen', description: 'BOQ version frozen for execution',
    module: 'pm', aggregate: 'BOQ', verb: 'version_frozen',
    payloadSchema: { boqId: 'string', projectId: 'string', version: 'number', frozenBy: 'string' },
    currentVersion: '1.0.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 3, avgDailyVolume: 8
  },
  {
    id: 'evt-003', eventType: 'budget.approved', description: 'Project budget approved by management',
    module: 'fin', aggregate: 'Budget', verb: 'approved',
    payloadSchema: { budgetId: 'string', projectId: 'string', amount: 'decimal', approvedBy: 'string' },
    currentVersion: '1.1.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 4, avgDailyVolume: 5
  },
  {
    id: 'evt-004', eventType: 'po.created', description: 'Purchase order created',
    module: 'proc', aggregate: 'PurchaseOrder', verb: 'created',
    payloadSchema: { poId: 'string', poNumber: 'string', projectId: 'string', supplierId: 'string', amount: 'decimal' },
    currentVersion: '1.3.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 6, avgDailyVolume: 45
  },
  {
    id: 'evt-005', eventType: 'po.approved', description: 'Purchase order approved',
    module: 'proc', aggregate: 'PurchaseOrder', verb: 'approved',
    payloadSchema: { poId: 'string', poNumber: 'string', approvedBy: 'string', approvedAt: 'datetime' },
    currentVersion: '1.2.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 7, avgDailyVolume: 42
  },
  {
    id: 'evt-006', eventType: 'grn.posted', description: 'Goods receipt note posted (material received)',
    module: 'inv', aggregate: 'GRN', verb: 'posted',
    payloadSchema: { grnId: 'string', grnNumber: 'string', poId: 'string', siteId: 'string', receivedBy: 'string' },
    currentVersion: '1.1.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 5, avgDailyVolume: 68
  },
  {
    id: 'evt-007', eventType: 'stock.issued', description: 'Material issued from store to site',
    module: 'inv', aggregate: 'StockIssue', verb: 'issued',
    payloadSchema: { issueId: 'string', issueNumber: 'string', siteId: 'string', materialId: 'string', quantity: 'decimal' },
    currentVersion: '1.0.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 4, avgDailyVolume: 125
  },
  {
    id: 'evt-008', eventType: 'dpr.submitted', description: 'Daily progress report submitted',
    module: 'pm', aggregate: 'DPR', verb: 'submitted',
    payloadSchema: { dprId: 'string', siteId: 'string', date: 'date', submittedBy: 'string' },
    currentVersion: '1.0.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 3, avgDailyVolume: 85
  },
  {
    id: 'evt-009', eventType: 'bill.certified', description: 'Subcontractor bill certified',
    module: 'fin', aggregate: 'Bill', verb: 'certified',
    payloadSchema: { billId: 'string', billNumber: 'string', projectId: 'string', amount: 'decimal', certifiedBy: 'string' },
    currentVersion: '1.2.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 5, avgDailyVolume: 18
  },
  {
    id: 'evt-010', eventType: 'payment.posted', description: 'Payment posted to vendor/subcontractor',
    module: 'fin', aggregate: 'Payment', verb: 'posted',
    payloadSchema: { paymentId: 'string', paymentNumber: 'string', vendorId: 'string', amount: 'decimal', postedBy: 'string' },
    currentVersion: '1.1.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 6, avgDailyVolume: 32
  },
  {
    id: 'evt-011', eventType: 'attendance.locked', description: 'Employee attendance locked for period',
    module: 'hr', aggregate: 'Attendance', verb: 'locked',
    payloadSchema: { attendanceId: 'string', period: 'string', lockedBy: 'string', employeeCount: 'number' },
    currentVersion: '1.0.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 3, avgDailyVolume: 156
  },
  {
    id: 'evt-012', eventType: 'payroll.posted', description: 'Payroll posted for period',
    module: 'hr', aggregate: 'Payroll', verb: 'posted',
    payloadSchema: { payrollId: 'string', period: 'string', totalAmount: 'decimal', postedBy: 'string' },
    currentVersion: '1.0.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 4, avgDailyVolume: 12
  },
  {
    id: 'evt-013', eventType: 'variation.approved', description: 'Variation/change order approved',
    module: 'pm', aggregate: 'Variation', verb: 'approved',
    payloadSchema: { variationId: 'string', projectId: 'string', amount: 'decimal', approvedBy: 'string' },
    currentVersion: '1.0.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 4, avgDailyVolume: 6
  },
  {
    id: 'evt-014', eventType: 'risk.escalated', description: 'Project risk escalated to management',
    module: 'pm', aggregate: 'Risk', verb: 'escalated',
    payloadSchema: { riskId: 'string', projectId: 'string', severity: 'string', escalatedBy: 'string' },
    currentVersion: '1.0.0', publishedAt: '2024-01-10', publishedBy: 'user-001',
    subscriberCount: 3, avgDailyVolume: 2
  },
];

// ===== SCHEMA VERSIONS =====
export const schemaVersions: SchemaVersion[] = [
  {
    id: 'schema-001', eventType: 'po.created', version: '1.3.0',
    jsonSchema: {
      type: 'object',
      properties: {
        poId: { type: 'string' },
        poNumber: { type: 'string' },
        projectId: { type: 'string' },
        supplierId: { type: 'string' },
        amount: { type: 'number' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' }
      },
      required: ['poId', 'poNumber', 'projectId', 'supplierId', 'amount']
    },
    status: 'published', publishedAt: '2024-01-10',
    changelog: 'Added currency field for multi-currency support',
    compatibilityReport: { breaking: [], additive: ['currency'], deprecated: [] }
  },
  {
    id: 'schema-002', eventType: 'po.created', version: '1.2.0',
    jsonSchema: {
      type: 'object',
      properties: {
        poId: { type: 'string' },
        poNumber: { type: 'string' },
        projectId: { type: 'string' },
        supplierId: { type: 'string' },
        amount: { type: 'number' }
      },
      required: ['poId', 'poNumber', 'projectId', 'supplierId', 'amount']
    },
    status: 'deprecated', publishedAt: '2023-06-15', sunsetAt: '2024-06-15',
    changelog: 'Initial schema with core fields',
    compatibilityReport: { breaking: [], additive: [], deprecated: [] }
  },
  {
    id: 'schema-003', eventType: 'bill.certified', version: '1.2.0',
    jsonSchema: {
      type: 'object',
      properties: {
        billId: { type: 'string' },
        billNumber: { type: 'string' },
        projectId: { type: 'string' },
        amount: { type: 'number' },
        taxAmount: { type: 'number' },
        certifiedBy: { type: 'string' },
        certifiedAt: { type: 'string', format: 'date-time' }
      },
      required: ['billId', 'billNumber', 'projectId', 'amount', 'certifiedBy']
    },
    status: 'published', publishedAt: '2024-01-10',
    changelog: 'Added taxAmount for GST compliance',
    compatibilityReport: { breaking: [], additive: ['taxAmount'], deprecated: [] }
  },
  {
    id: 'schema-004', eventType: 'grn.posted', version: '1.1.0',
    jsonSchema: {
      type: 'object',
      properties: {
        grnId: { type: 'string' },
        grnNumber: { type: 'string' },
        poId: { type: 'string' },
        siteId: { type: 'string' },
        receivedBy: { type: 'string' },
        receivedAt: { type: 'string', format: 'date-time' },
        qualityCheckPassed: { type: 'boolean' }
      },
      required: ['grnId', 'grnNumber', 'poId', 'siteId', 'receivedBy']
    },
    status: 'published', publishedAt: '2024-01-10',
    changelog: 'Added qualityCheckPassed for QC integration',
    compatibilityReport: { breaking: [], additive: ['qualityCheckPassed'], deprecated: [] }
  },
];

// ===== SUBSCRIPTIONS =====
export const subscriptions: Subscription[] = [
  {
    id: 'sub-001', name: 'Budget Commitment Engine', type: 'internal',
    eventTypes: ['po.approved', 'grn.posted', 'bill.certified', 'payment.posted'],
    consumer: 'budget-commitment-service', status: 'active', owner: 'user-022',
    createdAt: '2024-01-10', lastEventAt: '2024-01-16T15:30:00Z',
    lagSeconds: 2, errorRate24h: 0.01, failureCount: 0
  },
  {
    id: 'sub-002', name: 'Project Control Engine', type: 'internal',
    eventTypes: ['project.created', 'boq.version_frozen', 'budget.approved', 'variation.approved'],
    consumer: 'project-control-service', status: 'active', owner: 'user-010',
    createdAt: '2024-01-10', lastEventAt: '2024-01-16T15:28:00Z',
    lagSeconds: 5, errorRate24h: 0.02, failureCount: 1
  },
  {
    id: 'sub-003', name: 'Notification Service', type: 'internal',
    eventTypes: ['po.approved', 'bill.certified', 'payment.posted', 'risk.escalated'],
    consumer: 'notification-service', status: 'active', owner: 'user-001',
    createdAt: '2024-01-10', lastEventAt: '2024-01-16T15:32:00Z',
    lagSeconds: 1, errorRate24h: 0.005, failureCount: 0
  },
  {
    id: 'sub-004', name: 'Accounting Integration', type: 'internal',
    eventTypes: ['payment.posted', 'receipt.posted', 'payroll.posted'],
    consumer: 'accounting-service', status: 'active', owner: 'user-022',
    createdAt: '2024-01-10', lastEventAt: '2024-01-16T15:25:00Z',
    lagSeconds: 8, errorRate24h: 0.03, failureCount: 2
  },
  {
    id: 'sub-005', name: 'Vendor Portal Webhook', type: 'webhook',
    eventTypes: ['po.approved', 'payment.posted'],
    endpoint: 'https://vendor-portal.example.com/webhooks/erp',
    secretRef: 'vault://webhooks/vendor-portal', status: 'active', owner: 'user-020',
    createdAt: '2024-01-12', lastEventAt: '2024-01-16T14:45:00Z',
    lagSeconds: 15, errorRate24h: 0.08, failureCount: 5
  },
  {
    id: 'sub-006', name: 'Bank Integration Webhook', type: 'webhook',
    eventTypes: ['payment.posted'],
    endpoint: 'https://bank-api.example.com/webhooks/payments',
    secretRef: 'vault://webhooks/bank-api', status: 'suspended', owner: 'user-022',
    createdAt: '2024-01-10', lastEventAt: '2024-01-15T10:00:00Z',
    lagSeconds: 86400, errorRate24h: 1.0, failureCount: 48
  },
  {
    id: 'sub-007', name: 'GST Portal Integration', type: 'webhook',
    eventTypes: ['bill.certified', 'payment.posted'],
    endpoint: 'https://gst-portal.example.com/webhooks/tax',
    secretRef: 'vault://webhooks/gst-portal', status: 'active', owner: 'user-022',
    createdAt: '2024-01-10', lastEventAt: '2024-01-16T15:20:00Z',
    lagSeconds: 12, errorRate24h: 0.04, failureCount: 3
  },
];

// ===== DELIVERIES =====
export const deliveries: Delivery[] = [
  {
    id: 'del-001', subscriptionId: 'sub-001', subscriptionName: 'Budget Commitment Engine',
    eventId: 'evt-12345', eventType: 'po.approved', attempt: 1, status: 'delivered',
    httpStatus: 200, latencyMs: 45, deliveredAt: '2024-01-16T15:30:00Z', createdAt: '2024-01-16T15:30:00Z'
  },
  {
    id: 'del-002', subscriptionId: 'sub-002', subscriptionName: 'Project Control Engine',
    eventId: 'evt-12346', eventType: 'project.created', attempt: 1, status: 'delivered',
    httpStatus: 200, latencyMs: 32, deliveredAt: '2024-01-16T15:28:00Z', createdAt: '2024-01-16T15:28:00Z'
  },
  {
    id: 'del-003', subscriptionId: 'sub-005', subscriptionName: 'Vendor Portal Webhook',
    eventId: 'evt-12347', eventType: 'payment.posted', attempt: 3, status: 'failed',
    httpStatus: 500, latencyMs: 5200, error: 'Internal server error', createdAt: '2024-01-16T14:45:00Z'
  },
  {
    id: 'del-004', subscriptionId: 'sub-006', subscriptionName: 'Bank Integration Webhook',
    eventId: 'evt-12348', eventType: 'payment.posted', attempt: 5, status: 'failed',
    httpStatus: 503, latencyMs: 30000, error: 'Service unavailable', createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'del-005', subscriptionId: 'sub-003', subscriptionName: 'Notification Service',
    eventId: 'evt-12349', eventType: 'risk.escalated', attempt: 1, status: 'delivered',
    httpStatus: 200, latencyMs: 28, deliveredAt: '2024-01-16T15:32:00Z', createdAt: '2024-01-16T15:32:00Z'
  },
];

// ===== DEAD LETTER QUEUE =====
export const deadLetters: DeadLetter[] = [
  {
    id: 'dlq-001', consumer: 'Bank Integration Webhook', eventId: 'evt-12348',
    eventType: 'payment.posted', reason: 'Service unavailable after 5 retries',
    payloadHash: 'a1b2c3d4e5f6', payload: { paymentId: 'pay-001', amount: 1250000 },
    firstFailedAt: '2024-01-15T10:00:00Z', failureCount: 5,
    lastError: 'HTTP 503: Service Unavailable', status: 'pending'
  },
  {
    id: 'dlq-002', consumer: 'Vendor Portal Webhook', eventId: 'evt-12350',
    eventType: 'po.approved', reason: 'Invalid signature',
    payloadHash: 'f6e5d4c3b2a1', payload: { poId: 'po-045', poNumber: 'PO-2024-0045' },
    firstFailedAt: '2024-01-16T12:30:00Z', failureCount: 3,
    lastError: 'HMAC signature verification failed', status: 'pending'
  },
  {
    id: 'dlq-003', consumer: 'Accounting Integration', eventId: 'evt-12351',
    eventType: 'payment.posted', reason: 'Duplicate payment detected',
    payloadHash: 'b2c3d4e5f6a1', payload: { paymentId: 'pay-002', amount: 850000 },
    firstFailedAt: '2024-01-16T11:15:00Z', failureCount: 2,
    lastError: 'Business rule violation: duplicate payment', status: 'approved',
    approvedBy: 'user-022'
  },
  {
    id: 'dlq-004', consumer: 'Budget Commitment Engine', eventId: 'evt-12352',
    eventType: 'grn.posted', reason: 'Budget exceeded',
    payloadHash: 'c3d4e5f6a1b2', payload: { grnId: 'grn-089', amount: 450000 },
    firstFailedAt: '2024-01-16T09:45:00Z', failureCount: 1,
    lastError: 'Budget commitment would exceed approved budget', status: 'replayed',
    replayedAt: '2024-01-16T14:00:00Z', replayedBy: 'user-022', approvedBy: 'user-002'
  },
];

// ===== INTEGRATION METRICS =====
export const integrationMetrics: IntegrationMetric[] = [
  {
    subscriptionId: 'sub-001', subscriptionName: 'Budget Commitment Engine',
    totalEvents24h: 1250, successRate24h: 99.8, avgLatencyMs: 45,
    dlqSize: 1, lagSeconds: 2, lastSuccessAt: '2024-01-16T15:30:00Z', status: 'healthy'
  },
  {
    subscriptionId: 'sub-002', subscriptionName: 'Project Control Engine',
    totalEvents24h: 890, successRate24h: 99.5, avgLatencyMs: 52,
    dlqSize: 0, lagSeconds: 5, lastSuccessAt: '2024-01-16T15:28:00Z', status: 'healthy'
  },
  {
    subscriptionId: 'sub-003', subscriptionName: 'Notification Service',
    totalEvents24h: 2340, successRate24h: 99.9, avgLatencyMs: 28,
    dlqSize: 0, lagSeconds: 1, lastSuccessAt: '2024-01-16T15:32:00Z', status: 'healthy'
  },
  {
    subscriptionId: 'sub-004', subscriptionName: 'Accounting Integration',
    totalEvents24h: 560, successRate24h: 98.2, avgLatencyMs: 125,
    dlqSize: 1, lagSeconds: 8, lastSuccessAt: '2024-01-16T15:25:00Z', status: 'degraded'
  },
  {
    subscriptionId: 'sub-005', subscriptionName: 'Vendor Portal Webhook',
    totalEvents24h: 245, successRate24h: 92.5, avgLatencyMs: 320,
    dlqSize: 2, lagSeconds: 15, lastSuccessAt: '2024-01-16T14:45:00Z', status: 'degraded'
  },
  {
    subscriptionId: 'sub-006', subscriptionName: 'Bank Integration Webhook',
    totalEvents24h: 0, successRate24h: 0, avgLatencyMs: 0,
    dlqSize: 48, lagSeconds: 86400, status: 'unhealthy'
  },
  {
    subscriptionId: 'sub-007', subscriptionName: 'GST Portal Integration',
    totalEvents24h: 180, successRate24h: 96.8, avgLatencyMs: 210,
    dlqSize: 3, lagSeconds: 12, lastSuccessAt: '2024-01-16T15:20:00Z', status: 'degraded'
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-EVB-01', stage: 'VERIFY', control: 'Event published only through the outbox inside the business transaction', enforcement: 'BLOCK(build)', status: 'OBSERVE' },
  { id: 'CP-EVB-02', stage: 'APPROVE', control: 'Breaking schema change only as new major version with migration window', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-EVB-03', stage: 'APPROVE', control: 'Replay of financial/stock events approved and dry-run first', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-EVB-04', stage: 'MONITOR', control: 'Consumer lag, DLQ growth or webhook failure above threshold', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====

export function getEventStats(): { total: number; active: number; deprecated: number } {
  return {
    total: eventCatalogue.length,
    active: eventCatalogue.filter(e => schemaVersions.find(s => s.eventType === e.eventType && s.status === 'published')).length,
    deprecated: schemaVersions.filter(s => s.status === 'deprecated').length,
  };
}

export function getSubscriptionStats(): { total: number; active: number; suspended: number; unhealthy: number } {
  return {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    suspended: subscriptions.filter(s => s.status === 'suspended').length,
    unhealthy: integrationMetrics.filter(m => m.status === 'unhealthy').length,
  };
}

export function getDLQStats(): { total: number; pending: number; financial: number } {
  const financial = deadLetters.filter(dl => 
    dl.eventType === 'payment.posted' || dl.eventType === 'bill.certified' || dl.eventType === 'receipt.posted'
  ).length;
  return {
    total: deadLetters.length,
    pending: deadLetters.filter(dl => dl.status === 'pending').length,
    financial,
  };
}

export function getOverallIntegrationHealth(): 'healthy' | 'degraded' | 'unhealthy' {
  const unhealthy = integrationMetrics.filter(m => m.status === 'unhealthy').length;
  const degraded = integrationMetrics.filter(m => m.status === 'degraded').length;
  
  if (unhealthy > 0) return 'unhealthy';
  if (degraded > 1) return 'degraded';
  return 'healthy';
}
