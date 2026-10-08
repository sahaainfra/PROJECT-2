// Part 04 — Core Enterprise ERP Foundation
// Shared service types and interfaces

export interface RequestContext {
  userId: string;
  companyId: string;
  activeProjectId?: string;
  activeSiteId?: string;
  roles: string[];
  permissions: string[];
  locale: string;
  timezone: string;
  correlationId: string;
  deviceInfo: {
    type: 'web' | 'mobile' | 'tablet';
    userAgent: string;
    ipAddress: string;
  };
}

export interface AuditEntry {
  id: string;
  correlationId: string;
  userId: string;
  companyId: string;
  projectId?: string;
  siteId?: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'restore';
  before?: Record<string, any>;
  after?: Record<string, any>;
  reason?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface DomainEvent {
  id: string;
  name: string;
  aggregateType: string;
  aggregateId: string;
  companyId: string;
  projectId?: string;
  siteId?: string;
  payload: Record<string, any>;
  metadata: {
    correlationId: string;
    causationId?: string;
    userId: string;
    timestamp: string;
    schemaVersion: string;
  };
}

export interface OutboxEvent {
  id: string;
  eventName: string;
  aggregateType: string;
  aggregateId: string;
  companyId: string;
  projectId?: string;
  siteId?: string;
  payload: Record<string, any>;
  createdAt: string;
  publishedAt?: string;
  attempts: number;
  lastError?: string;
  status: 'pending' | 'published' | 'failed' | 'dead_letter';
}

export interface NumberSeries {
  id: string;
  companyId: string;
  projectId?: string;
  docType: string;
  fy: string; // Financial year (e.g., "2024-25")
  prefixTemplate: string; // e.g., "PO/{FY}/{SEQ}"
  nextValue: number;
  padding: number; // Zero padding for sequence
  resetRule: 'never' | 'yearly' | 'monthly';
  isGapless: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface JobDefinition {
  id: string;
  type: string;
  name: string;
  description: string;
  schedule?: string; // Cron expression
  handler: string; // Function name
  retryPolicy: {
    maxAttempts: number;
    backoffMs: number;
  };
  timeout: number; // milliseconds
  enabled: boolean;
}

export interface JobRun {
  id: string;
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  payload: Record<string, any>;
  attempts: number;
  scheduledAt: string;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
  correlationId: string;
  idempotencyKey?: string;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    correlationId: string;
    timestamp: string;
    path: string;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: HealthCheck;
    cache: HealthCheck;
    queue: HealthCheck;
    storage: HealthCheck;
  };
}

export interface HealthCheck {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  message?: string;
}

export interface MoneyValue {
  amount: string; // Decimal string for precision
  currency: string; // ISO 4217
}

export interface QuantityValue {
  value: string; // Decimal string
  uom: string; // Unit of measure code
}

export interface DateRange {
  from: string; // ISO date
  to: string; // ISO date
  fy?: string; // Financial year
}

// Service hook signatures
export type AuthorizeHook = (
  ctx: RequestContext,
  permissionKey: string,
  resource?: { type: string; id: string; scope?: Record<string, string> }
) => Promise<boolean>;

export type ValidateHook = <T>(
  schema: any, // Zod schema or similar
  input: unknown
) => { success: true; data: T } | { success: false; errors: Record<string, string[]> };

export type AuditHook = (
  ctx: RequestContext,
  entityType: string,
  entityId: string,
  action: AuditEntry['action'],
  before?: Record<string, any>,
  after?: Record<string, any>,
  reason?: string
) => Promise<void>;

export type EmitHook = (
  ctx: RequestContext,
  eventName: string,
  aggregateType: string,
  aggregateId: string,
  payload: Record<string, any>
) => Promise<void>;

export type NotifyHook = (
  ctx: RequestContext,
  recipients: { userIds?: string[]; roles?: string[]; emails?: string[] },
  template: string,
  data: Record<string, any>,
  level: 'info' | 'warning' | 'critical' | 'action_required'
) => Promise<void>;

export type AttachHook = (
  ctx: RequestContext,
  entityType: string,
  entityId: string,
  file: { name: string; size: number; type: string; data: ArrayBuffer | Blob }
) => Promise<{ attachmentId: string; url: string }>;

export type NextNumberHook = (
  ctx: RequestContext,
  docType: string,
  options?: { preview?: boolean; projectId?: string }
) => Promise<string>;
