// Part 04 — Core Enterprise ERP Foundation
// Service base class with all hooks

import { v4 as uuidv4 } from 'uuid';
import type {
  RequestContext,
  AuditEntry,
  DomainEvent,
  OutboxEvent,
  NumberSeries,
  AuthorizeHook,
  ValidateHook,
  AuditHook,
  EmitHook,
  NotifyHook,
  AttachHook,
  NextNumberHook,
} from './types';

// ============================================================================
// REQUEST CONTEXT FACTORY
// ============================================================================

export function createRequestContext(params: {
  userId: string;
  companyId: string;
  activeProjectId?: string;
  activeSiteId?: string;
  roles: string[];
  permissions: string[];
  locale?: string;
  timezone?: string;
  deviceInfo?: RequestContext['deviceInfo'];
}): RequestContext {
  return {
    userId: params.userId,
    companyId: params.companyId,
    activeProjectId: params.activeProjectId,
    activeSiteId: params.activeSiteId,
    roles: params.roles,
    permissions: params.permissions,
    locale: params.locale || 'en-IN',
    timezone: params.timezone || 'Asia/Kolkata',
    correlationId: uuidv4(),
    deviceInfo: params.deviceInfo || {
      type: 'web',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      ipAddress: '0.0.0.0',
    },
  };
}

// ============================================================================
// AUTHORIZATION HOOK
// ============================================================================

/**
 * Authorization hook - checks if user has permission for action
 * Currently delegates to existing auth mechanism (Part 06 will enhance)
 */
export const authorize: AuthorizeHook = async (ctx, permissionKey, resource) => {
  // Check if permission exists in user's permission list
  const hasPermission = ctx.permissions.includes(permissionKey);
  
  if (!hasPermission) {
    console.warn(`[AUTH] Permission denied: ${permissionKey} for user ${ctx.userId}`);
    return false;
  }

  // TODO: Part 06 will add ABAC, scope checks, SoD validation
  // For now, basic permission check is sufficient
  
  return true;
};

// ============================================================================
// VALIDATION HOOK
// ============================================================================

/**
 * Validation hook - validates input against schema
 * Uses simple schema validation (Part 06 will integrate Zod or similar)
 */
export const validate: ValidateHook = <T>(schema: any, input: unknown) => {
  try {
    const data = input as Record<string, any>;
    
    // Simple validation - check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (data[field] === undefined || data[field] === null) {
          return {
            success: false as const,
            errors: { [field]: [`${field} is required`] },
          };
        }
      }
    }

    // Type checking
    if (schema.properties) {
      const errors: Record<string, string[]> = {};
      
      for (const [field, rules] of Object.entries(schema.properties)) {
        const value = data[field];
        const rule = rules as any;
        
        if (value !== undefined) {
          if (rule.type === 'string' && typeof value !== 'string') {
            errors[field] = errors[field] || [];
            errors[field].push(`${field} must be a string`);
          }
          if (rule.type === 'number' && typeof value !== 'number') {
            errors[field] = errors[field] || [];
            errors[field].push(`${field} must be a number`);
          }
          if (rule.minLength && String(value).length < rule.minLength) {
            errors[field] = errors[field] || [];
            errors[field].push(`${field} must be at least ${rule.minLength} characters`);
          }
          if (rule.maximum !== undefined && value > rule.maximum) {
            errors[field] = errors[field] || [];
            errors[field].push(`${field} must be <= ${rule.maximum}`);
          }
        }
      }

      if (Object.keys(errors).length > 0) {
        return { success: false as const, errors };
      }
    }

    return { success: true as const, data: data as T };
  } catch (error) {
    return {
      success: false as const,
      errors: { _general: ['Validation failed'] },
    };
  }
};

// ============================================================================
// AUDIT HOOK
// ============================================================================

/**
 * Audit hook - records all changes for compliance
 * Stores in memory for now (Part 07 will provide persistent storage)
 */
const auditLog: AuditEntry[] = [];

export const audit: AuditHook = async (
  ctx,
  entityType,
  entityId,
  action,
  before,
  after,
  reason
) => {
  const entry: AuditEntry = {
    id: uuidv4(),
    correlationId: ctx.correlationId,
    userId: ctx.userId,
    companyId: ctx.companyId,
    projectId: ctx.activeProjectId,
    siteId: ctx.activeSiteId,
    entityType,
    entityId,
    action,
    before,
    after,
    reason,
    timestamp: new Date().toISOString(),
    ipAddress: ctx.deviceInfo.ipAddress,
    userAgent: ctx.deviceInfo.userAgent,
  };

  auditLog.push(entry);
  
  console.log(`[AUDIT] ${action} ${entityType}:${entityId} by ${ctx.userId}`, {
    correlationId: ctx.correlationId,
    before: before ? 'changed' : 'created',
    after: after ? 'changed' : 'deleted',
  });

  // TODO: Part 07 will persist to database
};

