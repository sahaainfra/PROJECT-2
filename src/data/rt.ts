// Part 16 — Real-time Notification & Collaboration Foundation
// Socket.IO infrastructure, notification engine, templates, preferences

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';
export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';
export type DeliveryStatus = 'queued' | 'sent' | 'delivered' | 'failed';
export type DigestFrequency = 'none' | 'hourly' | 'daily';
export type RoomType = 'user' | 'project' | 'site' | 'dept' | 'role' | 'conv' | 'doc';

export interface NotificationCategory {
  id: string;
  code: string;
  name: string;
  module: string;
  mandatory: boolean;
  defaultChannels: NotificationChannel[];
  description: string;
}

export interface NotificationTemplate {
  id: string;
  code: string;
  module: string;
  channel: NotificationChannel;
  locale: string;
  subject: string;
  body: string;
  variables: string[];
  version: number;
  isMandatoryCategory: boolean;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  category: string;
  categoryName: string;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  link?: string;
  priority: NotificationPriority;
  readAt?: string;
  archivedAt?: string;
  createdAt: string;
  eventId?: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  userName: string;
  category: string;
  categoryName: string;
  channels: NotificationChannel[];
  digest: DigestFrequency;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  provider: string;
  status: DeliveryStatus;
  attempts: number;
  providerRef?: string;
  error?: string;
  sentAt: string;
  deliveredAt?: string;
}

export interface Broadcast {
  id: string;
  title: string;
  body: string;
  scope: 'company' | 'project' | 'site' | 'department';
  scopeId?: string;
  scopeName?: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  recipientCount: number;
  deliveredCount: number;
  readCount: number;
}

export interface Room {
  id: string;
  type: RoomType;
  name: string;
  memberCount: number;
  lastActivity: string;
}

