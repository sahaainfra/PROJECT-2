// Part 06 — User, Role & Permission Architecture (Enterprise RBAC)
// Permission engine with scoped grants: User → Role → Department → Project → Site → Module → Feature → Action

export type PermissionEffect = 'allow' | 'deny';
export type ScopeType = 'company' | 'business_unit' | 'department' | 'project' | 'site' | 'own';
export type MaskType = 'full' | 'partial' | 'hash';
export type SodSeverity = 'block' | 'warn';

export interface Permission {
  key: string;
  module: string;
  feature: string;
  action: string;
  description: string;
  isSensitive: boolean;
  defaultScope: ScopeType;
  pcStage?: 'PLAN' | 'AUTHORIZE' | 'EXECUTE' | 'RECORD' | 'VERIFY' | 'ANALYZE' | 'CONTROL' | 'CLOSE';
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  maxScope: ScopeType;
  userCount: number;
  permissionCount: number;
  isActive: boolean;
}

export interface RolePermission {
  roleId: string;
  permissionKey: string;
  effect: PermissionEffect;
  scopeType: ScopeType;
  conditions?: Record<string, any>;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  userName: string;
  roleId: string;
  roleName: string;
  scopeType: ScopeType;
  scopeId: string;
  scopeName: string;
  validFrom: string;
  validTo?: string;
  assignedBy: string;
  assignedByName: string;
  reason: string;
  isActive: boolean;
}

export interface FieldPolicy {
  id: string;
  entity: string;
  field: string;
  permissionKeyToView: string;
  permissionKeyToEdit: string;
  maskType: MaskType;
}

export interface RecordRule {
  id: string;
  entity: string;
  ruleType: 'own' | 'allocated_project' | 'allocated_site' | 'department' | 'custom';
  expression: string;
  description: string;
}

export interface SodRule {
  id: string;
  code: string;
  permissionA: string;
  permissionB: string;
  scope: ScopeType;
  severity: SodSeverity;
  description: string;
}

export interface LegacyPermissionMap {
  legacyRight: string;
  permissionKey: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  roleAssignments: UserRoleAssignment[];
}

