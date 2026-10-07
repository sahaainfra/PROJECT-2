// Navigation Registry — DS-13, DS-14
export interface NavEntry {
  id: string;
  group: string;
  label: string;
  iconKey: string;
  route: string;
  permissionKey: string;
  featureFlag: string;
  sortOrder: number;
  keywords: string[];
  isActive: boolean;
  badge?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  iconKey: string;
  sortOrder: number;
  entries: NavEntry[];
}

export const navigationRegistry: NavGroup[] = [
  {
    id: 'home', label: 'Home', iconKey: 'home', sortOrder: 0,
    entries: [
      { id: 'launchpad', group: 'home', label: 'Launchpad', iconKey: 'grid', route: '/', permissionKey: 'shell.home.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['home', 'dashboard'], isActive: true },
      { id: 'my-workspace', group: 'home', label: 'My Workspace', iconKey: 'layout-dashboard', route: '/home/dash', permissionKey: 'dash.workspace.view', featureFlag: 'ff.dash', sortOrder: 1, keywords: ['workspace', 'dashboard', 'personal', 'kpi'], isActive: true } as NavEntry,
      { id: 'responsive-shell', group: 'home', label: 'Responsive Shell', iconKey: 'smartphone', route: '/home/rsp', permissionKey: 'rsp.shell.view', featureFlag: 'ff.rsp', sortOrder: 2, keywords: ['responsive', 'mobile', 'tablet', 'desktop', 'pwa', 'device'], isActive: true } as NavEntry,
      { id: 'my-approvals', group: 'home', label: 'My Approvals', iconKey: 'inbox', route: '/workflow', permissionKey: 'wf.task.act', featureFlag: 'ff.wf', sortOrder: 3, keywords: ['workflow', 'approval', 'inbox', 'task'], isActive: true, badge: '3' } as NavEntry,
      { id: 'notifications', group: 'home', label: 'Notifications', iconKey: 'bell', route: '/home/rt', permissionKey: 'ntf.view', featureFlag: 'ff.rt', sortOrder: 4, keywords: ['notification', 'alert', 'message', 'real-time'], isActive: true, badge: '5' } as NavEntry,
      { id: 'global-search', group: 'home', label: 'Global Search', iconKey: 'search', route: '/home/search', permissionKey: 'search.global.use', featureFlag: 'ff.search', sortOrder: 5, keywords: ['search', 'find', 'lookup', 'command', 'palette', 'global'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'project-management', label: 'Project Management', iconKey: 'folder', sortOrder: 10,
    entries: [
      { id: 'projects', group: 'project-management', label: 'Projects', iconKey: 'building', route: '/projects', permissionKey: 'pm.projects.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['project', 'construction'], isActive: true, badge: '12' } as NavEntry,
      { id: 'wbs', group: 'project-management', label: 'WBS Structure', iconKey: 'sitemap', route: '/projects/wbs', permissionKey: 'pm.wbs.view', featureFlag: 'ff.pgm', sortOrder: 1, keywords: ['wbs', 'breakdown'], isActive: true } as NavEntry,
      { id: 'boq', group: 'project-management', label: 'Bill of Quantities', iconKey: 'calculator', route: '/projects/boq', permissionKey: 'pm.boq.view', featureFlag: 'ff.pgm', sortOrder: 2, keywords: ['boq', 'estimate'], isActive: true } as NavEntry,
      { id: 'schedule', group: 'project-management', label: 'Schedule', iconKey: 'calendar', route: '/projects/schedule', permissionKey: 'pm.schedule.view', featureFlag: 'ff.pgm', sortOrder: 3, keywords: ['schedule', 'gantt'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'procurement', label: 'Procurement', iconKey: 'cart', sortOrder: 20,
    entries: [
      { id: 'purchase-requests', group: 'procurement', label: 'Purchase Requests', iconKey: 'file-text', route: '/procurement/requests', permissionKey: 'proc.pr.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['pr', 'requisition'], isActive: true, badge: '5' } as NavEntry,
      { id: 'purchase-orders', group: 'procurement', label: 'Purchase Orders', iconKey: 'clipboard', route: '/procurement/orders', permissionKey: 'proc.po.view', featureFlag: 'ff.pgm', sortOrder: 1, keywords: ['po', 'order'], isActive: true } as NavEntry,
      { id: 'suppliers', group: 'procurement', label: 'Suppliers', iconKey: 'truck', route: '/procurement/suppliers', permissionKey: 'proc.suppliers.view', featureFlag: 'ff.pgm', sortOrder: 2, keywords: ['supplier', 'vendor'], isActive: true } as NavEntry,
      { id: 'contracts', group: 'procurement', label: 'Contracts', iconKey: 'file-check', route: '/procurement/contracts', permissionKey: 'proc.contracts.view', featureFlag: 'ff.pgm', sortOrder: 3, keywords: ['contract', 'tender'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'inventory', label: 'Inventory & Stores', iconKey: 'warehouse', sortOrder: 30,
    entries: [
      { id: 'grn', group: 'inventory', label: 'Goods Receipt', iconKey: 'package', route: '/inventory/grn', permissionKey: 'inv.grn.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['grn', 'receiving'], isActive: true } as NavEntry,
      { id: 'stock', group: 'inventory', label: 'Stock Register', iconKey: 'boxes', route: '/inventory/stock', permissionKey: 'inv.stock.view', featureFlag: 'ff.pgm', sortOrder: 1, keywords: ['stock', 'material'], isActive: true } as NavEntry,
      { id: 'issue-slip', group: 'inventory', label: 'Material Issue', iconKey: 'arrow-up-right', route: '/inventory/issue', permissionKey: 'inv.issue.view', featureFlag: 'ff.pgm', sortOrder: 2, keywords: ['issue', 'consumption'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'finance', label: 'Finance & Accounts', iconKey: 'dollar', sortOrder: 40,
    entries: [
      { id: 'bills', group: 'finance', label: 'Subcontractor Bills', iconKey: 'receipt', route: '/finance/bills', permissionKey: 'fin.bills.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['bill', 'invoice'], isActive: true } as NavEntry,
      { id: 'payroll', group: 'finance', label: 'Payroll', iconKey: 'users', route: '/finance/payroll', permissionKey: 'fin.payroll.view', featureFlag: 'ff.pgm', sortOrder: 1, keywords: ['payroll', 'salary'], isActive: true } as NavEntry,
      { id: 'cost-centers', group: 'finance', label: 'Cost Centers', iconKey: 'pie-chart', route: '/finance/cost-centers', permissionKey: 'fin.cost.view', featureFlag: 'ff.pgm', sortOrder: 2, keywords: ['cost', 'budget'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'hr', label: 'Human Resources', iconKey: 'user-check', sortOrder: 50,
    entries: [
      { id: 'attendance', group: 'hr', label: 'Attendance', iconKey: 'clock', route: '/hr/attendance', permissionKey: 'hr.attendance.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['attendance', 'muster'], isActive: true } as NavEntry,
      { id: 'employees', group: 'hr', label: 'Employees', iconKey: 'user', route: '/hr/employees', permissionKey: 'hr.employees.view', featureFlag: 'ff.pgm', sortOrder: 1, keywords: ['employee', 'worker'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'quality', label: 'Quality & Safety', iconKey: 'shield', sortOrder: 60,
    entries: [
      { id: 'inspections', group: 'quality', label: 'Inspections', iconKey: 'search', route: '/quality/inspections', permissionKey: 'qa.inspections.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['inspection', 'quality'], isActive: true } as NavEntry,
      { id: 'safety', group: 'quality', label: 'Safety Incidents', iconKey: 'alert-triangle', route: '/quality/safety', permissionKey: 'qa.safety.view', featureFlag: 'ff.pgm', sortOrder: 1, keywords: ['safety', 'incident'], isActive: true, badge: '2' } as NavEntry,
    ],
  },
  {
    id: 'reports', label: 'Reports & Analytics', iconKey: 'bar-chart', sortOrder: 70,
    entries: [
      { id: 'dashboards', group: 'reports', label: 'Dashboards', iconKey: 'layout-dashboard', route: '/reports/dashboards', permissionKey: 'rpt.dashboards.view', featureFlag: 'ff.pgm', sortOrder: 0, keywords: ['dashboard', 'kpi'], isActive: true } as NavEntry,
      { id: 'report-catalog', group: 'reports', label: 'Report Catalog', iconKey: 'file-bar-chart', route: '/reports/catalog', permissionKey: 'rpt.catalog.view', featureFlag: 'ff.pgm', sortOrder: 1, keywords: ['report', 'export'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'field-operations', label: 'Field Operations', iconKey: 'cloud-off', sortOrder: 80,
    entries: [
      { id: 'offline-sync', group: 'field-operations', label: 'Offline Sync', iconKey: 'cloud-off', route: '/field/offline', permissionKey: 'offline.device.view', featureFlag: 'ff.offline', sortOrder: 0, keywords: ['offline', 'sync', 'field', 'mobile', 'conflict', 'command'], isActive: true } as NavEntry,
    ],
  },
  {
    id: 'engineering-documents', label: 'Engineering & Documents', iconKey: 'file-check', sortOrder: 90,
    entries: [
      { id: 'doc-register', group: 'engineering-documents', label: 'Document Register', iconKey: 'file-check', route: '/engineering/doc', permissionKey: 'doc.document.view', featureFlag: 'ff.doc', sortOrder: 0, keywords: ['document', 'drawing', 'revision', 'transmittal', 'rfi', 'correspondence', 'register'], isActive: true } as NavEntry,
    ],
  },
];

export function getAllNavEntries(): NavEntry[] {
  return navigationRegistry.flatMap(g => g.entries);
}