export interface Presence {
  userId: string;
  userName: string;
  entityType: string;
  entityId: string;
  joinedAt: string;
  lastSeenAt: string;
  isActive: boolean;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== NOTIFICATION CATEGORIES =====
export const notificationCategories: NotificationCategory[] = [
  { id: 'cat-001', code: 'APPROVAL_REQUIRED', name: 'Approval Required', module: 'workflow', mandatory: true, defaultChannels: ['in_app', 'email', 'push'], description: 'Tasks requiring your approval' },
  { id: 'cat-002', code: 'APPROVAL_COMPLETED', name: 'Approval Completed', module: 'workflow', mandatory: false, defaultChannels: ['in_app'], description: 'Your approvals have been processed' },
  { id: 'cat-003', code: 'TASK_ASSIGNED', name: 'Task Assigned', module: 'workflow', mandatory: true, defaultChannels: ['in_app', 'email'], description: 'New tasks assigned to you' },
  { id: 'cat-004', code: 'TASK_OVERDUE', name: 'Task Overdue', module: 'workflow', mandatory: true, defaultChannels: ['in_app', 'email', 'push'], description: 'Tasks past their due date' },
  { id: 'cat-005', code: 'EXCEPTION_REQUESTED', name: 'Exception Requested', module: 'protocol', mandatory: true, defaultChannels: ['in_app', 'email'], description: 'Protocol exceptions requiring your approval' },
  { id: 'cat-006', code: 'VIOLATION_RAISED', name: 'Violation Raised', module: 'protocol', mandatory: true, defaultChannels: ['in_app', 'email', 'push'], description: 'Protocol violations detected' },
  { id: 'cat-007', code: 'PO_CREATED', name: 'Purchase Order Created', module: 'procurement', mandatory: false, defaultChannels: ['in_app'], description: 'New purchase orders in your project' },
  { id: 'cat-008', code: 'GRN_RECEIVED', name: 'Goods Received', module: 'inventory', mandatory: false, defaultChannels: ['in_app'], description: 'Material received at your site' },
  { id: 'cat-009', code: 'STOCK_LOW', name: 'Stock Low Alert', module: 'inventory', mandatory: false, defaultChannels: ['in_app', 'email'], description: 'Stock below reorder level' },
  { id: 'cat-010', code: 'BILL_SUBMITTED', name: 'Bill Submitted', module: 'finance', mandatory: false, defaultChannels: ['in_app'], description: 'New bills submitted for verification' },
  { id: 'cat-011', code: 'PAYMENT_PROCESSED', name: 'Payment Processed', module: 'finance', mandatory: false, defaultChannels: ['in_app', 'email'], description: 'Payments have been processed' },
  { id: 'cat-012', code: 'SAFETY_INCIDENT', name: 'Safety Incident', module: 'safety', mandatory: true, defaultChannels: ['in_app', 'email', 'sms', 'push'], description: 'Safety incidents reported' },
  { id: 'cat-013', code: 'SYSTEM_ALERT', name: 'System Alert', module: 'system', mandatory: true, defaultChannels: ['in_app', 'email'], description: 'System maintenance and alerts' },
  { id: 'cat-014', code: 'ESCALATION', name: 'Escalation', module: 'protocol', mandatory: true, defaultChannels: ['in_app', 'email', 'sms', 'push'], description: 'Issues escalated to you' },
];

// ===== NOTIFICATION TEMPLATES =====
export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'tmpl-001', code: 'TPL-APPROVAL-001', module: 'workflow', channel: 'in_app', locale: 'en',
    subject: 'Approval Required: {{docType}} {{docNo}}',
    body: 'You have a pending approval for {{docType}} {{docNo}} ({{amount}}). Submitted by {{submitter}} on {{date}}. Please review and take action.',
    variables: ['docType', 'docNo', 'amount', 'submitter', 'date'],
    version: 2, isMandatoryCategory: true,
    createdAt: '2024-01-01', createdBy: 'user-001', lastModifiedAt: '2024-01-10'
  },
  {
    id: 'tmpl-002', code: 'TPL-APPROVAL-002', module: 'workflow', channel: 'email', locale: 'en',
    subject: 'Action Required: Approval Pending for {{docType}} {{docNo}}',
    body: 'Dear {{userName}},\n\nYou have a pending approval request:\n\nDocument: {{docType}} {{docNo}}\nAmount: {{amount}}\nSubmitted by: {{submitter}}\nDate: {{date}}\nProject: {{projectName}}\n\nPlease login to the system to review and take action.\n\nRegards,\nConstruction ERP System',
    variables: ['userName', 'docType', 'docNo', 'amount', 'submitter', 'date', 'projectName'],
    version: 1, isMandatoryCategory: true,
    createdAt: '2024-01-01', createdBy: 'user-001', lastModifiedAt: '2024-01-01'
  },
  {
    id: 'tmpl-003', code: 'TPL-TASK-001', module: 'workflow', channel: 'in_app', locale: 'en',
    subject: 'New Task: {{taskName}}',
    body: 'A new task has been assigned to you: {{taskName}}. Due date: {{dueDate}}. Priority: {{priority}}.',
    variables: ['taskName', 'dueDate', 'priority'],
    version: 1, isMandatoryCategory: true,
    createdAt: '2024-01-01', createdBy: 'user-001', lastModifiedAt: '2024-01-01'
  },
  {
    id: 'tmpl-004', code: 'TPL-EXCEPTION-001', module: 'protocol', channel: 'in_app', locale: 'en',
    subject: 'Exception Request: {{exceptionNo}}',
    body: '{{requester}} has requested an exception ({{exceptionNo}}) for {{deviationValue}} {{deviationUnit}}. Reason: {{reason}}. Please review.',
    variables: ['requester', 'exceptionNo', 'deviationValue', 'deviationUnit', 'reason'],
    version: 1, isMandatoryCategory: true,
    createdAt: '2024-01-01', createdBy: 'user-001', lastModifiedAt: '2024-01-01'
  },
  {
    id: 'tmpl-005', code: 'TPL-STOCK-001', module: 'inventory', channel: 'in_app', locale: 'en',
    subject: 'Low Stock Alert: {{materialName}}',
    body: '{{materialName}} at {{siteName}} is below reorder level. Current: {{currentQty}} {{unit}}, Reorder: {{reorderQty}} {{unit}}.',
    variables: ['materialName', 'siteName', 'currentQty', 'reorderQty', 'unit'],
    version: 1, isMandatoryCategory: false,
    createdAt: '2024-01-01', createdBy: 'user-001', lastModifiedAt: '2024-01-01'
  },
  {
    id: 'tmpl-006', code: 'TPL-SAFETY-001', module: 'safety', channel: 'sms', locale: 'en',
    subject: 'SAFETY INCIDENT: {{incidentNo}}',
    body: 'Safety incident {{incidentNo}} reported at {{siteName}}. Severity: {{severity}}. Immediate attention required.',
    variables: ['incidentNo', 'siteName', 'severity'],
    version: 1, isMandatoryCategory: true,
    createdAt: '2024-01-01', createdBy: 'user-001', lastModifiedAt: '2024-01-01'
  },
];

