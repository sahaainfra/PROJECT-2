// Part 28 — Automation & Alert Engine
// Configurable rules engine for alerts, tasks, and escalations

export type AlertTriggerType = 'event' | 'schedule' | 'threshold';
export type AlertAction = 'notify' | 'create_task' | 'escalate' | 'webhook';
export type AlertSeverity = 'information' | 'action_required' | 'warning' | 'critical' | 'escalation';
export type AlertStatus = 'open' | 'acknowledged' | 'snoozed' | 'resolved';
export type AlertCategory = 'approval' | 'contract' | 'stock' | 'payment' | 'task' | 'project' | 'budget' | 'quality' | 'safety' | 'document' | 'equipment' | 'attendance' | 'protocol';

export interface AlertRule {
  id: string;
  code: string;
  name: string;
  module: string;
  category: AlertCategory;
  triggerType: AlertTriggerType;
  eventName?: string;
  cron?: string;
  conditionJson: Record<string, any>;
  audienceRule: string;
  action: AlertAction;
  templateCode: string;
  severity: AlertSeverity;
  dedupeKeyExpr: string;
  snoozeAllowed: boolean;
  isEnabled: boolean;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  lastFiredAt?: string;
  fireCount: number;
}

export interface AlertInstance {
  id: string;
  ruleCode: string;
  ruleName: string;
  entityType: string;
  entityId: string;
  entityRef?: string;
  firedAt: string;
  severity: AlertSeverity;
  status: AlertStatus;
  snoozeUntil?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  message: string;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
  assigneeId?: string;
  assigneeName?: string;
  taskId?: string;
  correlationId: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== ALERT RULES =====
export const alertRules: AlertRule[] = [
  // Approval Overdue
  {
    id: 'rule-001', code: 'APPROVAL_OVERDUE', name: 'Approval SLA Breach',
    module: 'workflow', category: 'approval', triggerType: 'schedule',
    cron: '0 */2 * * *', // Every 2 hours
    conditionJson: { entity: 'workflow_task', field: 'status', operator: 'eq', value: 'pending', and: { field: 'due_at', operator: 'lt', value: 'now' } },
    audienceRule: 'assignee', action: 'notify', templateCode: 'TPL-APPROVAL-OVERDUE',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T14:00:00Z', fireCount: 45
  },
  
  // Contract Expiry
  {
    id: 'rule-002', code: 'CONTRACT_EXPIRY_60', name: 'Contract Expiring in 60 Days',
    module: 'procurement', category: 'contract', triggerType: 'schedule',
    cron: '0 9 * * *', // Daily at 9 AM
    conditionJson: { entity: 'contract', field: 'end_date', operator: 'between', value: ['now+60d', 'now+61d'] },
    audienceRule: 'project_manager', action: 'notify', templateCode: 'TPL-CONTRACT-EXPIRY',
    severity: 'information', dedupeKeyExpr: '${entityType}:${entityId}:60d', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-020', ownerName: 'Amit Shah',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T09:00:00Z', fireCount: 12
  },
  {
    id: 'rule-003', code: 'CONTRACT_EXPIRY_30', name: 'Contract Expiring in 30 Days',
    module: 'procurement', category: 'contract', triggerType: 'schedule',
    cron: '0 9 * * *',
    conditionJson: { entity: 'contract', field: 'end_date', operator: 'between', value: ['now+30d', 'now+31d'] },
    audienceRule: 'project_manager', action: 'notify', templateCode: 'TPL-CONTRACT-EXPIRY',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:30d', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-020', ownerName: 'Amit Shah',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T09:00:00Z', fireCount: 8
  },
  {
    id: 'rule-004', code: 'CONTRACT_EXPIRY_15', name: 'Contract Expiring in 15 Days',
    module: 'procurement', category: 'contract', triggerType: 'schedule',
    cron: '0 9 * * *',
    conditionJson: { entity: 'contract', field: 'end_date', operator: 'between', value: ['now+15d', 'now+16d'] },
    audienceRule: 'project_manager,commercial_manager', action: 'notify', templateCode: 'TPL-CONTRACT-EXPIRY',
    severity: 'critical', dedupeKeyExpr: '${entityType}:${entityId}:15d', snoozeAllowed: false,
    isEnabled: true, ownerId: 'user-020', ownerName: 'Amit Shah',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T09:00:00Z', fireCount: 3
  },
  
  // Stock Alerts
  {
    id: 'rule-005', code: 'STOCK_BELOW_REORDER', name: 'Stock Below Reorder Level',
    module: 'inventory', category: 'stock', triggerType: 'event',
    eventName: 'stock.level_changed',
    conditionJson: { entity: 'stock', field: 'current_qty', operator: 'lt', value: '${reorder_level}' },
    audienceRule: 'store_keeper,project_manager', action: 'notify', templateCode: 'TPL-STOCK-LOW',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:reorder', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-021', ownerName: 'Neha Gupta',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T15:30:00Z', fireCount: 28
  },
  {
    id: 'rule-006', code: 'STOCK_CRITICAL', name: 'Critical Stock Out',
    module: 'inventory', category: 'stock', triggerType: 'event',
    eventName: 'stock.level_changed',
    conditionJson: { entity: 'stock', field: 'current_qty', operator: 'lte', value: '${critical_level}' },
    audienceRule: 'store_keeper,project_manager,procurement_manager', action: 'create_task', templateCode: 'TPL-STOCK-CRITICAL',
    severity: 'critical', dedupeKeyExpr: '${entityType}:${entityId}:critical', snoozeAllowed: false,
    isEnabled: true, ownerId: 'user-021', ownerName: 'Neha Gupta',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T16:00:00Z', fireCount: 5
  },
  
  // Payment Alerts
  {
    id: 'rule-007', code: 'PAYMENT_DUE_7D', name: 'Vendor Payment Due in 7 Days',
    module: 'finance', category: 'payment', triggerType: 'schedule',
    cron: '0 9 * * *',
    conditionJson: { entity: 'payment', field: 'due_date', operator: 'between', value: ['now+7d', 'now+8d'], status: 'pending' },
    audienceRule: 'accounts_manager', action: 'notify', templateCode: 'TPL-PAYMENT-DUE',
    severity: 'information', dedupeKeyExpr: '${entityType}:${entityId}:7d', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-022', ownerName: 'Vikram Desai',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T09:00:00Z', fireCount: 15
  },
  {
    id: 'rule-008', code: 'RECEIVABLE_OVERDUE_60', name: 'Receivable Overdue 60 Days',
    module: 'finance', category: 'payment', triggerType: 'schedule',
    cron: '0 9 * * *',
    conditionJson: { entity: 'invoice', field: 'due_date', operator: 'lt', value: 'now-60d', status: 'unpaid' },
    audienceRule: 'accounts_manager,finance_manager', action: 'escalate', templateCode: 'TPL-RECEIVABLE-OVERDUE',
    severity: 'critical', dedupeKeyExpr: '${entityType}:${entityId}:60d', snoozeAllowed: false,
    isEnabled: true, ownerId: 'user-022', ownerName: 'Vikram Desai',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T09:00:00Z', fireCount: 7
  },
  
  // Task Alerts
  {
    id: 'rule-009', code: 'TASK_OVERDUE', name: 'Task Overdue',
    module: 'task', category: 'task', triggerType: 'schedule',
    cron: '0 */4 * * *', // Every 4 hours
    conditionJson: { entity: 'task', field: 'status', operator: 'in', value: ['open', 'in_progress'], and: { field: 'due_date', operator: 'lt', value: 'now' } },
    audienceRule: 'assignee,manager', action: 'notify', templateCode: 'TPL-TASK-OVERDUE',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:overdue', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T16:00:00Z', fireCount: 156
  },
  
  // Project Alerts
  {
    id: 'rule-010', code: 'MILESTONE_SLIP', name: 'Project Milestone Slip > 7 Days',
    module: 'project', category: 'project', triggerType: 'event',
    eventName: 'milestone.updated',
    conditionJson: { entity: 'milestone', field: 'variance_days', operator: 'gt', value: 7 },
    audienceRule: 'project_manager,planning_manager', action: 'notify', templateCode: 'TPL-MILESTONE-SLIP',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:slip', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-010', ownerName: 'Rajesh Kumar',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-15T10:00:00Z', fireCount: 4
  },
  
  // Budget Alerts
  {
    id: 'rule-011', code: 'BUDGET_UTILIZATION_90', name: 'Budget Utilization > 90%',
    module: 'finance', category: 'budget', triggerType: 'event',
    eventName: 'budget.utilization_changed',
    conditionJson: { entity: 'budget', field: 'utilization_pct', operator: 'gte', value: 90 },
    audienceRule: 'project_manager,commercial_manager', action: 'notify', templateCode: 'TPL-BUDGET-HIGH',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:90', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-022', ownerName: 'Vikram Desai',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T11:00:00Z', fireCount: 18
  },
  {
    id: 'rule-012', code: 'CPI_BELOW_0.9', name: 'Cost Performance Index < 0.9',
    module: 'finance', category: 'budget', triggerType: 'event',
    eventName: 'kpi.calculated',
    conditionJson: { entity: 'kpi', field: 'cpi', operator: 'lt', value: 0.9 },
    audienceRule: 'project_manager,commercial_manager,finance_manager', action: 'escalate', templateCode: 'TPL-CPI-LOW',
    severity: 'critical', dedupeKeyExpr: '${entityType}:${entityId}:cpi', snoozeAllowed: false,
    isEnabled: true, ownerId: 'user-022', ownerName: 'Vikram Desai',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-14T15:00:00Z', fireCount: 2
  },
  
  // Quality Alerts
  {
    id: 'rule-013', code: 'NCR_OPEN_15D', name: 'NCR Open > 15 Days',
    module: 'quality', category: 'quality', triggerType: 'schedule',
    cron: '0 9 * * *',
    conditionJson: { entity: 'ncr', field: 'status', operator: 'eq', value: 'open', and: { field: 'raised_date', operator: 'lt', value: 'now-15d' } },
    audienceRule: 'qa_manager,project_manager', action: 'notify', templateCode: 'TPL-NCR-OVERDUE',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:15d', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-026', ownerName: 'Krishna Rao',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T09:00:00Z', fireCount: 9
  },
  
  // Safety Alerts
  {
    id: 'rule-014', code: 'HSE_INCIDENT', name: 'HSE Incident Reported',
    module: 'safety', category: 'safety', triggerType: 'event',
    eventName: 'incident.created',
    conditionJson: { entity: 'incident', field: 'severity', operator: 'in', value: ['high', 'critical'] },
    audienceRule: 'hse_manager,project_manager,site_manager', action: 'notify', templateCode: 'TPL-HSE-INCIDENT',
    severity: 'critical', dedupeKeyExpr: '${entityType}:${entityId}', snoozeAllowed: false,
    isEnabled: true, ownerId: 'user-027', ownerName: 'HSE Manager',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T15:00:00Z', fireCount: 3
  },
  
  // Document Alerts
  {
    id: 'rule-015', code: 'DOCUMENT_REVIEW_OVERDUE', name: 'Document Review Overdue',
    module: 'document', category: 'document', triggerType: 'schedule',
    cron: '0 */6 * * *', // Every 6 hours
    conditionJson: { entity: 'document_review', field: 'status', operator: 'eq', value: 'pending', and: { field: 'due_date', operator: 'lt', value: 'now' } },
    audienceRule: 'reviewer', action: 'notify', templateCode: 'TPL-DOC-REVIEW-OVERDUE',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:review', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T12:00:00Z', fireCount: 23
  },
  
  // Equipment Alerts
  {
    id: 'rule-016', code: 'EQUIPMENT_PM_DUE', name: 'Equipment Preventive Maintenance Due',
    module: 'equipment', category: 'equipment', triggerType: 'schedule',
    cron: '0 9 * * *',
    conditionJson: { entity: 'equipment', field: 'next_pm_date', operator: 'between', value: ['now', 'now+7d'] },
    audienceRule: 'equipment_manager,site_manager', action: 'create_task', templateCode: 'TPL-EQUIPMENT-PM',
    severity: 'information', dedupeKeyExpr: '${entityType}:${entityId}:pm', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-019', ownerName: 'Ramesh Iyer',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T09:00:00Z', fireCount: 11
  },
  
  // Attendance Alerts
  {
    id: 'rule-017', code: 'ATTENDANCE_ANOMALY', name: 'Attendance Anomaly Detected',
    module: 'hr', category: 'attendance', triggerType: 'event',
    eventName: 'attendance.anomaly_detected',
    conditionJson: { entity: 'attendance', field: 'anomaly_score', operator: 'gt', value: 0.8 },
    audienceRule: 'hr_manager,project_manager', action: 'notify', templateCode: 'TPL-ATTENDANCE-ANOMALY',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:${date}', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-023', ownerName: 'Kavita Nair',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T08:00:00Z', fireCount: 6
  },
  
  // Protocol Alerts
  {
    id: 'rule-018', code: 'PROTOCOL_VIOLATION_REPEATED', name: 'Protocol Violation Repeated',
    module: 'protocol', category: 'protocol', triggerType: 'event',
    eventName: 'protocol.violation_raised',
    conditionJson: { entity: 'violation', field: 'actor_id', operator: 'count_recent', value: { period: '7d', min: 3 } },
    audienceRule: 'protocol_officer,project_manager', action: 'escalate', templateCode: 'TPL-PROTOCOL-REPEATED',
    severity: 'critical', dedupeKeyExpr: '${actorId}:violations:7d', snoozeAllowed: false,
    isEnabled: true, ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-15T14:00:00Z', fireCount: 2
  },
  {
    id: 'rule-019', code: 'EXCEPTION_PENDING_SLA', name: 'Exception Pending > SLA',
    module: 'protocol', category: 'protocol', triggerType: 'schedule',
    cron: '0 */4 * * *',
    conditionJson: { entity: 'exception', status: 'pending', requested_at: 'lt:now-${sla_hours}h' },
    audienceRule: 'approver,protocol_officer', action: 'escalate', templateCode: 'TPL-EXCEPTION-OVERDUE',
    severity: 'warning', dedupeKeyExpr: '${entityType}:${entityId}:sla', snoozeAllowed: true,
    isEnabled: true, ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T16:00:00Z', fireCount: 8
  },
  {
    id: 'rule-020', code: 'EMERGENCY_NOT_REGULARISED', name: 'Emergency Not Regularised',
    module: 'protocol', category: 'protocol', triggerType: 'schedule',
    cron: '0 */2 * * *',
    conditionJson: { entity: 'exception', is_emergency: true, status: 'executed_pending_regularisation', regularise_by: 'lt:now' },
    audienceRule: 'requester,project_manager,protocol_officer', action: 'escalate', templateCode: 'TPL-EMERGENCY-OVERDUE',
    severity: 'critical', dedupeKeyExpr: '${entityType}:${entityId}:emergency', snoozeAllowed: false,
    isEnabled: true, ownerId: 'user-001', ownerName: 'Rajesh Kumar',
    createdAt: '2024-01-01', updatedAt: '2024-01-01', lastFiredAt: '2024-01-16T18:00:00Z', fireCount: 1
  },
];

// ===== ALERT INSTANCES =====
export const alertInstances: AlertInstance[] = [
  {
    id: 'alert-001', ruleCode: 'APPROVAL_OVERDUE', ruleName: 'Approval SLA Breach',
    entityType: 'WorkflowTask', entityId: 'task-002', entityRef: 'PO-2024-0894',
    firedAt: '2024-01-16T14:00:00Z', severity: 'warning', status: 'open',
    message: 'Purchase Order PO-2024-0894 approval is overdue by 2 hours',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    assigneeId: 'user-010', assigneeName: 'Rajesh Kumar',
    correlationId: 'corr-alert-001'
  },
  {
    id: 'alert-002', ruleCode: 'STOCK_CRITICAL', ruleName: 'Critical Stock Out',
    entityType: 'Stock', entityId: 'mat-cement', entityRef: 'OPC 53 Grade Cement',
    firedAt: '2024-01-16T16:00:00Z', severity: 'critical', status: 'acknowledged',
    acknowledgedAt: '2024-01-16T16:15:00Z', acknowledgedBy: 'user-021',
    message: 'Cement stock at Site A is critically low (50 bags, minimum 200)',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    assigneeId: 'user-021', assigneeName: 'Neha Gupta', taskId: 'task-009',
    correlationId: 'corr-alert-002'
  },
  {
    id: 'alert-003', ruleCode: 'CONTRACT_EXPIRY_30', ruleName: 'Contract Expiring in 30 Days',
    entityType: 'Contract', entityId: 'contract-005', entityRef: 'Steel Supply Contract',
    firedAt: '2024-01-16T09:00:00Z', severity: 'warning', status: 'open',
    message: 'Steel supply contract with Steel India Ltd. expires in 30 days',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    assigneeId: 'user-020', assigneeName: 'Amit Shah',
    correlationId: 'corr-alert-003'
  },
  {
    id: 'alert-004', ruleCode: 'TASK_OVERDUE', ruleName: 'Task Overdue',
    entityType: 'Task', entityId: 'task-006', entityRef: 'TSK-2024-006',
    firedAt: '2024-01-16T16:00:00Z', severity: 'warning', status: 'open',
    message: 'Task "Rectify water seepage at basement level" is overdue by 1 day',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    assigneeId: 'user-015', assigneeName: 'Ravi Sharma',
    correlationId: 'corr-alert-004'
  },
  {
    id: 'alert-005', ruleCode: 'BUDGET_UTILIZATION_90', ruleName: 'Budget Utilization > 90%',
    entityType: 'Budget', entityId: 'budget-prj-001', entityRef: 'Metro Tower Phase II Budget',
    firedAt: '2024-01-16T11:00:00Z', severity: 'warning', status: 'resolved',
    resolvedAt: '2024-01-16T14:00:00Z', resolvedBy: 'user-022',
    message: 'Project budget utilization has reached 92%',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    assigneeId: 'user-010', assigneeName: 'Rajesh Kumar',
    correlationId: 'corr-alert-005'
  },
  {
    id: 'alert-006', ruleCode: 'HSE_INCIDENT', ruleName: 'HSE Incident Reported',
    entityType: 'Incident', entityId: 'incident-015', entityRef: 'SI-2024-015',
    firedAt: '2024-01-16T15:00:00Z', severity: 'critical', status: 'acknowledged',
    acknowledgedAt: '2024-01-16T15:05:00Z', acknowledgedBy: 'user-027',
    message: 'High severity safety incident reported at Metro Tower Site A',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    assigneeId: 'user-027', assigneeName: 'HSE Manager',
    correlationId: 'corr-alert-006'
  },
  {
    id: 'alert-007', ruleCode: 'NCR_OPEN_15D', ruleName: 'NCR Open > 15 Days',
    entityType: 'NCR', entityId: 'ncr-012', entityRef: 'NCR-2024-012',
    firedAt: '2024-01-16T09:00:00Z', severity: 'warning', status: 'snoozed',
    snoozeUntil: '2024-01-17T09:00:00Z',
    message: 'Non-conformance report NCR-2024-012 has been open for 18 days',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    assigneeId: 'user-026', assigneeName: 'Krishna Rao',
    correlationId: 'corr-alert-007'
  },
  {
    id: 'alert-008', ruleCode: 'EXCEPTION_PENDING_SLA', ruleName: 'Exception Pending > SLA',
    entityType: 'Exception', entityId: 'exc-002', entityRef: 'EXC-2024-002',
    firedAt: '2024-01-16T16:00:00Z', severity: 'warning', status: 'open',
    message: 'Exception EXC-2024-002 has been pending approval for 26 hours (SLA: 24 hours)',
    projectId: 'prj-002', projectName: 'Highway Bridge NH-48',
    assigneeId: 'user-011', assigneeName: 'Suresh Patel',
    correlationId: 'corr-alert-008'
  },
  {
    id: 'alert-009', ruleCode: 'DOCUMENT_REVIEW_OVERDUE', ruleName: 'Document Review Overdue',
    entityType: 'DocumentReview', entityId: 'review-003', entityRef: 'MT-MEP-DWG-001',
    firedAt: '2024-01-16T12:00:00Z', severity: 'warning', status: 'open',
    message: 'Document review for MT-MEP-DWG-001 is overdue by 6 hours',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    assigneeId: 'user-025', assigneeName: 'Anil Mehta',
    correlationId: 'corr-alert-009'
  },
  {
    id: 'alert-010', ruleCode: 'EQUIPMENT_PM_DUE', ruleName: 'Equipment Preventive Maintenance Due',
    entityType: 'Equipment', entityId: 'equip-005', entityRef: 'Crane HC-05',
    firedAt: '2024-01-16T09:00:00Z', severity: 'information', status: 'resolved',
    resolvedAt: '2024-01-16T10:00:00Z', resolvedBy: 'user-019',
    message: 'Preventive maintenance for Crane HC-05 is due within 7 days',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    assigneeId: 'user-019', assigneeName: 'Ramesh Iyer', taskId: 'task-010',
    correlationId: 'corr-alert-010'
  },
];

// ===== PROTOCOL CONTROL POINT =====
export const protocolControlPoint: ProtocolControlPoint = {
  id: 'CP-ALT-01',
  stage: 'MONITOR',
  control: 'Protocol violations, exceptions and findings are alert sources with PC-9 ladders',
  enforcement: 'MONITOR',
  status: 'OBSERVE',
};

// ===== HELPER FUNCTIONS =====
export function getAlertRuleStats(): { total: number; enabled: number; byCategory: Record<AlertCategory, number> } {
  const byCategory = alertRules.reduce((acc, rule) => {
    acc[rule.category] = (acc[rule.category] || 0) + 1;
    return acc;
  }, {} as Record<AlertCategory, number>);

  return {
    total: alertRules.length,
    enabled: alertRules.filter(r => r.isEnabled).length,
    byCategory,
  };
}

export function getAlertInstanceStats(): { total: number; open: number; acknowledged: number; snoozed: number; resolved: number; bySeverity: Record<AlertSeverity, number> } {
  const bySeverity = alertInstances.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<AlertSeverity, number>);

