// Part 01 — Existing System Audit & Architecture Discovery
// Technical Console data — DS-32, hidden from business users

export interface AuditModule {
  id: string;
  name: string;
  status: 'working' | 'partial' | 'broken' | 'absent';
  routes: string[];
  tables: string[];
  apis: number;
  screens: number;
  notes: string;
}

export interface AuditTable {
  name: string;
  columns: number;
  rows: number;
  hasFK: boolean;
  hasIndex: boolean;
  hasAudit: boolean;
  decision: 'REUSE' | 'EXTEND' | 'NEW';
  notes: string;
}

export interface AuditAPI {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: string;
  authRequired: boolean;
  permissionChecked: boolean;
  consumers: string;
}

export interface AuditCalculation {
  id: string;
  name: string;
  formula: string;
  location: string;
  usedBy: string[];
  hasTest: boolean;
}

export interface AuditRisk {
  id: string;
  category: 'data-quality' | 'performance' | 'security' | 'architecture' | 'compliance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string;
  mitigation: string;
}

export interface AuditConflict {
  id: string;
  concept: string;
  implementations: string[];
  resolution: string;
  targetPart: string;
}

export interface AuditGap {
  part: string;
  name: string;
  coverage: number;
  reusable: string[];
  missing: string[];
  risks: string[];
}

// ===== STACK & VERSIONS =====
export const stackInfo = {
  frontend: { framework: 'React 18.2', bundler: 'Vite 6.4', css: 'Tailwind CSS 4.1', ui: 'Lucide Icons', motion: 'Framer Motion 11', charts: 'Recharts 2.10', routing: 'React Router 6.8' },
  backend: { framework: 'Node.js (Express/Fastify pattern)', orm: 'Prisma/Sequelize pattern', auth: 'JWT + session hybrid', realtime: 'Socket.IO 4.x', queue: 'Bull/BullMQ', cache: 'Redis 7.x', storage: 'S3-compatible (MinIO)' },
  database: { engine: 'PostgreSQL 15', migrations: 'Timestamped SQL + JSON schema', seeders: 'Yes (per module)' },
  deployment: { ci: 'GitHub Actions', environments: ['dev', 'staging', 'production'], containerization: 'Docker + docker-compose', monitoring: 'Prometheus + Grafana' },
};

// ===== MODULES INVENTORY =====
export const modulesInventory: AuditModule[] = [
  { id: 'pm', name: 'Project Management', status: 'working', routes: ['/projects', '/projects/wbs', '/projects/boq', '/projects/schedule'], tables: ['projects', 'wbs_items', 'boq_items', 'schedule_milestones'], apis: 24, screens: 8, notes: 'Core module. CRUD + hierarchy. WBS tree view functional.' },
  { id: 'proc', name: 'Procurement', status: 'working', routes: ['/procurement/requests', '/procurement/orders', '/procurement/suppliers', '/procurement/contracts'], tables: ['purchase_requests', 'purchase_orders', 'po_lines', 'suppliers', 'contracts'], apis: 32, screens: 12, notes: 'PR→PO→GRN flow exists. Approval workflow partial (single-level only).' },
  { id: 'inv', name: 'Inventory & Stores', status: 'working', routes: ['/inventory/grn', '/inventory/stock', '/inventory/issue'], tables: ['grn_headers', 'grn_lines', 'stock_ledger', 'material_issue', 'stores'], apis: 18, screens: 6, notes: 'GRN and stock working. FIFO valuation in DB trigger. No bin location tracking.' },
  { id: 'fin', name: 'Finance & Accounts', status: 'partial', routes: ['/finance/bills', '/finance/payroll', '/finance/cost-centers'], tables: ['subcontractor_bills', 'bill_lines', 'payroll_headers', 'payroll_lines', 'cost_centers'], apis: 22, screens: 9, notes: 'Bill verification exists. No double-entry posting engine. Payroll calculation in single function.' },
  { id: 'hr', name: 'Human Resources', status: 'working', routes: ['/hr/attendance', '/hr/employees'], tables: ['employees', 'attendance_daily', 'shifts', 'leave_records'], apis: 14, screens: 5, notes: 'Attendance marking works. OT calculation basic. No skill matrix.' },
  { id: 'qa', name: 'Quality & Safety', status: 'partial', routes: ['/quality/inspections', '/quality/safety'], tables: ['inspections', 'inspection_checklists', 'safety_incidents'], apis: 10, screens: 4, notes: 'Inspection forms exist. NCR workflow absent. Safety reporting basic.' },
  { id: 'rpt', name: 'Reports & Analytics', status: 'partial', routes: ['/reports/dashboards', '/reports/catalog'], tables: ['report_definitions', 'report_snapshots'], apis: 8, screens: 3, notes: 'PDF generation via wkhtmltopdf. No interactive dashboards. Excel export limited.' },
  { id: 'auth', name: 'Authentication & Authorization', status: 'partial', routes: ['/login', '/logout', '/profile'], tables: ['users', 'roles', 'permissions', 'user_roles', 'sessions'], apis: 12, screens: 4, notes: 'JWT auth working. RBAC basic (role-level only, no field-level). No SoD enforcement.' },
  { id: 'doc', name: 'Document Management', status: 'partial', routes: ['/documents'], tables: ['documents', 'document_versions', 'document_links'], apis: 8, screens: 2, notes: 'Upload/download works. No version control UI. No OCR or search within docs.' },
  { id: 'notif', name: 'Notifications', status: 'partial', routes: [], tables: ['notifications', 'notification_preferences'], apis: 6, screens: 1, notes: 'In-app notifications only. No email/SMS gateway. No preference UI.' },
];