// ===== NOTIFICATIONS =====
export const notifications: Notification[] = [
  {
    id: 'ntf-001', userId: 'user-010', userName: 'Rajesh Kumar', category: 'APPROVAL_REQUIRED', categoryName: 'Approval Required',
    title: 'PO-2024-0894 requires your approval',
    body: 'Purchase Order PO-2024-0894 (₹8.5L) submitted by Amit Shah. Please review and approve.',
    entityType: 'PurchaseOrder', entityId: 'po-091', link: '/procurement/orders/po-091',
    priority: 'high', createdAt: '2024-01-16T10:00:00Z', eventId: 'evt-po-091'
  },
  {
    id: 'ntf-002', userId: 'user-010', userName: 'Rajesh Kumar', category: 'EXCEPTION_REQUESTED', categoryName: 'Exception Requested',
    title: 'Exception EXC-2024-002 pending approval',
    body: 'Suresh Patel requested amount excess exception (₹7.5L) for PO-2024-0893. Reason: Price escalation.',
    entityType: 'Exception', entityId: 'exc-002', link: '/protocol/exceptions/exc-002',
    priority: 'high', createdAt: '2024-01-16T16:00:00Z', eventId: 'evt-exc-002'
  },
  {
    id: 'ntf-003', userId: 'user-010', userName: 'Rajesh Kumar', category: 'TASK_OVERDUE', categoryName: 'Task Overdue',
    title: 'Bill B-448 verification overdue',
    body: 'Bill verification for B-448 is 3 days overdue. Assigned to Vikram Desai.',
    entityType: 'Bill', entityId: 'bill-448', link: '/finance/bills/bill-448',
    priority: 'normal', createdAt: '2024-01-16T08:00:00Z', eventId: 'evt-bill-448'
  },
  {
    id: 'ntf-004', userId: 'user-015', userName: 'Ravi Sharma', category: 'STOCK_LOW', categoryName: 'Stock Low Alert',
    title: 'Cement OPC 53 below reorder level',
    body: 'Cement OPC 53 at Metro Tower Site A is below reorder level. Current: 450 bags, Reorder: 500 bags.',
    entityType: 'Stock', entityId: 'mat-cement', link: '/inventory/stock/mat-cement',
    priority: 'normal', createdAt: '2024-01-16T14:30:00Z', eventId: 'evt-stock-cement'
  },
  {
    id: 'ntf-005', userId: 'user-015', userName: 'Ravi Sharma', category: 'TASK_ASSIGNED', categoryName: 'Task Assigned',
    title: 'New task: Submit DPR for 2024-01-17',
    body: 'Submit daily progress report for 2024-01-17. Due: 2024-01-17 18:00.',
    entityType: 'DPR', entityId: 'dpr-2024-01-17', link: '/project/dpr/dpr-2024-01-17',
    priority: 'normal', createdAt: '2024-01-16T18:00:00Z', eventId: 'evt-dpr-0117'
  },
  {
    id: 'ntf-006', userId: 'user-015', userName: 'Ravi Sharma', category: 'EXCEPTION_REQUESTED', categoryName: 'Exception Requested',
    title: 'Emergency exception EXC-2024-003 requires regularisation',
    body: 'Emergency approval EXC-2024-003 must be regularised by 2024-01-17 18:00. Amount: ₹12.5L.',
    entityType: 'Exception', entityId: 'exc-003', link: '/protocol/exceptions/exc-003',
    priority: 'critical', createdAt: '2024-01-16T08:30:00Z', eventId: 'evt-exc-003'
  },
  {
    id: 'ntf-007', userId: 'user-020', userName: 'Amit Shah', category: 'VIOLATION_RAISED', categoryName: 'Violation Raised',
    title: 'Violation VIOL-2024-001 requires resolution',
    body: 'Approval limit violation detected for PO-2024-0893. Please resolve by 2024-01-18.',
    entityType: 'Violation', entityId: 'viol-001', link: '/protocol/violations/viol-001',
    priority: 'high', createdAt: '2024-01-16T11:30:00Z', eventId: 'evt-viol-001'
  },
  {
    id: 'ntf-008', userId: 'user-022', userName: 'Vikram Desai', category: 'BILL_SUBMITTED', categoryName: 'Bill Submitted',
    title: 'Bill B-449 submitted for verification',
    body: 'Subcontractor bill B-449 (₹15.2L) submitted by Raj Constructions for December work.',
    entityType: 'Bill', entityId: 'bill-449', link: '/finance/bills/bill-449',
    priority: 'normal', createdAt: '2024-01-16T09:00:00Z', eventId: 'evt-bill-449'
  },
  {
    id: 'ntf-009', userId: 'user-001', userName: 'Rajesh Kumar', category: 'SAFETY_INCIDENT', categoryName: 'Safety Incident',
    title: 'Safety incident SI-2024-015 reported',
    body: 'Safety incident SI-2024-015 reported at Metro Tower Site A. Severity: Medium. Immediate attention required.',
    entityType: 'SafetyIncident', entityId: 'si-015', link: '/safety/incidents/si-015',
    priority: 'critical', createdAt: '2024-01-16T15:00:00Z', eventId: 'evt-si-015'
  },
  {
    id: 'ntf-010', userId: 'user-010', userName: 'Rajesh Kumar', category: 'APPROVAL_COMPLETED', categoryName: 'Approval Completed',
    title: 'Exception EXC-2024-001 approved',
    body: 'Your exception request EXC-2024-001 for material excess has been approved.',
    entityType: 'Exception', entityId: 'exc-001', link: '/protocol/exceptions/exc-001',
    priority: 'normal', readAt: '2024-01-16T15:30:00Z', createdAt: '2024-01-16T15:00:00Z', eventId: 'evt-exc-001'
  },
];