  return {
    total: alertInstances.length,
    open: alertInstances.filter(a => a.status === 'open').length,
    acknowledged: alertInstances.filter(a => a.status === 'acknowledged').length,
    snoozed: alertInstances.filter(a => a.status === 'snoozed').length,
    resolved: alertInstances.filter(a => a.status === 'resolved').length,
    bySeverity,
  };
}

export function getAlertsByStatus(status: AlertStatus): AlertInstance[] {
  return alertInstances.filter(a => a.status === status);
}

export function getAlertsBySeverity(severity: AlertSeverity): AlertInstance[] {
  return alertInstances.filter(a => a.severity === severity);
}

export function getAlertsByCategory(category: AlertCategory): AlertInstance[] {
  const ruleCodes = alertRules.filter(r => r.category === category).map(r => r.code);
  return alertInstances.filter(a => ruleCodes.includes(a.ruleCode));
}

export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-100 border-red-200';
    case 'escalation': return 'text-purple-600 bg-purple-100 border-purple-200';
    case 'warning': return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'action_required': return 'text-orange-600 bg-orange-100 border-orange-200';
    case 'information': return 'text-blue-600 bg-blue-100 border-blue-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

export function getStatusColor(status: AlertStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'resolved': return 'success';
    case 'acknowledged': return 'info';
    case 'snoozed': return 'warning';
    case 'open': return 'error';
    default: return 'neutral';
  }
}