// ===== PERMISSION REGISTRY =====
export const permissions: Permission[] = [
  // Shell & Navigation
  { key: 'shell.home.view', module: 'shell', feature: 'home', action: 'view', description: 'View home launchpad', isSensitive: false, defaultScope: 'own' },
  { key: 'shell.search.use', module: 'shell', feature: 'search', action: 'use', description: 'Use global search', isSensitive: false, defaultScope: 'own' },
  
  // Organization
  { key: 'org.company.view', module: 'org', feature: 'company', action: 'view', description: 'View company details', isSensitive: false, defaultScope: 'company' },
  { key: 'org.company.edit', module: 'org', feature: 'company', action: 'edit', description: 'Edit company details', isSensitive: true, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'org.project.view', module: 'org', feature: 'project', action: 'view', description: 'View projects', isSensitive: false, defaultScope: 'project' },
  { key: 'org.project.create', module: 'org', feature: 'project', action: 'create', description: 'Create new project', isSensitive: false, defaultScope: 'company', pcStage: 'PLAN' },
  { key: 'org.project.edit', module: 'org', feature: 'project', action: 'edit', description: 'Edit project details', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'org.project.close', module: 'org', feature: 'project', action: 'close', description: 'Close project', isSensitive: false, defaultScope: 'company', pcStage: 'CLOSE' },
  { key: 'org.site.view', module: 'org', feature: 'site', action: 'view', description: 'View sites', isSensitive: false, defaultScope: 'site' },
  { key: 'org.site.edit', module: 'org', feature: 'site', action: 'edit', description: 'Edit site details', isSensitive: false, defaultScope: 'site', pcStage: 'EXECUTE' },
  { key: 'org.site.geofence.edit', module: 'org', feature: 'site', action: 'edit_geofence', description: 'Edit site geofence', isSensitive: true, defaultScope: 'site', pcStage: 'AUTHORIZE' },
  { key: 'org.allocation.view', module: 'org', feature: 'allocation', action: 'view', description: 'View allocations', isSensitive: false, defaultScope: 'project' },
  { key: 'org.allocation.assign', module: 'org', feature: 'allocation', action: 'assign', description: 'Assign users to projects', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  
  // Procurement
  { key: 'proc.pr.view', module: 'proc', feature: 'pr', action: 'view', description: 'View purchase requests', isSensitive: false, defaultScope: 'project' },
  { key: 'proc.pr.create', module: 'proc', feature: 'pr', action: 'create', description: 'Create purchase request', isSensitive: false, defaultScope: 'project', pcStage: 'PLAN' },
  { key: 'proc.pr.approve', module: 'proc', feature: 'pr', action: 'approve', description: 'Approve purchase request', isSensitive: false, defaultScope: 'project', pcStage: 'AUTHORIZE' },
  { key: 'proc.po.view', module: 'proc', feature: 'po', action: 'view', description: 'View purchase orders', isSensitive: false, defaultScope: 'project' },
  { key: 'proc.po.create', module: 'proc', feature: 'po', action: 'create', description: 'Create purchase order', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'proc.po.approve', module: 'proc', feature: 'po', action: 'approve', description: 'Approve purchase order', isSensitive: false, defaultScope: 'project', pcStage: 'AUTHORIZE' },
  { key: 'proc.supplier.view', module: 'proc', feature: 'supplier', action: 'view', description: 'View suppliers', isSensitive: false, defaultScope: 'company' },
  { key: 'proc.supplier.create', module: 'proc', feature: 'supplier', action: 'create', description: 'Create supplier', isSensitive: true, defaultScope: 'company', pcStage: 'EXECUTE' },
  
  // Inventory
  { key: 'inv.grn.view', module: 'inv', feature: 'grn', action: 'view', description: 'View goods receipt notes', isSensitive: false, defaultScope: 'site' },
  { key: 'inv.grn.create', module: 'inv', feature: 'grn', action: 'create', description: 'Create goods receipt', isSensitive: false, defaultScope: 'site', pcStage: 'EXECUTE' },
  { key: 'inv.stock.view', module: 'inv', feature: 'stock', action: 'view', description: 'View stock register', isSensitive: false, defaultScope: 'site' },
  { key: 'inv.issue.create', module: 'inv', feature: 'issue', action: 'create', description: 'Create material issue', isSensitive: false, defaultScope: 'site', pcStage: 'EXECUTE' },
  
  // Finance
  { key: 'fin.bill.view', module: 'fin', feature: 'bill', action: 'view', description: 'View subcontractor bills', isSensitive: false, defaultScope: 'project' },
  { key: 'fin.bill.create', module: 'fin', feature: 'bill', action: 'create', description: 'Create bill', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'fin.bill.verify', module: 'fin', feature: 'bill', action: 'verify', description: 'Verify bill', isSensitive: false, defaultScope: 'project', pcStage: 'VERIFY' },
  { key: 'fin.bill.approve', module: 'fin', feature: 'bill', action: 'approve', description: 'Approve bill for payment', isSensitive: true, defaultScope: 'company', pcStage: 'AUTHORIZE' },
  { key: 'fin.payroll.view', module: 'fin', feature: 'payroll', action: 'view', description: 'View payroll', isSensitive: true, defaultScope: 'department' },
  { key: 'fin.payroll.process', module: 'fin', feature: 'payroll', action: 'process', description: 'Process payroll', isSensitive: true, defaultScope: 'company', pcStage: 'EXECUTE' },
  
  // HR
  { key: 'hr.attendance.view', module: 'hr', feature: 'attendance', action: 'view', description: 'View attendance', isSensitive: false, defaultScope: 'site' },
  { key: 'hr.attendance.mark', module: 'hr', feature: 'attendance', action: 'mark', description: 'Mark attendance', isSensitive: false, defaultScope: 'site', pcStage: 'RECORD' },
  { key: 'hr.employee.view', module: 'hr', feature: 'employee', action: 'view', description: 'View employees', isSensitive: true, defaultScope: 'department' },
  { key: 'hr.employee.edit', module: 'hr', feature: 'employee', action: 'edit', description: 'Edit employee details', isSensitive: true, defaultScope: 'department', pcStage: 'EXECUTE' },
  
  // Quality & Safety
  { key: 'qa.inspection.view', module: 'qa', feature: 'inspection', action: 'view', description: 'View inspections', isSensitive: false, defaultScope: 'site' },
  { key: 'qa.inspection.create', module: 'qa', feature: 'inspection', action: 'create', description: 'Create inspection', isSensitive: false, defaultScope: 'site', pcStage: 'EXECUTE' },
  { key: 'qa.safety.view', module: 'qa', feature: 'safety', action: 'view', description: 'View safety incidents', isSensitive: false, defaultScope: 'site' },
  { key: 'qa.safety.report', module: 'qa', feature: 'safety', action: 'report', description: 'Report safety incident', isSensitive: false, defaultScope: 'site', pcStage: 'RECORD' },
  
  // Reports
  { key: 'rpt.dashboard.view', module: 'rpt', feature: 'dashboard', action: 'view', description: 'View dashboards', isSensitive: false, defaultScope: 'project' },
  { key: 'rpt.report.view', module: 'rpt', feature: 'report', action: 'view', description: 'View reports', isSensitive: false, defaultScope: 'project' },
  { key: 'rpt.report.export', module: 'rpt', feature: 'report', action: 'export', description: 'Export reports', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  
  // IAM (Self)
  { key: 'iam.role.view', module: 'iam', feature: 'role', action: 'view', description: 'View roles', isSensitive: true, defaultScope: 'company' },
  { key: 'iam.role.edit', module: 'iam', feature: 'role', action: 'edit', description: 'Edit role permissions', isSensitive: true, defaultScope: 'company', pcStage: 'AUTHORIZE' },
  { key: 'iam.assignment.view', module: 'iam', feature: 'assignment', action: 'view', description: 'View user assignments', isSensitive: true, defaultScope: 'company' },
  { key: 'iam.assignment.assign', module: 'iam', feature: 'assignment', action: 'assign', description: 'Assign roles to users', isSensitive: true, defaultScope: 'company', pcStage: 'AUTHORIZE' },
  { key: 'iam.effective.view', module: 'iam', feature: 'effective', action: 'view', description: 'View effective permissions', isSensitive: true, defaultScope: 'own' },
];

// ===== ROLES =====
export const roles: Role[] = [
  { id: 'role-001', code: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full system access', isSystem: true, maxScope: 'company', userCount: 2, permissionCount: permissions.length, isActive: true },
  { id: 'role-002', code: 'MANAGEMENT', name: 'Management / CFO', description: 'Executive management access', isSystem: true, maxScope: 'company', userCount: 3, permissionCount: 45, isActive: true },
  { id: 'role-003', code: 'PROJECT_MANAGER', name: 'Project Manager', description: 'Manage assigned projects', isSystem: true, maxScope: 'project', userCount: 8, permissionCount: 38, isActive: true },
  { id: 'role-004', code: 'SITE_ENGINEER', name: 'Site Engineer', description: 'Manage assigned sites', isSystem: true, maxScope: 'site', userCount: 15, permissionCount: 28, isActive: true },
  { id: 'role-005', code: 'PROCUREMENT_MANAGER', name: 'Procurement Manager', description: 'Manage procurement operations', isSystem: true, maxScope: 'company', userCount: 4, permissionCount: 22, isActive: true },
  { id: 'role-006', code: 'STORE_KEEPER', name: 'Store Keeper', description: 'Manage store operations', isSystem: true, maxScope: 'site', userCount: 6, permissionCount: 18, isActive: true },
  { id: 'role-007', code: 'ACCOUNTS_MANAGER', name: 'Accounts Manager', description: 'Manage financial operations', isSystem: true, maxScope: 'company', userCount: 3, permissionCount: 25, isActive: true },
  { id: 'role-008', code: 'HR_MANAGER', name: 'HR Manager', description: 'Manage HR operations', isSystem: true, maxScope: 'company', userCount: 2, permissionCount: 20, isActive: true },
  { id: 'role-009', code: 'QA_ENGINEER', name: 'QA/QC Engineer', description: 'Quality assurance and control', isSystem: true, maxScope: 'site', userCount: 5, permissionCount: 15, isActive: true },
  { id: 'role-010', code: 'HSE_OFFICER', name: 'HSE Officer', description: 'Health, safety and environment', isSystem: true, maxScope: 'site', userCount: 3, permissionCount: 12, isActive: true },
  { id: 'role-011', code: 'COMMERCIAL_MANAGER', name: 'Commercial Manager', description: 'Commercial and contracts', isSystem: true, maxScope: 'project', userCount: 2, permissionCount: 20, isActive: true },
  { id: 'role-012', code: 'PLANNING_ENGINEER', name: 'Planning Engineer', description: 'Project planning and scheduling', isSystem: true, maxScope: 'project', userCount: 3, permissionCount: 16, isActive: true },
  { id: 'role-013', code: 'EMPLOYEE', name: 'Employee', description: 'Self-service employee access', isSystem: true, maxScope: 'own', userCount: 156, permissionCount: 8, isActive: true },
  { id: 'role-014', code: 'AUDITOR', name: 'Auditor', description: 'Read-only audit access', isSystem: true, maxScope: 'company', userCount: 2, permissionCount: 35, isActive: true },
];

// ===== ROLE PERMISSIONS (Sample) =====
export const rolePermissions: RolePermission[] = [
  // Super Admin - all permissions
  ...permissions.map(p => ({ roleId: 'role-001', permissionKey: p.key, effect: 'allow' as const, scopeType: p.defaultScope })),
  
  // Project Manager
  { roleId: 'role-003', permissionKey: 'org.project.view', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'org.project.edit', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'org.site.view', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'proc.pr.view', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'proc.pr.create', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'proc.pr.approve', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'proc.po.view', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'proc.po.create', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'proc.po.approve', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'fin.bill.view', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'fin.bill.verify', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'rpt.dashboard.view', effect: 'allow', scopeType: 'project' },
  { roleId: 'role-003', permissionKey: 'rpt.report.view', effect: 'allow', scopeType: 'project' },
  
  // Site Engineer
  { roleId: 'role-004', permissionKey: 'org.site.view', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'org.site.edit', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'inv.grn.view', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'inv.grn.create', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'inv.stock.view', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'inv.issue.create', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'hr.attendance.view', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'hr.attendance.mark', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'qa.inspection.view', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-004', permissionKey: 'qa.inspection.create', effect: 'allow', scopeType: 'site' },
  
  // Store Keeper
  { roleId: 'role-006', permissionKey: 'inv.grn.view', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-006', permissionKey: 'inv.grn.create', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-006', permissionKey: 'inv.stock.view', effect: 'allow', scopeType: 'site' },
  { roleId: 'role-006', permissionKey: 'inv.issue.create', effect: 'allow', scopeType: 'site' },
  
  // Employee (self-service)
  { roleId: 'role-013', permissionKey: 'shell.home.view', effect: 'allow', scopeType: 'own' },
  { roleId: 'role-013', permissionKey: 'hr.attendance.view', effect: 'allow', scopeType: 'own' },
  { roleId: 'role-013', permissionKey: 'fin.payroll.view', effect: 'allow', scopeType: 'own' },
  { roleId: 'role-013', permissionKey: 'iam.effective.view', effect: 'allow', scopeType: 'own' },
];

// ===== USER ROLE ASSIGNMENTS =====
export const userRoleAssignments: UserRoleAssignment[] = [
  { id: 'assign-001', userId: 'user-001', userName: 'Rajesh Kumar', roleId: 'role-001', roleName: 'Super Admin', scopeType: 'company', scopeId: 'comp-001', scopeName: 'Apex Construction', validFrom: '2023-01-01', assignedBy: 'system', assignedByName: 'System', reason: 'Initial setup', isActive: true },
  { id: 'assign-002', userId: 'user-002', userName: 'Priya Sharma', roleId: 'role-002', roleName: 'Management / CFO', scopeType: 'company', scopeId: 'comp-001', scopeName: 'Apex Construction', validFrom: '2023-01-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar', reason: 'Executive appointment', isActive: true },
  { id: 'assign-003', userId: 'user-010', userName: 'Rajesh Kumar', roleId: 'role-003', roleName: 'Project Manager', scopeType: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II', validFrom: '2023-03-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar', reason: 'Project assignment', isActive: true },
  { id: 'assign-004', userId: 'user-011', userName: 'Suresh Patel', roleId: 'role-003', roleName: 'Project Manager', scopeType: 'project', scopeId: 'prj-002', scopeName: 'Highway Bridge NH-48', validFrom: '2023-06-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar', reason: 'Project assignment', isActive: true },
  { id: 'assign-005', userId: 'user-015', userName: 'Ravi Sharma', roleId: 'role-004', roleName: 'Site Engineer', scopeType: 'site', scopeId: 'site-001', scopeName: 'Metro Tower Site A', validFrom: '2023-03-15', assignedBy: 'user-010', assignedByName: 'Rajesh Kumar', reason: 'Site assignment', isActive: true },
  { id: 'assign-006', userId: 'user-016', userName: 'Sanjay Verma', roleId: 'role-004', roleName: 'Site Engineer', scopeType: 'site', scopeId: 'site-002', scopeName: 'Metro Tower Site B', validFrom: '2023-04-01', assignedBy: 'user-010', assignedByName: 'Rajesh Kumar', reason: 'Site assignment', isActive: true },
  { id: 'assign-007', userId: 'user-020', userName: 'Amit Shah', roleId: 'role-005', roleName: 'Procurement Manager', scopeType: 'company', scopeId: 'comp-001', scopeName: 'Apex Construction', validFrom: '2023-02-01', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar', reason: 'Department head', isActive: true },
  { id: 'assign-008', userId: 'user-021', userName: 'Neha Gupta', roleId: 'role-006', roleName: 'Store Keeper', scopeType: 'site', scopeId: 'site-001', scopeName: 'Metro Tower Site A', validFrom: '2023-03-20', assignedBy: 'user-010', assignedByName: 'Rajesh Kumar', reason: 'Site assignment', isActive: true },
  { id: 'assign-009', userId: 'user-022', userName: 'Vikram Desai', roleId: 'role-007', roleName: 'Accounts Manager', scopeType: 'company', scopeId: 'comp-001', scopeName: 'Apex Construction', validFrom: '2023-01-15', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar', reason: 'Department head', isActive: true },
  { id: 'assign-010', userId: 'user-023', userName: 'Kavita Nair', roleId: 'role-008', roleName: 'HR Manager', scopeType: 'company', scopeId: 'comp-001', scopeName: 'Apex Construction', validFrom: '2023-01-15', assignedBy: 'user-001', assignedByName: 'Rajesh Kumar', reason: 'Department head', isActive: true },
];

// ===== FIELD POLICIES =====
export const fieldPolicies: FieldPolicy[] = [
  { id: 'fp-001', entity: 'Employee', field: 'salary', permissionKeyToView: 'hr.employee.salary.view', permissionKeyToEdit: 'hr.employee.salary.edit', maskType: 'full' },
  { id: 'fp-002', entity: 'Employee', field: 'bankAccount', permissionKeyToView: 'hr.employee.bank.view', permissionKeyToEdit: 'hr.employee.bank.edit', maskType: 'partial' },
  { id: 'fp-003', entity: 'Supplier', field: 'bankDetails', permissionKeyToView: 'proc.supplier.bank.view', permissionKeyToEdit: 'proc.supplier.bank.edit', maskType: 'partial' },
  { id: 'fp-004', entity: 'PurchaseOrder', field: 'totalAmount', permissionKeyToView: 'proc.po.amount.view', permissionKeyToEdit: 'proc.po.amount.edit', maskType: 'full' },
  { id: 'fp-005', entity: 'Bill', field: 'amount', permissionKeyToView: 'fin.bill.amount.view', permissionKeyToEdit: 'fin.bill.amount.edit', maskType: 'full' },
];

// ===== RECORD RULES =====
export const recordRules: RecordRule[] = [
  { id: 'rr-001', entity: 'DailyProgressReport', ruleType: 'allocated_site', expression: 'site_id IN (SELECT site_id FROM org_project_allocations WHERE user_id = :currentUserId AND is_active = true)', description: 'Site Engineer sees DPRs of allocated sites' },
  { id: 'rr-002', entity: 'StockLedger', ruleType: 'allocated_site', expression: 'site_id IN (SELECT site_id FROM org_project_allocations WHERE user_id = :currentUserId AND is_active = true)', description: 'Store Keeper sees stock of allocated sites' },
  { id: 'rr-003', entity: 'Attendance', ruleType: 'own', expression: 'employee_id = :currentEmployeeId', description: 'Employee sees own attendance only' },
  { id: 'rr-004', entity: 'Payslip', ruleType: 'own', expression: 'employee_id = :currentEmployeeId', description: 'Employee sees own payslips only' },
  { id: 'rr-005', entity: 'PurchaseOrder', ruleType: 'allocated_project', expression: 'project_id IN (SELECT project_id FROM org_project_allocations WHERE user_id = :currentUserId AND is_active = true)', description: 'Project Manager sees POs of allocated projects' },
];

// ===== SOD RULES =====
export const sodRules: SodRule[] = [
  { id: 'sod-001', code: 'SOD-PO-CREATE-APPROVE', permissionA: 'proc.po.create', permissionB: 'proc.po.approve', scope: 'project', severity: 'block', description: 'Cannot create and approve PO in same project' },
  { id: 'sod-002', code: 'SOD-PR-CREATE-APPROVE', permissionA: 'proc.pr.create', permissionB: 'proc.pr.approve', scope: 'project', severity: 'block', description: 'Cannot create and approve PR in same project' },
  { id: 'sod-003', code: 'SOD-BILL-CREATE-VERIFY', permissionA: 'fin.bill.create', permissionB: 'fin.bill.verify', scope: 'project', severity: 'block', description: 'Cannot create and verify bill in same project' },
  { id: 'sod-004', code: 'SOD-BILL-VERIFY-APPROVE', permissionA: 'fin.bill.verify', permissionB: 'fin.bill.approve', scope: 'company', severity: 'block', description: 'Cannot verify and approve bill (different levels)' },
  { id: 'sod-005', code: 'SOD-SUPPLIER-PAYMENT', permissionA: 'proc.supplier.create', permissionB: 'fin.bill.approve', scope: 'company', severity: 'warn', description: 'Vendor master + payment release should be separated' },
  { id: 'sod-006', code: 'SOD-ROLE-ASSIGN-EDIT', permissionA: 'iam.assignment.assign', permissionB: 'iam.role.edit', scope: 'company', severity: 'block', description: 'Cannot assign roles and edit role permissions' },
];

// ===== LEGACY PERMISSION MAP =====
export const legacyPermissionMap: LegacyPermissionMap[] = [
  { legacyRight: 'admin_access', permissionKey: 'shell.home.view' },
  { legacyRight: 'view_projects', permissionKey: 'org.project.view' },
  { legacyRight: 'edit_projects', permissionKey: 'org.project.edit' },
  { legacyRight: 'view_po', permissionKey: 'proc.po.view' },
  { legacyRight: 'create_po', permissionKey: 'proc.po.create' },
  { legacyRight: 'approve_po', permissionKey: 'proc.po.approve' },
  { legacyRight: 'view_grn', permissionKey: 'inv.grn.view' },
  { legacyRight: 'create_grn', permissionKey: 'inv.grn.create' },
  { legacyRight: 'view_stock', permissionKey: 'inv.stock.view' },
  { legacyRight: 'view_bills', permissionKey: 'fin.bill.view' },
  { legacyRight: 'approve_bills', permissionKey: 'fin.bill.approve' },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-IAM-01', stage: 'APPROVE', control: 'Role permission changes and privileged assignments are maker-checker', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-IAM-02', stage: 'VERIFY', control: 'SoD conflict check on every assignment', enforcement: 'BLOCK / EXCEPTION per rule severity', status: 'OBSERVE' },
  { id: 'CP-IAM-03', stage: 'MONITOR', control: 'Repeated 403/BLOCK attempts by a user on the same function', enforcement: 'MONITOR (DR-15)', status: 'OBSERVE' },
  { id: 'CP-IAM-04', stage: 'RECONCILE', control: 'Quarterly access review of all privileged roles', enforcement: 'BLOCK (campaign cannot close incomplete)', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====

export function getPermissionsByModule(): Record<string, Permission[]> {
  return permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);
}

export function getRolePermissions(roleId: string): RolePermission[] {
  return rolePermissions.filter(rp => rp.roleId === roleId);
}

export function getUserAssignments(userId: string): UserRoleAssignment[] {
  return userRoleAssignments.filter(a => a.userId === userId && a.isActive);
}

export function checkSodConflict(userId: string, permissionKey: string, scopeType: ScopeType, scopeId: string): SodRule | null {
  const userPerms = getUserAssignments(userId)
    .flatMap(a => getRolePermissions(a.roleId))
    .filter(rp => rp.effect === 'allow');
  
  for (const rule of sodRules) {
    if (rule.severity === 'block' && rule.scope === scopeType) {
      const hasA = userPerms.some(rp => rp.permissionKey === rule.permissionA);
      const hasB = userPerms.some(rp => rp.permissionKey === rule.permissionB);
      
      if ((permissionKey === rule.permissionA && hasB) || (permissionKey === rule.permissionB && hasA)) {
        return rule;
      }
    }
  }
  
  return null;
}

export function can(userPermissions: string[], permissionKey: string): boolean {
  return userPermissions.includes(permissionKey);
}