// ===== USER PREFERENCES =====
export const userPreferences: UserPreference[] = [
  { id: 'pref-001', userId: 'user-010', userName: 'Rajesh Kumar', category: 'APPROVAL_REQUIRED', categoryName: 'Approval Required', channels: ['in_app', 'email', 'push'], digest: 'none', updatedAt: '2024-01-01' },
  { id: 'pref-002', userId: 'user-010', userName: 'Rajesh Kumar', category: 'TASK_OVERDUE', categoryName: 'Task Overdue', channels: ['in_app', 'email'], digest: 'daily', quietHoursStart: '22:00', quietHoursEnd: '07:00', updatedAt: '2024-01-01' },
  { id: 'pref-003', userId: 'user-010', userName: 'Rajesh Kumar', category: 'PO_CREATED', categoryName: 'Purchase Order Created', channels: ['in_app'], digest: 'none', updatedAt: '2024-01-01' },
  { id: 'pref-004', userId: 'user-015', userName: 'Ravi Sharma', category: 'TASK_ASSIGNED', categoryName: 'Task Assigned', channels: ['in_app', 'push'], digest: 'none', updatedAt: '2024-01-01' },
  { id: 'pref-005', userId: 'user-015', userName: 'Ravi Sharma', category: 'STOCK_LOW', categoryName: 'Stock Low Alert', channels: ['in_app', 'email'], digest: 'daily', updatedAt: '2024-01-01' },
  { id: 'pref-006', userId: 'user-020', userName: 'Amit Shah', category: 'VIOLATION_RAISED', categoryName: 'Violation Raised', channels: ['in_app', 'email', 'sms'], digest: 'none', updatedAt: '2024-01-01' },
];

// ===== DELIVERIES =====
export const deliveries: Delivery[] = [
  { id: 'del-001', notificationId: 'ntf-001', channel: 'in_app', provider: 'internal', status: 'delivered', attempts: 1, sentAt: '2024-01-16T10:00:00Z', deliveredAt: '2024-01-16T10:00:01Z' },
  { id: 'del-002', notificationId: 'ntf-001', channel: 'email', provider: 'sendgrid', status: 'delivered', attempts: 1, providerRef: 'msg-12345', sentAt: '2024-01-16T10:00:02Z', deliveredAt: '2024-01-16T10:00:05Z' },
  { id: 'del-003', notificationId: 'ntf-002', channel: 'in_app', provider: 'internal', status: 'delivered', attempts: 1, sentAt: '2024-01-16T16:00:00Z', deliveredAt: '2024-01-16T16:00:01Z' },
  { id: 'del-004', notificationId: 'ntf-002', channel: 'email', provider: 'sendgrid', status: 'sent', attempts: 1, providerRef: 'msg-12346', sentAt: '2024-01-16T16:00:02Z' },
  { id: 'del-005', notificationId: 'ntf-006', channel: 'in_app', provider: 'internal', status: 'delivered', attempts: 1, sentAt: '2024-01-16T08:30:00Z', deliveredAt: '2024-01-16T08:30:01Z' },
  { id: 'del-006', notificationId: 'ntf-006', channel: 'push', provider: 'firebase', status: 'delivered', attempts: 1, providerRef: 'push-789', sentAt: '2024-01-16T08:30:02Z', deliveredAt: '2024-01-16T08:30:03Z' },
  { id: 'del-007', notificationId: 'ntf-007', channel: 'in_app', provider: 'internal', status: 'delivered', attempts: 1, sentAt: '2024-01-16T11:30:00Z', deliveredAt: '2024-01-16T11:30:01Z' },
  { id: 'del-008', notificationId: 'ntf-007', channel: 'email', provider: 'sendgrid', status: 'failed', attempts: 3, error: 'SMTP timeout', sentAt: '2024-01-16T11:30:02Z' },
  { id: 'del-009', notificationId: 'ntf-009', channel: 'in_app', provider: 'internal', status: 'delivered', attempts: 1, sentAt: '2024-01-16T15:00:00Z', deliveredAt: '2024-01-16T15:00:01Z' },
  { id: 'del-010', notificationId: 'ntf-009', channel: 'sms', provider: 'twilio', status: 'delivered', attempts: 1, providerRef: 'sms-456', sentAt: '2024-01-16T15:00:02Z', deliveredAt: '2024-01-16T15:00:05Z' },
];

