// Part 15 — Accountability, Responsibility Assignment & Action Ledger
// RACI management, action tracking, and compliance scoring

export type ScopeType = 'company' | 'department' | 'project' | 'site' | 'wbs_node' | 'process';
export type ProcessCode = 'MATERIAL_ISSUE' | 'DPR' | 'PO_APPROVAL' | 'MB_CERTIFICATION' | 'BILL_CERTIFICATION' | 'PAYMENT' | 'ATTENDANCE' | 'INSPECTION' | 'SAFETY_INCIDENT';
export type ActionType = 'CREATED' | 'SUBMITTED' | 'VERIFIED' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'MODIFIED' | 'EXECUTED' | 'RECORDED' | 'RECONCILED' | 'CLOSED' | 'CANCELLED' | 'REVERSED' | 'EXCEPTION_REQUESTED' | 'EXCEPTION_APPROVED';
export type SubjectType = 'user' | 'role' | 'site' | 'project' | 'department';
export type RACIRole = 'responsible' | 'accountable' | 'consulted' | 'informed';

export interface RACIAssignment {
  id: string;
  scopeType: ScopeType;
  scopeId: string;
  scopeName: string;
  processCode: ProcessCode;
  processName: string;
  responsibleUserId: string;
  responsibleUserName: string;
  accountableUserId: string;
  accountableUserName: string;
  consultedUserIds: string[];
  consultedUserNames: string[];
  informedUserIds: string[];
  informedUserNames: string[];
  validFrom: string;
  validTo?: string;
  assignedBy: string;
  assignedByName: string;
  createdAt: string;
}

export interface ActionLedgerEntry {
  id: string;
  entityType: string;
  entityId: string;
  docNo: string;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
  departmentId?: string;
  action: ActionType;
  actorId: string;
  actorName: string;
  actorRole: string;
  onBehalfOf?: string;
  at: string;
  deviceId?: string;
  lat?: number;
  lng?: number;
  reasonCode?: string;
  narrative?: string;
  auditId?: string;
  workflowTaskId?: string;
  protocolEvaluationId?: string;
}

export interface ProcessCatalogue {
  id: string;
  processCode: ProcessCode;
  module: string;
  description: string;
  requiresRACI: boolean;
  requiresIndependentAccountability: boolean;
}

