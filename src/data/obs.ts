// Part 10 — Observability, Performance & Reliability
// Telemetry, monitoring, SLOs, and capacity management

export type Severity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
export type IncidentStatus = 'OPEN' | 'ACKNOWLEDGED' | 'MITIGATED' | 'RESOLVED' | 'REVIEWED';
export type SLOStatus = 'proposed' | 'approved' | 'active' | 'retired';
export type AlertRuleStatus = 'active' | 'paused' | 'disabled';
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface SLO {
  id: string;
  code: string;
  journey: string;
  description: string;
  targetPct: number;
  windowDays: number;
  currentPct: number;
  errorBudgetRemaining: number;
  ownerId: string;
  ownerName: string;
  status: SLOStatus;
  lastMeasuredAt: string;
}

export interface Incident {
  id: string;
  code: string;
  severity: Severity;
  title: string;
  summary: string;
  startedAt: string;
  detectedBy: string;
  status: IncidentStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  mitigatedAt?: string;
  mitigatedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rootCause?: string;
  actions: { action: string; owner: string; dueDate: string; completed: boolean }[];
  affectedServices: string[];
  impactDescription: string;
  correlationId?: string;
}

export interface AlertRule {
  id: string;
  code: string;
  name: string;
  description: string;
  query: string;
  severity: Severity;
  runbookUrl: string;
  ownerId: string;
  ownerName: string;
  status: AlertRuleStatus;
  lastTriggeredAt?: string;
  triggerCount: number;
}

