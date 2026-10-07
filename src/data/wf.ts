// Part 12 — Workflow & Approval Engine
// Configurable workflow engine for all document types

export type DocType = 'PR' | 'PO' | 'WO' | 'Bill' | 'Budget' | 'Variation' | 'Leave' | 'NCR' | 'MasterChange';
export type StepType = 'sequential' | 'parallel_all' | 'parallel_any' | 'quorum';
export type ApproverRuleType = 'role' | 'user' | 'position' | 'project_role' | 'department_head' | 'reporting_manager' | 'dynamic';
export type ConditionAction = 'include' | 'skip' | 'route_to';
export type InstanceStatus = 'DRAFT' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'CANCELLED' | 'RECALLED';
export type TaskStatus = 'pending' | 'approved' | 'rejected' | 'returned' | 'skipped' | 'expired';
export type ActionType = 'submit' | 'approve' | 'reject' | 'return' | 'resubmit' | 'recall' | 'cancel' | 'reassign' | 'comment' | 'ask_for_info';

export interface WorkflowDefinition {
  id: string;
  code: string;
  docType: DocType;
  name: string;
  version: number;
  isActive: boolean;
  effectiveFrom: string;
  createdBy: string;
  createdByName: string;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  instanceCount: number;
  avgTurnaroundHours: number;
}

export interface WorkflowStep {
  id: string;
  definitionId: string;
  seq: number;
  name: string;
  type: StepType;
  quorumN?: number;
  approverRuleType: ApproverRuleType;
  approverRuleValue: string;
  slaHours: number;
  escalateToRule?: string;
  canEditFields: string[];
  allowReturnTo: number[];
  mandatoryComment: boolean;
  mandatoryDocuments: boolean;
}

export interface WorkflowCondition {
  id: string;
  definitionId: string;
  stepId?: string;
  expression: string;
  action: ConditionAction;
  targetStepSeq?: number;
}

export interface WorkflowInstance {
  id: string;
  docType: DocType;
  docId: string;
  docNumber: string;
  docTitle: string;
  definitionId: string;
  definitionVersion: number;
  status: InstanceStatus;
  currentStepSeq: number;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  completedAt?: string;
  amountSnapshot: number;
  contextJson: Record<string, any>;
  projectId?: string;
  projectName?: string;
  tasks: WorkflowTask[];
  actionLog: WorkflowAction[];
}

export interface WorkflowTask {
  id: string;
  instanceId: string;
  stepSeq: number;
  stepName: string;
  assigneeUserId: string;
  assigneeName: string;
  originalAssigneeId?: string;
  delegatedFrom?: string;
  status: TaskStatus;
  actedAt?: string;
  comment?: string;
  reasonCode?: string;
  dueAt: string;
  escalatedAt?: string;
  slaPercentRemaining: number;
}

export interface WorkflowAction {
  id: string;
  instanceId: string;
  taskId?: string;
  action: ActionType;
  actorId: string;
  actorName: string;
  onBehalfOf?: string;
  comment?: string;
  reason?: string;
  at: string;
  ip: string;
}

