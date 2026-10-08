// Part 13 — Workflow Rules & Decision Tables
// Configuration-driven business rules, authority matrices, and state machines

export type DocumentType = 'PO' | 'PR' | 'Bill' | 'Payment' | 'Variation' | 'Budget' | 'Vendor' | 'Drawing' | 'NCR' | 'Payroll';
export type DecisionTableStatus = 'draft' | 'simulated' | 'approved' | 'active' | 'superseded';
export type StateMachineStatus = 'draft' | 'active' | 'deprecated';
export type EmergencyStatus = 'pending' | 'regularised' | 'expired';
export type HitPolicy = 'UNIQUE' | 'FIRST' | 'PRIORITY' | 'ANY' | 'COLLECT';

export interface StateMachineDefinition {
  id: string;
  documentType: DocumentType;
  name: string;
  version: number;
  status: StateMachineStatus;
  states: State[];
  transitions: StateTransition[];
  effectiveFrom: string;
  createdBy: string;
}

export interface State {
  id: string;
  code: string;
  name: string;
  isInitial: boolean;
  isFinal: boolean;
  isLocked: boolean;
  color: string;
}

export interface StateTransition {
  id: string;
  fromStateId: string;
  toStateId: string;
  name: string;
  guardExpression?: string;
  sideEffects: string[];
  allowedRoles: string[];
}

export interface DecisionTable {
  id: string;
  code: string;
  documentType: DocumentType;
  name: string;
  description: string;
  version: number;
  status: DecisionTableStatus;
  hitPolicy: HitPolicy;
  inputs: DecisionInput[];
  outputs: DecisionOutput[];
  rules: DecisionRule[];
  effectiveFrom: string;
  effectiveTo?: string;
  approvedBy?: string;
  createdAt: string;
  createdBy: string;
}

export interface DecisionInput {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  enumValues?: string[];
  description: string;
}

export interface DecisionOutput {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'role[]' | 'string[]';
  description: string;
}

export interface DecisionRule {
  id: string;
  priority: number;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  annotation?: string;
}

export interface AuthorityMatrix {
  id: string;
  companyId: string;
  companyName: string;
  projectId?: string;
  projectName?: string;
  roleId: string;
  roleName: string;
  documentType: DocumentType;
  maxAmount: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
  approvedBy: string;
  createdAt: string;
}

export interface SimulationRun {
  id: string;
  decisionTableId: string;
  decisionTableName: string;
  version: number;
  periodFrom: string;
  periodTo: string;
  documentCount: number;
  changedRoutings: number;
  unchangedRoutings: number;
  reportFileId?: string;
  runBy: string;
  runAt: string;
  status: 'running' | 'completed' | 'failed';
  summary?: string;
}

