// Part 09 — Security, Identity & Segregation of Duties
// Enterprise identity, ABAC, SoD rules, and privileged access management

export type MFAMethod = 'totp' | 'webauthn' | 'sms' | 'email';
export type DeviceTrustLevel = 'trusted' | 'managed' | 'personal' | 'unknown';
export type SessionStatus = 'active' | 'expired' | 'revoked';
export type ABACPolicyEffect = 'allow' | 'deny';
export type ABACPolicyStatus = 'draft' | 'active' | 'retired';
export type SoDScope = 'same_record' | 'record_chain' | 'period';
export type SoDSeverity = 'critical' | 'high' | 'medium' | 'low';
export type SoDMode = 'observe' | 'enforce';
export type SoDStatus = 'draft' | 'approved' | 'active' | 'retired';
export type SoDExceptionStatus = 'requested' | 'approved' | 'expired' | 'revoked';
export type SoDFindingStatus = 'detected' | 'acknowledged' | 'resolved' | 'false_positive';
export type AccessReviewDecision = 'keep' | 'revoke' | 'pending';
export type AccessReviewCampaignStatus = 'open' | 'in_review' | 'closed';
export type PrivilegedSessionStatus = 'active' | 'ended' | 'expired';

export interface IdentityExtension {
  id: string;
  userId: string;
  userName: string;
  idp: 'local' | 'oidc' | 'saml';
  subject?: string;
  mfaMethods: MFAMethod[];
  passkeysCount: number;
  lastMfaAt?: string;
  riskLevel: 'low' | 'medium' | 'high';
  mfaEnforced: boolean;
}

export interface Device {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  platform: 'windows' | 'macos' | 'linux' | 'ios' | 'android';
  browser: string;
  trustLevel: DeviceTrustLevel;
  registeredAt: string;
  lastSeenAt: string;
  revokedAt?: string;
  revokeReason?: string;
}

