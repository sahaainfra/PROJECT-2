// Part 14 — Protocol & Control Engine
// Organization-wide governance framework with 8-stage protocol cycle

export type ProtocolStage = 'PLAN' | 'AUTHORIZE' | 'EXECUTE' | 'RECORD' | 'VERIFY' | 'ANALYZE' | 'CONTROL' | 'CLOSE';
export type CheckType = 'PLAN_EXISTS' | 'BUDGET_AVAILABLE' | 'STOCK_AVAILABLE' | 'BALANCE_QTY' | 'DUPLICATE' | 'THRESHOLD' | 'DOCUMENT_REQUIRED' | 'SOD' | 'CERTIFICATION_VALID' | 'PERMIT_VALID' | 'SPEC_APPROVED' | 'TIME_WINDOW' | 'SEQUENCE' | 'GEO_FENCE' | 'RECONCILIATION' | 'CUSTOM';
export type Enforcement = 'BLOCK' | 'EXCEPTION' | 'WARN' | 'MONITOR';
export type Mode = 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
export type EvaluationResult = 'PASS' | 'WARN' | 'EXCEPTION_REQUIRED' | 'BLOCK';
export type ExceptionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'CONSUMED' | 'EXPIRED' | 'REJECTED' | 'RETURNED' | 'EXECUTED_PENDING_REGULARISATION' | 'REGULARISED' | 'ESCALATED';
export type ViolationStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'ESCALATED';
export type EscalationLevel = 'L0' | 'L1' | 'L2' | 'L3';
export type EvidenceType = 'photo' | 'document' | 'field' | 'signature' | 'gps';
export type ReasonCategory = 'cancel' | 'reverse' | 'modify' | 'excess' | 'deviation' | 'backdate' | 'override' | 'waiver' | 'reject' | 'shortclose';
export type ValidityType = 'one_time' | 'until_date' | 'qty_cap' | 'amount_cap';

export interface ControlPoint {
  id: string;
  code: string;
  module: string;
  stage: ProtocolStage;
  trigger: string;
  checkType: CheckType;
  enforcement: Enforcement;
  configJson: Record<string, any>;
  thresholdKey?: string;
  evidenceRuleCode?: string;
  escalationLadderCode?: string;
  ownerRole: string;
  description: string;
  version: number;
  isActive: boolean;
}

export interface ControlPointMode {
  id: string;
  cpCode: string;
  scopeType: 'company' | 'project' | 'module';
  scopeId?: string;
  mode: Mode;
  effectiveFrom: string;
  approvedBy: string;
}

export interface Threshold {
  id: string;
  key: string;
  scopeType: 'company' | 'project';
  scopeId?: string;
  materialGroup?: string;
  category?: string;
  value: number;
  unit: string;
  effectiveFrom: string;
  effectiveTo?: string;
  approvedBy: string;
}

export interface EvidenceRule {
  id: string;
  code: string;
  transactionType: string;
  requiredItems: {
    type: EvidenceType;
    docType?: string;
    minCount: number;
    condition?: string;
  }[];
}

export interface ReasonCode {
  id: string;
  code: string;
  module: string;
  category: ReasonCategory;
  description: string;
  requiresNarrativeMinChars: number;
  isActive: boolean;
}

export interface ExceptionMatrix {
  id: string;
  exceptionType: string;
  severityBandRuleJson: {
    type: 'percentage' | 'absolute' | 'qty' | 'days';
    bands: { min: number; max: number; approverChain: string }[];
  };
}

export interface Evaluation {
  id: string;
  cpCode: string;
  mode: Mode;
  actorId: string;
  actorName: string;
  entityType: string;
  entityId: string;
  action: string;
  result: EvaluationResult;
  failuresJson: { check: string; message: string; threshold?: any }[];
  exceptionId?: string;
  at: string;
  correlationId: string;
}

