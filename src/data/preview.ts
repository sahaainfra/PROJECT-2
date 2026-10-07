// Part 02 — Preview Fixtures & Widget Registry
// Synthetic data only — never production data (CP-PRV-02)

export type PersonaKey =
  | 'cfo' | 'pm' | 'site-engineer' | 'store-keeper'
  | 'qs' | 'procurement' | 'plant-manager' | 'hr'
  | 'qa' | 'hse' | 'protocol' | 'super-admin';

export interface Persona {
  key: PersonaKey;
  label: string;
  role: string;
  device: 'desktop' | 'tablet' | 'mobile';
  avatar: string;
  color: string;
}

export interface WidgetPayload {
  value: string;
  previous?: string;
  trend?: number[];
  label: string;
  drillLink?: string;
  asOf: string;
  kpiCode: string;
  unit?: string;
}

export type WidgetStatus = 'PREVIEW' | 'LIVE' | 'PROMOTED' | 'RETIRED';

export interface WidgetDef {
  code: string;
  title: string;
  personas: PersonaKey[];
  kpiCodes: string[];
  futureSourcePrompt: string;
  futureApi: string;
  status: WidgetStatus;
  dataMode: 'fixture' | 'live';
  size: 'sm' | 'md' | 'lg' | 'xl';
  type: 'kpi' | 'chart' | 'list' | 'status' | 'gauge' | 'table';
  payload: WidgetPayload;
  chartData?: { label: string; value: number; color?: string }[];
  listData?: { label: string; sub?: string; badge?: string; variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' }[];
}

export interface FeedbackEntry {
  id: string;
  widgetCode: string;
  reviewer: string;
  comment: string;
  decision: 'accepted' | 'change_requested' | 'noted';
  createdAt: string;
}

// ===== PERSONAS =====
export const personas: Persona[] = [
  { key: 'cfo', label: 'Management / CFO', role: 'Chief Financial Officer', device: 'desktop', avatar: 'MC', color: 'from-indigo-500 to-indigo-700' },
  { key: 'pm', label: 'Project Manager', role: 'Project Manager', device: 'desktop', avatar: 'RK', color: 'from-blue-500 to-blue-700' },
  { key: 'site-engineer', label: 'Site Engineer', role: 'Site Engineer (Mobile)', device: 'mobile', avatar: 'VS', color: 'from-teal-500 to-teal-700' },
  { key: 'store-keeper', label: 'Store Keeper', role: 'Store / Inventory Manager', device: 'mobile', avatar: 'SP', color: 'from-emerald-500 to-emerald-700' },
  { key: 'qs', label: 'QS / Commercial', role: 'Quantity Surveyor', device: 'tablet', avatar: 'AM', color: 'from-violet-500 to-violet-700' },
  { key: 'procurement', label: 'Procurement', role: 'Procurement Manager', device: 'desktop', avatar: 'PS', color: 'from-cyan-500 to-cyan-700' },
  { key: 'plant-manager', label: 'Plant Manager', role: 'Plant & Equipment Head', device: 'desktop', avatar: 'DN', color: 'from-orange-500 to-orange-700' },
  { key: 'hr', label: 'HR Manager', role: 'Human Resources', device: 'desktop', avatar: 'NJ', color: 'from-pink-500 to-pink-700' },
  { key: 'qa', label: 'QA / QC', role: 'Quality Assurance', device: 'tablet', avatar: 'KR', color: 'from-lime-500 to-lime-700' },
  { key: 'hse', label: 'HSE Officer', role: 'Health Safety Environment', device: 'mobile', avatar: 'RS', color: 'from-red-500 to-red-700' },
  { key: 'protocol', label: 'Protocol Officer', role: 'Compliance & Protocol', device: 'desktop', avatar: 'TG', color: 'from-slate-500 to-slate-700' },
  { key: 'super-admin', label: 'Super Admin', role: 'System Administrator', device: 'desktop', avatar: 'SA', color: 'from-gray-600 to-gray-800' },
];

// ===== WIDGET REGISTRY =====
export const widgetRegistry: WidgetDef[] = [
  // CFO Snapshot
  { code: 'cfo-revenue', title: 'Revenue to Date', personas: ['cfo'], kpiCodes: ['FIN-REV-001'], futureSourcePrompt: 'Part 39', futureApi: '/api/v2/dash/cfo/revenue', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '₹142.8 Cr', previous: '₹128.4 Cr', trend: [98, 105, 112, 118, 125, 128, 142], label: 'Revenue to Date', asOf: '2024-01-15', kpiCode: 'FIN-REV-001', unit: 'INR' } },
  { code: 'cfo-margin', title: 'Gross Margin', personas: ['cfo'], kpiCodes: ['FIN-MGN-001'], futureSourcePrompt: 'Part 39', futureApi: '/api/v2/dash/cfo/margin', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '18.4%', previous: '17.1%', trend: [15, 16, 16.5, 17, 17.1, 17.8, 18.4], label: 'Gross Margin', asOf: '2024-01-15', kpiCode: 'FIN-MGN-001', unit: '%' } },
  { code: 'cfo-cashflow', title: 'Cash Flow Position', personas: ['cfo'], kpiCodes: ['FIN-CF-001'], futureSourcePrompt: 'Part 39', futureApi: '/api/v2/dash/cfo/cashflow', status: 'PREVIEW', dataMode: 'fixture', size: 'lg', type: 'chart', payload: { value: '₹23.4 Cr', label: 'Net Cash Flow (MTD)', asOf: '2024-01-15', kpiCode: 'FIN-CF-001' }, chartData: [{ label: 'Aug', value: 12 }, { label: 'Sep', value: 18 }, { label: 'Oct', value: 15 }, { label: 'Nov', value: 22 }, { label: 'Dec', value: 19 }, { label: 'Jan', value: 23 }] },
  { code: 'cfo-payables', title: 'Outstanding Payables', personas: ['cfo'], kpiCodes: ['FIN-AP-001'], futureSourcePrompt: 'Part 39', futureApi: '/api/v2/dash/cfo/payables', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '₹34.2 Cr', previous: '₹31.8 Cr', trend: [28, 29, 30, 31, 31.8, 33, 34.2], label: 'Outstanding Payables', asOf: '2024-01-15', kpiCode: 'FIN-AP-001' } },
  { code: 'cfo-tds', title: 'TDS Compliance', personas: ['cfo'], kpiCodes: ['FIN-TDS-001'], futureSourcePrompt: 'Part 39', futureApi: '/api/v2/dash/cfo/tds', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'gauge', payload: { value: '94%', label: 'TDS Deduction Compliance', asOf: '2024-01-15', kpiCode: 'FIN-TDS-001', unit: '%' } },
  { code: 'cfo-pending-bills', title: 'Pending Bill Verification', personas: ['cfo'], kpiCodes: ['FIN-BILL-001'], futureSourcePrompt: 'Part 39', futureApi: '/api/v2/dash/cfo/pending-bills', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '12', label: 'Bills Pending Verification', asOf: '2024-01-15', kpiCode: 'FIN-BILL-001' }, listData: [{ label: 'B-447 · Raj Constructions', sub: '₹28.5L · Due today', badge: 'Urgent', variant: 'error' }, { label: 'B-446 · Steel Works', sub: '₹15.2L · Due tomorrow', badge: 'High', variant: 'warning' }, { label: 'B-445 · Cement Supply', sub: '₹8.7L · In 3 days', badge: 'Normal', variant: 'info' }] },

  // Project Manager
  { code: 'pm-projects', title: 'Active Projects', personas: ['pm'], kpiCodes: ['PM-ACT-001'], futureSourcePrompt: 'Part 20', futureApi: '/api/v2/dash/pm/projects', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '12', previous: '11', label: 'Active Projects', asOf: '2024-01-15', kpiCode: 'PM-ACT-001' } },
  { code: 'pm-budget-var', title: 'Budget Variance', personas: ['pm'], kpiCodes: ['PM-BV-001'], futureSourcePrompt: 'Part 20', futureApi: '/api/v2/dash/pm/budget-variance', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '-3.2%', previous: '-2.8%', trend: [-1, -1.5, -2, -2.2, -2.8, -3, -3.2], label: 'Overall Budget Variance', asOf: '2024-01-15', kpiCode: 'PM-BV-001', unit: '%' } },
  { code: 'pm-milestones', title: 'Milestone Status', personas: ['pm'], kpiCodes: ['PM-MS-001'], futureSourcePrompt: 'Part 20', futureApi: '/api/v2/dash/pm/milestones', status: 'PREVIEW', dataMode: 'fixture', size: 'lg', type: 'chart', payload: { value: '67%', label: 'Overall Completion', asOf: '2024-01-15', kpiCode: 'PM-MS-001' }, chartData: [{ label: 'Foundation', value: 100, color: '#10b981' }, { label: 'Structure GF', value: 85, color: '#3b82f6' }, { label: 'Structure 1F', value: 45, color: '#3b82f6' }, { label: 'MEF Works', value: 20, color: '#f59e0b' }, { label: 'Finishing', value: 5, color: '#6b7280' }] },
  { code: 'pm-pending-po', title: 'Pending PO Approvals', personas: ['pm'], kpiCodes: ['PM-PO-001'], futureSourcePrompt: 'Part 22', futureApi: '/api/v2/dash/pm/pending-po', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '5', label: 'POs Pending Your Approval', asOf: '2024-01-15', kpiCode: 'PM-PO-001' }, listData: [{ label: 'PO-2024-0892 · Steel India', sub: '₹12.5L · Due today', badge: 'Urgent', variant: 'error' }, { label: 'PO-2024-0891 · Cement Corp', sub: '₹8.75L · Due today', badge: 'Urgent', variant: 'error' }, { label: 'PO-2024-0890 · Timbers Plus', sub: '₹3.2L · Tomorrow', badge: 'Normal', variant: 'info' }] },
  { code: 'pm-rfIs', title: 'Open RFIs', personas: ['pm'], kpiCodes: ['PM-RFI-001'], futureSourcePrompt: 'Part 20', futureApi: '/api/v2/dash/pm/rfis', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '8', previous: '11', label: 'Open RFIs', asOf: '2024-01-15', kpiCode: 'PM-RFI-001' } },
  { code: 'pm-safety', title: 'Safety Score', personas: ['pm', 'hse'], kpiCodes: ['HSE-SCR-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v2/dash/pm/safety', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'gauge', payload: { value: '87/100', label: 'Safety Compliance Score', asOf: '2024-01-15', kpiCode: 'HSE-SCR-001' } },

  // Site Engineer (Mobile)
  { code: 'site-today', title: "Today's Work", personas: ['site-engineer'], kpiCodes: ['SITE-TDY-001'], futureSourcePrompt: 'Part 21', futureApi: '/api/v2/dash/site/today', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '6', label: "Today's Work Authorisations", asOf: '2024-01-15', kpiCode: 'SITE-TDY-001' }, listData: [{ label: 'Column casting — Block A', sub: 'Zone 3 · 8 columns', badge: 'Active', variant: 'success' }, { label: 'Shuttering — Beam B12', sub: 'Zone 2 · 4 beams', badge: 'Active', variant: 'success' }, { label: 'Brick work — Wall W7', sub: 'Zone 1 · 120 sqm', badge: 'Pending', variant: 'warning' }] },
  { code: 'site-labour', title: 'Labour Today', personas: ['site-engineer', 'hr'], kpiCodes: ['SITE-LBR-001'], futureSourcePrompt: 'Part 21', futureApi: '/api/v2/dash/site/labour', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '42/45', previous: '44/45', label: 'Workers Present / Total', asOf: '2024-01-15', kpiCode: 'SITE-LBR-001' } },
  { code: 'site-material', title: 'Material Balance', personas: ['site-engineer', 'store-keeper'], kpiCodes: ['SITE-MAT-001'], futureSourcePrompt: 'Part 23', futureApi: '/api/v2/dash/site/material', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '5', label: 'Critical Material Items', asOf: '2024-01-15', kpiCode: 'SITE-MAT-001' }, listData: [{ label: 'Cement (OPC 53)', sub: '450 bags · 2 days stock', badge: 'Low', variant: 'warning' }, { label: 'TMT Bar 16mm', sub: '3.2 MT · 5 days stock', badge: 'OK', variant: 'success' }, { label: 'Sand (River)', sub: '28 CU.M · 3 days stock', badge: 'Low', variant: 'warning' }] },
  { code: 'site-dpr', title: 'DPR Status', personas: ['site-engineer'], kpiCodes: ['SITE-DPR-001'], futureSourcePrompt: 'Part 21', futureApi: '/api/v2/dash/site/dpr', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'status', payload: { value: 'Pending', label: "Today's DPR", asOf: '2024-01-15', kpiCode: 'SITE-DPR-001' } },
  { code: 'site-plant', title: 'Plant Utilisation', personas: ['site-engineer', 'plant-manager'], kpiCodes: ['PLT-UTL-001'], futureSourcePrompt: 'Part 44', futureApi: '/api/v2/dash/site/plant', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'gauge', payload: { value: '72%', label: 'Plant Utilisation Today', asOf: '2024-01-15', kpiCode: 'PLT-UTL-001', unit: '%' } },

  // Store Keeper
  { code: 'store-grn', title: 'Pending GRNs', personas: ['store-keeper'], kpiCodes: ['INV-GRN-001'], futureSourcePrompt: 'Part 23', futureApi: '/api/v2/dash/store/grn', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '3', label: 'GRNs Pending Today', asOf: '2024-01-15', kpiCode: 'INV-GRN-001' } },
  { code: 'store-consumption', title: 'Consumption vs Theoretical', personas: ['store-keeper', 'qs'], kpiCodes: ['INV-CVT-001'], futureSourcePrompt: 'Part 23', futureApi: '/api/v2/dash/store/consumption', status: 'PREVIEW', dataMode: 'fixture', size: 'lg', type: 'chart', payload: { value: '94.2%', label: 'Consumption Efficiency', asOf: '2024-01-15', kpiCode: 'INV-CVT-001' }, chartData: [{ label: 'Cement', value: 97 }, { label: 'Steel', value: 92 }, { label: 'Sand', value: 88 }, { label: 'Aggregate', value: 95 }, { label: 'Bricks', value: 91 }] },
  { code: 'store-wastage', title: 'Wastage Alert', personas: ['store-keeper'], kpiCodes: ['INV-WST-001'], futureSourcePrompt: 'Part 23', futureApi: '/api/v2/dash/store/wastage', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '2', label: 'Items Above Wastage Threshold', asOf: '2024-01-15', kpiCode: 'INV-WST-001' }, listData: [{ label: 'Sand — 12% wastage', sub: 'Threshold: 8% · Zone 2', badge: 'Over', variant: 'error' }, { label: 'Cement bags — 5% damage', sub: 'Threshold: 3% · Store B', badge: 'Over', variant: 'warning' }] },
  { code: 'store-reorder', title: 'Reorder Alerts', personas: ['store-keeper', 'procurement'], kpiCodes: ['INV-ROR-001'], futureSourcePrompt: 'Part 23', futureApi: '/api/v2/dash/store/reorder', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '7', label: 'Items Below Reorder Level', asOf: '2024-01-15', kpiCode: 'INV-ROR-001' } },

  // QS / Commercial
  { code: 'qs-pnl', title: 'Project P&L', personas: ['qs', 'cfo'], kpiCodes: ['QS-PNL-001'], futureSourcePrompt: 'Part 35', futureApi: '/api/v2/dash/qs/pnl', status: 'PREVIEW', dataMode: 'fixture', size: 'lg', type: 'chart', payload: { value: '₹4.8 Cr', label: 'Project Profit (MTD)', asOf: '2024-01-15', kpiCode: 'QS-PNL-001' }, chartData: [{ label: 'Revenue', value: 45 }, { label: 'Material', value: -18 }, { label: 'Labour', value: -12 }, { label: 'Plant', value: -5 }, { label: 'Subcontract', value: -4 }, { label: 'Overheads', value: -1.2 }] },
  { code: 'qs-eac', title: 'Estimate at Completion', personas: ['qs', 'pm'], kpiCodes: ['QS-EAC-001'], futureSourcePrompt: 'Part 35', futureApi: '/api/v2/dash/qs/eac', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '₹46.2 Cr', previous: '₹45.0 Cr', label: 'Estimate at Completion', asOf: '2024-01-15', kpiCode: 'QS-EAC-001' } },
  { code: 'qs-claims', title: 'Open Claims', personas: ['qs'], kpiCodes: ['QS-CLM-001'], futureSourcePrompt: 'Part 35', futureApi: '/api/v2/dash/qs/claims', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '3', label: 'Open Claims / Variations', asOf: '2024-01-15', kpiCode: 'QS-CLM-001' } },

  // Procurement
  { code: 'proc-pending', title: 'Pending PRs', personas: ['procurement'], kpiCodes: ['PROC-PR-001'], futureSourcePrompt: 'Part 22', futureApi: '/api/v2/dash/proc/pending', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '5', label: 'PRs Pending Processing', asOf: '2024-01-15', kpiCode: 'PROC-PR-001' } },
  { code: 'proc-vendor', title: 'Vendor Performance', personas: ['procurement'], kpiCodes: ['PROC-VP-001'], futureSourcePrompt: 'Part 22', futureApi: '/api/v2/dash/proc/vendor', status: 'PREVIEW', dataMode: 'fixture', size: 'lg', type: 'chart', payload: { value: '82%', label: 'Avg Vendor Score', asOf: '2024-01-15', kpiCode: 'PROC-VP-001' }, chartData: [{ label: 'Steel India', value: 88 }, { label: 'Cement Corp', value: 92 }, { label: 'Timbers Plus', value: 75 }, { label: 'ElectroWorks', value: 80 }, { label: 'Pipe Solutions', value: 68 }] },
  { code: 'proc-lead', title: 'Avg Lead Time', personas: ['procurement'], kpiCodes: ['PROC-LT-001'], futureSourcePrompt: 'Part 22', futureApi: '/api/v2/dash/proc/lead', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '8.2 days', previous: '9.1 days', label: 'Avg Procurement Lead Time', asOf: '2024-01-15', kpiCode: 'PROC-LT-001' } },

  // Plant Manager
  { code: 'plant-util', title: 'Fleet Utilisation', personas: ['plant-manager'], kpiCodes: ['PLT-UTL-002'], futureSourcePrompt: 'Part 44', futureApi: '/api/v2/dash/plant/util', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'gauge', payload: { value: '68%', label: 'Fleet Utilisation Rate', asOf: '2024-01-15', kpiCode: 'PLT-UTL-002', unit: '%' } },
  { code: 'plant-maintenance', title: 'Maintenance Due', personas: ['plant-manager'], kpiCodes: ['PLT-MNT-001'], futureSourcePrompt: 'Part 44', futureApi: '/api/v2/dash/plant/maintenance', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '4', label: 'Maintenance Due This Week', asOf: '2024-01-15', kpiCode: 'PLT-MNT-001' }, listData: [{ label: 'Crane HC-05 — 200hr service', sub: 'Due: Jan 17 · Site A', badge: 'Due', variant: 'warning' }, { label: 'Excavator EX-02 — Oil change', sub: 'Due: Jan 18 · Site B', badge: 'Due', variant: 'warning' }, { label: 'Batch Plant BP-01 — Calibration', sub: 'Due: Jan 20 · Central', badge: 'Scheduled', variant: 'info' }] },
  { code: 'plant-fuel', title: 'Fuel Consumption', personas: ['plant-manager'], kpiCodes: ['PLT-FUL-001'], futureSourcePrompt: 'Part 44', futureApi: '/api/v2/dash/plant/fuel', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '₹4.8L', previous: '₹5.2L', label: 'Fuel Cost (MTD)', asOf: '2024-01-15', kpiCode: 'PLT-FUL-001' } },

  // HR
  { code: 'hr-attendance', title: 'Attendance Rate', personas: ['hr'], kpiCodes: ['HR-ATT-001'], futureSourcePrompt: 'Part 42', futureApi: '/api/v2/dash/hr/attendance', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'gauge', payload: { value: '92%', label: 'Attendance Rate (Today)', asOf: '2024-01-15', kpiCode: 'HR-ATT-001', unit: '%' } },
  { code: 'hr-payroll', title: 'Payroll Status', personas: ['hr', 'cfo'], kpiCodes: ['HR-PYR-001'], futureSourcePrompt: 'Part 42', futureApi: '/api/v2/dash/hr/payroll', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'status', payload: { value: 'Processing', label: 'January Payroll', asOf: '2024-01-15', kpiCode: 'HR-PYR-001' } },
  { code: 'hr-leave', title: 'Leave Balance Alerts', personas: ['hr'], kpiCodes: ['HR-LVE-001'], futureSourcePrompt: 'Part 42', futureApi: '/api/v2/dash/hr/leave', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '18', label: 'Employees with >20 days leave', asOf: '2024-01-15', kpiCode: 'HR-LVE-001' } },

  // QA/QC
  { code: 'qa-inspections', title: 'Inspections Due', personas: ['qa'], kpiCodes: ['QA-INS-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v2/dash/qa/inspections', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '6', label: 'Inspections Due Today', asOf: '2024-01-15', kpiCode: 'QA-INS-001' } },
  { code: 'qa-ncr', title: 'Open NCRs', personas: ['qa'], kpiCodes: ['QA-NCR-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v2/dash/qa/ncr', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '3', previous: '5', label: 'Open Non-Conformances', asOf: '2024-01-15', kpiCode: 'QA-NCR-001' } },
  { code: 'qa-pass-rate', title: 'First-Pass Yield', personas: ['qa'], kpiCodes: ['QA-FPY-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v2/dash/qa/fpy', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'gauge', payload: { value: '94%', label: 'First-Pass Inspection Yield', asOf: '2024-01-15', kpiCode: 'QA-FPY-001', unit: '%' } },

  // HSE
  { code: 'hse-incidents', title: 'Incidents (MTD)', personas: ['hse'], kpiCodes: ['HSE-INC-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v2/dash/hse/incidents', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '2', previous: '1', label: 'Reportable Incidents (MTD)', asOf: '2024-01-15', kpiCode: 'HSE-INC-001' } },
  { code: 'hse-near-miss', title: 'Near Misses', personas: ['hse'], kpiCodes: ['HSE-NM-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v2/dash/hse/near-miss', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '7', label: 'Near Miss Reports (MTD)', asOf: '2024-01-15', kpiCode: 'HSE-NM-001' } },
  { code: 'hse-toolbox', title: 'Toolbox Talks', personas: ['hse', 'site-engineer'], kpiCodes: ['HSE-TBT-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v2/dash/hse/toolbox', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'status', payload: { value: 'Completed', label: "Today's Toolbox Talk", asOf: '2024-01-15', kpiCode: 'HSE-TBT-001' } },

  // Protocol / Compliance
  { code: 'proto-violations', title: 'Protocol Violations', personas: ['protocol'], kpiCodes: ['PC-VIO-001'], futureSourcePrompt: 'Part 14', futureApi: '/api/v2/dash/protocol/violations', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '4', label: 'Active Violations', asOf: '2024-01-15', kpiCode: 'PC-VIO-001' } },
  { code: 'proto-exceptions', title: 'Exception Requests', personas: ['protocol'], kpiCodes: ['PC-EXC-001'], futureSourcePrompt: 'Part 14', futureApi: '/api/v2/dash/protocol/exceptions', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '3', label: 'Pending Exception Requests', asOf: '2024-01-15', kpiCode: 'PC-EXC-001' }, listData: [{ label: 'EXC-001 · PO without CS match', sub: '₹12.5L · Procurement', badge: 'Pending', variant: 'warning' }, { label: 'EXC-002 · Issue without PR', sub: 'Emergency · Site A', badge: 'Approved', variant: 'success' }, { label: 'EXC-003 · Back-dated GRN', sub: 'Store · Justification needed', badge: 'Under Review', variant: 'info' }] },
  { code: 'proto-compliance', title: 'Compliance Score', personas: ['protocol', 'cfo'], kpiCodes: ['PC-CMP-001'], futureSourcePrompt: 'Part 14', futureApi: '/api/v2/dash/protocol/compliance', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'gauge', payload: { value: '82%', label: 'Overall Compliance Score', asOf: '2024-01-15', kpiCode: 'PC-CMP-001', unit: '%' } },

  // Super Admin
  { code: 'admin-health', title: 'System Health', personas: ['super-admin'], kpiCodes: ['SYS-HLT-001'], futureSourcePrompt: 'Part 10', futureApi: '/api/v2/dash/admin/health', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'status', payload: { value: 'Healthy', label: 'System Health', asOf: '2024-01-15', kpiCode: 'SYS-HLT-001' } },
  { code: 'admin-users', title: 'Active Users', personas: ['super-admin'], kpiCodes: ['SYS-USR-001'], futureSourcePrompt: 'Part 09', futureApi: '/api/v2/dash/admin/users', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '34', label: 'Active Users Today', asOf: '2024-01-15', kpiCode: 'SYS-USR-001' } },
  { code: 'admin-errors', title: 'Error Rate', personas: ['super-admin'], kpiCodes: ['SYS-ERR-001'], futureSourcePrompt: 'Part 10', futureApi: '/api/v2/dash/admin/errors', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'kpi', payload: { value: '0.12%', previous: '0.18%', label: 'API Error Rate (24h)', asOf: '2024-01-15', kpiCode: 'SYS-ERR-001' } },
  { code: 'admin-jobs', title: 'Background Jobs', personas: ['super-admin'], kpiCodes: ['SYS-JOB-001'], futureSourcePrompt: 'Part 04', futureApi: '/api/v2/dash/admin/jobs', status: 'PREVIEW', dataMode: 'fixture', size: 'md', type: 'list', payload: { value: '5', label: 'Active Background Jobs', asOf: '2024-01-15', kpiCode: 'SYS-JOB-001' }, listData: [{ label: 'attendance-auto_mark', sub: 'Last run: 9:00 AM · Success', badge: 'OK', variant: 'success' }, { label: 'stock_reorder_alert', sub: 'Last run: 12:00 PM · Success', badge: 'OK', variant: 'success' }, { label: 'report_snapshot', sub: 'Last run: 2:00 AM · Success', badge: 'OK', variant: 'success' }] },
];

// ===== INITIAL FEEDBACK =====
export const initialFeedback: FeedbackEntry[] = [
  { id: 'FB-001', widgetCode: 'cfo-revenue', reviewer: 'Program Sponsor', comment: 'Good layout. Add drill-down to project-level revenue.', decision: 'change_requested', createdAt: '2024-01-14T10:30:00Z' },
  { id: 'FB-002', widgetCode: 'pm-projects', reviewer: 'PM Lead', comment: 'Accepted. Matches our workflow.', decision: 'accepted', createdAt: '2024-01-14T11:15:00Z' },
  { id: 'FB-003', widgetCode: 'site-today', reviewer: 'Site Lead', comment: 'Need weather integration for work authorisations.', decision: 'noted', createdAt: '2024-01-14T14:00:00Z' },
];

export function getWidgetsForPersona(persona: PersonaKey): WidgetDef[] {
  return widgetRegistry.filter(w => w.personas.includes(persona));
}