export function getAuditLog(): AuditEntry[] {
  return [...auditLog];
}

// ============================================================================
// EVENT OUTBOX HOOK
// ============================================================================

/**
 * Event outbox hook - ensures events are published atomically with business transaction
 * Uses in-memory queue for now (Part 11 will provide persistent outbox)
 */
const outboxQueue: OutboxEvent[] = [];

export const emit: EmitHook = async (
  ctx,
  eventName,
  aggregateType,
  aggregateId,
  payload
) => {
  const event: OutboxEvent = {
    id: uuidv4(),
    eventName,
    aggregateType,
    aggregateId,
    companyId: ctx.companyId,
    projectId: ctx.activeProjectId,
    siteId: ctx.activeSiteId,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: 'pending',
  };

  outboxQueue.push(event);
  
  console.log(`[EVENT] ${eventName} for ${aggregateType}:${aggregateId}`, {
    correlationId: ctx.correlationId,
    eventId: event.id,
  });

  // TODO: Part 11 will implement outbox relay worker
};

export function getOutboxQueue(): OutboxEvent[] {
  return [...outboxQueue];
}

// ============================================================================
// NOTIFICATION HOOK
// ============================================================================

/**
 * Notification hook - sends notifications to users
 * Currently logs only (Part 16 will provide full notification engine)
 */
export const notify: NotifyHook = async (ctx, recipients, template, data, level) => {
  console.log(`[NOTIFY] Template: ${template}, Level: ${level}`, {
    correlationId: ctx.correlationId,
    recipients,
    data,
  });

  // TODO: Part 16 will implement full notification engine with:
  // - Email, SMS, in-app, push notifications
  // - Template rendering
  // - Preference management
  // - Delivery tracking
};

// ============================================================================
// DOCUMENT ATTACHMENT HOOK
// ============================================================================

/**
 * Attachment hook - handles file uploads
 * Currently returns mock data (Part 10 will provide real storage)
 */
export const attach: AttachHook = async (ctx, entityType, entityId, file) => {
  const attachmentId = uuidv4();
  
  console.log(`[ATTACH] ${file.name} (${file.size} bytes) to ${entityType}:${entityId}`, {
    correlationId: ctx.correlationId,
    attachmentId,
  });

  // TODO: Part 10 will implement:
  // - File upload to S3/storage
  // - Virus scanning
  // - Thumbnail generation
  // - Access control
  
  return {
    attachmentId,
    url: `/api/v1/attachments/${attachmentId}`,
  };
};

// ============================================================================
// NUMBERING SERVICE
// ============================================================================

/**
 * Number series registry - manages document numbering
 * In-memory for now (will be persisted in database)
 */
const numberSeriesRegistry: Map<string, NumberSeries> = new Map();

/**
 * Initialize a number series
 */
export function initNumberSeries(
  companyId: string,
  docType: string,
  fy: string,
  prefixTemplate: string,
  startFrom: number = 1,
  padding: number = 4,
  projectId?: string
): NumberSeries {
  const key = `${companyId}:${projectId || 'global'}:${docType}:${fy}`;
  
  const series: NumberSeries = {
    id: uuidv4(),
    companyId,
    projectId,
    docType,
    fy,
    prefixTemplate,
    nextValue: startFrom,
    padding,
    resetRule: 'yearly',
    isGapless: true,
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  };

  numberSeriesRegistry.set(key, series);
  return series;
}

/**
 * Get next number in series
 */
export const nextNumber: NextNumberHook = async (ctx, docType, options) => {
  const fy = getCurrentFY();
  const key = `${ctx.companyId}:${options?.projectId || 'global'}:${docType}:${fy}`;
  
  let series = numberSeriesRegistry.get(key);
  
  if (!series) {
    // Auto-initialize with defaults
    series = initNumberSeries(
      ctx.companyId,
      docType,
      fy,
      `${docType}/{FY}/{SEQ}`,
      1,
      4,
      options?.projectId
    );
  }

  if (options?.preview) {
    // Preview mode - don't increment
    return formatNumber(series.prefixTemplate, series.fy, series.nextValue, series.padding);
  }

  // Get next number and increment
  const number = formatNumber(series.prefixTemplate, series.fy, series.nextValue, series.padding);
  series.nextValue++;
  series.updatedAt = new Date().toISOString();
  series.updatedBy = ctx.userId;

  console.log(`[NUMBER] Generated ${number} for ${docType}`, {
    correlationId: ctx.correlationId,
    series: key,
  });

  return number;
};