export interface CapacityRun {
  id: string;
  scenario: string;
  description: string;
  volumes: {
    projects: number;
    boqLines: number;
    stockTransactions: number;
    attendanceRecords: number;
    dprPhotos: number;
    concurrentUsers: number;
  };
  results: {
    passed: boolean;
    avgResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  runAt: string;
  runBy: string;
  notes?: string;
}

export interface HealthCheck {
  id: string;
  service: string;
  status: HealthStatus;
  latency: number;
  message?: string;
  checkedAt: string;
  details?: Record<string, any>;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
  labels?: Record<string, string>;
}

export interface MetricSeries {
  name: string;
  description: string;
  unit: string;
  type: 'counter' | 'gauge' | 'histogram';
  data: MetricPoint[];
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  serviceName: string;
  startTime: string;
  duration: number;
  status: 'ok' | 'error';
  tags: Record<string, string>;
  logs: { timestamp: string; message: string; level: LogLevel }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  module: string;
  partNo: string;
  companyId?: string;
  projectId?: string;
  userId?: string;
  route?: string;
  correlationId: string;
  message: string;
  durationMs?: number;
  outcome?: 'success' | 'failure';
  error?: string;
}

export interface QueueMetric {
  queueName: string;
  depth: number;
  oldestMessageAge: number;
  retries: number;
  deadLetterCount: number;
  processingRate: number;
  lastCheckedAt: string;
}

export interface JobMetric {
  jobId: string;
  jobName: string;
  status: 'idle' | 'running' | 'failed' | 'stuck';
  lastRunAt?: string;
  nextRunAt?: string;
  avgDuration: number;
  successRate: number;
  stuckCount: number;
}

export interface SlowQuery {
  id: string;
  queryFingerprint: string;
  query: string;
  avgDuration: number;
  maxDuration: number;
  callCount: number;
  lastSeenAt: string;
  table: string;
  indexUsed?: string;
  rowsScanned: number;
  rowsReturned: number;
}

export interface DatabaseMetric {
  connectionPoolSize: number;
  activeConnections: number;
  idleConnections: number;
  waitingConnections: number;
  slowQueryCount: number;
  lockWaitCount: number;
  tableGrowth: { table: string; sizeMB: number; growthRate: number }[];
}

// ===== SLOs =====
export const slos: SLO[] = [
  {
    id: 'slo-001', code: 'SLO-LOGIN', journey: 'User Login',
    description: '99.9% of logins complete within 2 seconds',
    targetPct: 99.9, windowDays: 30, currentPct: 99.85, errorBudgetRemaining: 43.2,
    ownerId: 'user-001', ownerName: 'Rajesh Kumar', status: 'active', lastMeasuredAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'slo-002', code: 'SLO-DASHBOARD', journey: 'Dashboard Load',
    description: '99.5% of dashboard loads complete within 3 seconds',
    targetPct: 99.5, windowDays: 30, currentPct: 99.62, errorBudgetRemaining: 72.0,
    ownerId: 'user-001', ownerName: 'Rajesh Kumar', status: 'active', lastMeasuredAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'slo-003', code: 'SLO-POSTING', journey: 'Transaction Posting',
    description: '99.95% of postings complete within 1 second',
    targetPct: 99.95, windowDays: 30, currentPct: 99.92, errorBudgetRemaining: 28.8,
    ownerId: 'user-022', ownerName: 'Vikram Desai', status: 'active', lastMeasuredAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'slo-004', code: 'SLO-UPLOAD', journey: 'Document Upload',
    description: '99.0% of uploads complete within 5 seconds',
    targetPct: 99.0, windowDays: 30, currentPct: 98.75, errorBudgetRemaining: -12.5,
    ownerId: 'user-010', ownerName: 'Rajesh Kumar (PM)', status: 'active', lastMeasuredAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'slo-005', code: 'SLO-REPORT', journey: 'Report Generation',
    description: '95.0% of reports generate within 10 seconds',
    targetPct: 95.0, windowDays: 30, currentPct: 96.20, errorBudgetRemaining: 60.0,
    ownerId: 'user-002', ownerName: 'Priya Sharma', status: 'active', lastMeasuredAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'slo-006', code: 'SLO-API', journey: 'API Response',
    description: '99.9% of API calls complete within 500ms',
    targetPct: 99.9, windowDays: 30, currentPct: 99.88, errorBudgetRemaining: 57.6,
    ownerId: 'user-001', ownerName: 'Rajesh Kumar', status: 'active', lastMeasuredAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'slo-007', code: 'SLO-SYNC', journey: 'Mobile Sync',
    description: '99.0% of sync operations complete within 30 seconds',
    targetPct: 99.0, windowDays: 30, currentPct: 99.15, errorBudgetRemaining: 75.0,
    ownerId: 'user-015', ownerName: 'Ravi Sharma', status: 'active', lastMeasuredAt: '2024-01-16T15:00:00Z'
  },
];

// ===== INCIDENTS =====
export const incidents: Incident[] = [
  {
    id: 'inc-001', code: 'INC-2024-001', severity: 'SEV2',
    title: 'Document Upload Performance Degradation',
    summary: 'Upload SLO breached due to storage service latency spike',
    startedAt: '2024-01-16T10:30:00Z', detectedBy: 'SLO Monitor',
    status: 'MITIGATED',
    acknowledgedAt: '2024-01-16T10:35:00Z', acknowledgedBy: 'user-001',
    mitigatedAt: '2024-01-16T11:15:00Z', mitigatedBy: 'user-001',
    rootCause: 'Storage service experiencing high latency due to network congestion',
    actions: [
      { action: 'Investigate storage service performance', owner: 'DevOps Team', dueDate: '2024-01-17', completed: true },
      { action: 'Implement upload retry logic', owner: 'Engineering', dueDate: '2024-01-20', completed: false },
      { action: 'Add storage latency alert', owner: 'SRE', dueDate: '2024-01-18', completed: true },
    ],
    affectedServices: ['document-service', 'storage-service'],
    impactDescription: 'Users experienced slow document uploads, SLO breached by 0.25%',
    correlationId: 'corr-upload-001'
  },
  {
    id: 'inc-002', code: 'INC-2024-002', severity: 'SEV3',
    title: 'Queue Processing Delay',
    summary: 'Notification queue depth exceeded threshold',
    startedAt: '2024-01-15T14:00:00Z', detectedBy: 'Queue Monitor',
    status: 'RESOLVED',
    acknowledgedAt: '2024-01-15T14:05:00Z', acknowledgedBy: 'user-001',
    resolvedAt: '2024-01-15T15:30:00Z', resolvedBy: 'user-001',
    reviewedAt: '2024-01-16T09:00:00Z', reviewedBy: 'user-002',
    rootCause: 'Worker pod crashed due to memory limit',
    actions: [
      { action: 'Increase worker memory limit', owner: 'DevOps', dueDate: '2024-01-16', completed: true },
      { action: 'Add worker health check', owner: 'Engineering', dueDate: '2024-01-18', completed: true },
    ],
    affectedServices: ['notification-service', 'queue-service'],
    impactDescription: 'Notification delivery delayed by 30-60 minutes',
    correlationId: 'corr-queue-002'
  },
  {
    id: 'inc-003', code: 'INC-2024-003', severity: 'SEV1',
    title: 'Database Connection Pool Exhaustion',
    summary: 'Critical: Application unable to acquire database connections',
    startedAt: '2024-01-14T08:00:00Z', detectedBy: 'Health Check',
    status: 'REVIEWED',
    acknowledgedAt: '2024-01-14T08:02:00Z', acknowledgedBy: 'user-001',
    mitigatedAt: '2024-01-14T08:30:00Z', mitigatedBy: 'user-001',
    resolvedAt: '2024-01-14T09:00:00Z', resolvedBy: 'user-001',
    reviewedAt: '2024-01-15T10:00:00Z', reviewedBy: 'user-002',
    rootCause: 'Slow query holding connections for extended period',
    actions: [
      { action: 'Optimize slow query', owner: 'DBA', dueDate: '2024-01-15', completed: true },
      { action: 'Add connection pool monitoring', owner: 'SRE', dueDate: '2024-01-16', completed: true },
      { action: 'Implement query timeout', owner: 'Engineering', dueDate: '2024-01-17', completed: true },
      { action: 'Conduct load testing', owner: 'QA', dueDate: '2024-01-20', completed: false },
    ],
    affectedServices: ['database', 'api-service'],
    impactDescription: 'Complete system outage for 30 minutes, affecting all users',
    correlationId: 'corr-db-003'
  },
  {
    id: 'inc-004', code: 'INC-2024-004', severity: 'SEV4',
    title: 'Audit Log Hash Chain Verification Warning',
    summary: 'Nightly verification detected potential chain inconsistency',
    startedAt: '2024-01-16T02:00:00Z', detectedBy: 'Audit Integrity Job',
    status: 'ACKNOWLEDGED',
    acknowledgedAt: '2024-01-16T09:00:00Z', acknowledgedBy: 'user-001',
    actions: [
      { action: 'Investigate hash chain break', owner: 'Security Team', dueDate: '2024-01-17', completed: false },
    ],
    affectedServices: ['audit-service'],
    impactDescription: 'No user impact, internal integrity check',
    correlationId: 'corr-audit-004'
  },
];

// ===== ALERT RULES =====
export const alertRules: AlertRule[] = [
  {
    id: 'alert-001', code: 'ALERT-SLO-BURN', name: 'SLO Burn Rate High',
    description: 'SLO error budget burning faster than expected',
    query: 'slo_burn_rate > 2.0', severity: 'SEV2',
    runbookUrl: '/runbooks/slo-burn-rate', ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    status: 'active', lastTriggeredAt: '2024-01-16T10:30:00Z', triggerCount: 3
  },
  {
    id: 'alert-002', code: 'ALERT-QUEUE-DEPTH', name: 'Queue Depth Critical',
    description: 'Queue depth exceeds threshold',
    query: 'queue_depth > 1000', severity: 'SEV3',
    runbookUrl: '/runbooks/queue-depth', ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    status: 'active', lastTriggeredAt: '2024-01-15T14:00:00Z', triggerCount: 5
  },
  {
    id: 'alert-003', code: 'ALERT-DB-CONNECTIONS', name: 'Database Connection Pool',
    description: 'Database connection pool near exhaustion',
    query: 'db_active_connections / db_pool_size > 0.9', severity: 'SEV1',
    runbookUrl: '/runbooks/db-connections', ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    status: 'active', lastTriggeredAt: '2024-01-14T08:00:00Z', triggerCount: 1
  },
  {
    id: 'alert-004', code: 'ALERT-ERROR-RATE', name: 'High Error Rate',
    description: 'API error rate exceeds threshold',
    query: 'api_error_rate > 0.01', severity: 'SEV2',
    runbookUrl: '/runbooks/error-rate', ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    status: 'active', triggerCount: 0
  },
  {
    id: 'alert-005', code: 'ALERT-AUDIT-INTEGRITY', name: 'Audit Hash Chain Break',
    description: 'Audit log hash chain verification failed',
    query: 'audit_chain_broken == true', severity: 'SEV1',
    runbookUrl: '/runbooks/audit-integrity', ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    status: 'active', lastTriggeredAt: '2024-01-16T02:00:00Z', triggerCount: 1
  },
  {
    id: 'alert-006', code: 'ALERT-SLOW-QUERY', name: 'Slow Query Detected',
    description: 'Query execution time exceeds threshold',
    query: 'query_duration_p95 > 5000', severity: 'SEV3',
    runbookUrl: '/runbooks/slow-query', ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    status: 'active', lastTriggeredAt: '2024-01-14T08:00:00Z', triggerCount: 8
  },
];

// ===== CAPACITY RUNS =====
export const capacityRuns: CapacityRun[] = [
  {
    id: 'cap-001', scenario: 'Production Scale Test',
    description: 'Full production scale simulation',
    volumes: {
      projects: 500, boqLines: 2000000, stockTransactions: 50000000,
      attendanceRecords: 20000000, dprPhotos: 5000000, concurrentUsers: 1000
    },
    results: {
      passed: true, avgResponseTime: 245, p95ResponseTime: 485, p99ResponseTime: 890,
      errorRate: 0.02, throughput: 1250
    },
    runAt: '2024-01-10T10:00:00Z', runBy: 'user-001',
    notes: 'All performance targets met with headroom'
  },
  {
    id: 'cap-002', scenario: 'Peak Load Test',
    description: 'Peak load simulation (2x production)',
    volumes: {
      projects: 1000, boqLines: 4000000, stockTransactions: 100000000,
      attendanceRecords: 40000000, dprPhotos: 10000000, concurrentUsers: 2000
    },
    results: {
      passed: false, avgResponseTime: 520, p95ResponseTime: 1250, p99ResponseTime: 2100,
      errorRate: 0.15, throughput: 980
    },
    runAt: '2024-01-12T10:00:00Z', runBy: 'user-001',
    notes: 'Database connection pool needs scaling, p95 exceeds target'
  },
  {
    id: 'cap-003', scenario: 'Stress Test',
    description: 'Stress test beyond capacity',
    volumes: {
      projects: 1500, boqLines: 6000000, stockTransactions: 150000000,
      attendanceRecords: 60000000, dprPhotos: 15000000, concurrentUsers: 3000
    },
    results: {
      passed: false, avgResponseTime: 1250, p95ResponseTime: 3500, p99ResponseTime: 5200,
      errorRate: 2.5, throughput: 650
    },
    runAt: '2024-01-14T10:00:00Z', runBy: 'user-001',
    notes: 'System reaches breaking point, requires architectural changes for 3x scale'
  },
];

// ===== HEALTH CHECKS =====
export const healthChecks: HealthCheck[] = [
  { id: 'health-001', service: 'Database', status: 'healthy', latency: 5, checkedAt: '2024-01-16T15:45:00Z' },
  { id: 'health-002', service: 'Cache (Redis)', status: 'healthy', latency: 2, checkedAt: '2024-01-16T15:45:00Z' },
  { id: 'health-003', service: 'Queue (BullMQ)', status: 'healthy', latency: 10, checkedAt: '2024-01-16T15:45:00Z' },
  { id: 'health-004', service: 'Storage (S3)', status: 'degraded', latency: 250, message: 'Elevated latency', checkedAt: '2024-01-16T15:45:00Z' },
  { id: 'health-005', service: 'Email Gateway', status: 'healthy', latency: 120, checkedAt: '2024-01-16T15:45:00Z' },
  { id: 'health-006', service: 'SMS Gateway', status: 'healthy', latency: 180, checkedAt: '2024-01-16T15:45:00Z' },
  { id: 'health-007', service: 'Government API', status: 'healthy', latency: 350, checkedAt: '2024-01-16T15:45:00Z' },
];

// ===== METRICS =====
export const metrics: MetricSeries[] = [
  {
    name: 'api_requests_total', description: 'Total API requests', unit: 'requests',
    type: 'counter',
    data: [
      { timestamp: '2024-01-16T15:00:00Z', value: 1250 },
      { timestamp: '2024-01-16T15:05:00Z', value: 1320 },
      { timestamp: '2024-01-16T15:10:00Z', value: 1180 },
      { timestamp: '2024-01-16T15:15:00Z', value: 1420 },
      { timestamp: '2024-01-16T15:20:00Z', value: 1280 },
    ]
  },
  {
    name: 'api_errors_total', description: 'Total API errors', unit: 'errors',
    type: 'counter',
    data: [
      { timestamp: '2024-01-16T15:00:00Z', value: 2 },
      { timestamp: '2024-01-16T15:05:00Z', value: 3 },
      { timestamp: '2024-01-16T15:10:00Z', value: 1 },
      { timestamp: '2024-01-16T15:15:00Z', value: 4 },
      { timestamp: '2024-01-16T15:20:00Z', value: 2 },
    ]
  },
  {
    name: 'api_response_time_p95', description: 'API response time (p95)', unit: 'ms',
    type: 'histogram',
    data: [
      { timestamp: '2024-01-16T15:00:00Z', value: 320 },
      { timestamp: '2024-01-16T15:05:00Z', value: 345 },
      { timestamp: '2024-01-16T15:10:00Z', value: 310 },
      { timestamp: '2024-01-16T15:15:00Z', value: 380 },
      { timestamp: '2024-01-16T15:20:00Z', value: 335 },
    ]
  },
  {
    name: 'db_connections_active', description: 'Active database connections', unit: 'connections',
    type: 'gauge',
    data: [
      { timestamp: '2024-01-16T15:00:00Z', value: 45 },
      { timestamp: '2024-01-16T15:05:00Z', value: 48 },
      { timestamp: '2024-01-16T15:10:00Z', value: 42 },
      { timestamp: '2024-01-16T15:15:00Z', value: 52 },
      { timestamp: '2024-01-16T15:20:00Z', value: 47 },
    ]
  },
  {
    name: 'queue_depth', description: 'Queue message depth', unit: 'messages',
    type: 'gauge',
    data: [
      { timestamp: '2024-01-16T15:00:00Z', value: 125 },
      { timestamp: '2024-01-16T15:05:00Z', value: 180 },
      { timestamp: '2024-01-16T15:10:00Z', value: 95 },
      { timestamp: '2024-01-16T15:15:00Z', value: 220 },
      { timestamp: '2024-01-16T15:20:00Z', value: 150 },
    ]
  },
];

// ===== TRACE SPANS =====
export const traceSpans: TraceSpan[] = [
  {
    traceId: 'trace-001', spanId: 'span-001', operationName: 'POST /api/v1/purchase-orders',
    serviceName: 'api-gateway', startTime: '2024-01-16T15:30:00Z', duration: 485,
    status: 'ok', tags: { 'http.method': 'POST', 'http.status_code': '201', 'user.id': 'user-010' },
    logs: []
  },
  {
    traceId: 'trace-001', spanId: 'span-002', parentSpanId: 'span-001',
    operationName: 'createPurchaseOrder', serviceName: 'procurement-service',
    startTime: '2024-01-16T15:30:00.100Z', duration: 380, status: 'ok',
    tags: { 'po.number': 'PO-2024-0892', 'po.amount': '1250000' }, logs: []
  },
  {
    traceId: 'trace-001', spanId: 'span-003', parentSpanId: 'span-002',
    operationName: 'INSERT purchase_orders', serviceName: 'database',
    startTime: '2024-01-16T15:30:00.200Z', duration: 45, status: 'ok',
    tags: { 'db.type': 'postgresql', 'db.statement': 'INSERT INTO purchase_orders...' }, logs: []
  },
  {
    traceId: 'trace-001', spanId: 'span-004', parentSpanId: 'span-002',
    operationName: 'emit po.created', serviceName: 'event-bus',
    startTime: '2024-01-16T15:30:00.300Z', duration: 12, status: 'ok',
    tags: { 'event.name': 'po.created', 'event.aggregate': 'PurchaseOrder' }, logs: []
  },
  {
    traceId: 'trace-002', spanId: 'span-005', operationName: 'GET /api/v1/dashboard',
    serviceName: 'api-gateway', startTime: '2024-01-16T15:31:00Z', duration: 2150,
    status: 'ok', tags: { 'http.method': 'GET', 'http.status_code': '200', 'user.id': 'user-001' },
    logs: []
  },
];

// ===== LOG ENTRIES =====
export const logEntries: LogEntry[] = [
  {
    id: 'log-001', timestamp: '2024-01-16T15:30:00Z', level: 'info',
    service: 'api-gateway', module: 'procurement', partNo: 'Part 22',
    companyId: 'comp-001', projectId: 'prj-001', userId: 'user-010',
    route: 'POST /api/v1/purchase-orders', correlationId: 'corr-001',
    message: 'Purchase order created successfully', durationMs: 485, outcome: 'success'
  },
  {
    id: 'log-002', timestamp: '2024-01-16T15:30:00.100Z', level: 'info',
    service: 'procurement-service', module: 'procurement', partNo: 'Part 22',
    correlationId: 'corr-001', message: 'Validating purchase order data', durationMs: 12
  },
  {
    id: 'log-003', timestamp: '2024-01-16T15:30:00.200Z', level: 'debug',
    service: 'database', module: 'persistence', partNo: 'Part 04',
    correlationId: 'corr-001', message: 'Executing INSERT query', durationMs: 45
  },
  {
    id: 'log-004', timestamp: '2024-01-16T15:31:00Z', level: 'warn',
    service: 'api-gateway', module: 'dashboard', partNo: 'Part 20',
    route: 'GET /api/v1/dashboard', correlationId: 'corr-002',
    message: 'Dashboard load exceeded SLO target', durationMs: 2150, outcome: 'success'
  },
  {
    id: 'log-005', timestamp: '2024-01-16T15:32:00Z', level: 'error',
    service: 'storage-service', module: 'documents', partNo: 'Part 24',
    correlationId: 'corr-003', message: 'Upload failed: storage service timeout',
    durationMs: 5200, outcome: 'failure', error: 'ETIMEDOUT'
  },
];

// ===== QUEUE METRICS =====
export const queueMetrics: QueueMetric[] = [
  { queueName: 'notifications', depth: 125, oldestMessageAge: 45, retries: 2, deadLetterCount: 0, processingRate: 85, lastCheckedAt: '2024-01-16T15:45:00Z' },
  { queueName: 'emails', depth: 18, oldestMessageAge: 12, retries: 0, deadLetterCount: 0, processingRate: 45, lastCheckedAt: '2024-01-16T15:45:00Z' },
  { queueName: 'reports', depth: 3, oldestMessageAge: 5, retries: 0, deadLetterCount: 0, processingRate: 12, lastCheckedAt: '2024-01-16T15:45:00Z' },
  { queueName: 'audit-events', depth: 450, oldestMessageAge: 120, retries: 5, deadLetterCount: 2, processingRate: 320, lastCheckedAt: '2024-01-16T15:45:00Z' },
];

// ===== JOB METRICS =====
export const jobMetrics: JobMetric[] = [
  { jobId: 'job-001', jobName: 'Audit Hash Verification', status: 'idle', lastRunAt: '2024-01-16T02:00:00Z', nextRunAt: '2024-01-17T02:00:00Z', avgDuration: 45000, successRate: 100, stuckCount: 0 },
  { jobId: 'job-002', jobName: 'SLO Calculation', status: 'idle', lastRunAt: '2024-01-16T15:00:00Z', nextRunAt: '2024-01-16T16:00:00Z', avgDuration: 12000, successRate: 100, stuckCount: 0 },
  { jobId: 'job-003', jobName: 'Queue Health Check', status: 'running', lastRunAt: '2024-01-16T15:40:00Z', nextRunAt: '2024-01-16T15:45:00Z', avgDuration: 5000, successRate: 99.8, stuckCount: 0 },
  { jobId: 'job-004', jobName: 'Slow Query Analyzer', status: 'idle', lastRunAt: '2024-01-16T14:00:00Z', nextRunAt: '2024-01-16T16:00:00Z', avgDuration: 30000, successRate: 100, stuckCount: 0 },
  { jobId: 'job-005', jobName: 'Capacity Test Runner', status: 'idle', lastRunAt: '2024-01-14T10:00:00Z', avgDuration: 3600000, successRate: 100, stuckCount: 0 },
];

// ===== SLOW QUERIES =====
export const slowQueries: SlowQuery[] = [
  {
    id: 'sq-001', queryFingerprint: 'SELECT * FROM stock_ledger WHERE project_id = ? AND date >= ?',
    query: 'SELECT * FROM stock_ledger WHERE project_id = $1 AND date >= $2 ORDER BY date DESC',
    avgDuration: 2500, maxDuration: 4800, callCount: 1250, lastSeenAt: '2024-01-16T15:30:00Z',
    table: 'stock_ledger', indexUsed: 'idx_stock_project_date', rowsScanned: 125000, rowsReturned: 500
  },
  {
    id: 'sq-002', queryFingerprint: 'SELECT COUNT(*) FROM attendance_daily WHERE date = ?',
    query: 'SELECT COUNT(*) FROM attendance_daily WHERE date = $1',
    avgDuration: 1800, maxDuration: 3200, callCount: 890, lastSeenAt: '2024-01-16T15:25:00Z',
    table: 'attendance_daily', indexUsed: 'idx_attendance_date', rowsScanned: 85000, rowsReturned: 1
  },
  {
    id: 'sq-003', queryFingerprint: 'SELECT * FROM purchase_orders WHERE status = ? AND created_at >= ?',
    query: 'SELECT * FROM purchase_orders WHERE status = $1 AND created_at >= $2',
    avgDuration: 1200, maxDuration: 2100, callCount: 2340, lastSeenAt: '2024-01-16T15:20:00Z',
    table: 'purchase_orders', indexUsed: 'idx_po_status_created', rowsScanned: 45000, rowsReturned: 125
  },
];

// ===== DATABASE METRICS =====
export const databaseMetrics: DatabaseMetric = {
  connectionPoolSize: 100,
  activeConnections: 47,
  idleConnections: 48,
  waitingConnections: 5,
  slowQueryCount: 3,
  lockWaitCount: 0,
  tableGrowth: [
    { table: 'stock_ledger', sizeMB: 2450, growthRate: 12.5 },
    { table: 'attendance_daily', sizeMB: 1850, growthRate: 8.2 },
    { table: 'purchase_orders', sizeMB: 450, growthRate: 3.1 },
    { table: 'audit_log', sizeMB: 1250, growthRate: 15.8 },
  ]
};

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-OBS-01', stage: 'VERIFY', control: 'New routes/jobs emit correlation-tagged logs, metrics and traces before release', enforcement: 'BLOCK(release)', status: 'OBSERVE' },
  { id: 'CP-OBS-02', stage: 'MONITOR', control: 'SLO burn rate above threshold', enforcement: 'MONITOR', status: 'OBSERVE' },
  { id: 'CP-OBS-03', stage: 'MONITOR', control: 'Audit hash-chain break or log redaction failure', enforcement: 'MONITOR', status: 'OBSERVE' },
  { id: 'CP-OBS-04', stage: 'CLOSE', control: 'SEV1/SEV2 incidents closed only with post-incident review and actions', enforcement: 'BLOCK(close)', status: 'OBSERVE' },
];