export interface Delegation {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegateId: string;
  delegateName: string;
  docTypes: DocType[];
  scope: string;
  from: string;
  to: string;
  reason: string;
  approvedBy?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface SLACalendar {
  id: string;
  companyId: string;
  name: string;
  workingDays: number[];
  holidays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
}

// ===== SEED WORKFLOW DEFINITIONS =====
export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: 'wf-001', code: 'WF-PR', docType: 'PR', name: 'Purchase Request Approval',
    version: 2, isActive: true, effectiveFrom: '2024-01-01',
    createdBy: 'user-001', createdByName: 'Rajesh Kumar',
    instanceCount: 234, avgTurnaroundHours: 18,
    steps: [
      { id: 'step-001', definitionId: 'wf-001', seq: 1, name: 'Procurement Review', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'PROCUREMENT_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [], mandatoryComment: false, mandatoryDocuments: false },
      { id: 'step-002', definitionId: 'wf-001', seq: 2, name: 'Project Manager', type: 'sequential', approverRuleType: 'project_role', approverRuleValue: 'PROJECT_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [1], mandatoryComment: true, mandatoryDocuments: false },
      { id: 'step-003', definitionId: 'wf-001', seq: 3, name: 'Management Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'MANAGEMENT', slaHours: 48, escalateToRule: 'CFO', canEditFields: [], allowReturnTo: [1, 2], mandatoryComment: true, mandatoryDocuments: false },
    ],
    conditions: [
      { id: 'cond-001', definitionId: 'wf-001', stepId: 'step-003', expression: 'amount < 500000', action: 'skip' },
    ],
  },
  {
    id: 'wf-002', code: 'WF-PO', docType: 'PO', name: 'Purchase Order Approval',
    version: 3, isActive: true, effectiveFrom: '2024-01-01',
    createdBy: 'user-001', createdByName: 'Rajesh Kumar',
    instanceCount: 389, avgTurnaroundHours: 36,
    steps: [
      { id: 'step-004', definitionId: 'wf-002', seq: 1, name: 'Procurement Manager', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'PROCUREMENT_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [], mandatoryComment: false, mandatoryDocuments: false },
      { id: 'step-005', definitionId: 'wf-002', seq: 2, name: 'Project/Commercial Manager', type: 'parallel_any', approverRuleType: 'project_role', approverRuleValue: 'PROJECT_MANAGER,COMMERCIAL_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [1], mandatoryComment: true, mandatoryDocuments: false },
      { id: 'step-006', definitionId: 'wf-002', seq: 3, name: 'Finance Review', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'ACCOUNTS_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [1, 2], mandatoryComment: true, mandatoryDocuments: true },
      { id: 'step-007', definitionId: 'wf-002', seq: 4, name: 'Management Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'MANAGEMENT', slaHours: 48, escalateToRule: 'CFO', canEditFields: [], allowReturnTo: [1, 2, 3], mandatoryComment: true, mandatoryDocuments: false },
    ],
    conditions: [
      { id: 'cond-002', definitionId: 'wf-002', stepId: 'step-006', expression: 'amount < 1000000', action: 'skip' },
      { id: 'cond-003', definitionId: 'wf-002', stepId: 'step-007', expression: 'amount < 5000000', action: 'skip' },
    ],
  },
  {
    id: 'wf-003', code: 'WF-BILL', docType: 'Bill', name: 'Subcontractor Bill Approval',
    version: 2, isActive: true, effectiveFrom: '2024-01-01',
    createdBy: 'user-001', createdByName: 'Rajesh Kumar',
    instanceCount: 134, avgTurnaroundHours: 72,
    steps: [
      { id: 'step-008', definitionId: 'wf-003', seq: 1, name: 'QS Verification', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'QS', slaHours: 48, canEditFields: [], allowReturnTo: [], mandatoryComment: true, mandatoryDocuments: true },
      { id: 'step-009', definitionId: 'wf-003', seq: 2, name: 'Commercial Manager', type: 'sequential', approverRuleType: 'project_role', approverRuleValue: 'COMMERCIAL_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [1], mandatoryComment: true, mandatoryDocuments: false },
      { id: 'step-010', definitionId: 'wf-003', seq: 3, name: 'Finance Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'ACCOUNTS_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [1, 2], mandatoryComment: true, mandatoryDocuments: false },
      { id: 'step-011', definitionId: 'wf-003', seq: 4, name: 'Authorised Approver', type: 'sequential', approverRuleType: 'dynamic', approverRuleValue: 'amount_based_approver', slaHours: 48, escalateToRule: 'CFO', canEditFields: [], allowReturnTo: [1, 2, 3], mandatoryComment: true, mandatoryDocuments: false },
    ],
    conditions: [],
  },
  {
    id: 'wf-004', code: 'WF-LEAVE', docType: 'Leave', name: 'Leave Application',
    version: 1, isActive: true, effectiveFrom: '2024-01-01',
    createdBy: 'user-023', createdByName: 'Kavita Nair',
    instanceCount: 456, avgTurnaroundHours: 8,
    steps: [
      { id: 'step-012', definitionId: 'wf-004', seq: 1, name: 'Reporting Manager', type: 'sequential', approverRuleType: 'reporting_manager', approverRuleValue: '', slaHours: 24, canEditFields: [], allowReturnTo: [], mandatoryComment: false, mandatoryDocuments: false },
      { id: 'step-013', definitionId: 'wf-004', seq: 2, name: 'HR Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'HR_MANAGER', slaHours: 24, canEditFields: [], allowReturnTo: [1], mandatoryComment: true, mandatoryDocuments: false },
    ],
    conditions: [
      { id: 'cond-004', definitionId: 'wf-004', stepId: 'step-013', expression: 'days <= 3', action: 'skip' },
    ],
  },
  {
    id: 'wf-005', code: 'WF-BUDGET', docType: 'Budget', name: 'Budget Revision',
    version: 1, isActive: true, effectiveFrom: '2024-01-01',
    createdBy: 'user-001', createdByName: 'Rajesh Kumar',
    instanceCount: 28, avgTurnaroundHours: 96,
    steps: [
      { id: 'step-014', definitionId: 'wf-005', seq: 1, name: 'Project Manager', type: 'sequential', approverRuleType: 'project_role', approverRuleValue: 'PROJECT_MANAGER', slaHours: 48, canEditFields: [], allowReturnTo: [], mandatoryComment: true, mandatoryDocuments: true },
      { id: 'step-015', definitionId: 'wf-005', seq: 2, name: 'Commercial Manager', type: 'sequential', approverRuleType: 'project_role', approverRuleValue: 'COMMERCIAL_MANAGER', slaHours: 48, canEditFields: [], allowReturnTo: [1], mandatoryComment: true, mandatoryDocuments: false },
      { id: 'step-016', definitionId: 'wf-005', seq: 3, name: 'CFO Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'CFO', slaHours: 72, canEditFields: [], allowReturnTo: [1, 2], mandatoryComment: true, mandatoryDocuments: false },
    ],
    conditions: [],
  },
  {
    id: 'wf-006', code: 'WF-MASTER', docType: 'MasterChange', name: 'Master Data Change',
    version: 1, isActive: true, effectiveFrom: '2024-01-01',
    createdBy: 'user-001', createdByName: 'Rajesh Kumar',
    instanceCount: 67, avgTurnaroundHours: 24,
    steps: [
      { id: 'step-017', definitionId: 'wf-006', seq: 1, name: 'Master Data Steward', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'DATA_STEWARD', slaHours: 24, canEditFields: [], allowReturnTo: [], mandatoryComment: true, mandatoryDocuments: true },
    ],
    conditions: [],
  },
];

// ===== SAMPLE INSTANCES =====
export const workflowInstances: WorkflowInstance[] = [
  {
    id: 'inst-001', docType: 'PO', docId: 'po-089', docNumber: 'PO-2024-0892', docTitle: 'Steel Supply - Metro Tower',
    definitionId: 'wf-002', definitionVersion: 3, status: 'IN_PROGRESS', currentStepSeq: 2,
    submittedBy: 'user-020', submittedByName: 'Amit Shah', submittedAt: '2024-01-15T10:00:00Z',
    amountSnapshot: 1250000, contextJson: { supplier: 'Steel India Ltd.', project: 'Metro Tower Phase II' },
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    tasks: [
      { id: 'task-001', instanceId: 'inst-001', stepSeq: 1, stepName: 'Procurement Manager', assigneeUserId: 'user-020', assigneeName: 'Amit Shah', status: 'approved', actedAt: '2024-01-15T11:30:00Z', comment: 'Verified specifications', dueAt: '2024-01-16T10:00:00Z', slaPercentRemaining: 100 },
      { id: 'task-002', instanceId: 'inst-001', stepSeq: 2, stepName: 'Project/Commercial Manager', assigneeUserId: 'user-010', assigneeName: 'Rajesh Kumar', status: 'pending', dueAt: '2024-01-16T11:30:00Z', slaPercentRemaining: 65 },
    ],
    actionLog: [
      { id: 'log-001', instanceId: 'inst-001', action: 'submit', actorId: 'user-020', actorName: 'Amit Shah', at: '2024-01-15T10:00:00Z', ip: '192.168.1.100' },
      { id: 'log-002', instanceId: 'inst-001', taskId: 'task-001', action: 'approve', actorId: 'user-020', actorName: 'Amit Shah', comment: 'Verified specifications', at: '2024-01-15T11:30:00Z', ip: '192.168.1.100' },
    ],
  },
  {
    id: 'inst-002', docType: 'Bill', docId: 'bill-447', docNumber: 'B-447', docTitle: 'Raj Constructions - Dec Work',
    definitionId: 'wf-003', definitionVersion: 2, status: 'IN_PROGRESS', currentStepSeq: 1,
    submittedBy: 'user-022', submittedByName: 'Vikram Desai', submittedAt: '2024-01-16T09:00:00Z',
    amountSnapshot: 2850000, contextJson: { vendor: 'Raj Constructions', period: 'December 2024' },
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    tasks: [
      { id: 'task-003', instanceId: 'inst-002', stepSeq: 1, stepName: 'QS Verification', assigneeUserId: 'user-025', assigneeName: 'Anil Mehta', status: 'pending', dueAt: '2024-01-18T09:00:00Z', slaPercentRemaining: 85 },
    ],
    actionLog: [
      { id: 'log-003', instanceId: 'inst-002', action: 'submit', actorId: 'user-022', actorName: 'Vikram Desai', at: '2024-01-16T09:00:00Z', ip: '192.168.1.104' },
    ],
  },
  {
    id: 'inst-003', docType: 'PR', docId: 'pr-234', docNumber: 'PR-2024-0234', docTitle: 'Cement Requirement - Site A',
    definitionId: 'wf-001', definitionVersion: 2, status: 'IN_PROGRESS', currentStepSeq: 3,
    submittedBy: 'user-015', submittedByName: 'Ravi Sharma', submittedAt: '2024-01-14T14:00:00Z',
    amountSnapshot: 750000, contextJson: { material: 'Cement OPC 53', quantity: '500 bags' },
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    tasks: [
      { id: 'task-004', instanceId: 'inst-003', stepSeq: 1, stepName: 'Procurement Review', assigneeUserId: 'user-020', assigneeName: 'Amit Shah', status: 'approved', actedAt: '2024-01-14T15:30:00Z', dueAt: '2024-01-15T14:00:00Z', slaPercentRemaining: 100 },
      { id: 'task-005', instanceId: 'inst-003', stepSeq: 2, stepName: 'Project Manager', assigneeUserId: 'user-010', assigneeName: 'Rajesh Kumar', status: 'approved', actedAt: '2024-01-15T09:00:00Z', comment: 'Approved - urgent requirement', dueAt: '2024-01-15T15:30:00Z', slaPercentRemaining: 100 },
      { id: 'task-006', instanceId: 'inst-003', stepSeq: 3, stepName: 'Management Approval', assigneeUserId: 'user-002', assigneeName: 'Priya Sharma', status: 'pending', dueAt: '2024-01-17T09:00:00Z', slaPercentRemaining: 45 },
    ],
    actionLog: [
      { id: 'log-004', instanceId: 'inst-003', action: 'submit', actorId: 'user-015', actorName: 'Ravi Sharma', at: '2024-01-14T14:00:00Z', ip: '10.0.0.50' },
      { id: 'log-005', instanceId: 'inst-003', taskId: 'task-004', action: 'approve', actorId: 'user-020', actorName: 'Amit Shah', at: '2024-01-14T15:30:00Z', ip: '192.168.1.100' },
      { id: 'log-006', instanceId: 'inst-003', taskId: 'task-005', action: 'approve', actorId: 'user-010', actorName: 'Rajesh Kumar', comment: 'Approved - urgent requirement', at: '2024-01-15T09:00:00Z', ip: '192.168.1.101' },
    ],
  },
  {
    id: 'inst-004', docType: 'Leave', docId: 'leave-089', docNumber: 'LV-2024-089', docTitle: 'Annual Leave - 5 days',
    definitionId: 'wf-004', definitionVersion: 1, status: 'APPROVED', currentStepSeq: 2,
    submittedBy: 'user-015', submittedByName: 'Ravi Sharma', submittedAt: '2024-01-10T09:00:00Z', completedAt: '2024-01-11T14:00:00Z',
    amountSnapshot: 0, contextJson: { days: 5, from: '2024-01-20', to: '2024-01-24', reason: 'Family function' },
    tasks: [
      { id: 'task-007', instanceId: 'inst-004', stepSeq: 1, stepName: 'Reporting Manager', assigneeUserId: 'user-010', assigneeName: 'Rajesh Kumar', status: 'approved', actedAt: '2024-01-10T10:30:00Z', comment: 'Approved', dueAt: '2024-01-11T09:00:00Z', slaPercentRemaining: 100 },
      { id: 'task-008', instanceId: 'inst-004', stepSeq: 2, stepName: 'HR Approval', assigneeUserId: 'user-023', assigneeName: 'Kavita Nair', status: 'approved', actedAt: '2024-01-11T14:00:00Z', comment: 'Leave balance verified', dueAt: '2024-01-11T10:30:00Z', slaPercentRemaining: 100 },
    ],
    actionLog: [
      { id: 'log-007', instanceId: 'inst-004', action: 'submit', actorId: 'user-015', actorName: 'Ravi Sharma', at: '2024-01-10T09:00:00Z', ip: '10.0.0.50' },
      { id: 'log-008', instanceId: 'inst-004', taskId: 'task-007', action: 'approve', actorId: 'user-010', actorName: 'Rajesh Kumar', comment: 'Approved', at: '2024-01-10T10:30:00Z', ip: '192.168.1.101' },
      { id: 'log-009', instanceId: 'inst-004', taskId: 'task-008', action: 'approve', actorId: 'user-023', actorName: 'Kavita Nair', comment: 'Leave balance verified', at: '2024-01-11T14:00:00Z', ip: '192.168.1.106' },
    ],
  },
  {
    id: 'inst-005', docType: 'PO', docId: 'po-090', docNumber: 'PO-2024-0893', docTitle: 'Timber Supply - Residential Complex',
    definitionId: 'wf-002', definitionVersion: 3, status: 'RETURNED', currentStepSeq: 2,
    submittedBy: 'user-020', submittedByName: 'Amit Shah', submittedAt: '2024-01-13T11:00:00Z',
    amountSnapshot: 320000, contextJson: { supplier: 'Timbers Plus', project: 'Residential Complex B7' },
    projectId: 'prj-003', projectName: 'Residential Complex B7',
    tasks: [
      { id: 'task-009', instanceId: 'inst-005', stepSeq: 1, stepName: 'Procurement Manager', assigneeUserId: 'user-020', assigneeName: 'Amit Shah', status: 'approved', actedAt: '2024-01-13T12:00:00Z', dueAt: '2024-01-14T11:00:00Z', slaPercentRemaining: 100 },
      { id: 'task-010', instanceId: 'inst-005', stepSeq: 2, stepName: 'Project/Commercial Manager', assigneeUserId: 'user-012', assigneeName: 'Vikram Desai', status: 'returned', actedAt: '2024-01-14T09:00:00Z', comment: 'Please attach vendor quotation', dueAt: '2024-01-14T12:00:00Z', slaPercentRemaining: 100 },
    ],
    actionLog: [
      { id: 'log-010', instanceId: 'inst-005', action: 'submit', actorId: 'user-020', actorName: 'Amit Shah', at: '2024-01-13T11:00:00Z', ip: '192.168.1.100' },
      { id: 'log-011', instanceId: 'inst-005', taskId: 'task-009', action: 'approve', actorId: 'user-020', actorName: 'Amit Shah', at: '2024-01-13T12:00:00Z', ip: '192.168.1.100' },
      { id: 'log-012', instanceId: 'inst-005', taskId: 'task-010', action: 'return', actorId: 'user-012', actorName: 'Vikram Desai', comment: 'Please attach vendor quotation', at: '2024-01-14T09:00:00Z', ip: '192.168.1.107' },
    ],
  },
];

// ===== DELEGATIONS =====
export const delegations: Delegation[] = [
  { id: 'del-001', delegatorId: 'user-010', delegatorName: 'Rajesh Kumar', delegateId: 'user-011', delegateName: 'Suresh Patel', docTypes: ['PO', 'PR'], scope: 'Project: Metro Tower Phase II', from: '2024-01-20', to: '2024-01-25', reason: 'Out of station - client meeting', approvedBy: 'user-001', status: 'active' },
  { id: 'del-002', delegatorId: 'user-002', delegatorName: 'Priya Sharma', delegateId: 'user-022', delegateName: 'Vikram Desai', docTypes: ['Bill', 'Budget'], scope: 'Company-wide', from: '2024-01-18', to: '2024-01-19', reason: 'Medical leave', status: 'active' },
  { id: 'del-003', delegatorId: 'user-023', delegatorName: 'Kavita Nair', delegateId: 'user-024', delegateName: 'Neha Gupta', docTypes: ['Leave'], scope: 'All departments', from: '2024-01-10', to: '2024-01-12', reason: 'Training program', status: 'expired' },
];

// ===== SLA CALENDARS =====
export const slaCalendars: SLACalendar[] = [
  { id: 'cal-001', companyId: 'comp-001', name: 'Standard Working Calendar', workingDays: [1, 2, 3, 4, 5], holidays: ['2024-01-26', '2024-03-25', '2024-05-01', '2024-08-15', '2024-10-02', '2024-11-01', '2024-12-25'], workingHoursStart: '09:00', workingHoursEnd: '18:00' },
  { id: 'cal-002', companyId: 'comp-001', name: 'Site Working Calendar', workingDays: [1, 2, 3, 4, 5, 6], holidays: ['2024-01-26', '2024-03-25', '2024-05-01', '2024-08-15', '2024-10-02'], workingHoursStart: '07:00', workingHoursEnd: '17:00' },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-WF-01', stage: 'APPROVE', control: 'Submitter cannot approve own document; one approver cannot act at two levels', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-WF-02', stage: 'MONITOR', control: 'Approval SLA breach escalates L1→L2→L3', enforcement: 'MONITOR', status: 'OBSERVE' },
  { id: 'CP-WF-03', stage: 'VERIFY', control: 'Bulk approval disabled for documents carrying WARN/EXCEPTION results', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-WF-04', stage: 'MONITOR', control: 'Split documents to stay under approval bands', enforcement: 'MONITOR (DR-13)', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getMyTasks(userId: string): WorkflowTask[] {
  return workflowInstances
    .flatMap(inst => inst.tasks)
    .filter(task => task.assigneeUserId === userId && task.status === 'pending');
}

export function getOverdueTasks(): WorkflowTask[] {
  const now = new Date();
  return workflowInstances
    .flatMap(inst => inst.tasks)
    .filter(task => task.status === 'pending' && new Date(task.dueAt) < now);
}

export function getInstanceStats(): { total: number; inProgress: number; approved: number; rejected: number; returned: number; overdue: number } {
  return {
    total: workflowInstances.length,
    inProgress: workflowInstances.filter(i => i.status === 'IN_PROGRESS').length,
    approved: workflowInstances.filter(i => i.status === 'APPROVED').length,
    rejected: workflowInstances.filter(i => i.status === 'REJECTED').length,
    returned: workflowInstances.filter(i => i.status === 'RETURNED').length,
    overdue: getOverdueTasks().length,
  };
}
