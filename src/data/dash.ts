// Part 20 — Advanced Responsive Dashboard Architecture
// Widget framework, KPI registry, layouts, and personalization

export type WidgetType = 'kpi' | 'chart' | 'list' | 'table' | 'map' | 'calendar' | 'custom';
export type LayoutOwnerType = 'user' | 'role' | 'system';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type KPIDirection = 'higher_better' | 'lower_better';
export type KPIDataLabel = 'actual' | 'calculated' | 'forecast';
export type RAGStatus = 'red' | 'amber' | 'green';

export interface Widget {
  id: string;
  code: string;
  name: string;
  module: string;
  type: WidgetType;
  description: string;
  dataEndpoint: string;
  requiredPermission: string;
  defaultSize: { w: number; h: number };
  refreshSeconds: number;
  supportsFilters: boolean;
  isActive: boolean;
}

export interface KPI {
  id: string;
  code: string;
  name: string;
  formulaDescription: string;
  unit: string;
  dataLabel: KPIDataLabel;
  sourceEndpoint: string;
  thresholds: {
    red: number;
    amber: number;
    green: number;
  };
  direction: KPIDirection;
  ownerModule: string;
  version: number;
  effectiveFrom: string;
}

export interface LayoutItem {
  widgetCode: string;
  x: number;
  y: number;
  w: number;
  h: number;
  filters?: Record<string, any>;
}