export interface ComplianceScore {
  id: string;
  subjectType: SubjectType;
  subjectId: string;
  subjectName: string;
  period: string;
  score: number;
  components: {
    onTimeCompletion: number;
    qualityScore: number;
    complianceRate: number;
    exceptionRate: number;
    violationCount: number;
  };
  calculatedAt: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ResponsibilityItem {
  id: string;
  userId: string;
  userName: string;
  itemType: 'task' | 'approval' | 'exception' | 'violation' | 'overdue_record';
  entityType: string;
  entityId: string;
  docNo: string;
  description: string;
  dueAt: string;
  isOverdue: boolean;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== PROCESS CATALOGUE =====
export const processCatalogue: ProcessCatalogue[] = [
  { id: 'proc-001', processCode: 'MATERIAL_ISSUE', module: 'inventory', description: 'Material issue from store to site', requiresRACI: true, requiresIndependentAccountability: true },
  { id: 'proc-002', processCode: 'DPR', module: 'project', description: 'Daily progress report submission', requiresRACI: true, requiresIndependentAccountability: false },
  { id: 'proc-003', processCode: 'PO_APPROVAL', module: 'procurement', description: 'Purchase order approval', requiresRACI: true, requiresIndependentAccountability: false },
  { id: 'proc-004', processCode: 'MB_CERTIFICATION', module: 'project', description: 'Measurement book certification', requiresRACI: true, requiresIndependentAccountability: true },
  { id: 'proc-005', processCode: 'BILL_CERTIFICATION', module: 'finance', description: 'Subcontractor bill certification', requiresRACI: true, requiresIndependentAccountability: true },
  { id: 'proc-006', processCode: 'PAYMENT', module: 'finance', description: 'Payment processing', requiresRACI: true, requiresIndependentAccountability: true },
  { id: 'proc-007', processCode: 'ATTENDANCE', module: 'hr', description: 'Attendance marking', requiresRACI: true, requiresIndependentAccountability: false },
  { id: 'proc-008', processCode: 'INSPECTION', module: 'quality', description: 'Quality inspection', requiresRACI: true, requiresIndependentAccountability: false },
  { id: 'proc-009', processCode: 'SAFETY_INCIDENT', module: 'safety', description: 'Safety incident reporting', requiresRACI: true, requiresIndependentAccountability: false },
];

// ===== RACI ASSIGNMENTS =====
export const raciAssignments: RACIAssignment[] = [
  {
    id: 'raci-001', scopeType: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    processCode: 'MATERIAL_ISSUE', processName: 'Material Issue',
    responsibleUserId: 'user-015', responsibleUserName: 'Ravi Sharma',
    accountableUserId: 'user-010', accountableUserName: 'Rajesh Kumar',
    consultedUserIds: ['user-021'], consultedUserNames: ['Neha Gupta'],
    informedUserIds: ['user-022'], informedUserNames: ['Vikram Desai'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
  {
    id: 'raci-002', scopeType: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    processCode: 'DPR', processName: 'Daily Progress Report',
    responsibleUserId: 'user-015', responsibleUserName: 'Ravi Sharma',
    accountableUserId: 'user-010', accountableUserName: 'Rajesh Kumar',
    consultedUserIds: [], consultedUserNames: [],
    informedUserIds: ['user-002'], informedUserNames: ['Priya Sharma'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
  {
    id: 'raci-003', scopeType: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    processCode: 'PO_APPROVAL', processName: 'Purchase Order Approval',
    responsibleUserId: 'user-020', responsibleUserName: 'Amit Shah',
    accountableUserId: 'user-010', accountableUserName: 'Rajesh Kumar',
    consultedUserIds: ['user-022'], consultedUserNames: ['Vikram Desai'],
    informedUserIds: ['user-002'], informedUserNames: ['Priya Sharma'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
  {
    id: 'raci-004', scopeType: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    processCode: 'MB_CERTIFICATION', processName: 'Measurement Book Certification',
    responsibleUserId: 'user-025', responsibleUserName: 'Anil Mehta',
    accountableUserId: 'user-011', accountableUserName: 'Commercial Manager',
    consultedUserIds: ['user-015'], consultedUserNames: ['Ravi Sharma'],
    informedUserIds: ['user-022'], informedUserNames: ['Vikram Desai'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
  {
    id: 'raci-005', scopeType: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    processCode: 'BILL_CERTIFICATION', processName: 'Bill Certification',
    responsibleUserId: 'user-025', responsibleUserName: 'Anil Mehta',
    accountableUserId: 'user-011', accountableUserName: 'Commercial Manager',
    consultedUserIds: ['user-022'], consultedUserNames: ['Vikram Desai'],
    informedUserIds: ['user-002'], informedUserNames: ['Priya Sharma'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
  {
    id: 'raci-006', scopeType: 'project', scopeId: 'prj-002', scopeName: 'Highway Bridge NH-48',
    processCode: 'MATERIAL_ISSUE', processName: 'Material Issue',
    responsibleUserId: 'user-017', responsibleUserName: 'Mohan Lal',
    accountableUserId: 'user-011', accountableUserName: 'Suresh Patel',
    consultedUserIds: [], consultedUserNames: [],
    informedUserIds: ['user-022'], informedUserNames: ['Vikram Desai'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
  {
    id: 'raci-007', scopeType: 'department', scopeId: 'dept-001', scopeName: 'Engineering',
    processCode: 'INSPECTION', processName: 'Quality Inspection',
    responsibleUserId: 'user-026', responsibleUserName: 'Krishna Rao',
    accountableUserId: 'user-006', accountableUserName: 'Mahesh Gupta',
    consultedUserIds: [], consultedUserNames: [],
    informedUserIds: ['user-010', 'user-011'], informedUserNames: ['Rajesh Kumar', 'Suresh Patel'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
  {
    id: 'raci-008', scopeType: 'site', scopeId: 'site-001', scopeName: 'Metro Tower Site A',
    processCode: 'SAFETY_INCIDENT', processName: 'Safety Incident Reporting',
    responsibleUserId: 'user-015', responsibleUserName: 'Ravi Sharma',
    accountableUserId: 'user-010', accountableUserName: 'Rajesh Kumar',
    consultedUserIds: ['user-027'], consultedUserNames: ['HSE Officer'],
    informedUserIds: ['user-001', 'user-002'], informedUserNames: ['Rajesh Kumar', 'Priya Sharma'],
    validFrom: '2024-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar',
    createdAt: '2023-12-20'
  },
];

// ===== ACTION LEDGER =====
export const actionLedger: ActionLedgerEntry[] = [
  {
    id: 'ledger-001', entityType: 'PurchaseOrder', entityId: 'po-089', docNo: 'PO-2024-0892',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    action: 'CREATED', actorId: 'user-020', actorName: 'Amit Shah', actorRole: 'Procurement Manager',
    at: '2024-01-15T10:00:00Z', reasonCode: 'RC-NEW-001', narrative: 'Steel requirement for foundation work',
    auditId: 'audit-002', protocolEvaluationId: 'eval-001'
  },
  {
    id: 'ledger-002', entityType: 'PurchaseOrder', entityId: 'po-089', docNo: 'PO-2024-0892',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    action: 'APPROVED', actorId: 'user-010', actorName: 'Rajesh Kumar', actorRole: 'Project Manager',
    at: '2024-01-15T11:30:00Z', reasonCode: 'RC-APPROVE-001', narrative: 'Approved within budget and specifications',
    auditId: 'audit-003', workflowTaskId: 'task-002', protocolEvaluationId: 'eval-001'
  },
  {
    id: 'ledger-003', entityType: 'GRN', entityId: 'grn-001', docNo: 'GRN-2024-1205',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    action: 'RECORDED', actorId: 'user-015', actorName: 'Ravi Sharma', actorRole: 'Site Engineer',
    at: '2024-01-16T09:45:00Z', deviceId: 'dev-003', lat: 19.1365, lng: 72.8347,
    narrative: 'Material received at site, verified against PO',
    auditId: 'audit-004', protocolEvaluationId: 'eval-005'
  },
  {
    id: 'ledger-004', entityType: 'MaterialIssue', entityId: 'mi-001', docNo: 'MI-2024-4521',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    action: 'EXECUTED', actorId: 'user-021', actorName: 'Neha Gupta', actorRole: 'Store Keeper',
    at: '2024-01-16T15:30:00Z', reasonCode: 'RC-ISSUE-001', narrative: 'Cement issued for column casting',
    auditId: 'audit-008'
  },
  {
    id: 'ledger-005', entityType: 'Bill', entityId: 'bill-447', docNo: 'B-447',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    action: 'VERIFIED', actorId: 'user-025', actorName: 'Anil Mehta', actorRole: 'QS Engineer',
    at: '2024-01-16T16:00:00Z', narrative: 'Measurements verified against MB',
    auditId: 'audit-005', workflowTaskId: 'task-003', protocolEvaluationId: 'eval-005'
  },
  {
    id: 'ledger-006', entityType: 'PurchaseOrder', entityId: 'po-090', docNo: 'PO-2024-0893',
    projectId: 'prj-003', projectName: 'Residential Complex B7',
    action: 'RETURNED', actorId: 'user-012', actorName: 'Vikram Desai', actorRole: 'Project Manager',
    at: '2024-01-14T09:00:00Z', reasonCode: 'RC-RETURN-001', narrative: 'Please attach vendor quotation',
    auditId: 'audit-012', workflowTaskId: 'task-010'
  },
  {
    id: 'ledger-007', entityType: 'Exception', entityId: 'exc-001', docNo: 'EXC-2024-001',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    action: 'EXCEPTION_REQUESTED', actorId: 'user-015', actorName: 'Ravi Sharma', actorRole: 'Site Engineer',
    at: '2024-01-16T14:35:00Z', reasonCode: 'RC-EXCESS-001',
    narrative: 'Emergency requirement for column casting due to unexpected design change',
    protocolEvaluationId: 'eval-002'
  },
  {
    id: 'ledger-008', entityType: 'Exception', entityId: 'exc-001', docNo: 'EXC-2024-001',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A',
    action: 'EXCEPTION_APPROVED', actorId: 'user-010', actorName: 'Rajesh Kumar', actorRole: 'Project Manager',
    at: '2024-01-16T15:00:00Z', narrative: 'Approved - client variation VAR-2024-015 confirmed'
  },
];

// ===== COMPLIANCE SCORES =====
export const complianceScores: ComplianceScore[] = [
  {
    id: 'score-001', subjectType: 'user', subjectId: 'user-015', subjectName: 'Ravi Sharma',
    period: '2024-01', score: 92,
    components: { onTimeCompletion: 95, qualityScore: 90, complianceRate: 98, exceptionRate: 2, violationCount: 0 },
    calculatedAt: '2024-01-16T23:00:00Z', trend: 'up'
  },
  {
    id: 'score-002', subjectType: 'user', subjectId: 'user-010', subjectName: 'Rajesh Kumar',
    period: '2024-01', score: 96,
    components: { onTimeCompletion: 98, qualityScore: 95, complianceRate: 100, exceptionRate: 0, violationCount: 0 },
    calculatedAt: '2024-01-16T23:00:00Z', trend: 'stable'
  },
  {
    id: 'score-003', subjectType: 'user', subjectId: 'user-020', subjectName: 'Amit Shah',
    period: '2024-01', score: 88,
    components: { onTimeCompletion: 85, qualityScore: 92, complianceRate: 95, exceptionRate: 5, violationCount: 1 },
    calculatedAt: '2024-01-16T23:00:00Z', trend: 'down'
  },
  {
    id: 'score-004', subjectType: 'site', subjectId: 'site-001', subjectName: 'Metro Tower Site A',
    period: '2024-01', score: 94,
    components: { onTimeCompletion: 96, qualityScore: 93, complianceRate: 97, exceptionRate: 3, violationCount: 0 },
    calculatedAt: '2024-01-16T23:00:00Z', trend: 'up'
  },
  {
    id: 'score-005', subjectType: 'project', subjectId: 'prj-001', subjectName: 'Metro Tower Phase II',
    period: '2024-01', score: 91,
    components: { onTimeCompletion: 90, qualityScore: 92, complianceRate: 94, exceptionRate: 6, violationCount: 2 },
    calculatedAt: '2024-01-16T23:00:00Z', trend: 'stable'
  },
  {
    id: 'score-006', subjectType: 'user', subjectId: 'user-021', subjectName: 'Neha Gupta',
    period: '2024-01', score: 95,
    components: { onTimeCompletion: 97, qualityScore: 94, complianceRate: 99, exceptionRate: 1, violationCount: 0 },
    calculatedAt: '2024-01-16T23:00:00Z', trend: 'up'
  },
];

// ===== RESPONSIBILITY ITEMS =====
export const responsibilityItems: ResponsibilityItem[] = [
  {
    id: 'resp-001', userId: 'user-010', userName: 'Rajesh Kumar',
    itemType: 'approval', entityType: 'PurchaseOrder', entityId: 'po-091', docNo: 'PO-2024-0894',
    description: 'PO approval pending - ₹8.5L', dueAt: '2024-01-17T10:00:00Z', isOverdue: false,
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
  {
    id: 'resp-002', userId: 'user-010', userName: 'Rajesh Kumar',
    itemType: 'exception', entityType: 'Exception', entityId: 'exc-002', docNo: 'EXC-2024-002',
    description: 'Amount excess exception - ₹7.5L', dueAt: '2024-01-17T16:00:00Z', isOverdue: false,
    projectId: 'prj-002', projectName: 'Highway Bridge NH-48'
  },
  {
    id: 'resp-003', userId: 'user-015', userName: 'Ravi Sharma',
    itemType: 'task', entityType: 'DPR', entityId: 'dpr-2024-01-17', docNo: 'DPR-2024-01-17',
    description: 'Submit daily progress report', dueAt: '2024-01-17T18:00:00Z', isOverdue: false,
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A'
  },
  {
    id: 'resp-004', userId: 'user-022', userName: 'Vikram Desai',
    itemType: 'overdue_record', entityType: 'Bill', entityId: 'bill-448', docNo: 'B-448',
    description: 'Bill verification overdue - 3 days', dueAt: '2024-01-14T10:00:00Z', isOverdue: true,
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
  {
    id: 'resp-005', userId: 'user-015', userName: 'Ravi Sharma',
    itemType: 'exception', entityType: 'Exception', entityId: 'exc-003', docNo: 'EXC-2024-003',
    description: 'Emergency approval - regularise by 2024-01-17', dueAt: '2024-01-17T18:00:00Z', isOverdue: false,
    projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Metro Tower Site A'
  },
  {
    id: 'resp-006', userId: 'user-020', userName: 'Amit Shah',
    itemType: 'violation', entityType: 'Violation', entityId: 'viol-001', docNo: 'VIOL-2024-001',
    description: 'Approval limit violation - resolve required', dueAt: '2024-01-18T10:00:00Z', isOverdue: false,
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-ACC-01', stage: 'PLAN', control: 'Responsible and Accountable persons assigned for the WBS/activity/process before any EXECUTE-stage action', enforcement: 'EXCEPTION', status: 'OBSERVE' },
  { id: 'CP-ACC-02', stage: 'APPROVE', control: 'RACI changes approved by next-level manager', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-ACC-03', stage: 'CLOSE', control: 'Open responsibilities reassigned before transfer/exit clearance', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-ACC-04', stage: 'MONITOR', control: 'Responsibility items overdue beyond SLA', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getRACIStats(): { total: number; byScope: Record<ScopeType, number>; byProcess: Record<ProcessCode, number> } {
  const byScope = raciAssignments.reduce((acc, r) => {
    acc[r.scopeType] = (acc[r.scopeType] || 0) + 1;
    return acc;
  }, {} as Record<ScopeType, number>);

  const byProcess = raciAssignments.reduce((acc, r) => {
    acc[r.processCode] = (acc[r.processCode] || 0) + 1;
    return acc;
  }, {} as Record<ProcessCode, number>);

  return { total: raciAssignments.length, byScope, byProcess };
}

export function getLedgerStats(): { total: number; byAction: Record<ActionType, number>; today: number } {
  const today = new Date().toISOString().split('T')[0];
  const byAction = actionLedger.reduce((acc, l) => {
    acc[l.action] = (acc[l.action] || 0) + 1;
    return acc;
  }, {} as Record<ActionType, number>);

  return {
    total: actionLedger.length,
    byAction,
    today: actionLedger.filter(l => l.at.startsWith(today)).length
  };
}

export function getUserResponsibilities(userId: string): ResponsibilityItem[] {
  return responsibilityItems.filter(r => r.userId === userId);
}

export function getOverdueResponsibilities(): ResponsibilityItem[] {
  return responsibilityItems.filter(r => r.isOverdue);
}

export function getAverageScore(): number {
  const userScores = complianceScores.filter(s => s.subjectType === 'user');
  if (userScores.length === 0) return 0;
  return Math.round(userScores.reduce((sum, s) => sum + s.score, 0) / userScores.length);
}