export interface Exception {
  id: string;
  exceptionNo: string;
  type: string;
  cpCode: string;
  entityType: string;
  entityId: string;
  projectId?: string;
  siteId?: string;
  requestedBy: string;
  requestedByName: string;
  deviationValue: number;
  deviationUnit: string;
  costImpact?: number;
  timeImpactDays?: number;
  reasonCode: string;
  narrative: string;
  evidenceDocIds: string[];
  validityType: ValidityType;
  capValue?: number;
  consumedValue: number;
  validTo?: string;
  isEmergency: boolean;
  regulariseBy?: string;
  status: ExceptionStatus;
  workflowInstanceId?: string;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ControlCycle {
  id: string;
  activityType: string;
  rootEntityType: string;
  rootEntityId: string;
  projectId?: string;
  siteId?: string;
  responsibleId: string;
  responsibleName: string;
  stageStatus: Record<ProtocolStage, {
    status: 'pending' | 'in_progress' | 'completed' | 'skipped';
    entityRef?: string;
    at?: string;
    by?: string;
  }>;
  currentStage: ProtocolStage;
  isClosed: boolean;
}

export interface Violation {
  id: string;
  cpCode: string;
  evaluationId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actorId: string;
  actorName: string;
  projectId?: string;
  siteId?: string;
  departmentId?: string;
  status: ViolationStatus;
  resolvedBy?: string;
  resolutionNote?: string;
  raisedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface Escalation {
  id: string;
  violationId?: string;
  exceptionId?: string;
  level: EscalationLevel;
  recipientIds: string[];
  recipientNames: string[];
  raisedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface EscalationLadder {
  id: string;
  code: string;
  name: string;
  levels: {
    level: EscalationLevel;
    roles: string[];
    slaHours: number;
  }[];
}

// ===== CONTROL POINTS =====
export const controlPoints: ControlPoint[] = [
  {
    id: 'cp-001', code: 'CP-PO-001', module: 'procurement', stage: 'PLAN',
    trigger: 'purchase_order.create', checkType: 'BUDGET_AVAILABLE',
    enforcement: 'BLOCK', configJson: { checkCommitted: true, checkSpent: true },
    thresholdKey: 'PO_BUDGET_THRESHOLD', ownerRole: 'PROJECT_MANAGER',
    description: 'Verify budget availability before PO creation', version: 1, isActive: true
  },
  {
    id: 'cp-002', code: 'CP-PO-002', module: 'procurement', stage: 'VERIFY',
    trigger: 'purchase_order.approve', checkType: 'THRESHOLD',
    enforcement: 'BLOCK', configJson: { field: 'amount', operator: '<=' },
    thresholdKey: 'PO_APPROVAL_LIMIT', ownerRole: 'APPROVER',
    description: 'Check approval authority limit', version: 1, isActive: true
  },
  {
    id: 'cp-003', code: 'CP-GRN-001', module: 'inventory', stage: 'RECORD',
    trigger: 'grn.post', checkType: 'STOCK_AVAILABLE',
    enforcement: 'BLOCK', configJson: { checkPO: true },
    ownerRole: 'STORE_KEEPER',
    description: 'Verify PO exists and quantities match', version: 1, isActive: true
  },
  {
    id: 'cp-004', code: 'CP-ISSUE-001', module: 'inventory', stage: 'EXECUTE',
    trigger: 'material_issue.create', checkType: 'BALANCE_QTY',
    enforcement: 'EXCEPTION', configJson: { allowNegative: false },
    thresholdKey: 'ISSUE_TOLERANCE_PCT', evidenceRuleCode: 'ER-ISSUE-001',
    ownerRole: 'SITE_ENGINEER',
    description: 'Check stock balance before issue', version: 1, isActive: true
  },
  {
    id: 'cp-005', code: 'CP-BILL-001', module: 'finance', stage: 'VERIFY',
    trigger: 'bill.verify', checkType: 'RECONCILIATION',
    enforcement: 'BLOCK', configJson: { checkMB: true, checkMeasurements: true },
    ownerRole: 'QS_ENGINEER',
    description: 'Verify measurement book reconciliation', version: 1, isActive: true
  },
  {
    id: 'cp-006', code: 'CP-PAY-001', module: 'finance', stage: 'AUTHORIZE',
    trigger: 'payment.approve', checkType: 'SOD',
    enforcement: 'BLOCK', configJson: { checkMakerChecker: true },
    ownerRole: 'ACCOUNTS_MANAGER',
    description: 'Segregation of duties check', version: 1, isActive: true
  },
  {
    id: 'cp-007', code: 'CP-WO-001', module: 'project', stage: 'PLAN',
    trigger: 'work_order.create', checkType: 'PERMIT_VALID',
    enforcement: 'BLOCK', configJson: { checkExpiry: true, checkScope: true },
    ownerRole: 'SITE_ENGINEER',
    description: 'Verify work permit validity', version: 1, isActive: true
  },
  {
    id: 'cp-008', code: 'CP-DPR-001', module: 'project', stage: 'RECORD',
    trigger: 'dpr.submit', checkType: 'GEO_FENCE',
    enforcement: 'WARN', configJson: { toleranceMeters: 100 },
    ownerRole: 'SITE_ENGINEER',
    description: 'Verify submission within site geofence', version: 1, isActive: true
  },
  {
    id: 'cp-009', code: 'CP-ATT-001', module: 'hr', stage: 'RECORD',
    trigger: 'attendance.mark', checkType: 'TIME_WINDOW',
    enforcement: 'WARN', configJson: { allowedHours: 8, overtimeThreshold: 2 },
    ownerRole: 'SITE_ENGINEER',
    description: 'Validate attendance within work window', version: 1, isActive: true
  },
  {
    id: 'cp-010', code: 'CP-VAR-001', module: 'project', stage: 'AUTHORIZE',
    trigger: 'variation.approve', checkType: 'SPEC_APPROVED',
    enforcement: 'BLOCK', configJson: { checkClientApproval: true },
    ownerRole: 'PROJECT_MANAGER',
    description: 'Verify client approval for variation', version: 1, isActive: true
  },
  {
    id: 'cp-011', code: 'CP-SEQ-001', module: 'project', stage: 'EXECUTE',
    trigger: 'activity.start', checkType: 'SEQUENCE',
    enforcement: 'BLOCK', configJson: { checkPredecessor: true },
    ownerRole: 'SITE_ENGINEER',
    description: 'Verify predecessor activity complete', version: 1, isActive: true
  },
  {
    id: 'cp-012', code: 'CP-DUP-001', module: 'procurement', stage: 'PLAN',
    trigger: 'purchase_request.create', checkType: 'DUPLICATE',
    enforcement: 'WARN', configJson: { fingerprintFields: ['material', 'qty', 'supplier'], windowDays: 7 },
    ownerRole: 'PROCUREMENT_MANAGER',
    description: 'Detect duplicate purchase requests', version: 1, isActive: true
  },
  {
    id: 'cp-013', code: 'CP-DOC-001', module: 'procurement', stage: 'EXECUTE',
    trigger: 'purchase_order.submit', checkType: 'DOCUMENT_REQUIRED',
    enforcement: 'BLOCK', configJson: { requiredDocs: ['quotation', 'comparison_statement'] },
    evidenceRuleCode: 'ER-PO-001', ownerRole: 'PROCUREMENT_MANAGER',
    description: 'Verify mandatory documents attached', version: 1, isActive: true
  },
  {
    id: 'cp-014', code: 'CP-CERT-001', module: 'quality', stage: 'VERIFY',
    trigger: 'inspection.complete', checkType: 'CERTIFICATION_VALID',
    enforcement: 'BLOCK', configJson: { checkExpiry: true, checkScope: true },
    ownerRole: 'QA_ENGINEER',
    description: 'Verify inspector certification validity', version: 1, isActive: true
  },
  {
    id: 'cp-015', code: 'CP-CLOSE-001', module: 'project', stage: 'CLOSE',
    trigger: 'project.close', checkType: 'RECONCILIATION',
    enforcement: 'BLOCK', configJson: { checkPOs: true, checkBills: true, checkStock: true },
    ownerRole: 'PROJECT_MANAGER',
    description: 'Verify all reconciliations complete before closure', version: 1, isActive: true
  },
];

// ===== CONTROL POINT MODES =====
export const controlPointModes: ControlPointMode[] = [
  { id: 'mode-001', cpCode: 'CP-PO-001', scopeType: 'company', mode: 'ENFORCE', effectiveFrom: '2024-01-01', approvedBy: 'user-001' },
  { id: 'mode-002', cpCode: 'CP-PO-002', scopeType: 'company', mode: 'ENFORCE', effectiveFrom: '2024-01-01', approvedBy: 'user-001' },
  { id: 'mode-003', cpCode: 'CP-GRN-001', scopeType: 'company', mode: 'ENFORCE', effectiveFrom: '2024-01-01', approvedBy: 'user-001' },
  { id: 'mode-004', cpCode: 'CP-ISSUE-001', scopeType: 'project', scopeId: 'prj-001', mode: 'OBSERVE', effectiveFrom: '2024-01-10', approvedBy: 'user-010' },
  { id: 'mode-005', cpCode: 'CP-BILL-001', scopeType: 'company', mode: 'ENFORCE', effectiveFrom: '2024-01-01', approvedBy: 'user-001' },
  { id: 'mode-006', cpCode: 'CP-PAY-001', scopeType: 'company', mode: 'ENFORCE', effectiveFrom: '2024-01-01', approvedBy: 'user-001' },
  { id: 'mode-007', cpCode: 'CP-WO-001', scopeType: 'company', mode: 'WARN', effectiveFrom: '2024-01-05', approvedBy: 'user-001' },
  { id: 'mode-008', cpCode: 'CP-DPR-001', scopeType: 'company', mode: 'OBSERVE', effectiveFrom: '2024-01-15', approvedBy: 'user-001' },
  { id: 'mode-009', cpCode: 'CP-ATT-001', scopeType: 'company', mode: 'WARN', effectiveFrom: '2024-01-01', approvedBy: 'user-001' },
  { id: 'mode-010', cpCode: 'CP-VAR-001', scopeType: 'company', mode: 'ENFORCE', effectiveFrom: '2024-01-01', approvedBy: 'user-001' },
];

// ===== THRESHOLDS =====
export const thresholds: Threshold[] = [
  { id: 'thresh-001', key: 'PO_BUDGET_THRESHOLD', scopeType: 'company', value: 90, unit: '%', effectiveFrom: '2024-01-01', approvedBy: 'user-002' },
  { id: 'thresh-002', key: 'PO_APPROVAL_LIMIT', scopeType: 'company', value: 5000000, unit: 'INR', effectiveFrom: '2024-01-01', approvedBy: 'user-002' },
  { id: 'thresh-003', key: 'ISSUE_TOLERANCE_PCT', scopeType: 'project', scopeId: 'prj-001', value: 5, unit: '%', effectiveFrom: '2024-01-01', approvedBy: 'user-010' },
  { id: 'thresh-004', key: 'ISSUE_TOLERANCE_PCT', scopeType: 'project', scopeId: 'prj-002', value: 3, unit: '%', effectiveFrom: '2024-01-01', approvedBy: 'user-011' },
  { id: 'thresh-005', key: 'OVERTIME_THRESHOLD', scopeType: 'company', value: 2, unit: 'hours', effectiveFrom: '2024-01-01', approvedBy: 'user-023' },
];

// ===== EVIDENCE RULES =====
export const evidenceRules: EvidenceRule[] = [
  {
    id: 'er-001', code: 'ER-ISSUE-001', transactionType: 'material_issue',
    requiredItems: [
      { type: 'signature', minCount: 1, condition: 'receiver' },
      { type: 'gps', minCount: 1, condition: 'site_location' },
    ]
  },
  {
    id: 'er-002', code: 'ER-PO-001', transactionType: 'purchase_order',
    requiredItems: [
      { type: 'document', docType: 'quotation', minCount: 3 },
      { type: 'document', docType: 'comparison_statement', minCount: 1 },
    ]
  },
  {
    id: 'er-003', code: 'ER-EXCEPTION-001', transactionType: 'exception_request',
    requiredItems: [
      { type: 'photo', minCount: 1, condition: 'site_evidence' },
      { type: 'document', docType: 'justification', minCount: 1 },
      { type: 'signature', minCount: 1, condition: 'requester' },
    ]
  },
];

// ===== REASON CODES =====
export const reasonCodes: ReasonCode[] = [
  { id: 'rc-001', code: 'RC-EXCESS-001', module: 'inventory', category: 'excess', description: 'Emergency requirement beyond planned quantity', requiresNarrativeMinChars: 50, isActive: true },
  { id: 'rc-002', code: 'RC-DEVIATION-001', module: 'project', category: 'deviation', description: 'Site condition differs from design', requiresNarrativeMinChars: 100, isActive: true },
  { id: 'rc-003', code: 'RC-BACKDATE-001', module: 'finance', category: 'backdate', description: 'System downtime during original transaction date', requiresNarrativeMinChars: 50, isActive: true },
  { id: 'rc-004', code: 'RC-OVERRIDE-001', module: 'procurement', category: 'override', description: 'Management directive for urgent procurement', requiresNarrativeMinChars: 100, isActive: true },
  { id: 'rc-005', code: 'RC-CANCEL-001', module: 'procurement', category: 'cancel', description: 'Supplier unable to deliver', requiresNarrativeMinChars: 50, isActive: true },
  { id: 'rc-006', code: 'RC-REVERSE-001', module: 'finance', category: 'reverse', description: 'Duplicate payment detected', requiresNarrativeMinChars: 50, isActive: true },
  { id: 'rc-007', code: 'RC-MODIFY-001', module: 'project', category: 'modify', description: 'Design change approved by client', requiresNarrativeMinChars: 100, isActive: true },
  { id: 'rc-008', code: 'RC-WAIVER-001', module: 'quality', category: 'waiver', description: 'Minor deviation acceptable per client approval', requiresNarrativeMinChars: 100, isActive: true },
];

// ===== EXCEPTION MATRIX =====
export const exceptionMatrix: ExceptionMatrix[] = [
  {
    id: 'em-001', exceptionType: 'qty_excess',
    severityBandRuleJson: {
      type: 'percentage',
      bands: [
        { min: 0, max: 5, approverChain: 'SITE_ENGINEER' },
        { min: 5, max: 10, approverChain: 'PROJECT_MANAGER' },
        { min: 10, max: 20, approverChain: 'PROJECT_MANAGER,COST_CONTROLLER' },
        { min: 20, max: 100, approverChain: 'PROJECT_MANAGER,COST_CONTROLLER,MANAGEMENT' },
      ]
    }
  },
  {
    id: 'em-002', exceptionType: 'amount_excess',
    severityBandRuleJson: {
      type: 'absolute',
      bands: [
        { min: 0, max: 100000, approverChain: 'PROJECT_MANAGER' },
        { min: 100000, max: 500000, approverChain: 'PROJECT_MANAGER,COMMERCIAL_MANAGER' },
        { min: 500000, max: 2000000, approverChain: 'PROJECT_MANAGER,COMMERCIAL_MANAGER,FINANCE_MANAGER' },
        { min: 2000000, max: 100000000, approverChain: 'PROJECT_MANAGER,COMMERCIAL_MANAGER,FINANCE_MANAGER,CFO' },
      ]
    }
  },
  {
    id: 'em-003', exceptionType: 'time_extension',
    severityBandRuleJson: {
      type: 'days',
      bands: [
        { min: 0, max: 7, approverChain: 'PROJECT_MANAGER' },
        { min: 7, max: 30, approverChain: 'PROJECT_MANAGER,PLANNING_MANAGER' },
        { min: 30, max: 90, approverChain: 'PROJECT_MANAGER,PLANNING_MANAGER,PROJECT_DIRECTOR' },
        { min: 90, max: 3650, approverChain: 'PROJECT_MANAGER,PLANNING_MANAGER,PROJECT_DIRECTOR,MANAGEMENT' },
      ]
    }
  },
];

// ===== EVALUATIONS =====
export const evaluations: Evaluation[] = [
  {
    id: 'eval-001', cpCode: 'CP-PO-001', mode: 'ENFORCE', actorId: 'user-020', actorName: 'Amit Shah',
    entityType: 'PurchaseOrder', entityId: 'po-089', action: 'create', result: 'PASS',
    failuresJson: [], at: '2024-01-15T10:00:00Z', correlationId: 'corr-po-089'
  },
  {
    id: 'eval-002', cpCode: 'CP-ISSUE-001', mode: 'OBSERVE', actorId: 'user-015', actorName: 'Ravi Sharma',
    entityType: 'MaterialIssue', entityId: 'mi-045', action: 'create', result: 'EXCEPTION_REQUIRED',
    failuresJson: [{ check: 'BALANCE_QTY', message: 'Issue quantity exceeds balance by 8%', threshold: '5%' }],
    exceptionId: 'exc-001', at: '2024-01-16T14:30:00Z', correlationId: 'corr-mi-045'
  },
  {
    id: 'eval-003', cpCode: 'CP-DPR-001', mode: 'OBSERVE', actorId: 'user-015', actorName: 'Ravi Sharma',
    entityType: 'DPR', entityId: 'dpr-2024-01-16', action: 'submit', result: 'WARN',
    failuresJson: [{ check: 'GEO_FENCE', message: 'Submission location 120m from site boundary', threshold: '100m' }],
    at: '2024-01-16T18:00:00Z', correlationId: 'corr-dpr-0116'
  },
  {
    id: 'eval-004', cpCode: 'CP-PO-002', mode: 'ENFORCE', actorId: 'user-010', actorName: 'Rajesh Kumar',
    entityType: 'PurchaseOrder', entityId: 'po-090', action: 'approve', result: 'BLOCK',
    failuresJson: [{ check: 'THRESHOLD', message: 'PO amount ₹1.25Cr exceeds approval limit ₹50L', threshold: '5000000' }],
    at: '2024-01-16T11:30:00Z', correlationId: 'corr-po-090'
  },
  {
    id: 'eval-005', cpCode: 'CP-BILL-001', mode: 'ENFORCE', actorId: 'user-025', actorName: 'Anil Mehta',
    entityType: 'Bill', entityId: 'bill-447', action: 'verify', result: 'PASS',
    failuresJson: [], at: '2024-01-16T16:00:00Z', correlationId: 'corr-bill-447'
  },
];

// ===== EXCEPTIONS =====
export const exceptions: Exception[] = [
  {
    id: 'exc-001', exceptionNo: 'EXC-2024-001', type: 'qty_excess', cpCode: 'CP-ISSUE-001',
    entityType: 'MaterialIssue', entityId: 'mi-045', projectId: 'prj-001', siteId: 'site-001',
    requestedBy: 'user-015', requestedByName: 'Ravi Sharma', deviationValue: 8, deviationUnit: '%',
    costImpact: 125000, reasonCode: 'RC-EXCESS-001',
    narrative: 'Emergency requirement for column casting due to unexpected design change. Client approved variation VAR-2024-015. Material urgently needed to avoid work stoppage.',
    evidenceDocIds: ['doc-001', 'doc-002', 'doc-003'], validityType: 'one_time', capValue: 10,
    consumedValue: 8, isEmergency: false, status: 'APPROVED', workflowInstanceId: 'wf-exc-001',
    requestedAt: '2024-01-16T14:35:00Z', approvedAt: '2024-01-16T15:00:00Z', approvedBy: 'user-010'
  },
  {
    id: 'exc-002', exceptionNo: 'EXC-2024-002', type: 'amount_excess', cpCode: 'CP-PO-001',
    entityType: 'PurchaseOrder', entityId: 'po-091', projectId: 'prj-002',
    requestedBy: 'user-011', requestedByName: 'Suresh Patel', deviationValue: 750000, deviationUnit: 'INR',
    costImpact: 750000, reasonCode: 'RC-OVERRIDE-001',
    narrative: 'Price escalation due to steel rate increase. Original budget based on Q3 2023 rates. Current market rates 15% higher. Urgent requirement for bridge construction.',
    evidenceDocIds: ['doc-004', 'doc-005'], validityType: 'amount_cap', capValue: 1000000,
    consumedValue: 750000, isEmergency: false, status: 'SUBMITTED', workflowInstanceId: 'wf-exc-002',
    requestedAt: '2024-01-16T16:00:00Z'
  },
  {
    id: 'exc-003', exceptionNo: 'EXC-2024-003', type: 'qty_excess', cpCode: 'CP-ISSUE-001',
    entityType: 'MaterialIssue', entityId: 'mi-046', projectId: 'prj-001', siteId: 'site-001',
    requestedBy: 'user-015', requestedByName: 'Ravi Sharma', deviationValue: 15, deviationUnit: '%',
    costImpact: 225000, reasonCode: 'RC-EXCESS-001',
    narrative: 'EMERGENCY: Structural collapse risk. Immediate shoring material required for safety. Site evacuated, work stopped.',
    evidenceDocIds: ['doc-006', 'doc-007', 'doc-008', 'doc-009'], validityType: 'one_time',
    consumedValue: 0, isEmergency: true, regulariseBy: '2024-01-17T18:00:00Z',
    status: 'EXECUTED_PENDING_REGULARISATION', requestedAt: '2024-01-16T08:30:00Z'
  },
];

// ===== CONTROL CYCLES =====
export const controlCycles: ControlCycle[] = [
  {
    id: 'cycle-001', activityType: 'purchase_order', rootEntityType: 'PurchaseOrder', rootEntityId: 'po-089',
    projectId: 'prj-001', responsibleId: 'user-020', responsibleName: 'Amit Shah',
    stageStatus: {
      PLAN: { status: 'completed', entityRef: 'pr-234', at: '2024-01-14T10:00:00Z', by: 'user-015' },
      AUTHORIZE: { status: 'completed', entityRef: 'pr-234', at: '2024-01-15T09:00:00Z', by: 'user-010' },
      EXECUTE: { status: 'completed', entityRef: 'po-089', at: '2024-01-15T10:00:00Z', by: 'user-020' },
      RECORD: { status: 'in_progress' },
      VERIFY: { status: 'pending' },
      ANALYZE: { status: 'pending' },
      CONTROL: { status: 'pending' },
      CLOSE: { status: 'pending' },
    },
    currentStage: 'RECORD', isClosed: false
  },
  {
    id: 'cycle-002', activityType: 'bill', rootEntityType: 'Bill', rootEntityId: 'bill-447',
    projectId: 'prj-001', responsibleId: 'user-022', responsibleName: 'Vikram Desai',
    stageStatus: {
      PLAN: { status: 'completed', entityRef: 'wo-045', at: '2023-12-01T10:00:00Z', by: 'user-010' },
      AUTHORIZE: { status: 'completed', entityRef: 'wo-045', at: '2023-12-05T14:00:00Z', by: 'user-011' },
      EXECUTE: { status: 'completed', entityRef: 'mb-2024-012', at: '2024-01-10T16:00:00Z', by: 'user-025' },
      RECORD: { status: 'completed', entityRef: 'bill-447', at: '2024-01-16T09:00:00Z', by: 'user-022' },
      VERIFY: { status: 'completed', entityRef: 'bill-447', at: '2024-01-16T16:00:00Z', by: 'user-025' },
      ANALYZE: { status: 'in_progress' },
      CONTROL: { status: 'pending' },
      CLOSE: { status: 'pending' },
    },
    currentStage: 'ANALYZE', isClosed: false
  },
];

// ===== VIOLATIONS =====
export const violations: Violation[] = [
  {
    id: 'viol-001', cpCode: 'CP-PO-002', evaluationId: 'eval-004', severity: 'high',
    actorId: 'user-010', actorName: 'Rajesh Kumar', projectId: 'prj-001',
    status: 'OPEN', raisedAt: '2024-01-16T11:30:00Z'
  },
  {
    id: 'viol-002', cpCode: 'CP-ISSUE-001', evaluationId: 'eval-002', severity: 'medium',
    actorId: 'user-015', actorName: 'Ravi Sharma', projectId: 'prj-001', siteId: 'site-001',
    status: 'ACKNOWLEDGED', raisedAt: '2024-01-16T14:30:00Z', acknowledgedAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'viol-003', cpCode: 'CP-DPR-001', evaluationId: 'eval-003', severity: 'low',
    actorId: 'user-015', actorName: 'Ravi Sharma', projectId: 'prj-001', siteId: 'site-001',
    status: 'RESOLVED', raisedAt: '2024-01-16T18:00:00Z', acknowledgedAt: '2024-01-16T18:30:00Z',
    resolvedBy: 'user-015', resolutionNote: 'GPS device calibration issue. Recalibrated and resubmitted.',
    resolvedAt: '2024-01-16T19:00:00Z'
  },
];

// ===== ESCALATIONS =====
export const escalations: Escalation[] = [
  {
    id: 'esc-001', violationId: 'viol-001', level: 'L1',
    recipientIds: ['user-010'], recipientNames: ['Rajesh Kumar'],
    raisedAt: '2024-01-16T11:30:00Z'
  },
  {
    id: 'esc-002', exceptionId: 'exc-003', level: 'L2',
    recipientIds: ['user-010', 'user-002'], recipientNames: ['Rajesh Kumar', 'Priya Sharma'],
    raisedAt: '2024-01-16T14:00:00Z', acknowledgedAt: '2024-01-16T14:15:00Z'
  },
];

// ===== ESCALATION LADDERS =====
export const escalationLadders: EscalationLadder[] = [
  {
    id: 'ladder-001', code: 'EL-PROCUREMENT', name: 'Procurement Escalation',
    levels: [
      { level: 'L0', roles: ['PROCUREMENT_MANAGER'], slaHours: 4 },
      { level: 'L1', roles: ['PROJECT_MANAGER'], slaHours: 8 },
      { level: 'L2', roles: ['COMMERCIAL_MANAGER', 'FINANCE_MANAGER'], slaHours: 24 },
      { level: 'L3', roles: ['CFO', 'MANAGEMENT'], slaHours: 48 },
    ]
  },
  {
    id: 'ladder-002', code: 'EL-FINANCE', name: 'Finance Escalation',
    levels: [
      { level: 'L0', roles: ['ACCOUNTS_MANAGER'], slaHours: 4 },
      { level: 'L1', roles: ['FINANCE_MANAGER'], slaHours: 8 },
      { level: 'L2', roles: ['CFO'], slaHours: 24 },
      { level: 'L3', roles: ['MANAGEMENT'], slaHours: 48 },
    ]
  },
  {
    id: 'ladder-003', code: 'EL-PROJECT', name: 'Project Escalation',
    levels: [
      { level: 'L0', roles: ['SITE_ENGINEER'], slaHours: 2 },
      { level: 'L1', roles: ['PROJECT_MANAGER'], slaHours: 4 },
      { level: 'L2', roles: ['PROJECT_DIRECTOR'], slaHours: 12 },
      { level: 'L3', roles: ['MANAGEMENT'], slaHours: 24 },
    ]
  },
];

// ===== PROTOCOL CONTROL POINTS (Self-referential) =====
export const protocolControlPoints = [
  { id: 'CP-PRT-01', stage: 'AUTHORIZE', control: 'Any change to control points, thresholds, modes, reason codes or exception matrix is maker-checker', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-PRT-02', stage: 'VERIFY', control: 'Switching a CP to ENFORCE requires ≥ 14 days of OBSERVE data and a signed impact review', enforcement: 'EXCEPTION', status: 'OBSERVE' },
  { id: 'CP-PRT-03', stage: 'MONITOR', control: 'Exceptions nearing expiry/cap and emergencies nearing regularisation deadline', enforcement: 'MONITOR', status: 'OBSERVE' },
  { id: 'CP-PRT-04', stage: 'CLOSE', control: 'Violations cannot be closed without resolution note and evidence', enforcement: 'BLOCK', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getControlPointStats(): { total: number; enforce: number; observe: number; warn: number; off: number } {
  const modes = controlPointModes.reduce((acc, m) => {
    acc[m.mode] = (acc[m.mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: controlPoints.length,
    enforce: modes['ENFORCE'] || 0,
    observe: modes['OBSERVE'] || 0,
    warn: modes['WARN'] || 0,
    off: modes['OFF'] || 0,
  };
}

export function getExceptionStats(): { total: number; pending: number; approved: number; consumed: number; emergency: number } {
  return {
    total: exceptions.length,
    pending: exceptions.filter(e => e.status === 'SUBMITTED' || e.status === 'DRAFT').length,
    approved: exceptions.filter(e => e.status === 'APPROVED').length,
    consumed: exceptions.filter(e => e.status === 'CONSUMED').length,
    emergency: exceptions.filter(e => e.isEmergency).length,
  };
}

export function getViolationStats(): { total: number; open: number; acknowledged: number; resolved: number; escalated: number } {
  return {
    total: violations.length,
    open: violations.filter(v => v.status === 'OPEN').length,
    acknowledged: violations.filter(v => v.status === 'ACKNOWLEDGED').length,
    resolved: violations.filter(v => v.status === 'RESOLVED').length,
    escalated: violations.filter(v => v.status === 'ESCALATED').length,
  };
}

export function getEvaluationStats(): { total: number; pass: number; warn: number; exception: number; block: number } {
  return {
    total: evaluations.length,
    pass: evaluations.filter(e => e.result === 'PASS').length,
    warn: evaluations.filter(e => e.result === 'WARN').length,
    exception: evaluations.filter(e => e.result === 'EXCEPTION_REQUIRED').length,
    block: evaluations.filter(e => e.result === 'BLOCK').length,
  };
}