export interface Session {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  issuedAt: string;
  expiresAt: string;
  refreshFamilyId: string;
  status: SessionStatus;
  ipAddress: string;
  geoLocation?: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface ABACPolicy {
  id: string;
  code: string;
  name: string;
  description: string;
  resourceType: string;
  expression: string;
  effect: ABACPolicyEffect;
  priority: number;
  status: ABACPolicyStatus;
  version: number;
  createdBy: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface SoDRule {
  id: string;
  code: string;
  name: string;
  description: string;
  actionA: string;
  actionB: string;
  scope: SoDScope;
  severity: SoDSeverity;
  mode: SoDMode;
  status: SoDStatus;
  approvedBy?: string;
  activatedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface SoDException {
  id: string;
  ruleId: string;
  ruleCode: string;
  userId: string;
  userName: string;
  scope: Record<string, any>;
  reason: string;
  compensatingControl: string;
  validFrom: string;
  validTo: string;
  requestedBy: string;
  approvedBy?: string;
  status: SoDExceptionStatus;
  createdAt: string;
}

export interface SoDFinding {
  id: string;
  ruleId: string;
  ruleCode: string;
  recordType: string;
  recordId: string;
  recordName: string;
  actorA: string;
  actorAName: string;
  actorB: string;
  actorBName: string;
  detectedAt: string;
  ownerId: string;
  ownerName: string;
  status: SoDFindingStatus;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface AccessReviewCampaign {
  id: string;
  name: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: AccessReviewCampaignStatus;
  totalGrants: number;
  reviewedGrants: number;
  keptGrants: number;
  revokedGrants: number;
  pendingGrants: number;
  createdBy: string;
}

export interface AccessReviewItem {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  roleId: string;
  roleName: string;
  scopeType: string;
  scopeName: string;
  grantedAt: string;
  reviewerId?: string;
  reviewerName?: string;
  decision: AccessReviewDecision;
  decidedAt?: string;
  comments?: string;
}

export interface PrivilegedSession {
  id: string;
  adminId: string;
  adminName: string;
  approvedBy: string;
  approverName: string;
  reason: string;
  startedAt: string;
  endedAt?: string;
  expiresAt: string;
  actionsCount: number;
  status: PrivilegedSessionStatus;
}

// ===== IDENTITY EXTENSIONS =====
export const identityExtensions: IdentityExtension[] = [
  { id: 'id-001', userId: 'user-001', userName: 'Rajesh Kumar', idp: 'local', mfaMethods: ['totp', 'webauthn'], passkeysCount: 2, lastMfaAt: '2024-01-16T14:30:00Z', riskLevel: 'high', mfaEnforced: true },
  { id: 'id-002', userId: 'user-002', userName: 'Priya Sharma', idp: 'local', mfaMethods: ['totp'], passkeysCount: 1, lastMfaAt: '2024-01-16T10:15:00Z', riskLevel: 'high', mfaEnforced: true },
  { id: 'id-003', userId: 'user-010', userName: 'Rajesh Kumar (PM)', idp: 'local', mfaMethods: ['totp'], passkeysCount: 1, lastMfaAt: '2024-01-16T09:45:00Z', riskLevel: 'medium', mfaEnforced: true },
  { id: 'id-004', userId: 'user-015', userName: 'Ravi Sharma', idp: 'local', mfaMethods: ['totp'], passkeysCount: 0, lastMfaAt: '2024-01-16T09:30:00Z', riskLevel: 'low', mfaEnforced: false },
  { id: 'id-005', userId: 'user-022', userName: 'Vikram Desai', idp: 'local', mfaMethods: ['totp', 'webauthn'], passkeysCount: 1, lastMfaAt: '2024-01-16T10:30:00Z', riskLevel: 'high', mfaEnforced: true },
  { id: 'id-006', userId: 'user-023', userName: 'Kavita Nair', idp: 'local', mfaMethods: ['totp'], passkeysCount: 0, lastMfaAt: '2024-01-15T16:00:00Z', riskLevel: 'medium', mfaEnforced: true },
];

// ===== DEVICES =====
export const devices: Device[] = [
  { id: 'dev-001', userId: 'user-001', userName: 'Rajesh Kumar', deviceId: 'device-abc-123', deviceName: 'Office Desktop', platform: 'windows', browser: 'Chrome 120', trustLevel: 'managed', registeredAt: '2023-01-15', lastSeenAt: '2024-01-16T15:45:00Z' },
  { id: 'dev-002', userId: 'user-001', userName: 'Rajesh Kumar', deviceId: 'device-def-456', deviceName: 'Home Laptop', platform: 'macos', browser: 'Safari 17', trustLevel: 'personal', registeredAt: '2023-06-20', lastSeenAt: '2024-01-15T22:30:00Z' },
  { id: 'dev-003', userId: 'user-015', userName: 'Ravi Sharma', deviceId: 'device-ghi-789', deviceName: 'iPhone 13', platform: 'ios', browser: 'Safari 17', trustLevel: 'trusted', registeredAt: '2023-03-15', lastSeenAt: '2024-01-16T15:30:00Z' },
  { id: 'dev-004', userId: 'user-002', userName: 'Priya Sharma', deviceId: 'device-jkl-012', deviceName: 'CFO Laptop', platform: 'windows', browser: 'Chrome 120', trustLevel: 'managed', registeredAt: '2023-01-10', lastSeenAt: '2024-01-16T15:45:00Z' },
  { id: 'dev-005', userId: 'user-022', userName: 'Vikram Desai', deviceId: 'device-mno-345', deviceName: 'Accounts Desktop', platform: 'windows', browser: 'Edge 120', trustLevel: 'managed', registeredAt: '2023-01-15', lastSeenAt: '2024-01-16T14:00:00Z' },
];

// ===== SESSIONS =====
export const sessions: Session[] = [
  { id: 'sess-001', sessionId: 'session-xyz-001', userId: 'user-001', userName: 'Rajesh Kumar', deviceId: 'device-abc-123', deviceName: 'Office Desktop', issuedAt: '2024-01-16T09:00:00Z', expiresAt: '2024-01-16T17:00:00Z', refreshFamilyId: 'family-001', status: 'active', ipAddress: '192.168.1.100', geoLocation: 'Mumbai, IN' },
  { id: 'sess-002', sessionId: 'session-xyz-002', userId: 'user-010', userName: 'Rajesh Kumar (PM)', deviceId: 'device-def-456', deviceName: 'Home Laptop', issuedAt: '2024-01-16T09:15:00Z', expiresAt: '2024-01-16T17:15:00Z', refreshFamilyId: 'family-002', status: 'active', ipAddress: '192.168.1.101', geoLocation: 'Mumbai, IN' },
  { id: 'sess-003', sessionId: 'session-xyz-003', userId: 'user-015', userName: 'Ravi Sharma', deviceId: 'device-ghi-789', deviceName: 'iPhone 13', issuedAt: '2024-01-16T09:30:00Z', expiresAt: '2024-01-16T17:30:00Z', refreshFamilyId: 'family-003', status: 'active', ipAddress: '10.0.0.50', geoLocation: 'Mumbai, IN' },
  { id: 'sess-004', sessionId: 'session-xyz-004', userId: 'user-002', userName: 'Priya Sharma', deviceId: 'device-jkl-012', deviceName: 'CFO Laptop', issuedAt: '2024-01-16T10:00:00Z', expiresAt: '2024-01-16T18:00:00Z', refreshFamilyId: 'family-004', status: 'active', ipAddress: '192.168.1.102', geoLocation: 'Mumbai, IN' },
  { id: 'sess-005', sessionId: 'session-xyz-005', userId: 'user-022', userName: 'Vikram Desai', deviceId: 'device-mno-345', deviceName: 'Accounts Desktop', issuedAt: '2024-01-16T10:30:00Z', expiresAt: '2024-01-16T18:30:00Z', refreshFamilyId: 'family-005', status: 'active', ipAddress: '192.168.1.104', geoLocation: 'Mumbai, IN' },
];

// ===== ABAC POLICIES =====
export const abacPolicies: ABACPolicy[] = [
  { id: 'abac-001', code: 'ABAC-001', name: 'Project Manager Scope', description: 'PM can only access allocated projects', resourceType: 'project', expression: 'user.projectAllocations.includes(resource.projectId)', effect: 'allow', priority: 10, status: 'active', version: 1, createdBy: 'user-001', createdAt: '2024-01-01', lastModifiedAt: '2024-01-01' },
  { id: 'abac-002', code: 'ABAC-002', name: 'Site Engineer Scope', description: 'Site Engineer can only access allocated sites', resourceType: 'site', expression: 'user.siteAllocations.includes(resource.siteId)', effect: 'allow', priority: 10, status: 'active', version: 1, createdBy: 'user-001', createdAt: '2024-01-01', lastModifiedAt: '2024-01-01' },
  { id: 'abac-003', code: 'ABAC-003', name: 'Amount Limit Check', description: 'Approval authority limited by amount', resourceType: 'purchase_order', expression: 'resource.amount <= user.approvalLimit', effect: 'allow', priority: 20, status: 'active', version: 1, createdBy: 'user-001', createdAt: '2024-01-01', lastModifiedAt: '2024-01-01' },
  { id: 'abac-004', code: 'ABAC-004', name: 'Sensitive Field Masking', description: 'Mask salary for non-HR users', resourceType: 'employee', expression: 'user.role !== "HR_MANAGER" && field === "salary"', effect: 'deny', priority: 30, status: 'active', version: 1, createdBy: 'user-001', createdAt: '2024-01-01', lastModifiedAt: '2024-01-01' },
  { id: 'abac-005', code: 'ABAC-005', name: 'Department Scope', description: 'Manager can access department records', resourceType: 'employee', expression: 'user.departmentId === resource.departmentId', effect: 'allow', priority: 15, status: 'active', version: 1, createdBy: 'user-001', createdAt: '2024-01-01', lastModifiedAt: '2024-01-01' },
];

// ===== SOD RULES =====
export const sodRules: SoDRule[] = [
  { id: 'sod-001', code: 'SOD-PR-CREATE-APPROVE', name: 'PR Creator ≠ PR Approver', description: 'Purchase Request creator cannot approve the same PR', actionA: 'proc.pr.create', actionB: 'proc.pr.approve', scope: 'same_record', severity: 'high', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-002', code: 'SOD-PO-CREATE-APPROVE', name: 'PO Creator ≠ PO Approver', description: 'Purchase Order creator cannot approve the same PO', actionA: 'proc.po.create', actionB: 'proc.po.approve', scope: 'same_record', severity: 'high', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-003', code: 'SOD-PURCHASER-RECEIVER', name: 'Purchaser ≠ Goods Receiver', description: 'Person who creates PO cannot receive goods', actionA: 'proc.po.create', actionB: 'inv.grn.create', scope: 'record_chain', severity: 'high', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-004', code: 'SOD-BILL-CREATE-VERIFY', name: 'Bill Creator ≠ Bill Verifier', description: 'Bill creator cannot verify the same bill', actionA: 'fin.bill.create', actionB: 'fin.bill.verify', scope: 'same_record', severity: 'high', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-005', code: 'SOD-BILL-VERIFY-APPROVE', name: 'Bill Verifier ≠ Bill Approver', description: 'Bill verifier cannot approve the same bill', actionA: 'fin.bill.verify', actionB: 'fin.bill.approve', scope: 'same_record', severity: 'critical', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-006', code: 'SOD-PROCUREMENT-STOCK', name: 'Procurement Authority ≠ Stock Custody', description: 'Procurement manager cannot have stock custody', actionA: 'proc.po.approve', actionB: 'inv.stock.manage', scope: 'period', severity: 'high', mode: 'observe', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-20', createdBy: 'user-001' },
  { id: 'sod-007', code: 'SOD-PAYROLL-PREPARE-APPROVE', name: 'Payroll Preparer ≠ Payroll Approver', description: 'Payroll preparer cannot approve payroll', actionA: 'fin.payroll.prepare', actionB: 'fin.payroll.approve', scope: 'same_record', severity: 'critical', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-008', code: 'SOD-VENDOR-CREATE-VERIFY', name: 'Vendor Master Creator ≠ Bank Verifier', description: 'Vendor creator cannot verify bank details', actionA: 'proc.vendor.create', actionB: 'proc.vendor.verify_bank', scope: 'same_record', severity: 'high', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-009', code: 'SOD-BUDGET-PREPARE-APPROVE', name: 'Budget Preparer ≠ Budget Approver', description: 'Budget preparer cannot approve budget', actionA: 'fin.budget.prepare', actionB: 'fin.budget.approve', scope: 'same_record', severity: 'high', mode: 'enforce', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-15', createdBy: 'user-001' },
  { id: 'sod-010', code: 'SOD-ROLE-ASSIGN-EDIT', name: 'Role Assigner ≠ Role Editor', description: 'Cannot assign roles and edit role permissions', actionA: 'iam.assignment.assign', actionB: 'iam.role.edit', scope: 'period', severity: 'medium', mode: 'observe', status: 'active', approvedBy: 'user-002', activatedAt: '2024-01-01', createdAt: '2023-12-20', createdBy: 'user-001' },
];

// ===== SOD EXCEPTIONS =====
export const sodExceptions: SoDException[] = [
  { id: 'exc-001', ruleId: 'sod-006', ruleCode: 'SOD-PROCUREMENT-STOCK', userId: 'user-020', userName: 'Amit Shah', scope: { projectId: 'prj-003', reason: 'Small project with limited staff' }, reason: 'Small project with only one procurement staff', compensatingControl: 'Monthly review by Finance Manager', validFrom: '2024-01-01', validTo: '2024-06-30', requestedBy: 'user-010', approvedBy: 'user-002', status: 'approved', createdAt: '2023-12-28' },
  { id: 'exc-002', ruleId: 'sod-010', ruleCode: 'SOD-ROLE-ASSIGN-EDIT', userId: 'user-001', userName: 'Rajesh Kumar', scope: { reason: 'Emergency access for system migration' }, reason: 'Temporary access for system migration project', compensatingControl: 'All changes logged and reviewed by Security Officer', validFrom: '2024-01-15', validTo: '2024-01-31', requestedBy: 'user-001', approvedBy: 'user-002', status: 'approved', createdAt: '2024-01-14' },
];

// ===== SOD FINDINGS =====
export const sodFindings: SoDFinding[] = [
  { id: 'find-001', ruleId: 'sod-006', ruleCode: 'SOD-PROCUREMENT-STOCK', recordType: 'project', recordId: 'prj-004', recordName: 'Industrial Park Unit 3', actorA: 'user-013', actorAName: 'Arun Krishnan', actorB: 'user-013', actorBName: 'Arun Krishnan', detectedAt: '2024-01-16T02:00:00Z', ownerId: 'user-002', ownerName: 'Priya Sharma', status: 'acknowledged' },
  { id: 'find-002', ruleId: 'sod-003', ruleCode: 'SOD-PURCHASER-RECEIVER', recordType: 'purchase_order', recordId: 'po-045', recordName: 'PO-2024-0045', actorA: 'user-020', actorAName: 'Amit Shah', actorB: 'user-020', actorBName: 'Amit Shah', detectedAt: '2024-01-16T02:00:00Z', ownerId: 'user-002', ownerName: 'Priya Sharma', status: 'detected' },
  { id: 'find-003', ruleId: 'sod-001', ruleCode: 'SOD-PR-CREATE-APPROVE', recordType: 'purchase_request', recordId: 'pr-089', recordName: 'PR-2024-0089', actorA: 'user-015', actorAName: 'Ravi Sharma', actorB: 'user-015', actorBName: 'Ravi Sharma', detectedAt: '2024-01-15T02:00:00Z', ownerId: 'user-010', ownerName: 'Rajesh Kumar (PM)', status: 'resolved', resolvedAt: '2024-01-15T10:00:00Z', resolutionNotes: 'Exception approved for emergency procurement' },
];

// ===== ACCESS REVIEW CAMPAIGNS =====
export const accessReviewCampaigns: AccessReviewCampaign[] = [
  { id: 'campaign-001', name: 'Q1 2024 Access Review', scope: 'All Users - Company Wide', startDate: '2024-01-01', endDate: '2024-01-31', status: 'in_review', totalGrants: 156, reviewedGrants: 89, keptGrants: 82, revokedGrants: 7, pendingGrants: 67, createdBy: 'user-001' },
  { id: 'campaign-002', name: 'Project PRJ-001 Access Review', scope: 'Metro Tower Phase II', startDate: '2024-01-10', endDate: '2024-01-25', status: 'in_review', totalGrants: 24, reviewedGrants: 18, keptGrants: 16, revokedGrants: 2, pendingGrants: 6, createdBy: 'user-010' },
  { id: 'campaign-003', name: 'Q4 2023 Access Review', scope: 'All Users - Company Wide', startDate: '2023-10-01', endDate: '2023-10-31', status: 'closed', totalGrants: 148, reviewedGrants: 148, keptGrants: 138, revokedGrants: 10, pendingGrants: 0, createdBy: 'user-001' },
];

// ===== ACCESS REVIEW ITEMS =====
export const accessReviewItems: AccessReviewItem[] = [
  { id: 'review-001', campaignId: 'campaign-001', userId: 'user-015', userName: 'Ravi Sharma', roleId: 'role-004', roleName: 'Site Engineer', scopeType: 'site', scopeName: 'Metro Tower Site A', grantedAt: '2023-03-15', reviewerId: 'user-010', reviewerName: 'Rajesh Kumar (PM)', decision: 'keep', decidedAt: '2024-01-12T10:00:00Z', comments: 'Active site engineer, access required' },
  { id: 'review-002', campaignId: 'campaign-001', userId: 'user-021', userName: 'Neha Gupta', roleId: 'role-006', roleName: 'Store Keeper', scopeType: 'site', scopeName: 'Metro Tower Site A', grantedAt: '2023-03-20', reviewerId: 'user-010', reviewerName: 'Rajesh Kumar (PM)', decision: 'keep', decidedAt: '2024-01-12T10:05:00Z', comments: 'Store operations ongoing' },
  { id: 'review-003', campaignId: 'campaign-001', userId: 'user-099', userName: 'Former Employee', roleId: 'role-013', roleName: 'Employee', scopeType: 'company', scopeName: 'Apex Construction', grantedAt: '2022-06-01', reviewerId: 'user-023', reviewerName: 'Kavita Nair', decision: 'revoke', decidedAt: '2024-01-13T09:00:00Z', comments: 'Employee terminated, access should be revoked' },
  { id: 'review-004', campaignId: 'campaign-002', userId: 'user-016', userName: 'Sanjay Verma', roleId: 'role-004', roleName: 'Site Engineer', scopeType: 'site', scopeName: 'Metro Tower Site B', grantedAt: '2023-04-01', decision: 'pending' },
  { id: 'review-005', campaignId: 'campaign-002', userId: 'user-017', userName: 'Mohan Lal', roleId: 'role-004', roleName: 'Site Engineer', scopeType: 'site', scopeName: 'NH-48 Bridge Site', grantedAt: '2023-06-15', decision: 'pending' },
];

// ===== PRIVILEGED SESSIONS =====
export const privilegedSessions: PrivilegedSession[] = [
  { id: 'priv-001', adminId: 'user-001', adminName: 'Rajesh Kumar', approvedBy: 'user-002', approverName: 'Priya Sharma', reason: 'Emergency system migration - require role editing access', startedAt: '2024-01-15T14:00:00Z', expiresAt: '2024-01-15T18:00:00Z', endedAt: '2024-01-15T17:30:00Z', actionsCount: 12, status: 'ended' },
  { id: 'priv-002', adminId: 'user-001', adminName: 'Rajesh Kumar', approvedBy: 'user-002', approverName: 'Priya Sharma', reason: 'Quarterly access review - require user role assignment', startedAt: '2024-01-10T09:00:00Z', expiresAt: '2024-01-10T17:00:00Z', endedAt: '2024-01-10T16:45:00Z', actionsCount: 45, status: 'ended' },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-IDS-01', stage: 'VERIFY', control: 'SoD rule evaluated before an action that completes a conflicting pair on the same record chain', enforcement: 'BLOCK/EXCEPTION', status: 'OBSERVE' },
  { id: 'CP-IDS-02', stage: 'APPROVE', control: 'Toxic role combination detected at role assignment', enforcement: 'EXCEPTION', status: 'OBSERVE' },
  { id: 'CP-IDS-03', stage: 'VERIFY', control: 'Step-up MFA for payment release, bank-detail change, permission grant and large export', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-IDS-04', stage: 'RECONCILE', control: 'Access certification completed for every active grant each cycle', enforcement: 'BLOCK(close)', status: 'OBSERVE' },
  { id: 'CP-IDS-05', stage: 'MONITOR', control: 'Detective SoD scan and privileged-session review', enforcement: 'MONITOR(DR-15)', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====

export function getSodRulesBySeverity(): Record<SoDSeverity, number> {
  return sodRules.reduce((acc, rule) => {
    acc[rule.severity] = (acc[rule.severity] || 0) + 1;
    return acc;
  }, {} as Record<SoDSeverity, number>);
}

export function getSodRulesByMode(): Record<SoDMode, number> {
  return sodRules.reduce((acc, rule) => {
    acc[rule.mode] = (acc[rule.mode] || 0) + 1;
    return acc;
  }, {} as Record<SoDMode, number>);
}

export function getFindingsByStatus(): Record<SoDFindingStatus, number> {
  return sodFindings.reduce((acc, finding) => {
    acc[finding.status] = (acc[finding.status] || 0) + 1;
    return acc;
  }, {} as Record<SoDFindingStatus, number>);
}

export function getMfaCoverage(): { enforced: number; total: number; percentage: number } {
  const enforced = identityExtensions.filter(id => id.mfaEnforced).length;
  const total = identityExtensions.length;
  return {
    enforced,
    total,
    percentage: Math.round((enforced / total) * 100),
  };
}

export function getAccessReviewProgress(campaignId: string): { total: number; reviewed: number; percentage: number } {
  const campaign = accessReviewCampaigns.find(c => c.id === campaignId);
  if (!campaign) return { total: 0, reviewed: 0, percentage: 0 };
  return {
    total: campaign.totalGrants,
    reviewed: campaign.reviewedGrants,
    percentage: Math.round((campaign.reviewedGrants / campaign.totalGrants) * 100),
  };
}