// ===== ERROR TAXONOMY =====
export const errorTaxonomy = [
  { code: 'VALIDATION', description: 'Input validation failed', userMessage: 'Please check your input and try again' },
  { code: 'PERMISSION', description: 'Access denied', userMessage: 'You do not have permission to perform this action' },
  { code: 'CONFLICT', description: 'Optimistic locking conflict', userMessage: 'This record was modified by another user. Please refresh and try again' },
  { code: 'NOT_FOUND', description: 'Resource not found', userMessage: 'The requested resource could not be found' },
  { code: 'BUSINESS_RULE', description: 'Business rule violation', userMessage: 'This action violates a business rule' },
  { code: 'INTEGRATION', description: 'External integration failure', userMessage: 'Unable to connect to external service. Please try again later' },
  { code: 'TIMEOUT', description: 'Operation timeout', userMessage: 'The operation took too long. Please try again' },
  { code: 'DEPENDENCY_DOWN', description: 'Dependency unavailable', userMessage: 'A required service is temporarily unavailable' },
  { code: 'INTERNAL', description: 'Internal server error', userMessage: 'An unexpected error occurred. Please contact support with correlation ID' },
];

// ===== HELPER FUNCTIONS =====

export function getSLOHealth(): { onTrack: number; atRisk: number; breached: number } {
  const onTrack = slos.filter(s => s.errorBudgetRemaining > 20).length;
  const atRisk = slos.filter(s => s.errorBudgetRemaining > 0 && s.errorBudgetRemaining <= 20).length;
  const breached = slos.filter(s => s.errorBudgetRemaining <= 0).length;
  return { onTrack, atRisk, breached };
}

export function getIncidentStats(): { open: number; mitigated: number; resolved: number; reviewed: number } {
  return {
    open: incidents.filter(i => i.status === 'OPEN' || i.status === 'ACKNOWLEDGED').length,
    mitigated: incidents.filter(i => i.status === 'MITIGATED').length,
    resolved: incidents.filter(i => i.status === 'RESOLVED').length,
    reviewed: incidents.filter(i => i.status === 'REVIEWED').length,
  };
}

export function getOverallHealth(): HealthStatus {
  const unhealthy = healthChecks.filter(h => h.status === 'unhealthy').length;
  const degraded = healthChecks.filter(h => h.status === 'degraded').length;
  
  if (unhealthy > 0) return 'unhealthy';
  if (degraded > 0) return 'degraded';
  return 'healthy';
}