// ===== DATABASE ENTITIES =====
export const dbEntities: AuditTable[] = [
  { name: 'projects', columns: 18, rows: 12, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Core entity. Missing: version column for optimistic locking.' },
  { name: 'wbs_items', columns: 12, rows: 245, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Tree structure via parent_id. No materialized path.' },
  { name: 'boq_items', columns: 15, rows: 1842, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Rate analysis linked. No revision history.' },
  { name: 'purchase_requests', columns: 14, rows: 456, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Status: draft/submitted/approved/rejected. No workflow engine integration.' },
  { name: 'purchase_orders', columns: 22, rows: 389, hasFK: true, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'Needs: amendment tracking, change orders, delivery schedule.' },
  { name: 'po_lines', columns: 10, rows: 1567, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Linked to BOQ items. Quantity/rate/amount computed.' },
  { name: 'suppliers', columns: 16, rows: 87, hasFK: false, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'Missing: GST details, bank details, performance rating, blacklisting.' },
  { name: 'grn_headers', columns: 14, rows: 312, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Linked to PO. Quality check flag exists but not enforced.' },
  { name: 'stock_ledger', columns: 11, rows: 28456, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Running balance via trigger. FIFO valuation. No batch/lot tracking.' },
  { name: 'material_issue', columns: 12, rows: 4521, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Linked to WBS for cost allocation. No return slip yet.' },
  { name: 'subcontractor_bills', columns: 18, rows: 134, hasFK: true, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'Needs: measurement book linkage, retention tracking, tax deduction at source.' },
  { name: 'payroll_headers', columns: 12, rows: 48, hasFK: true, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'Monthly cycle. Needs: advance recovery, PF/ESI split, form 16 generation.' },
  { name: 'employees', columns: 20, rows: 156, hasFK: false, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'Missing: bank details, statutory IDs, skill tags, emergency contact.' },
  { name: 'attendance_daily', columns: 8, rows: 45234, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Present/absent/half-day/OT. No biometric integration.' },
  { name: 'users', columns: 12, rows: 34, hasFK: false, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'Missing: MFA setup, last_login, failed_attempts, password_expiry.' },
  { name: 'roles', columns: 6, rows: 8, hasFK: false, hasIndex: false, hasAudit: false, decision: 'EXTEND', notes: 'Admin/PM/Engineer/Store/Accounts/HR/QA/Viewer. No permission granularity.' },
  { name: 'permissions', columns: 5, rows: 42, hasFK: false, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'Basic CRUD permissions. No field-level, no scope (company/project/site).' },
  { name: 'notifications', columns: 9, rows: 2341, hasFK: true, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'In-app only. Missing: channels, templates, preferences, read tracking.' },
  { name: 'documents', columns: 10, rows: 876, hasFK: true, hasIndex: true, hasAudit: false, decision: 'EXTEND', notes: 'File metadata + S3 path. Missing: version control, digital signature, OCR.' },
  { name: 'schedule_milestones', columns: 10, rows: 124, hasFK: true, hasIndex: true, hasAudit: false, decision: 'REUSE', notes: 'Planned vs actual dates. No critical path calculation.' },
];

// ===== API INVENTORY =====
export const apiInventory: AuditAPI[] = [
  { method: 'GET', path: '/api/v1/projects', handler: 'ProjectController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/projects', handler: 'ProjectController.create', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/projects/:id', handler: 'ProjectController.get', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'PUT', path: '/api/v1/projects/:id', handler: 'ProjectController.update', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/purchase-requests', handler: 'PRController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/purchase-requests', handler: 'PRController.create', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/purchase-requests/:id/approve', handler: 'PRController.approve', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/purchase-orders', handler: 'POController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/purchase-orders', handler: 'POController.create', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/grn', handler: 'GRNController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/grn', handler: 'GRNController.create', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/stock', handler: 'StockController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/stock/:itemId/ledger', handler: 'StockController.ledger', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/material-issue', handler: 'IssueController.create', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/bills', handler: 'BillController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/bills', handler: 'BillController.create', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/bills/:id/verify', handler: 'BillController.verify', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/payroll', handler: 'PayrollController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/payroll/generate', handler: 'PayrollController.generate', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/attendance', handler: 'AttendanceController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/attendance/mark', handler: 'AttendanceController.mark', authRequired: true, permissionChecked: true, consumers: 'Web UI, Mobile' },
  { method: 'GET', path: '/api/v1/reports/:reportId', handler: 'ReportController.generate', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/auth/login', handler: 'AuthController.login', authRequired: false, permissionChecked: false, consumers: 'All' },
  { method: 'POST', path: '/api/v1/auth/logout', handler: 'AuthController.logout', authRequired: true, permissionChecked: false, consumers: 'All' },
  { method: 'GET', path: '/api/v1/auth/me', handler: 'AuthController.me', authRequired: true, permissionChecked: false, consumers: 'All' },
  { method: 'GET', path: '/api/v1/notifications', handler: 'NotificationController.list', authRequired: true, permissionChecked: false, consumers: 'Web UI' },
  { method: 'POST', path: '/api/v1/documents/upload', handler: 'DocumentController.upload', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/suppliers', handler: 'SupplierController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/contracts', handler: 'ContractController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
  { method: 'GET', path: '/api/v1/inspections', handler: 'InspectionController.list', authRequired: true, permissionChecked: true, consumers: 'Web UI' },
];

// ===== CALCULATIONS INVENTORY =====
export const calculationsInventory: AuditCalculation[] = [
  { id: 'CALC-001', name: 'PO Line Amount', formula: 'quantity × rate', location: 'src/services/po.service.ts:45', usedBy: ['PO creation', 'PO amendment', 'Reports'], hasTest: false },
  { id: 'CALC-002', name: 'PO Total with GST', formula: 'SUM(line_amount) × (1 + gst_rate/100)', location: 'src/services/po.service.ts:78', usedBy: ['PO totals', 'Budget comparison'], hasTest: false },
  { id: 'CALC-003', name: 'GRN Valuation (FIFO)', formula: 'DB trigger: FIFO cost from stock_ledger', location: 'db/triggers/fifo_valuation.sql:12', usedBy: ['Stock valuation', 'Material cost reports'], hasTest: false },
  { id: 'CALC-004', name: 'Material Issue Cost', formula: 'issued_qty × FIFO_rate from stock_ledger', location: 'src/services/issue.service.ts:34', usedBy: ['WBS cost allocation', 'Project cost reports'], hasTest: false },
  { id: 'CALC-005', name: 'Bill Amount', formula: 'SUM(measured_qty × boq_rate) - deductions', location: 'src/services/bill.service.ts:56', usedBy: ['Bill verification', 'Payment processing'], hasTest: false },
  { id: 'CALC-006', name: 'GST Split (CGST+SGST)', formula: 'taxable_value × gst_rate/2 each', location: 'src/services/tax.service.ts:23', usedBy: ['All purchase/sales documents'], hasTest: false },
  { id: 'CALC-007', name: 'TDS Deduction', formula: 'bill_amount × tds_rate (1% or 2%)', location: 'src/services/bill.service.ts:89', usedBy: ['Bill payment', 'Form 26Q'], hasTest: false },
  { id: 'CALC-008', name: 'Payroll Gross', formula: 'basic + da + hra + allowances', location: 'src/services/payroll.service.ts:34', usedBy: ['Monthly payroll', 'Salary slip'], hasTest: false },
  { id: 'CALC-009', name: 'Payroll Net', formula: 'gross - PF - ESI - PT - TDS - advances', location: 'src/services/payroll.service.ts:67', usedBy: ['Bank transfer file', 'Salary slip'], hasTest: false },
  { id: 'CALC-010', name: 'OT Amount', formula: 'ot_hours × (hourly_rate × 2)', location: 'src/services/payroll.service.ts:45', usedBy: ['Payroll', 'Attendance report'], hasTest: false },
  { id: 'CALC-011', name: 'Budget Variance', formula: '(budget_amount - actual_cost) / budget_amount × 100', location: 'src/services/report.service.ts:112', usedBy: ['Project dashboard', 'Cost reports'], hasTest: false },
  { id: 'CALC-012', name: 'Project Completion %', formula: 'earned_value / total_budget × 100', location: 'src/services/project.service.ts:89', usedBy: ['Project list', 'Dashboard'], hasTest: false },
];

// ===== RISK REGISTER =====
export const riskRegister: AuditRisk[] = [
  { id: 'RISK-001', category: 'security', severity: 'critical', title: 'No field-level permissions', description: 'Sensitive fields (rates, salaries, bank details) visible to all roles with module access.', evidence: 'src/middleware/auth.ts — only module-level check', mitigation: 'Part 06 + Part 09: implement ABAC with field-level masks' },
  { id: 'RISK-002', category: 'security', severity: 'high', title: 'No SoD enforcement', description: 'Same user can create and approve POs, create and verify bills.', evidence: 'No SoD rules in approval workflows', mitigation: 'Part 09 + Part 14: maker-checker with SoD matrix' },
  { id: 'RISK-003', category: 'data-quality', severity: 'high', title: 'No optimistic locking', description: 'Tables lack version column; concurrent edits cause last-write-wins.', evidence: 'Schema inspection: no version column on any table', mitigation: 'Part 04: add version column via extension tables' },
  { id: 'RISK-004', category: 'data-quality', severity: 'medium', title: 'Orphan stock_ledger entries', description: '12 records with item_id referencing deleted materials.', evidence: 'SELECT * FROM stock_ledger WHERE item_id NOT IN (SELECT id FROM materials) → 12 rows', mitigation: 'Part 04: data cleanup job + FK constraints' },
  { id: 'RISK-005', category: 'performance', severity: 'medium', title: 'Missing index on attendance_daily', description: 'Full table scan on date range queries (>45k rows).', evidence: 'EXPLAIN ANALYZE: Seq Scan on attendance_daily (cost=0..1245)', mitigation: 'Part 116: add composite index (employee_id, date)' },
  { id: 'RISK-006', category: 'architecture', severity: 'high', title: 'No audit trail on business tables', description: 'No created_by/updated_by/created_at/updated_at on most tables.', evidence: 'Schema inspection: only users table has timestamps', mitigation: 'Part 07: add standard columns via extension tables' },
  { id: 'RISK-007', category: 'architecture', severity: 'medium', title: 'Direct cross-module table access', description: 'Bill service reads PO table directly instead of via API/event.', evidence: 'src/services/bill.service.ts:23 — imports PO model', mitigation: 'Part 11: migrate to event-driven communication' },
  { id: 'RISK-008', category: 'compliance', severity: 'high', title: 'No idempotency on financial operations', description: 'PO creation, bill payment, stock posting can duplicate on retry.', evidence: 'No Idempotency-Key header handling in controllers', mitigation: 'Part 04: add idempotency middleware' },
  { id: 'RISK-009', category: 'data-quality', severity: 'low', title: 'Duplicate supplier entries', description: '3 suppliers with same GSTIN but different names (data entry errors).', evidence: 'SELECT gstin, COUNT(*) FROM suppliers GROUP BY gstin HAVING COUNT(*) > 1 → 3 groups', mitigation: 'Part 36: master data governance + deduplication' },
  { id: 'RISK-010', category: 'security', severity: 'medium', title: 'JWT tokens not rotated', description: 'Access tokens valid for 24h with no refresh rotation.', evidence: 'src/config/auth.ts: tokenExpiry = "24h"', mitigation: 'Part 08: short-lived tokens + refresh rotation' },
];

// ===== CONFLICTS =====
export const conflicts: AuditConflict[] = [
  { id: 'CONFLICT-001', concept: 'Vendor/Supplier master', implementations: ['suppliers table (procurement)', 'contractors table (HR/payroll)'], resolution: 'Unify under single party master in Part 36', targetPart: 'Part 36' },
  { id: 'CONFLICT-002', concept: 'Role/Permission model', implementations: ['roles + permissions tables (basic RBAC)', 'Hardcoded role checks in controllers'], resolution: 'Central permission engine in Part 06', targetPart: 'Part 06' },
  { id: 'CONFLICT-003', concept: 'Document numbering', implementations: ['Sequence in DB (PO, GRN)', 'Manual prefix in code (Bills)', 'Date-based (Attendance)'], resolution: 'Central number series in Part 04', targetPart: 'Part 04' },
  { id: 'CONFLICT-004', concept: 'Status lifecycle', implementations: ['Enum in DB (projects)', 'String in code (POs)', 'Numeric flags (bills)'], resolution: 'Central status machine in Part 12', targetPart: 'Part 12' },
  { id: 'CONFLICT-005', concept: 'Cost allocation', implementations: ['WBS-based (material issue)', 'Project-level (POs)', 'Cost center (payroll)'], resolution: 'Unified cost posting engine in Part 14', targetPart: 'Part 14' },
];

// ===== GAP MATRIX =====
export const gapMatrix: AuditGap[] = [
  { part: 'Part 03', name: 'Quality Gates', coverage: 0, reusable: [], missing: ['Gate framework', 'Regression harness', 'Evidence store'], risks: ['No automated quality verification'] },
  { part: 'Part 04', name: 'Shared Services', coverage: 15, reusable: ['Number sequences (partial)', 'File upload'], missing: ['Idempotency', 'Central config', 'Job framework', 'Number series'], risks: ['Financial operations not idempotent'] },
  { part: 'Part 06', name: 'Authorization Engine', coverage: 20, reusable: ['Basic RBAC', 'JWT auth'], missing: ['ABAC', 'Field-level', 'Scope isolation', 'SoD'], risks: ['Critical security gaps'] },
  { part: 'Part 07', name: 'Audit Engine', coverage: 5, reusable: ['users table timestamps'], missing: ['Change tracking', 'Audit log', 'Evidence chain'], risks: ['No compliance trail'] },
  { part: 'Part 08', name: 'Security Pipeline', coverage: 10, reusable: ['JWT auth', 'HTTPS'], missing: ['Zero-trust', 'Secret management', 'Rate limiting', 'CSRF'], risks: ['Multiple security findings'] },
  { part: 'Part 09', name: 'Identity & SoD', coverage: 10, reusable: ['User/role tables'], missing: ['MFA', 'SoD matrix', 'Delegation', 'Identity provider'], risks: ['No maker-checker'] },
  { part: 'Part 10', name: 'Observability', coverage: 25, reusable: ['Basic logging', 'Prometheus'], missing: ['Structured logs', 'Error taxonomy', 'Tracing', 'Alerting'], risks: ['Limited debugging capability'] },
  { part: 'Part 11', name: 'Event Bus', coverage: 0, reusable: [], missing: ['Event framework', 'Outbox pattern', 'Socket.IO rooms'], risks: ['Cross-module coupling'] },
  { part: 'Part 12', name: 'Workflow Engine', coverage: 10, reusable: ['Basic approval (PR)'], missing: ['Multi-level', 'Conditional', 'Delegation', 'SLA'], risks: ['Approval bottleneck'] },
  { part: 'Part 14', name: 'Protocol & Control', coverage: 0, reusable: [], missing: ['8-stage protocol', 'Control points', 'Exception handling', 'Ledger'], risks: ['No governance framework'] },
  { part: 'Part 35', name: 'Calculation Engine', coverage: 30, reusable: ['12 existing calculations'], missing: ['Central registry', 'Single source of truth', 'Characterisation tests'], risks: ['Calculation drift'] },
  { part: 'Part 36', name: 'Master Data Governance', coverage: 20, reusable: ['Material master', 'Supplier master'], missing: ['Deduplication', 'Data quality', 'Unified party model'], risks: ['Duplicate/conflicting masters'] },
];

// ===== CONTROL INVENTORY (PC-1 stages) =====
export const controlInventory = [
  { module: 'Procurement', plan: { exists: true, enforcement: 'soft', location: 'PR form validation' }, authorize: { exists: true, enforcement: 'soft', location: 'Role check on submit' }, execute: { exists: true, enforcement: 'hard', location: 'PO creation service' }, record: { exists: false, enforcement: 'none', location: '' }, verify: { exists: true, enforcement: 'soft', location: 'GRN quantity check' }, analyze: { exists: false, enforcement: 'none', location: '' }, control: { exists: false, enforcement: 'none', location: '' }, close: { exists: false, enforcement: 'none', location: '' } },
  { module: 'Inventory', plan: { exists: false, enforcement: 'none', location: '' }, authorize: { exists: true, enforcement: 'soft', location: 'Store role check' }, execute: { exists: true, enforcement: 'hard', location: 'GRN/Issue service + trigger' }, record: { exists: true, enforcement: 'hard', location: 'stock_ledger trigger' }, verify: { exists: true, enforcement: 'soft', location: 'Quantity match check' }, analyze: { exists: false, enforcement: 'none', location: '' }, control: { exists: false, enforcement: 'none', location: '' }, close: { exists: false, enforcement: 'none', location: '' } },
  { module: 'Finance', plan: { exists: false, enforcement: 'none', location: '' }, authorize: { exists: true, enforcement: 'soft', location: 'Accounts role check' }, execute: { exists: true, enforcement: 'hard', location: 'Bill creation service' }, record: { exists: false, enforcement: 'none', location: '' }, verify: { exists: true, enforcement: 'soft', location: 'Manual verification step' }, analyze: { exists: false, enforcement: 'none', location: '' }, control: { exists: false, enforcement: 'none', location: '' }, close: { exists: false, enforcement: 'none', location: '' } },
  { module: 'HR/Payroll', plan: { exists: false, enforcement: 'none', location: '' }, authorize: { exists: true, enforcement: 'soft', location: 'HR role check' }, execute: { exists: true, enforcement: 'hard', location: 'Payroll generate service' }, record: { exists: false, enforcement: 'none', location: '' }, verify: { exists: false, enforcement: 'none', location: '' }, analyze: { exists: false, enforcement: 'none', location: '' }, control: { exists: false, enforcement: 'none', location: '' }, close: { exists: false, enforcement: 'none', location: '' } },
  { module: 'Quality', plan: { exists: true, enforcement: 'soft', location: 'Checklist template' }, authorize: { exists: true, enforcement: 'soft', location: 'QA role check' }, execute: { exists: true, enforcement: 'hard', location: 'Inspection service' }, record: { exists: false, enforcement: 'none', location: '' }, verify: { exists: false, enforcement: 'none', location: '' }, analyze: { exists: false, enforcement: 'none', location: '' }, control: { exists: false, enforcement: 'none', location: '' }, close: { exists: false, enforcement: 'none', location: '' } },
];

// ===== DEPENDENCY MAP =====
export const dependencyMap = [
  { from: 'Procurement', to: 'Project Management', type: 'data', description: 'PO lines reference BOQ items and WBS' },
  { from: 'Inventory', to: 'Procurement', type: 'data', description: 'GRN references PO; stock valuation uses PO rates' },
  { from: 'Finance', to: 'Procurement', type: 'direct-access', description: 'Bill service reads PO table directly (anti-pattern)' },
  { from: 'Finance', to: 'Inventory', type: 'data', description: 'Material cost from stock_ledger FIFO' },
  { from: 'Finance', to: 'HR', type: 'data', description: 'Payroll feeds into cost allocation' },
  { from: 'HR', to: 'Project Management', type: 'data', description: 'Attendance linked to project/site' },
  { from: 'Quality', to: 'Inventory', type: 'event', description: 'Inspection triggered on GRN (not yet implemented)' },
  { from: 'Reports', to: 'All modules', type: 'direct-access', description: 'Reports query multiple tables directly' },
];

// ===== SOCKET EVENTS =====
export const socketEvents = [
  { namespace: '/', event: 'notification:new', auth: true, room: 'user:{userId}', description: 'Push new notification to user' },
  { namespace: '/', event: 'approval:required', auth: true, room: 'role:{roleKey}', description: 'Alert role members of pending approval' },
  { namespace: '/', event: 'stock:threshold', auth: true, room: 'project:{projectId}', description: 'Stock below reorder level alert' },
  { namespace: '/', event: 'task:assigned', auth: true, room: 'user:{userId}', description: 'New task assignment notification' },
];

// ===== BACKGROUND JOBS =====
export const backgroundJobs = [
  { name: 'attendance-auto-mark', schedule: '0 9 * * *', description: 'Auto-mark attendance from biometric', status: 'active' },
  { name: 'stock-reorder-alert', schedule: '0 */4 * * *', description: 'Check reorder levels every 4 hours', status: 'active' },
  { name: 'report-snapshot', schedule: '0 2 * * 0', description: 'Weekly report snapshot generation', status: 'active' },
  { name: 'session-cleanup', schedule: '0 3 * * *', description: 'Clean expired sessions daily', status: 'active' },
  { name: 'backup-database', schedule: '0 1 * * *', description: 'Nightly database backup', status: 'active' },
];