// ===== BROADCASTS =====
export const broadcasts: Broadcast[] = [
  {
    id: 'bc-001', title: 'System Maintenance Scheduled',
    body: 'The system will be down for maintenance on 2024-01-20 from 02:00 to 06:00 IST. Please save your work.',
    scope: 'company', priority: 'high', channels: ['in_app', 'email'],
    createdBy: 'user-001', createdByName: 'Rajesh Kumar', createdAt: '2024-01-16T10:00:00Z',
    recipientCount: 156, deliveredCount: 156, readCount: 142
  },
  {
    id: 'bc-002', title: 'Metro Tower Phase II - Progress Update',
    body: 'Project has achieved 67% completion. Excellent progress by the team. Keep up the good work!',
    scope: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    priority: 'normal', channels: ['in_app'],
    createdBy: 'user-010', createdByName: 'Rajesh Kumar', createdAt: '2024-01-15T14:00:00Z',
    recipientCount: 24, deliveredCount: 24, readCount: 18
  },
];

// ===== ROOMS =====
export const rooms: Room[] = [
  { id: 'room-001', type: 'user', name: 'user:user-010', memberCount: 1, lastActivity: '2024-01-16T15:45:00Z' },
  { id: 'room-002', type: 'project', name: 'project:prj-001', memberCount: 24, lastActivity: '2024-01-16T15:30:00Z' },
  { id: 'room-003', type: 'site', name: 'site:site-001', memberCount: 8, lastActivity: '2024-01-16T15:40:00Z' },
  { id: 'room-004', type: 'dept', name: 'dept:dept-001', memberCount: 12, lastActivity: '2024-01-16T14:00:00Z' },
  { id: 'room-005', type: 'doc', name: 'doc:PurchaseOrder:po-089', memberCount: 3, lastActivity: '2024-01-16T11:30:00Z' },
];

// ===== PRESENCE =====
export const presence: Presence[] = [
  { userId: 'user-010', userName: 'Rajesh Kumar', entityType: 'PurchaseOrder', entityId: 'po-089', joinedAt: '2024-01-16T11:00:00Z', lastSeenAt: '2024-01-16T11:30:00Z', isActive: true },
  { userId: 'user-020', userName: 'Amit Shah', entityType: 'PurchaseOrder', entityId: 'po-089', joinedAt: '2024-01-16T11:05:00Z', lastSeenAt: '2024-01-16T11:25:00Z', isActive: true },
  { userId: 'user-015', userName: 'Ravi Sharma', entityType: 'DPR', entityId: 'dpr-2024-01-16', joinedAt: '2024-01-16T17:00:00Z', lastSeenAt: '2024-01-16T17:30:00Z', isActive: true },
  { userId: 'user-021', userName: 'Neha Gupta', entityType: 'GRN', entityId: 'grn-001', joinedAt: '2024-01-16T09:30:00Z', lastSeenAt: '2024-01-16T09:45:00Z', isActive: false },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-RT-01', stage: 'MONITOR', control: 'Escalation notifications (PC-9) are mandatory categories and cannot be muted', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-RT-02', stage: 'MONITOR', control: 'Undelivered critical notifications retried on alternate channel', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getNotificationStats(userId: string): { total: number; unread: number; high: number; critical: number } {
  const userNotifs = notifications.filter(n => n.userId === userId);
  return {
    total: userNotifs.length,
    unread: userNotifs.filter(n => !n.readAt).length,
    high: userNotifs.filter(n => n.priority === 'high' && !n.readAt).length,
    critical: userNotifs.filter(n => n.priority === 'critical' && !n.readAt).length,
  };
}

export function getDeliveryStats(): { total: number; delivered: number; failed: number; pending: number } {
  return {
    total: deliveries.length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    failed: deliveries.filter(d => d.status === 'failed').length,
    pending: deliveries.filter(d => d.status === 'queued' || d.status === 'sent').length,
  };
}

export function getCategoryStats(): Record<string, number> {
  return notifications.reduce((acc, n) => {
    acc[n.category] = (acc[n.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