export interface Layout {
  id: string;
  ownerType: LayoutOwnerType;
  ownerId: string;
  name: string;
  isDefault: boolean;
  device: DeviceType;
  items: LayoutItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UserQuickAction {
  id: string;
  userId: string;
  actionCode: string;
  actionName: string;
  icon: string;
  route: string;
  permission: string;
  position: number;
}

export interface WidgetData {
  widgetCode: string;
  value?: number | string;
  previousValue?: number | string;
  trend?: { label: string; value: number }[];
  label?: string;
  drillLink?: string;
  asOf?: string;
  status?: RAGStatus;
  items?: any[];
  error?: string;
  loading?: boolean;
}

export interface DashboardFilter {
  projectId?: string;
  siteId?: string;
  period?: string;
  department?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== WIDGET REGISTRY =====
export const widgets: Widget[] = [
  // My Work Widgets
  {
    id: 'widget-001', code: 'my_approvals', name: 'My Approvals', module: 'workflow',
    type: 'list', description: 'Pending approval tasks assigned to you',
    dataEndpoint: '/api/v1/wf/my/tasks', requiredPermission: 'wf.task.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 60, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-002', code: 'my_tasks', name: 'My Tasks', module: 'task',
    type: 'list', description: 'Tasks assigned to you across all modules',
    dataEndpoint: '/api/v1/tasks/my', requiredPermission: 'task.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 60, supportsFilters: true, isActive: false // Hidden until Part 27
  },
  {
    id: 'widget-003', code: 'my_notifications', name: 'My Notifications', module: 'notification',
    type: 'list', description: 'Recent notifications and alerts',
    dataEndpoint: '/api/v1/ntf/notifications', requiredPermission: 'ntf.view',
    defaultSize: { w: 6, h: 3 }, refreshSeconds: 30, supportsFilters: false, isActive: true
  },
  {
    id: 'widget-004', code: 'my_projects', name: 'My Projects', module: 'org',
    type: 'table', description: 'Projects you are allocated to',
    dataEndpoint: '/api/v1/org/projects/my', requiredPermission: 'org.project.view',
    defaultSize: { w: 12, h: 4 }, refreshSeconds: 300, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-005', code: 'my_sites', name: 'My Sites', module: 'org',
    type: 'table', description: 'Sites you are allocated to',
    dataEndpoint: '/api/v1/org/sites/my', requiredPermission: 'org.site.view',
    defaultSize: { w: 12, h: 4 }, refreshSeconds: 300, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-006', code: 'my_attendance', name: 'My Attendance', module: 'hr',
    type: 'kpi', description: 'Your attendance summary',
    dataEndpoint: '/api/v1/hr/attendance/my', requiredPermission: 'hr.attendance.view',
    defaultSize: { w: 4, h: 2 }, refreshSeconds: 3600, supportsFilters: true, isActive: false // Hidden until Part 69
  },
  {
    id: 'widget-007', code: 'my_calendar', name: 'My Calendar', module: 'calendar',
    type: 'calendar', description: 'Upcoming approvals, tasks, and meetings',
    dataEndpoint: '/api/v1/calendar/my', requiredPermission: 'calendar.view',
    defaultSize: { w: 8, h: 6 }, refreshSeconds: 300, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-008', code: 'my_documents', name: 'Recent Documents', module: 'document',
    type: 'list', description: 'Recently accessed documents',
    dataEndpoint: '/api/v1/doc/recent', requiredPermission: 'doc.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 300, supportsFilters: false, isActive: true
  },
  {
    id: 'widget-009', code: 'quick_actions', name: 'Quick Actions', module: 'shell',
    type: 'custom', description: 'Frequently used actions',
    dataEndpoint: '/api/v1/dash/quick-actions', requiredPermission: 'shell.home.view',
    defaultSize: { w: 6, h: 3 }, refreshSeconds: 0, supportsFilters: false, isActive: true
  },
  {
    id: 'widget-010', code: 'recent_records', name: 'Recent Records', module: 'shell',
    type: 'list', description: 'Recently viewed records across modules',
    dataEndpoint: '/api/v1/dash/recent', requiredPermission: 'shell.home.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 60, supportsFilters: false, isActive: true
  },
  {
    id: 'widget-011', code: 'favourites', name: 'Favourites', module: 'shell',
    type: 'list', description: 'Your bookmarked records',
    dataEndpoint: '/api/v1/dash/favourites', requiredPermission: 'shell.home.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 0, supportsFilters: false, isActive: true
  },
  
  // Protocol Widgets
  {
    id: 'widget-012', code: 'my_gates_today', name: 'My Gates Today', module: 'protocol',
    type: 'list', description: 'Protocol gates requiring your attention today',
    dataEndpoint: '/api/v1/protocol/gates/my/today', requiredPermission: 'protocol.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 300, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-013', code: 'my_exceptions', name: 'My Exceptions', module: 'protocol',
    type: 'list', description: 'Protocol exceptions you requested or need to approve',
    dataEndpoint: '/api/v1/protocol/exceptions/my', requiredPermission: 'protocol.exception.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 300, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-014', code: 'my_violations', name: 'My Violations', module: 'protocol',
    type: 'list', description: 'Protocol violations assigned to you',
    dataEndpoint: '/api/v1/protocol/violations/my', requiredPermission: 'protocol.violation.view',
    defaultSize: { w: 6, h: 4 }, refreshSeconds: 300, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-015', code: 'my_compliance_score', name: 'My Compliance Score', module: 'accountability',
    type: 'kpi', description: 'Your current compliance score',
    dataEndpoint: '/api/v1/acc/scores/me', requiredPermission: 'acc.score.view',
    defaultSize: { w: 4, h: 2 }, refreshSeconds: 3600, supportsFilters: false, isActive: true
  },
  {
    id: 'widget-016', code: 'planned_vs_actual', name: 'Planned vs Actual', module: 'protocol',
    type: 'chart', description: 'Planned vs actual comparison for your scope',
    dataEndpoint: '/api/v1/protocol/planned-vs-actual', requiredPermission: 'protocol.view',
    defaultSize: { w: 8, h: 4 }, refreshSeconds: 3600, supportsFilters: true, isActive: true
  },
  
  // KPI Widgets
  {
    id: 'widget-017', code: 'kpi_active_projects', name: 'Active Projects', module: 'org',
    type: 'kpi', description: 'Total active projects',
    dataEndpoint: '/api/v1/dash/kpis/active-projects', requiredPermission: 'org.project.view',
    defaultSize: { w: 4, h: 2 }, refreshSeconds: 3600, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-018', code: 'kpi_pending_pos', name: 'Pending POs', module: 'procurement',
    type: 'kpi', description: 'Purchase orders pending approval',
    dataEndpoint: '/api/v1/dash/kpis/pending-pos', requiredPermission: 'proc.po.view',
    defaultSize: { w: 4, h: 2 }, refreshSeconds: 300, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-019', code: 'kpi_budget_variance', name: 'Budget Variance', module: 'finance',
    type: 'kpi', description: 'Overall budget variance percentage',
    dataEndpoint: '/api/v1/dash/kpis/budget-variance', requiredPermission: 'fin.budget.view',
    defaultSize: { w: 4, h: 2 }, refreshSeconds: 3600, supportsFilters: true, isActive: true
  },
  {
    id: 'widget-020', code: 'kpi_material_value', name: 'Material Value', module: 'inventory',
    type: 'kpi', description: 'Total material value in stock',
    dataEndpoint: '/api/v1/dash/kpis/material-value', requiredPermission: 'inv.stock.view',
    defaultSize: { w: 4, h: 2 }, refreshSeconds: 3600, supportsFilters: true, isActive: true
  },
];

// ===== KPI REGISTRY =====
export const kpis: KPI[] = [
  {
    id: 'kpi-001', code: 'active_projects', name: 'Active Projects',
    formulaDescription: 'COUNT(projects WHERE status = "Active")',
    unit: 'count', dataLabel: 'actual',
    sourceEndpoint: '/api/v1/org/projects',
    thresholds: { red: 0, amber: 5, green: 10 },
    direction: 'higher_better', ownerModule: 'org', version: 1, effectiveFrom: '2024-01-01'
  },
  {
    id: 'kpi-002', code: 'pending_pos', name: 'Pending Purchase Orders',
    formulaDescription: 'COUNT(purchase_orders WHERE status = "Pending Approval")',
    unit: 'count', dataLabel: 'actual',
    sourceEndpoint: '/api/v1/proc/purchase-orders',
    thresholds: { red: 20, amber: 10, green: 0 },
    direction: 'lower_better', ownerModule: 'procurement', version: 1, effectiveFrom: '2024-01-01'
  },
  {
    id: 'kpi-003', code: 'budget_variance', name: 'Budget Variance',
    formulaDescription: '(actual_cost - budget) / budget * 100',
    unit: 'percentage', dataLabel: 'calculated',
    sourceEndpoint: '/api/v1/fin/budget/variance',
    thresholds: { red: 10, amber: 5, green: 0 },
    direction: 'lower_better', ownerModule: 'finance', version: 1, effectiveFrom: '2024-01-01'
  },
  {
    id: 'kpi-004', code: 'material_value', name: 'Material Value',
    formulaDescription: 'SUM(stock_ledger.quantity * stock_ledger.unit_cost)',
    unit: 'currency', dataLabel: 'actual',
    sourceEndpoint: '/api/v1/inv/stock/value',
    thresholds: { red: 0, amber: 1000000, green: 5000000 },
    direction: 'higher_better', ownerModule: 'inventory', version: 1, effectiveFrom: '2024-01-01'
  },
  {
    id: 'kpi-005', code: 'compliance_score', name: 'Compliance Score',
    formulaDescription: 'Weighted average of on-time completion, quality, compliance rate, exception rate, violations',
    unit: 'percentage', dataLabel: 'calculated',
    sourceEndpoint: '/api/v1/acc/scores/me',
    thresholds: { red: 70, amber: 85, green: 95 },
    direction: 'higher_better', ownerModule: 'accountability', version: 1, effectiveFrom: '2024-01-01'
  },
];

// ===== DEFAULT LAYOUTS =====
export const defaultLayouts: Layout[] = [
  {
    id: 'layout-001', ownerType: 'role', ownerId: 'PROJECT_MANAGER', name: 'Project Manager Default',
    isDefault: true, device: 'desktop',
    items: [
      { widgetCode: 'my_approvals', x: 0, y: 0, w: 6, h: 4 },
      { widgetCode: 'my_notifications', x: 6, y: 0, w: 6, h: 3 },
      { widgetCode: 'quick_actions', x: 6, y: 3, w: 6, h: 3 },
      { widgetCode: 'kpi_active_projects', x: 0, y: 4, w: 4, h: 2 },
      { widgetCode: 'kpi_pending_pos', x: 4, y: 4, w: 4, h: 2 },
      { widgetCode: 'kpi_budget_variance', x: 8, y: 4, w: 4, h: 2 },
      { widgetCode: 'my_projects', x: 0, y: 6, w: 12, h: 4 },
      { widgetCode: 'my_gates_today', x: 0, y: 10, w: 6, h: 4 },
      { widgetCode: 'my_compliance_score', x: 6, y: 10, w: 6, h: 2 },
      { widgetCode: 'planned_vs_actual', x: 6, y: 12, w: 6, h: 4 },
    ],
    createdAt: '2024-01-01', updatedAt: '2024-01-01'
  },
  {
    id: 'layout-002', ownerType: 'role', ownerId: 'SITE_ENGINEER', name: 'Site Engineer Default',
    isDefault: true, device: 'desktop',
    items: [
      { widgetCode: 'my_approvals', x: 0, y: 0, w: 6, h: 4 },
      { widgetCode: 'my_notifications', x: 6, y: 0, w: 6, h: 3 },
      { widgetCode: 'quick_actions', x: 6, y: 3, w: 6, h: 3 },
      { widgetCode: 'my_sites', x: 0, y: 6, w: 12, h: 4 },
      { widgetCode: 'my_gates_today', x: 0, y: 10, w: 6, h: 4 },
      { widgetCode: 'my_violations', x: 6, y: 10, w: 6, h: 4 },
    ],
    createdAt: '2024-01-01', updatedAt: '2024-01-01'
  },
  {
    id: 'layout-003', ownerType: 'role', ownerId: 'PROCUREMENT_MANAGER', name: 'Procurement Manager Default',
    isDefault: true, device: 'desktop',
    items: [
      { widgetCode: 'my_approvals', x: 0, y: 0, w: 6, h: 4 },
      { widgetCode: 'my_notifications', x: 6, y: 0, w: 6, h: 3 },
      { widgetCode: 'quick_actions', x: 6, y: 3, w: 6, h: 3 },
      { widgetCode: 'kpi_pending_pos', x: 0, y: 6, w: 4, h: 2 },
      { widgetCode: 'kpi_material_value', x: 4, y: 6, w: 4, h: 2 },
      { widgetCode: 'kpi_budget_variance', x: 8, y: 6, w: 4, h: 2 },
      { widgetCode: 'my_exceptions', x: 0, y: 8, w: 6, h: 4 },
      { widgetCode: 'recent_records', x: 6, y: 8, w: 6, h: 4 },
    ],
    createdAt: '2024-01-01', updatedAt: '2024-01-01'
  },
  {
    id: 'layout-004', ownerType: 'user', ownerId: 'user-010', name: 'Rajesh Kumar Personal',
    isDefault: false, device: 'desktop',
    items: [
      { widgetCode: 'my_approvals', x: 0, y: 0, w: 8, h: 5 },
      { widgetCode: 'my_notifications', x: 8, y: 0, w: 4, h: 3 },
      { widgetCode: 'quick_actions', x: 8, y: 3, w: 4, h: 2 },
      { widgetCode: 'my_projects', x: 0, y: 5, w: 12, h: 5 },
      { widgetCode: 'my_compliance_score', x: 0, y: 10, w: 4, h: 2 },
      { widgetCode: 'my_gates_today', x: 4, y: 10, w: 8, h: 4 },
    ],
    createdAt: '2024-01-10', updatedAt: '2024-01-15'
  },
];

// ===== USER QUICK ACTIONS =====
export const userQuickActions: UserQuickAction[] = [
  { id: 'action-001', userId: 'user-010', actionCode: 'create_pr', actionName: 'Create PR', icon: 'plus', route: '/procurement/requests/new', permission: 'proc.pr.create', position: 1 },
  { id: 'action-002', userId: 'user-010', actionCode: 'create_po', actionName: 'Create PO', icon: 'plus', route: '/procurement/orders/new', permission: 'proc.po.create', position: 2 },
  { id: 'action-003', userId: 'user-010', actionCode: 'view_reports', actionName: 'View Reports', icon: 'file-text', route: '/reports', permission: 'rpt.report.view', position: 3 },
  { id: 'action-004', userId: 'user-015', actionCode: 'mark_attendance', actionName: 'Mark Attendance', icon: 'check', route: '/hr/attendance/mark', permission: 'hr.attendance.mark', position: 1 },
  { id: 'action-005', userId: 'user-015', actionCode: 'submit_dpr', actionName: 'Submit DPR', icon: 'file-text', route: '/project/dpr/new', permission: 'project.dpr.create', position: 2 },
];

// ===== SAMPLE WIDGET DATA =====
export const sampleWidgetData: Record<string, WidgetData> = {
  'my_approvals': {
    widgetCode: 'my_approvals',
    value: 5,
    label: 'Pending Approvals',
    asOf: '2024-01-16T15:45:00Z',
    items: [
      { id: 'task-001', title: 'PO-2024-0894', subtitle: '₹8.5L · Amit Shah', status: 'high', dueDate: '2024-01-17' },
      { id: 'task-002', title: 'EXC-2024-002', subtitle: '₹7.5L excess · Suresh Patel', status: 'high', dueDate: '2024-01-17' },
      { id: 'task-003', title: 'PR-2024-0235', subtitle: '₹3.2L · Ravi Sharma', status: 'normal', dueDate: '2024-01-18' },
      { id: 'task-004', title: 'Bill B-450', subtitle: '₹12.5L · Raj Constructions', status: 'normal', dueDate: '2024-01-19' },
      { id: 'task-005', title: 'Variation VAR-015', subtitle: '₹5.0L · Metro Tower', status: 'low', dueDate: '2024-01-20' },
    ],
    drillLink: '/workflow?filter=pending',
    loading: false,
  },
  'my_notifications': {
    widgetCode: 'my_notifications',
    value: 8,
    label: 'Unread Notifications',
    asOf: '2024-01-16T15:45:00Z',
    items: [
      { id: 'ntf-001', title: 'PO-2024-0894 requires approval', type: 'approval', priority: 'high', time: '10 min ago' },
      { id: 'ntf-002', title: 'Exception EXC-2024-002 pending', type: 'exception', priority: 'high', time: '1 hour ago' },
      { id: 'ntf-003', title: 'Bill B-448 overdue', type: 'overdue', priority: 'normal', time: '3 hours ago' },
      { id: 'ntf-004', title: 'Safety incident SI-015 reported', type: 'safety', priority: 'critical', time: '5 hours ago' },
    ],
    drillLink: '/home/rt',
    loading: false,
  },
  'kpi_active_projects': {
    widgetCode: 'kpi_active_projects',
    value: 12,
    previousValue: 11,
    trend: [
      { label: 'Oct', value: 10 },
      { label: 'Nov', value: 11 },
      { label: 'Dec', value: 11 },
      { label: 'Jan', value: 12 },
    ],
    label: 'Active Projects',
    asOf: '2024-01-16T15:00:00Z',
    status: 'green',
    drillLink: '/org/projects?status=active',
    loading: false,
  },
  'kpi_pending_pos': {
    widgetCode: 'kpi_pending_pos',
    value: 8,
    previousValue: 12,
    trend: [
      { label: 'Oct', value: 15 },
      { label: 'Nov', value: 12 },
      { label: 'Dec', value: 10 },
      { label: 'Jan', value: 8 },
    ],
    label: 'Pending POs',
    asOf: '2024-01-16T15:00:00Z',
    status: 'green',
    drillLink: '/procurement/orders?status=pending',
    loading: false,
  },
  'kpi_budget_variance': {
    widgetCode: 'kpi_budget_variance',
    value: -3.2,
    previousValue: -2.8,
    trend: [
      { label: 'Oct', value: -1.5 },
      { label: 'Nov', value: -2.0 },
      { label: 'Dec', value: -2.8 },
      { label: 'Jan', value: -3.2 },
    ],
    label: 'Budget Variance',
    asOf: '2024-01-16T15:00:00Z',
    status: 'amber',
    drillLink: '/finance/budget/variance',
    loading: false,
  },
  'kpi_material_value': {
    widgetCode: 'kpi_material_value',
    value: 4200000,
    previousValue: 3800000,
    trend: [
      { label: 'Oct', value: 3200000 },
      { label: 'Nov', value: 3500000 },
      { label: 'Dec', value: 3800000 },
      { label: 'Jan', value: 4200000 },
    ],
    label: 'Material Value',
    asOf: '2024-01-16T15:00:00Z',
    status: 'green',
    drillLink: '/inventory/stock/value',
    loading: false,
  },
  'my_compliance_score': {
    widgetCode: 'my_compliance_score',
    value: 96,
    previousValue: 94,
    trend: [
      { label: 'Oct', value: 92 },
      { label: 'Nov', value: 93 },
      { label: 'Dec', value: 94 },
      { label: 'Jan', value: 96 },
    ],
    label: 'Compliance Score',
    asOf: '2024-01-16T15:00:00Z',
    status: 'green',
    drillLink: '/admin/acc/scores',
    loading: false,
  },
  'my_gates_today': {
    widgetCode: 'my_gates_today',
    value: 3,
    label: 'Gates Requiring Attention',
    asOf: '2024-01-16T15:45:00Z',
    items: [
      { id: 'gate-001', title: 'CP-PO-001: Budget check', status: 'warn', message: 'PO-0894 exceeds 90% budget' },
      { id: 'gate-002', title: 'CP-ISSUE-001: Stock balance', status: 'pass', message: 'All issues within limits' },
      { id: 'gate-003', title: 'CP-BILL-001: Reconciliation', status: 'fail', message: 'Bill B-448 pending reconciliation' },
    ],
    drillLink: '/admin/protocol/gates',
    loading: false,
  },
  'my_exceptions': {
    widgetCode: 'my_exceptions',
    value: 2,
    label: 'Pending Exceptions',
    asOf: '2024-01-16T15:45:00Z',
    items: [
      { id: 'exc-001', title: 'EXC-2024-001', subtitle: 'Qty excess 8% · Ravi Sharma', status: 'approved', date: '2024-01-16' },
      { id: 'exc-002', title: 'EXC-2024-002', subtitle: 'Amount excess ₹7.5L · Suresh Patel', status: 'pending', date: '2024-01-16' },
    ],
    drillLink: '/admin/protocol/exceptions',
    loading: false,
  },
  'my_violations': {
    widgetCode: 'my_violations',
    value: 1,
    label: 'Open Violations',
    asOf: '2024-01-16T15:45:00Z',
    items: [
      { id: 'viol-001', title: 'VIOL-2024-001', subtitle: 'Approval limit exceeded · Amit Shah', status: 'open', date: '2024-01-16' },
    ],
    drillLink: '/admin/protocol/violations',
    loading: false,
  },
  'planned_vs_actual': {
    widgetCode: 'planned_vs_actual',
    label: 'Planned vs Actual',
    asOf: '2024-01-16T15:00:00Z',
    items: [
      { category: 'Time', planned: 100, actual: 85, variance: -15, unit: '%' },
      { category: 'Cost', planned: 4500000, actual: 4200000, variance: -300000, unit: 'INR' },
      { category: 'Quantity', planned: 500, actual: 475, variance: -25, unit: 'MT' },
      { category: 'Progress', planned: 67, actual: 62, variance: -5, unit: '%' },
    ],
    drillLink: '/protocol/planned-vs-actual',
    loading: false,
  },
  'quick_actions': {
    widgetCode: 'quick_actions',
    label: 'Quick Actions',
    asOf: '2024-01-16T15:45:00Z',
    items: [
      { id: 'action-001', title: 'Create PR', icon: 'plus', route: '/procurement/requests/new' },
      { id: 'action-002', title: 'Create PO', icon: 'plus', route: '/procurement/orders/new' },
      { id: 'action-003', title: 'View Reports', icon: 'file-text', route: '/reports' },
    ],
    loading: false,
  },
  'recent_records': {
    widgetCode: 'recent_records',
    label: 'Recent Records',
    asOf: '2024-01-16T15:45:00Z',
    items: [
      { id: 'rec-001', title: 'PO-2024-0892', type: 'Purchase Order', time: '2 hours ago', route: '/procurement/orders/po-089' },
      { id: 'rec-002', title: 'Bill B-447', type: 'Subcontractor Bill', time: '5 hours ago', route: '/finance/bills/bill-447' },
      { id: 'rec-003', title: 'GRN-2024-1205', type: 'Goods Receipt', time: '1 day ago', route: '/inventory/grn/grn-001' },
    ],
    drillLink: '/recent',
    loading: false,
  },
};

// ===== PROTOCOL CONTROL POINT =====
export const protocolControlPoint: ProtocolControlPoint = {
  id: 'CP-DASH-01',
  stage: 'VERIFY',
  control: 'Every KPI widget declares data label, formula, threshold and drill path',
  enforcement: 'BLOCK (widget registration)',
  status: 'OBSERVE',
};

// ===== HELPER FUNCTIONS =====
export function getWidgetsByModule(module: string): Widget[] {
  return widgets.filter(w => w.module === module && w.isActive);
}

export function getWidgetsByType(type: WidgetType): Widget[] {
  return widgets.filter(w => w.type === type && w.isActive);
}

export function getLayoutForUser(userId: string, device: DeviceType): Layout | null {
  // First check for user-specific layout
  const userLayout = defaultLayouts.find(l => l.ownerType === 'user' && l.ownerId === userId && l.device === device);
  if (userLayout) return userLayout;
  
  // Fall back to role default (simulated)
  return defaultLayouts.find(l => l.ownerType === 'role' && l.device === device) || null;
}

export function getKPIByCode(code: string): KPI | null {
  return kpis.find(k => k.code === code) || null;
}

export function calculateRAGStatus(value: number, kpi: KPI): RAGStatus {
  const { red, amber, green } = kpi.thresholds;
  
  if (kpi.direction === 'higher_better') {
    if (value >= green) return 'green';
    if (value >= amber) return 'amber';
    return 'red';
  } else {
    if (value <= green) return 'green';
    if (value <= amber) return 'amber';
    return 'red';
  }
}

export function formatKPIValue(value: number | string, unit: string): string {
  if (typeof value === 'string') return value;
  
  switch (unit) {
    case 'currency':
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'count':
      return value.toLocaleString('en-IN');
    default:
      return value.toString();
  }
}