/**
 * Format number according to template
 */
function formatNumber(template: string, fy: string, seq: number, padding: number): string {
  const seqStr = String(seq).padStart(padding, '0');
  return template
    .replace('{FY}', fy)
    .replace('{SEQ}', seqStr);
}

/**
 * Get current financial year (April to March)
 */
function getCurrentFY(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 0-indexed
  
  if (month >= 4) {
    // April or later - current FY
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    // Before April - previous FY
    return `${year - 1}-${String(year).slice(-2)}`;
  }
}

export function getNumberSeriesRegistry(): Map<string, NumberSeries> {
  return new Map(numberSeriesRegistry);
}

// ============================================================================
// TRANSACTION HELPER
// ============================================================================

/**
 * Transaction helper - ensures business write + audit + outbox in one atomic operation
 * Currently simulates transaction (real implementation will use DB transactions)
 */
export async function withTransaction<T>(
  ctx: RequestContext,
  operation: () => Promise<T>
): Promise<T> {
  console.log(`[TX] Starting transaction`, { correlationId: ctx.correlationId });
  
  try {
    // Execute business operation
    const result = await operation();
    
    // TODO: Real implementation will:
    // 1. BEGIN TRANSACTION
    // 2. Execute business logic
    // 3. Write audit entries
    // 4. Write outbox events
    // 5. COMMIT
    
    console.log(`[TX] Transaction committed`, { correlationId: ctx.correlationId });
    return result;
  } catch (error) {
    // TODO: Real implementation will ROLLBACK
    console.error(`[TX] Transaction failed`, {
      correlationId: ctx.correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createErrorEnvelope(
  error: Error | AppError,
  correlationId: string,
  path: string
): any {
  const appError = error instanceof AppError ? error : new AppError('INTERNAL_ERROR', error.message);
  
  return {
    error: {
      code: appError.code,
      message: appError.message,
      details: appError.details,
      correlationId,
      timestamp: new Date().toISOString(),
      path,
    },
  };
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function checkHealth(): Promise<any> {
  // TODO: Part 10 will implement real health checks
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: 'up', latency: 5 },
      cache: { status: 'up', latency: 2 },
      queue: { status: 'up', latency: 10 },
      storage: { status: 'up', latency: 50 },
    },
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Format money value in Indian format
 */
export function formatMoney(amount: number | string, currency: string = 'INR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format quantity with UOM
 */
export function formatQuantity(value: number | string, uom: string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toLocaleString('en-IN')} ${uom}`;
}

/**
 * Parse financial year string
 */
export function parseFY(fy: string): { startYear: number; endYear: number } {
  const match = fy.match(/^(\d{4})-(\d{2})$/);
  if (!match) throw new Error(`Invalid FY format: ${fy}`);
  
  return {
    startYear: parseInt(match[1]),
    endYear: parseInt(match[2]) + (parseInt(match[1]) < 2000 ? 2000 : 0),
  };
}

/**
 * Check if date is within financial year
 */
export function isInFY(date: Date | string, fy: string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const { startYear, endYear } = parseFY(fy);
  
  const fyStart = new Date(startYear, 3, 1); // April 1
  const fyEnd = new Date(endYear, 2, 31); // March 31
  
  return d >= fyStart && d <= fyEnd;
}

/**
 * Decimal arithmetic with precision
 */
export function decimalAdd(a: number | string, b: number | string, precision: number = 2): number {
  const numA = typeof a === 'string' ? parseFloat(a) : a;
  const numB = typeof b === 'string' ? parseFloat(b) : b;
  const factor = Math.pow(10, precision);
  return Math.round((numA + numB) * factor) / factor;
}

export function decimalSubtract(a: number | string, b: number | string, precision: number = 2): number {
  const numA = typeof a === 'string' ? parseFloat(a) : a;
  const numB = typeof b === 'string' ? parseFloat(b) : b;
  const factor = Math.pow(10, precision);
  return Math.round((numA - numB) * factor) / factor;
}

export function decimalMultiply(a: number | string, b: number | string, precision: number = 2): number {
  const numA = typeof a === 'string' ? parseFloat(a) : a;
  const numB = typeof b === 'string' ? parseFloat(b) : b;
  const factor = Math.pow(10, precision);
  return Math.round(numA * numB * factor) / factor;
}

export function decimalDivide(a: number | string, b: number | string, precision: number = 2): number {
  const numA = typeof a === 'string' ? parseFloat(a) : a;
  const numB = typeof b === 'string' ? parseFloat(b) : b;
  if (numB === 0) throw new Error('Division by zero');
  const factor = Math.pow(10, precision);
  return Math.round((numA / numB) * factor) / factor;
}