export interface EmergencyApproval {
  id: string;
  instanceId: string;
  documentType: DocumentType;
  documentNumber: string;
  reason: string;
  evidenceIds: string[];
  approvedBy: string;
  approvedByName: string;
  approvedAt: string;
  regulariseBy: string;
  regularisedAt?: string;
  regularisedBy?: string;
  status: EmergencyStatus;
  amount: number;
  projectId: string;
  projectName: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== STATE MACHINES =====
export const stateMachines: StateMachineDefinition[] = [
  {
    id: 'sm-001',
    documentType: 'PO',
    name: 'Purchase Order Lifecycle',
    version: 2,
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'user-001',
    states: [
      { id: 'state-001', code: 'DRAFT', name: 'Draft', isInitial: true, isFinal: false, isLocked: false, color: 'gray' },
      { id: 'state-002', code: 'SUBMITTED', name: 'Submitted', isInitial: false, isFinal: false, isLocked: false, color: 'blue' },
      { id: 'state-003', code: 'IN_REVIEW', name: 'In Review', isInitial: false, isFinal: false, isLocked: false, color: 'blue' },
      { id: 'state-004', code: 'APPROVED', name: 'Approved', isInitial: false, isFinal: false, isLocked: true, color: 'green' },
      { id: 'state-005', code: 'REJECTED', name: 'Rejected', isInitial: false, isFinal: true, isLocked: true, color: 'red' },
      { id: 'state-006', code: 'RETURNED', name: 'Returned', isInitial: false, isFinal: false, isLocked: false, color: 'orange' },
      { id: 'state-007', code: 'RELEASED', name: 'Released', isInitial: false, isFinal: true, isLocked: true, color: 'green' },
      { id: 'state-008', code: 'CANCELLED', name: 'Cancelled', isInitial: false, isFinal: true, isLocked: true, color: 'gray' },
    ],
    transitions: [
      { id: 'trans-001', fromStateId: 'state-001', toStateId: 'state-002', name: 'Submit', sideEffects: ['wf.instance.created'], allowedRoles: ['creator'] },
      { id: 'trans-002', fromStateId: 'state-002', toStateId: 'state-003', name: 'Start Review', sideEffects: ['wf.task.assigned'], allowedRoles: ['approver'] },
      { id: 'trans-003', fromStateId: 'state-003', toStateId: 'state-004', name: 'Approve', guardExpression: 'amount <= authority_limit', sideEffects: ['wf.task.completed', 'doc.locked'], allowedRoles: ['approver'] },
      { id: 'trans-004', fromStateId: 'state-003', toStateId: 'state-005', name: 'Reject', sideEffects: ['wf.task.completed', 'notification.sent'], allowedRoles: ['approver'] },
      { id: 'trans-005', fromStateId: 'state-003', toStateId: 'state-006', name: 'Return', sideEffects: ['wf.task.completed', 'notification.sent'], allowedRoles: ['approver'] },
      { id: 'trans-006', fromStateId: 'state-006', toStateId: 'state-002', name: 'Resubmit', sideEffects: ['wf.instance.updated'], allowedRoles: ['creator'] },
      { id: 'trans-007', fromStateId: 'state-004', toStateId: 'state-007', name: 'Release', sideEffects: ['doc.released', 'notification.sent'], allowedRoles: ['releaser'] },
      { id: 'trans-008', fromStateId: 'state-002', toStateId: 'state-008', name: 'Cancel', guardExpression: 'creator == current_user', sideEffects: ['wf.instance.cancelled'], allowedRoles: ['creator'] },
    ],
  },
  {
    id: 'sm-002',
    documentType: 'Bill',
    name: 'Subcontractor Bill Lifecycle',
    version: 1,
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'user-001',
    states: [
      { id: 'state-009', code: 'DRAFT', name: 'Draft', isInitial: true, isFinal: false, isLocked: false, color: 'gray' },
      { id: 'state-010', code: 'SUBMITTED', name: 'Submitted', isInitial: false, isFinal: false, isLocked: false, color: 'blue' },
      { id: 'state-011', code: 'QS_VERIFIED', name: 'QS Verified', isInitial: false, isFinal: false, isLocked: false, color: 'blue' },
      { id: 'state-012', code: 'COMMERCIAL_APPROVED', name: 'Commercial Approved', isInitial: false, isFinal: false, isLocked: false, color: 'blue' },
      { id: 'state-013', code: 'FINANCE_APPROVED', name: 'Finance Approved', isInitial: false, isFinal: false, isLocked: false, color: 'blue' },
      { id: 'state-014', code: 'CERTIFIED', name: 'Certified', isInitial: false, isFinal: true, isLocked: true, color: 'green' },
      { id: 'state-015', code: 'REJECTED', name: 'Rejected', isInitial: false, isFinal: true, isLocked: true, color: 'red' },
    ],
    transitions: [
      { id: 'trans-009', fromStateId: 'state-009', toStateId: 'state-010', name: 'Submit', sideEffects: ['wf.instance.created'], allowedRoles: ['creator'] },
      { id: 'trans-010', fromStateId: 'state-010', toStateId: 'state-011', name: 'QS Verify', sideEffects: ['wf.task.completed'], allowedRoles: ['QS'] },
      { id: 'trans-011', fromStateId: 'state-011', toStateId: 'state-012', name: 'Commercial Approve', sideEffects: ['wf.task.completed'], allowedRoles: ['COMMERCIAL_MANAGER'] },
      { id: 'trans-012', fromStateId: 'state-012', toStateId: 'state-013', name: 'Finance Approve', sideEffects: ['wf.task.completed'], allowedRoles: ['ACCOUNTS_MANAGER'] },
      { id: 'trans-013', fromStateId: 'state-013', toStateId: 'state-014', name: 'Certify', sideEffects: ['doc.certified', 'notification.sent'], allowedRoles: ['AUTHORISED_APPROVER'] },
      { id: 'trans-014', fromStateId: 'state-011', toStateId: 'state-015', name: 'Reject', sideEffects: ['notification.sent'], allowedRoles: ['QS', 'COMMERCIAL_MANAGER', 'ACCOUNTS_MANAGER'] },
    ],
  },
];

// ===== DECISION TABLES =====
export const decisionTables: DecisionTable[] = [
  {
    id: 'dt-001',
    code: 'DT-PO-APPROVAL',
    documentType: 'PO',
    name: 'Purchase Order Approval Routing',
    description: 'Determines approval levels based on amount and project',
    version: 3,
    status: 'active',
    hitPolicy: 'FIRST',
    inputs: [
      { id: 'input-001', name: 'amount', label: 'PO Amount (₹)', type: 'number', description: 'Total PO amount in INR' },
      { id: 'input-002', name: 'project_type', label: 'Project Type', type: 'enum', enumValues: ['building', 'infrastructure', 'industrial'], description: 'Type of project' },
      { id: 'input-003', name: 'vendor_risk', label: 'Vendor Risk', type: 'enum', enumValues: ['low', 'medium', 'high'], description: 'Vendor risk classification' },
    ],
    outputs: [
      { id: 'output-001', name: 'approval_levels', label: 'Approval Levels', type: 'role[]', description: 'List of required approval roles' },
      { id: 'output-002', name: 'sla_hours', label: 'SLA (hours)', type: 'number', description: 'Approval SLA in hours' },
      { id: 'output-003', name: 'mandatory_docs', label: 'Mandatory Documents', type: 'string[]', description: 'Required attachments' },
    ],
    rules: [
      { id: 'rule-001', priority: 1, inputs: { amount: '<= 500000', project_type: 'any', vendor_risk: 'low' }, outputs: { approval_levels: ['PROCUREMENT_MANAGER'], sla_hours: 24, mandatory_docs: [] }, annotation: 'Small PO, low risk vendor' },
      { id: 'rule-002', priority: 2, inputs: { amount: '<= 500000', project_type: 'any', vendor_risk: 'medium,high' }, outputs: { approval_levels: ['PROCUREMENT_MANAGER', 'PROJECT_MANAGER'], sla_hours: 24, mandatory_docs: ['vendor_quotation'] }, annotation: 'Small PO, medium/high risk vendor' },
      { id: 'rule-003', priority: 3, inputs: { amount: '500001 .. 5000000', project_type: 'any', vendor_risk: 'any' }, outputs: { approval_levels: ['PROCUREMENT_MANAGER', 'PROJECT_MANAGER', 'ACCOUNTS_MANAGER'], sla_hours: 48, mandatory_docs: ['vendor_quotation', 'comparison_statement'] }, annotation: 'Medium PO' },
      { id: 'rule-004', priority: 4, inputs: { amount: '> 5000000', project_type: 'any', vendor_risk: 'any' }, outputs: { approval_levels: ['PROCUREMENT_MANAGER', 'PROJECT_MANAGER', 'ACCOUNTS_MANAGER', 'MANAGEMENT'], sla_hours: 72, mandatory_docs: ['vendor_quotation', 'comparison_statement', 'justification_note'] }, annotation: 'Large PO requires management approval' },
      { id: 'rule-005', priority: 5, inputs: { amount: '> 50000000', project_type: 'infrastructure', vendor_risk: 'any' }, outputs: { approval_levels: ['PROCUREMENT_MANAGER', 'PROJECT_MANAGER', 'ACCOUNTS_MANAGER', 'MANAGEMENT', 'CFO'], sla_hours: 96, mandatory_docs: ['vendor_quotation', 'comparison_statement', 'justification_note', 'board_approval'] }, annotation: 'Very large infrastructure PO requires CFO' },
    ],
    effectiveFrom: '2024-01-01',
    approvedBy: 'user-002',
    createdAt: '2023-12-15',
    createdBy: 'user-001',
  },
  {
    id: 'dt-002',
    code: 'DT-BILL-APPROVAL',
    documentType: 'Bill',
    name: 'Subcontractor Bill Approval Routing',
    description: 'Determines bill approval chain based on amount and certification status',
    version: 2,
    status: 'active',
    hitPolicy: 'FIRST',
    inputs: [
      { id: 'input-004', name: 'amount', label: 'Bill Amount (₹)', type: 'number', description: 'Total bill amount in INR' },
      { id: 'input-005', name: 'is_retention', label: 'Is Retention Bill', type: 'boolean', description: 'Whether this is a retention release bill' },
      { id: 'input-006', name: 'variance_pct', label: 'Variance %', type: 'number', description: 'Variance from BOQ percentage' },
    ],
    outputs: [
      { id: 'output-004', name: 'approval_chain', label: 'Approval Chain', type: 'role[]', description: 'Sequential approval roles' },
      { id: 'output-005', name: 'sla_hours', label: 'SLA (hours)', type: 'number', description: 'Approval SLA in hours' },
      { id: 'output-006', name: 'requires_measurement', label: 'Requires Measurement Book', type: 'boolean', description: 'Whether MB verification is required' },
    ],
    rules: [
      { id: 'rule-006', priority: 1, inputs: { amount: '<= 1000000', is_retention: 'false', variance_pct: '<= 5' }, outputs: { approval_chain: ['QS', 'PROJECT_MANAGER'], sla_hours: 48, requires_measurement: false }, annotation: 'Small bill, within variance' },
      { id: 'rule-007', priority: 2, inputs: { amount: '<= 1000000', is_retention: 'false', variance_pct: '> 5' }, outputs: { approval_chain: ['QS', 'PROJECT_MANAGER', 'COMMERCIAL_MANAGER'], sla_hours: 72, requires_measurement: true }, annotation: 'Small bill, high variance requires commercial review' },
      { id: 'rule-008', priority: 3, inputs: { amount: '1000001 .. 10000000', is_retention: 'any', variance_pct: 'any' }, outputs: { approval_chain: ['QS', 'PROJECT_MANAGER', 'COMMERCIAL_MANAGER', 'ACCOUNTS_MANAGER'], sla_hours: 96, requires_measurement: true }, annotation: 'Medium bill' },
      { id: 'rule-009', priority: 4, inputs: { amount: '> 10000000', is_retention: 'any', variance_pct: 'any' }, outputs: { approval_chain: ['QS', 'PROJECT_MANAGER', 'COMMERCIAL_MANAGER', 'ACCOUNTS_MANAGER', 'MANAGEMENT'], sla_hours: 120, requires_measurement: true }, annotation: 'Large bill requires management' },
      { id: 'rule-010', priority: 5, inputs: { amount: 'any', is_retention: 'true', variance_pct: 'any' }, outputs: { approval_chain: ['QS', 'ACCOUNTS_MANAGER'], sla_hours: 48, requires_measurement: false }, annotation: 'Retention bills skip project management' },
    ],
    effectiveFrom: '2024-01-01',
    approvedBy: 'user-002',
    createdAt: '2023-12-20',
    createdBy: 'user-001',
  },
  {
    id: 'dt-003',
    code: 'DT-PAYMENT-APPROVAL',
    documentType: 'Payment',
    name: 'Payment Approval Routing',
    description: 'Determines payment approval based on amount and payment type',
    version: 1,
    status: 'simulated',
    hitPolicy: 'FIRST',
    inputs: [
      { id: 'input-007', name: 'amount', label: 'Payment Amount (₹)', type: 'number', description: 'Payment amount in INR' },
      { id: 'input-008', name: 'payment_type', label: 'Payment Type', type: 'enum', enumValues: ['vendor', 'subcontractor', 'employee', 'tax'], description: 'Type of payment' },
    ],
    outputs: [
      { id: 'output-007', name: 'approval_levels', label: 'Approval Levels', type: 'role[]', description: 'Required approval roles' },
      { id: 'output-008', name: 'requires_bank_verification', label: 'Requires Bank Verification', type: 'boolean', description: 'Whether bank details need verification' },
    ],
    rules: [
      { id: 'rule-011', priority: 1, inputs: { amount: '<= 2000000', payment_type: 'vendor,subcontractor' }, outputs: { approval_levels: ['ACCOUNTS_MANAGER'], requires_bank_verification: false }, annotation: 'Small vendor/subcontractor payment' },
      { id: 'rule-012', priority: 2, inputs: { amount: '2000001 .. 10000000', payment_type: 'vendor,subcontractor' }, outputs: { approval_levels: ['ACCOUNTS_MANAGER', 'FINANCE_MANAGER'], requires_bank_verification: true }, annotation: 'Medium payment requires finance manager' },
      { id: 'rule-013', priority: 3, inputs: { amount: '> 10000000', payment_type: 'vendor,subcontractor' }, outputs: { approval_levels: ['ACCOUNTS_MANAGER', 'FINANCE_MANAGER', 'CFO'], requires_bank_verification: true }, annotation: 'Large payment requires CFO' },
      { id: 'rule-014', priority: 4, inputs: { amount: 'any', payment_type: 'employee' }, outputs: { approval_levels: ['HR_MANAGER', 'ACCOUNTS_MANAGER'], requires_bank_verification: false }, annotation: 'Employee payments' },
      { id: 'rule-015', priority: 5, inputs: { amount: 'any', payment_type: 'tax' }, outputs: { approval_levels: ['ACCOUNTS_MANAGER'], requires_bank_verification: false }, annotation: 'Tax payments' },
    ],
    effectiveFrom: '2024-02-01',
    createdAt: '2024-01-10',
    createdBy: 'user-001',
  },
];

// ===== AUTHORITY MATRIX =====
export const authorityMatrix: AuthorityMatrix[] = [
  { id: 'auth-001', companyId: 'comp-001', companyName: 'Apex Construction', projectId: 'prj-001', projectName: 'Metro Tower Phase II', roleId: 'role-003', roleName: 'Project Manager', documentType: 'PO', maxAmount: 5000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002', createdAt: '2023-12-15' },
  { id: 'auth-002', companyId: 'comp-001', companyName: 'Apex Construction', projectId: 'prj-001', projectName: 'Metro Tower Phase II', roleId: 'role-011', roleName: 'Commercial Manager', documentType: 'PO', maxAmount: 10000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002', createdAt: '2023-12-15' },
  { id: 'auth-003', companyId: 'comp-001', companyName: 'Apex Construction', roleId: 'role-007', roleName: 'Accounts Manager', documentType: 'PO', maxAmount: 50000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002', createdAt: '2023-12-15' },
  { id: 'auth-004', companyId: 'comp-001', companyName: 'Apex Construction', roleId: 'role-002', roleName: 'Management / CFO', documentType: 'PO', maxAmount: 1000000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-001', createdAt: '2023-12-15' },
  { id: 'auth-005', companyId: 'comp-001', companyName: 'Apex Construction', projectId: 'prj-001', projectName: 'Metro Tower Phase II', roleId: 'role-003', roleName: 'Project Manager', documentType: 'Bill', maxAmount: 2000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002', createdAt: '2023-12-15' },
  { id: 'auth-006', companyId: 'comp-001', companyName: 'Apex Construction', projectId: 'prj-001', projectName: 'Metro Tower Phase II', roleId: 'role-011', roleName: 'Commercial Manager', documentType: 'Bill', maxAmount: 5000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002', createdAt: '2023-12-15' },
  { id: 'auth-007', companyId: 'comp-001', companyName: 'Apex Construction', roleId: 'role-007', roleName: 'Accounts Manager', documentType: 'Bill', maxAmount: 20000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002', createdAt: '2023-12-15' },
  { id: 'auth-008', companyId: 'comp-001', companyName: 'Apex Construction', roleId: 'role-002', roleName: 'Management / CFO', documentType: 'Bill', maxAmount: 1000000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-001', createdAt: '2023-12-15' },
  { id: 'auth-009', companyId: 'comp-001', companyName: 'Apex Construction', roleId: 'role-007', roleName: 'Accounts Manager', documentType: 'Payment', maxAmount: 10000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002', createdAt: '2023-12-15' },
  { id: 'auth-010', companyId: 'comp-001', companyName: 'Apex Construction', roleId: 'role-002', roleName: 'Management / CFO', documentType: 'Payment', maxAmount: 1000000000, currency: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-001', createdAt: '2023-12-15' },
];

// ===== SIMULATION RUNS =====
export const simulationRuns: SimulationRun[] = [
  {
    id: 'sim-001',
    decisionTableId: 'dt-003',
    decisionTableName: 'Payment Approval Routing',
    version: 1,
    periodFrom: '2023-10-01',
    periodTo: '2023-12-31',
    documentCount: 245,
    changedRoutings: 12,
    unchangedRoutings: 233,
    runBy: 'user-001',
    runAt: '2024-01-10T14:30:00Z',
    status: 'completed',
    summary: '12 payments would have different routing under new rules. All changes are within acceptable variance. No critical approvals affected.',
  },
  {
    id: 'sim-002',
    decisionTableId: 'dt-001',
    decisionTableName: 'Purchase Order Approval Routing',
    version: 3,
    periodFrom: '2023-10-01',
    periodTo: '2023-12-31',
    documentCount: 389,
    changedRoutings: 0,
    unchangedRoutings: 389,
    runBy: 'user-001',
    runAt: '2024-01-05T10:15:00Z',
    status: 'completed',
    summary: 'All 389 POs routed identically under new rules. 100% parity with legacy logic confirmed.',
  },
];

// ===== EMERGENCY APPROVALS =====
export const emergencyApprovals: EmergencyApproval[] = [
  {
    id: 'emg-001',
    instanceId: 'inst-010',
    documentType: 'PO',
    documentNumber: 'PO-2024-EMG-001',
    reason: 'Site emergency - structural collapse risk. Immediate material procurement required for safety shoring.',
    evidenceIds: ['evid-001', 'evid-002', 'evid-003'],
    approvedBy: 'user-010',
    approvedByName: 'Rajesh Kumar',
    approvedAt: '2024-01-15T08:30:00Z',
    regulariseBy: '2024-01-22',
    status: 'pending',
    amount: 1250000,
    projectId: 'prj-001',
    projectName: 'Metro Tower Phase II',
  },
  {
    id: 'emg-002',
    instanceId: 'inst-011',
    documentType: 'PO',
    documentNumber: 'PO-2024-EMG-002',
    reason: 'Monsoon damage - urgent repair work required to prevent further structural damage.',
    evidenceIds: ['evid-004', 'evid-005'],
    approvedBy: 'user-011',
    approvedByName: 'Suresh Patel',
    approvedAt: '2024-01-12T16:45:00Z',
    regulariseBy: '2024-01-19',
    regularisedAt: '2024-01-18T10:00:00Z',
    regularisedBy: 'user-020',
    status: 'regularised',
    amount: 850000,
    projectId: 'prj-002',
    projectName: 'Highway Bridge NH-48',
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-RUL-01', stage: 'VERIFY', control: 'New rule version simulated against historical documents before activation', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-RUL-02', stage: 'APPROVE', control: 'Rule activation by maker-checker; authority-matrix changes by CFO office', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-RUL-03', stage: 'VERIFY', control: "Approver's authority limit and SoD validated at action time", enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-RUL-04', stage: 'MONITOR', control: 'SLA breach and emergency approvals pending regularisation', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getDecisionTableStats(): { total: number; active: number; draft: number; simulated: number } {
  return {
    total: decisionTables.length,
    active: decisionTables.filter(dt => dt.status === 'active').length,
    draft: decisionTables.filter(dt => dt.status === 'draft').length,
    simulated: decisionTables.filter(dt => dt.status === 'simulated').length,
  };
}

export function getAuthorityMatrixStats(): { total: number; byDocType: Record<DocumentType, number> } {
  const byDocType = decisionTables.reduce((acc, dt) => {
    acc[dt.documentType] = (acc[dt.documentType] || 0) + 1;
    return acc;
  }, {} as Record<DocumentType, number>);
  
  return {
    total: authorityMatrix.length,
    byDocType,
  };
}

export function getEmergencyStats(): { total: number; pending: number; regularised: number; expired: number } {
  return {
    total: emergencyApprovals.length,
    pending: emergencyApprovals.filter(e => e.status === 'pending').length,
    regularised: emergencyApprovals.filter(e => e.status === 'regularised').length,
    expired: emergencyApprovals.filter(e => e.status === 'expired').length,
  };
}

export function evaluateDecision(tableId: string, inputs: Record<string, any>): DecisionRule | null {
  const table = decisionTables.find(dt => dt.id === tableId);
  if (!table) return null;

  // Simple rule evaluation (in production, this would be a full DMN engine)
  for (const rule of table.rules.sort((a, b) => a.priority - b.priority)) {
    let matches = true;
    
    for (const [key, condition] of Object.entries(rule.inputs)) {
      const inputValue = inputs[key];
      const condStr = String(condition);
      
      if (condStr === 'any') continue;
      
      if (condStr.includes('..')) {
        // Range check
        const [min, max] = condStr.split('..').map(s => parseInt(s.trim()));
        if (inputValue < min || inputValue > max) {
          matches = false;
          break;
        }
      } else if (condStr.startsWith('<=')) {
        const threshold = parseInt(condStr.substring(2).trim());
        if (inputValue > threshold) {
          matches = false;
          break;
        }
      } else if (condStr.startsWith('>')) {
        const threshold = parseInt(condStr.substring(1).trim());
        if (inputValue <= threshold) {
          matches = false;
          break;
        }
      } else if (condStr.includes(',')) {
        // Enum check
        const values = condStr.split(',').map(s => s.trim());
        if (!values.includes(String(inputValue))) {
          matches = false;
          break;
        }
      } else {
        // Exact match
        if (String(inputValue) !== condStr) {
          matches = false;
          break;
        }
      }
    }
    
    if (matches) return rule;
  }
  
  return null;
}
