// Part 17 — Integration Architecture
// Secure integration hub for external services

export type ConnectorType = 'email' | 'sms' | 'whatsapp' | 'bank' | 'gst' | 'maps' | 'ocr' | 'bi' | 'ai' | 'storage' | 'biometric' | 'erp';
export type ConnectorStatus = 'active' | 'inactive' | 'error' | 'testing';
export type MessageDirection = 'outbound' | 'inbound';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'retrying';
export type EndpointDirection = 'outbound' | 'inbound';
export type AuthType = 'api_key' | 'oauth2' | 'basic' | 'bearer' | 'hmac' | 'certificate';

export interface Connector {
  id: string;
  code: string;
  type: ConnectorType;
  provider: string;
  name: string;
  description: string;
  configJson: Record<string, any>;
  secretRef: string;
  status: ConnectorStatus;
  health: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastCheckedAt?: string;
  lastSuccessAt?: string;
  lastErrorAt?: string;
  errorMessage?: string;
  throughputLast24h: number;
  failureRateLast24h: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Endpoint {
  id: string;
  connectorCode: string;
  name: string;
  direction: EndpointDirection;
  url: string;
  authType: AuthType;
  rateLimit: number;
  rateLimitWindow: string;
  timeout: number;
  retries: number;
  isActive: boolean;
  createdAt: string;
}

export interface IntegrationMessage {
  id: string;
  connectorCode: string;
  direction: MessageDirection;
  correlationId: string;
  entityType?: string;
  entityId?: string;
  requestRedacted: Record<string, any>;
  responseRedacted?: Record<string, any>;
  status: MessageStatus;
  attempts: number;
  error?: string;
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
}

export interface Webhook {
  id: string;
  eventName: string;
  targetUrl: string;
  secretRef: string;
  isActive: boolean;
  failureCount: number;
  lastTriggeredAt?: string;
  lastSuccessAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface ApiClient {
  id: string;
  clientId: string;
  name: string;
  scopes: string[];
  keyHash: string;
  ipAllowlist: string[];
  rateLimit: number;
  rateLimitWindow: string;
  expiresAt?: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface DeadLetter {
  id: string;
  messageId: string;
  connectorCode: string;
  reason: string;
  payloadRedacted: Record<string, any>;
  attempts: number;
  lastError: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== CONNECTORS =====
export const connectors: Connector[] = [
  {
    id: 'conn-001', code: 'SMTP-SENDGRID', type: 'email', provider: 'SendGrid',
    name: 'SendGrid Email Service', description: 'Transactional email delivery via SendGrid API',
    configJson: { fromEmail: 'noreply@construction-erp.com', fromName: 'Construction ERP' },
    secretRef: 'vault://integrations/sendgrid-api-key', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:45:00Z', lastSuccessAt: '2024-01-16T15:40:00Z',
    throughputLast24h: 1250, failureRateLast24h: 0.02,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-10', updatedBy: 'user-001'
  },
  {
    id: 'conn-002', code: 'SMS-TWILIO', type: 'sms', provider: 'Twilio',
    name: 'Twilio SMS Service', description: 'SMS delivery via Twilio with DLT compliance',
    configJson: { fromNumber: '+919876543210', dltTemplateId: '123456789' },
    secretRef: 'vault://integrations/twilio-credentials', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:45:00Z', lastSuccessAt: '2024-01-16T15:30:00Z',
    throughputLast24h: 340, failureRateLast24h: 0.01,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-05', updatedBy: 'user-001'
  },
  {
    id: 'conn-003', code: 'WHATSAPP-META', type: 'whatsapp', provider: 'Meta Business',
    name: 'WhatsApp Business API', description: 'WhatsApp messaging via Meta Business Platform',
    configJson: { businessAccountId: '123456789', phoneNumberId: '987654321' },
    secretRef: 'vault://integrations/meta-whatsapp-token', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:45:00Z', lastSuccessAt: '2024-01-16T14:00:00Z',
    throughputLast24h: 85, failureRateLast24h: 0.03,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-08', updatedBy: 'user-001'
  },
  {
    id: 'conn-004', code: 'BANK-HDFC', type: 'bank', provider: 'HDFC Bank',
    name: 'HDFC Bank Integration', description: 'Payment file generation and bank statement import',
    configJson: { accountNumber: '****5678', ifscCode: 'HDFC0001234', format: 'NEFT' },
    secretRef: 'vault://integrations/hdfc-api-credentials', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:00:00Z', lastSuccessAt: '2024-01-16T10:00:00Z',
    throughputLast24h: 45, failureRateLast24h: 0.0,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-12', updatedBy: 'user-001'
  },
  {
    id: 'conn-005', code: 'GST-ADAPTER', type: 'gst', provider: 'ClearTax GSP',
    name: 'GST E-Invoice & E-Way Bill', description: 'GST compliance via authorised GSP provider',
    configJson: { gstin: '27AAACI5678G1Z5', environment: 'production' },
    secretRef: 'vault://integrations/cleartax-gsp-credentials', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:30:00Z', lastSuccessAt: '2024-01-16T14:45:00Z',
    throughputLast24h: 120, failureRateLast24h: 0.01,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-15', updatedBy: 'user-001'
  },
  {
    id: 'conn-006', code: 'MAPS-GOOGLE', type: 'maps', provider: 'Google Maps',
    name: 'Google Maps Platform', description: 'Geocoding, distance calculation, and map tiles',
    configJson: { enableDistanceMatrix: true, enableGeocoding: true },
    secretRef: 'vault://integrations/google-maps-api-key', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:45:00Z', lastSuccessAt: '2024-01-16T15:40:00Z',
    throughputLast24h: 2340, failureRateLast24h: 0.005,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-03', updatedBy: 'user-001'
  },
  {
    id: 'conn-007', code: 'OCR-AWS', type: 'ocr', provider: 'AWS Textract',
    name: 'AWS Textract OCR', description: 'Document OCR and data extraction',
    configJson: { region: 'ap-south-1', enableTables: true, enableForms: true },
    secretRef: 'vault://integrations/aws-textract-credentials', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:45:00Z', lastSuccessAt: '2024-01-16T13:00:00Z',
    throughputLast24h: 67, failureRateLast24h: 0.02,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-07', updatedBy: 'user-001'
  },
  {
    id: 'conn-008', code: 'BI-EXPORT', type: 'bi', provider: 'Internal',
    name: 'BI Data Export', description: 'Read-only replica export for external BI tools',
    configJson: { schedule: '0 2 * * *', format: 'parquet', compression: 'snappy' },
    secretRef: 'vault://integrations/bi-export-credentials', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T02:00:00Z', lastSuccessAt: '2024-01-16T02:15:00Z',
    throughputLast24h: 1, failureRateLast24h: 0.0,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-02', updatedBy: 'user-001'
  },
  {
    id: 'conn-009', code: 'PUSH-FIREBASE', type: 'storage', provider: 'Firebase',
    name: 'Firebase Cloud Messaging', description: 'Push notifications for mobile devices',
    configJson: { projectId: 'construction-erp-prod', enableTopics: true },
    secretRef: 'vault://integrations/firebase-service-account', status: 'active', health: 'healthy',
    lastCheckedAt: '2024-01-16T15:45:00Z', lastSuccessAt: '2024-01-16T15:40:00Z',
    throughputLast24h: 890, failureRateLast24h: 0.01,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-04', updatedBy: 'user-001'
  },
  {
    id: 'conn-010', code: 'ERP-TALLY', type: 'erp', provider: 'Tally',
    name: 'Tally ERP Connector', description: 'Master and voucher sync with Tally ERP',
    configJson: { companyId: 'TALLY-COMP-001', syncDirection: 'bidirectional' },
    secretRef: 'vault://integrations/tally-connector-credentials', status: 'active', health: 'degraded',
    lastCheckedAt: '2024-01-16T15:00:00Z', lastSuccessAt: '2024-01-16T12:00:00Z',
    lastErrorAt: '2024-01-16T14:30:00Z', errorMessage: 'Connection timeout - Tally server unresponsive',
    throughputLast24h: 23, failureRateLast24h: 0.15,
    createdAt: '2024-01-01', createdBy: 'user-001', updatedAt: '2024-01-14', updatedBy: 'user-001'
  },
];

// ===== ENDPOINTS =====
export const endpoints: Endpoint[] = [
  { id: 'ep-001', connectorCode: 'SMTP-SENDGRID', name: 'Send Email', direction: 'outbound', url: 'https://api.sendgrid.com/v3/mail/send', authType: 'bearer', rateLimit: 100, rateLimitWindow: '1m', timeout: 30000, retries: 3, isActive: true, createdAt: '2024-01-01' },
  { id: 'ep-002', connectorCode: 'SMS-TWILIO', name: 'Send SMS', direction: 'outbound', url: 'https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json', authType: 'basic', rateLimit: 50, rateLimitWindow: '1m', timeout: 15000, retries: 3, isActive: true, createdAt: '2024-01-01' },
  { id: 'ep-003', connectorCode: 'WHATSAPP-META', name: 'Send WhatsApp', direction: 'outbound', url: 'https://graph.facebook.com/v18.0/{Phone-Number-ID}/messages', authType: 'bearer', rateLimit: 80, rateLimitWindow: '1m', timeout: 20000, retries: 3, isActive: true, createdAt: '2024-01-01' },
  { id: 'ep-004', connectorCode: 'BANK-HDFC', name: 'Payment File Upload', direction: 'outbound', url: 'https://netbanking.hdfcbank.com/corp/UploadFile', authType: 'certificate', rateLimit: 10, rateLimitWindow: '1h', timeout: 60000, retries: 2, isActive: true, createdAt: '2024-01-01' },
  { id: 'ep-005', connectorCode: 'GST-ADAPTER', name: 'Generate E-Invoice', direction: 'outbound', url: 'https://gsp.cleartax.in/gsp/v2/einvoice/generatedocument', authType: 'api_key', rateLimit: 100, rateLimitWindow: '1m', timeout: 30000, retries: 3, isActive: true, createdAt: '2024-01-01' },
  { id: 'ep-006', connectorCode: 'MAPS-GOOGLE', name: 'Geocode Address', direction: 'outbound', url: 'https://maps.googleapis.com/maps/api/geocode/json', authType: 'api_key', rateLimit: 1000, rateLimitWindow: '1m', timeout: 10000, retries: 2, isActive: true, createdAt: '2024-01-01' },
];

// ===== MESSAGES =====
export const messages: IntegrationMessage[] = [
  {
    id: 'msg-001', connectorCode: 'SMTP-SENDGRID', direction: 'outbound', correlationId: 'corr-ntf-001',
    entityType: 'Notification', entityId: 'ntf-001',
    requestRedacted: { to: 'user@example.com', subject: '***REDACTED***', body: '***REDACTED***' },
    responseRedacted: { messageId: 'sendgrid-msg-123', status: 'accepted' },
    status: 'delivered', attempts: 1, createdAt: '2024-01-16T10:00:00Z', sentAt: '2024-01-16T10:00:02Z', deliveredAt: '2024-01-16T10:00:05Z'
  },
  {
    id: 'msg-002', connectorCode: 'SMS-TWILIO', direction: 'outbound', correlationId: 'corr-ntf-009',
    entityType: 'Notification', entityId: 'ntf-009',
    requestRedacted: { to: '+919876543210', body: '***REDACTED***', templateId: '123456789' },
    responseRedacted: { sid: 'SM123456789', status: 'sent' },
    status: 'delivered', attempts: 1, createdAt: '2024-01-16T15:00:00Z', sentAt: '2024-01-16T15:00:02Z', deliveredAt: '2024-01-16T15:00:05Z'
  },
  {
    id: 'msg-003', connectorCode: 'GST-ADAPTER', direction: 'outbound', correlationId: 'corr-bill-447',
    entityType: 'Bill', entityId: 'bill-447',
    requestRedacted: { invoiceNumber: 'B-447', invoiceDate: '2024-01-16', taxableValue: 2850000 },
    responseRedacted: { irn: 'IRN-2024-001234', ackNo: 'ACK-567890', status: 'ACTIVE' },
    status: 'delivered', attempts: 1, createdAt: '2024-01-16T16:00:00Z', sentAt: '2024-01-16T16:00:03Z', deliveredAt: '2024-01-16T16:00:08Z'
  },
  {
    id: 'msg-004', connectorCode: 'BANK-HDFC', direction: 'outbound', correlationId: 'corr-pay-001',
    entityType: 'Payment', entityId: 'pay-001',
    requestRedacted: { paymentFile: 'NEFT_20240116_001.txt', transactionCount: 15, totalAmount: 12500000 },
    responseRedacted: { batchId: 'HDFC-BATCH-789', status: 'ACCEPTED' },
    status: 'delivered', attempts: 1, createdAt: '2024-01-16T10:00:00Z', sentAt: '2024-01-16T10:00:10Z', deliveredAt: '2024-01-16T10:05:00Z'
  },
  {
    id: 'msg-005', connectorCode: 'ERP-TALLY', direction: 'outbound', correlationId: 'corr-voucher-001',
    entityType: 'Voucher', entityId: 'vch-001',
    requestRedacted: { voucherType: 'Payment', voucherNumber: 'PAY-001', amount: 850000 },
    status: 'failed', attempts: 3, error: 'Connection timeout - Tally server unresponsive',
    createdAt: '2024-01-16T14:30:00Z'
  },
];

// ===== WEBHOOKS =====
export const webhooks: Webhook[] = [
  {
    id: 'wh-001', eventName: 'po.approved', targetUrl: 'https://vendor-portal.example.com/webhooks/po-approved',
    secretRef: 'vault://webhooks/vendor-portal-signing-key', isActive: true, failureCount: 2,
    lastTriggeredAt: '2024-01-16T14:45:00Z', lastSuccessAt: '2024-01-16T14:45:02Z',
    createdAt: '2024-01-10', createdBy: 'user-001'
  },
  {
    id: 'wh-002', eventName: 'payment.posted', targetUrl: 'https://bank-api.example.com/webhooks/payment',
    secretRef: 'vault://webhooks/bank-api-signing-key', isActive: true, failureCount: 0,
    lastTriggeredAt: '2024-01-16T10:05:00Z', lastSuccessAt: '2024-01-16T10:05:01Z',
    createdAt: '2024-01-05', createdBy: 'user-001'
  },
  {
    id: 'wh-003', eventName: 'grn.posted', targetUrl: 'https://supplier-portal.example.com/webhooks/grn',
    secretRef: 'vault://webhooks/supplier-portal-signing-key', isActive: true, failureCount: 5,
    lastTriggeredAt: '2024-01-16T09:45:00Z', lastSuccessAt: '2024-01-15T16:00:00Z',
    createdAt: '2024-01-08', createdBy: 'user-001'
  },
];

// ===== API CLIENTS =====
export const apiClients: ApiClient[] = [
  {
    id: 'client-001', clientId: 'vendor-portal-prod', name: 'Vendor Portal Integration',
    scopes: ['procurement.po.view', 'procurement.po.download'],
    keyHash: 'sha256:a1b2c3d4e5f6...', ipAllowlist: ['203.0.113.0/24'], rateLimit: 1000, rateLimitWindow: '1h',
    expiresAt: '2025-01-01', isActive: true, lastUsedAt: '2024-01-16T15:30:00Z',
    createdAt: '2024-01-01', createdBy: 'user-001'
  },
  {
    id: 'client-002', clientId: 'bi-tool-prod', name: 'BI Tool Read Access',
    scopes: ['rpt.dashboard.view', 'rpt.report.view', 'rpt.report.export'],
    keyHash: 'sha256:f6e5d4c3b2a1...', ipAllowlist: ['198.51.100.0/24'], rateLimit: 500, rateLimitWindow: '1h',
    expiresAt: '2025-01-01', isActive: true, lastUsedAt: '2024-01-16T02:15:00Z',
    createdAt: '2024-01-01', createdBy: 'user-001'
  },
  {
    id: 'client-003', clientId: 'mobile-app-prod', name: 'Mobile Application',
    scopes: ['shell.home.view', 'proc.pr.view', 'proc.pr.create', 'inv.grn.view', 'inv.grn.create'],
    keyHash: 'sha256:b2c3d4e5f6a1...', ipAllowlist: [], rateLimit: 2000, rateLimitWindow: '1h',
    expiresAt: '2025-06-01', isActive: true, lastUsedAt: '2024-01-16T15:40:00Z',
    createdAt: '2024-01-01', createdBy: 'user-001'
  },
];

// ===== DEAD LETTERS =====
export const deadLetters: DeadLetter[] = [
  {
    id: 'dlq-001', messageId: 'msg-005', connectorCode: 'ERP-TALLY',
    reason: 'Connection timeout after 3 retries', payloadRedacted: { voucherType: 'Payment', voucherNumber: 'PAY-001' },
    attempts: 3, lastError: 'ETIMEDOUT: Connection timed out after 60000ms',
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 'dlq-002', messageId: 'msg-006', connectorCode: 'WHATSAPP-META',
    reason: 'Template not approved by Meta', payloadRedacted: { to: '+919876543210', templateName: 'approval_notification' },
    attempts: 1, lastError: 'Template "approval_notification" is not approved',
    createdAt: '2024-01-15T11:00:00Z'
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-INT-01', stage: 'APPROVE', control: 'Integration credential changes maker-checker', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-INT-02', stage: 'MONITOR', control: 'Failed bank/GST/e-invoice messages', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getConnectorStats(): { total: number; active: number; healthy: number; degraded: number; unhealthy: number } {
  return {
    total: connectors.length,
    active: connectors.filter(c => c.status === 'active').length,
    healthy: connectors.filter(c => c.health === 'healthy').length,
    degraded: connectors.filter(c => c.health === 'degraded').length,
    unhealthy: connectors.filter(c => c.health === 'unhealthy').length,
  };
}

export function getMessageStats(): { total: number; delivered: number; failed: number; pending: number } {
  return {
    total: messages.length,
    delivered: messages.filter(m => m.status === 'delivered').length,
    failed: messages.filter(m => m.status === 'failed').length,
    pending: messages.filter(m => m.status === 'pending' || m.status === 'retrying').length,
  };
}

export function getThroughputByType(): Record<ConnectorType, number> {
  return connectors.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + c.throughputLast24h;
    return acc;
  }, {} as Record<ConnectorType, number>);
}
