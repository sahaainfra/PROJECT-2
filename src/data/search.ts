// Part 23 — Global Search & Command Center
// Permission-safe universal search, command palette, recent/favourites, and context actions

export type EntityType = 'project' | 'site' | 'purchase_order' | 'purchase_request' | 'vendor' | 'employee' | 'material' | 'boq_item' | 'bill' | 'grn' | 'document' | 'task' | 'report' | 'contract' | 'work_order' | 'drawing' | 'rfi' | 'ncr' | 'claim' | 'equipment' | 'tool' | 'inspection';
export type SearchPrefix = 'po:' | 'pr:' | 'vendor:' | 'emp:' | 'boq:' | 'bill:' | 'grn:' | 'doc:' | 'task:' | 'rpt:' | 'contract:' | 'wo:' | 'dwg:' | 'rfi:' | 'ncr:' | 'claim:' | 'equip:' | 'tool:';

export interface SearchDocument {
  id: string;
  entityType: EntityType;
  entityId: string;
  companyId: string;
  projectName?: string;
  projectId?: string;
  siteName?: string;
  siteId?: string;
  departmentId?: string;
  ownerId: string;
  ownerName: string;
  title: string;
  subtitle?: string;
  bodyText: string;
  keywords: string[];
  status: string;
  docDate: string;
  aclTags: string[]; // company/project/site/department/own
  updatedAt: string;
  searchScore?: number;
}

export interface RecentItem {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: string;
  title: string;
  viewedAt: string;
}

export interface Favourite {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: string;
  title: string;
  pinnedModuleCode?: string;
  position: number;
  addedAt: string;
}

export interface CommandAction {
  id: string;
  code: string;
  label: string;
  module: string;
  permissionKey: string;
  route: string;
  contextEntityTypes: EntityType[];
  shortcut?: string;
  icon?: string;
}

export interface SearchFacet {
  field: string;
  label: string;
  values: { value: string; count: number }[];
}

export interface SearchResult {
  documents: SearchDocument[];
  facets: SearchFacet[];
  total: number;
  query: string;
  page: number;
  pageSize: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'record' | 'action' | 'navigation';
  entityType?: EntityType;
  entityId?: string;
  route?: string;
  icon?: string;
}

export interface Synonym {
  id: string;
  term: string;
  synonyms: string[];
  module?: string;
  createdAt: string;
  createdBy: string;
}

export interface SearchAnalytics {
  id: string;
  query: string;
  userId: string;
  timestamp: string;
  resultCount: number;
  clickedResult?: string;
  isZeroResult: boolean;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== SEARCH DOCUMENTS (Sample Index) =====
export const searchDocuments: SearchDocument[] = [
  // Projects
  {
    id: 'doc-001', entityType: 'project', entityId: 'prj-001',
    companyId: 'comp-001', projectName: 'Metro Tower Phase II', projectId: 'prj-001',
    ownerId: 'user-010', ownerName: 'Rajesh Kumar',
    title: 'Metro Tower Phase II', subtitle: 'Commercial Building Project',
    bodyText: 'High-rise commercial building project in Mumbai. 45 floors, 2 basement levels. Client: Metro Corp Ltd.',
    keywords: ['metro', 'tower', 'commercial', 'mumbai', 'high-rise'],
    status: 'Active', docDate: '2024-01-01', aclTags: ['company:comp-001', 'project:prj-001'],
    updatedAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'doc-002', entityType: 'project', entityId: 'prj-002',
    companyId: 'comp-001', projectName: 'Highway Bridge NH-48', projectId: 'prj-002',
    ownerId: 'user-011', ownerName: 'Suresh Patel',
    title: 'Highway Bridge NH-48', subtitle: 'Infrastructure Project',
    bodyText: 'Highway bridge construction project on NH-48. Client: National Highways Authority of India.',
    keywords: ['highway', 'bridge', 'nh-48', 'infrastructure', 'nhai'],
    status: 'Active', docDate: '2024-01-01', aclTags: ['company:comp-001', 'project:prj-002'],
    updatedAt: '2024-01-16T14:00:00Z'
  },
  
  // Purchase Orders
  {
    id: 'doc-003', entityType: 'purchase_order', entityId: 'po-089',
    companyId: 'comp-001', projectName: 'Metro Tower Phase II', projectId: 'prj-001',
    ownerId: 'user-020', ownerName: 'Amit Shah',
    title: 'PO-2024-0892', subtitle: 'Steel Supply - Steel India Ltd.',
    bodyText: 'Purchase order for TMT steel bars. Quantity: 50 MT. Rate: ₹62,000/MT. Total: ₹31,00,000.',
    keywords: ['po', 'purchase', 'order', 'steel', 'tmt', 'steel india'],
    status: 'Approved', docDate: '2024-01-15', aclTags: ['company:comp-001', 'project:prj-001'],
    updatedAt: '2024-01-15T11:30:00Z'
  },
  {
    id: 'doc-004', entityType: 'purchase_order', entityId: 'po-090',
    companyId: 'comp-001', projectName: 'Highway Bridge NH-48', projectId: 'prj-002',
    ownerId: 'user-020', ownerName: 'Amit Shah',
    title: 'PO-2024-0893', subtitle: 'Cement Supply - ACC Ltd.',
    bodyText: 'Purchase order for OPC 53 grade cement. Quantity: 500 bags. Rate: ₹400/bag. Total: ₹2,00,000.',
    keywords: ['po', 'purchase', 'order', 'cement', 'opc', 'acc'],
    status: 'Pending Approval', docDate: '2024-01-16', aclTags: ['company:comp-001', 'project:prj-002'],
    updatedAt: '2024-01-16T10:00:00Z'
  },
  
  // Vendors
  {
    id: 'doc-005', entityType: 'vendor', entityId: 'vendor-001',
    companyId: 'comp-001',
    ownerId: 'user-020', ownerName: 'Amit Shah',
    title: 'Steel India Ltd.', subtitle: 'Primary Steel Supplier',
    bodyText: 'Leading steel supplier in Mumbai. GSTIN: 27AABCS1234F1Z5. Contact: +91-22-12345678.',
    keywords: ['vendor', 'supplier', 'steel', 'mumbai', 'gst'],
    status: 'Active', docDate: '2023-01-01', aclTags: ['company:comp-001'],
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'doc-006', entityType: 'vendor', entityId: 'vendor-002',
    companyId: 'comp-001',
    ownerId: 'user-020', ownerName: 'Amit Shah',
    title: 'ACC Ltd.', subtitle: 'Cement Supplier',
    bodyText: 'Major cement manufacturer. GSTIN: 27AABCA5678F1Z3. Supplying to multiple projects.',
    keywords: ['vendor', 'supplier', 'cement', 'acc', 'gst'],
    status: 'Active', docDate: '2023-01-01', aclTags: ['company:comp-001'],
    updatedAt: '2024-01-12T10:00:00Z'
  },
  
  // Employees
  {
    id: 'doc-007', entityType: 'employee', entityId: 'emp-001',
    companyId: 'comp-001', departmentId: 'dept-eng',
    ownerId: 'user-023', ownerName: 'Kavita Nair',
    title: 'Ravi Sharma', subtitle: 'Site Engineer - Metro Tower',
    bodyText: 'Site Engineer assigned to Metro Tower Phase II. Employee ID: EMP-001. Joining: 2023-03-15.',
    keywords: ['employee', 'engineer', 'site', 'ravi', 'sharma'],
    status: 'Active', docDate: '2023-03-15', aclTags: ['company:comp-001', 'department:dept-eng'],
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'doc-008', entityType: 'employee', entityId: 'emp-002',
    companyId: 'comp-001', departmentId: 'dept-eng',
    ownerId: 'user-023', ownerName: 'Kavita Nair',
    title: 'Sanjay Verma', subtitle: 'Site Engineer - Metro Tower Site B',
    bodyText: 'Site Engineer assigned to Metro Tower Site B. Employee ID: EMP-002. Joining: 2023-04-01.',
    keywords: ['employee', 'engineer', 'site', 'sanjay', 'verma'],
    status: 'Active', docDate: '2023-04-01', aclTags: ['company:comp-001', 'department:dept-eng'],
    updatedAt: '2024-01-15T09:00:00Z'
  },
  
  // Materials
  {
    id: 'doc-009', entityType: 'material', entityId: 'mat-001',
    companyId: 'comp-001',
    ownerId: 'user-021', ownerName: 'Neha Gupta',
    title: 'TMT Bar Fe500D 16mm', subtitle: 'Steel Reinforcement',
    bodyText: 'TMT steel reinforcement bars, Fe500D grade, 16mm diameter. Current stock: 25 MT.',
    keywords: ['material', 'steel', 'tmt', 'reinforcement', 'bar', 'fe500d'],
    status: 'In Stock', docDate: '2024-01-16', aclTags: ['company:comp-001'],
    updatedAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'doc-010', entityType: 'material', entityId: 'mat-002',
    companyId: 'comp-001',
    ownerId: 'user-021', ownerName: 'Neha Gupta',
    title: 'OPC 53 Grade Cement', subtitle: 'Cement',
    bodyText: 'Ordinary Portland Cement, 53 grade. Current stock: 450 bags.',
    keywords: ['material', 'cement', 'opc', '53', 'grade'],
    status: 'In Stock', docDate: '2024-01-16', aclTags: ['company:comp-001'],
    updatedAt: '2024-01-16T14:00:00Z'
  },
  
  // BOQ Items
  {
    id: 'doc-011', entityType: 'boq_item', entityId: 'boq-001',
    companyId: 'comp-001', projectName: 'Metro Tower Phase II', projectId: 'prj-001',
    ownerId: 'user-010', ownerName: 'Rajesh Kumar',
    title: 'Foundation Excavation', subtitle: 'BOQ Item 1.1',
    bodyText: 'Excavation for foundation including disposal of earth. Quantity: 5000 Cu.M. Rate: ₹250/Cu.M.',
    keywords: ['boq', 'foundation', 'excavation', 'earth', 'quantity'],
    status: 'In Progress', docDate: '2024-01-01', aclTags: ['company:comp-001', 'project:prj-001'],
    updatedAt: '2024-01-15T10:00:00Z'
  },
  
  // Bills
  {
    id: 'doc-012', entityType: 'bill', entityId: 'bill-447',
    companyId: 'comp-001', projectName: 'Metro Tower Phase II', projectId: 'prj-001',
    ownerId: 'user-022', ownerName: 'Vikram Desai',
    title: 'Bill B-447', subtitle: 'Raj Constructions - December Work',
    bodyText: 'Subcontractor bill for December 2024 work. Amount: ₹28,50,000. Status: Verified by QS.',
    keywords: ['bill', 'subcontractor', 'raj', 'constructions', 'december'],
    status: 'Verified', docDate: '2024-01-16', aclTags: ['company:comp-001', 'project:prj-001'],
    updatedAt: '2024-01-16T16:00:00Z'
  },
  
  // GRN
  {
    id: 'doc-013', entityType: 'grn', entityId: 'grn-001',
    companyId: 'comp-001', projectName: 'Metro Tower Phase II', projectId: 'prj-001',
    siteName: 'Metro Tower Site A', siteId: 'site-001',
    ownerId: 'user-015', ownerName: 'Ravi Sharma',
    title: 'GRN-2024-1205', subtitle: 'Steel Receipt - PO-2024-0892',
    bodyText: 'Goods receipt for TMT steel bars. PO: PO-2024-0892. Quantity received: 50 MT. Quality: Passed.',
    keywords: ['grn', 'goods', 'receipt', 'steel', 'tmt', 'po-0892'],
    status: 'Received', docDate: '2024-01-16', aclTags: ['company:comp-001', 'project:prj-001', 'site:site-001'],
    updatedAt: '2024-01-16T09:45:00Z'
  },
  
  // Documents
  {
    id: 'doc-014', entityType: 'document', entityId: 'doc-001',
    companyId: 'comp-001', projectName: 'Metro Tower Phase II', projectId: 'prj-001',
    ownerId: 'user-010', ownerName: 'Rajesh Kumar',
    title: 'Structural Drawing S-001', subtitle: 'Foundation Layout',
    bodyText: 'Structural drawing for foundation layout. Revision: 3. Approved by: Structural Engineer.',
    keywords: ['document', 'drawing', 'structural', 'foundation', 'layout'],
    status: 'Approved', docDate: '2024-01-10', aclTags: ['company:comp-001', 'project:prj-001'],
    updatedAt: '2024-01-10T14:00:00Z'
  },
  
  // Tasks
  {
    id: 'doc-015', entityType: 'task', entityId: 'task-001',
    companyId: 'comp-001', projectName: 'Metro Tower Phase II', projectId: 'prj-001',
    ownerId: 'user-015', ownerName: 'Ravi Sharma',
    title: 'Submit DPR for 2024-01-17', subtitle: 'Daily Progress Report',
    bodyText: 'Submit daily progress report for 17th January 2024. Due: 2024-01-17 18:00.',
    keywords: ['task', 'dpr', 'daily', 'progress', 'report', 'submit'],
    status: 'Pending', docDate: '2024-01-17', aclTags: ['company:comp-001', 'project:prj-001', 'own:user-015'],
    updatedAt: '2024-01-16T18:00:00Z'
  },
];

// ===== RECENT ITEMS =====
export const recentItems: RecentItem[] = [
  { id: 'recent-001', userId: 'user-010', entityType: 'project', entityId: 'prj-001', title: 'Metro Tower Phase II', viewedAt: '2024-01-16T15:45:00Z' },
  { id: 'recent-002', userId: 'user-010', entityType: 'purchase_order', entityId: 'po-089', title: 'PO-2024-0892', viewedAt: '2024-01-16T15:30:00Z' },
  { id: 'recent-003', userId: 'user-010', entityType: 'bill', entityId: 'bill-447', title: 'Bill B-447', viewedAt: '2024-01-16T15:00:00Z' },
  { id: 'recent-004', userId: 'user-010', entityType: 'vendor', entityId: 'vendor-001', title: 'Steel India Ltd.', viewedAt: '2024-01-16T14:30:00Z' },
  { id: 'recent-005', userId: 'user-010', entityType: 'document', entityId: 'doc-001', title: 'Structural Drawing S-001', viewedAt: '2024-01-16T14:00:00Z' },
  { id: 'recent-006', userId: 'user-015', entityType: 'grn', entityId: 'grn-001', title: 'GRN-2024-1205', viewedAt: '2024-01-16T15:40:00Z' },
  { id: 'recent-007', userId: 'user-015', entityType: 'task', entityId: 'task-001', title: 'Submit DPR for 2024-01-17', viewedAt: '2024-01-16T15:35:00Z' },
];

// ===== FAVOURITES =====
export const favourites: Favourite[] = [
  { id: 'fav-001', userId: 'user-010', entityType: 'project', entityId: 'prj-001', title: 'Metro Tower Phase II', position: 1, addedAt: '2024-01-10T09:00:00Z' },
  { id: 'fav-002', userId: 'user-010', entityType: 'vendor', entityId: 'vendor-001', title: 'Steel India Ltd.', position: 2, addedAt: '2024-01-12T10:00:00Z' },
  { id: 'fav-003', userId: 'user-010', entityType: 'document', entityId: 'doc-001', title: 'Structural Drawing S-001', pinnedModuleCode: 'project-management', position: 3, addedAt: '2024-01-15T14:00:00Z' },
  { id: 'fav-004', userId: 'user-015', entityType: 'project', entityId: 'prj-001', title: 'Metro Tower Phase II', position: 1, addedAt: '2024-01-10T09:00:00Z' },
];

// ===== COMMAND ACTIONS =====
export const commandActions: CommandAction[] = [
  // Navigation Actions
  { id: 'cmd-001', code: 'nav.home', label: 'Go to Home', module: 'shell', permissionKey: 'shell.home.view', route: '/', contextEntityTypes: [], shortcut: 'g h', icon: 'home' },
  { id: 'cmd-002', code: 'nav.dashboard', label: 'Go to Dashboard', module: 'shell', permissionKey: 'dash.workspace.view', route: '/home/dash', contextEntityTypes: [], shortcut: 'g d', icon: 'layout-dashboard' },
  { id: 'cmd-003', code: 'nav.search', label: 'Go to Search', module: 'shell', permissionKey: 'search.global.use', route: '/home/search', contextEntityTypes: [], shortcut: 'g s', icon: 'search' },
  
  // Creation Actions
  { id: 'cmd-004', code: 'create.pr', label: 'Create Purchase Request', module: 'procurement', permissionKey: 'proc.pr.create', route: '/procurement/requests/new', contextEntityTypes: ['project', 'vendor'], shortcut: 'n pr', icon: 'plus' },
  { id: 'cmd-005', code: 'create.po', label: 'Create Purchase Order', module: 'procurement', permissionKey: 'proc.po.create', route: '/procurement/orders/new', contextEntityTypes: ['project', 'vendor', 'purchase_request'], shortcut: 'n po', icon: 'plus' },
  { id: 'cmd-006', code: 'create.grn', label: 'Create Goods Receipt', module: 'inventory', permissionKey: 'inv.grn.create', route: '/inventory/grn/new', contextEntityTypes: ['purchase_order', 'project', 'site'], shortcut: 'n grn', icon: 'plus' },
  { id: 'cmd-007', code: 'create.bill', label: 'Create Subcontractor Bill', module: 'finance', permissionKey: 'fin.bill.create', route: '/finance/bills/new', contextEntityTypes: ['project', 'vendor'], shortcut: 'n bill', icon: 'plus' },
  { id: 'cmd-008', code: 'create.dpr', label: 'Submit Daily Progress Report', module: 'project', permissionKey: 'project.dpr.create', route: '/project/dpr/new', contextEntityTypes: ['project', 'site'], shortcut: 'n dpr', icon: 'plus' },
  
  // Context Actions
  { id: 'cmd-009', code: 'ctx.create_grn_from_po', label: 'Create GRN from this PO', module: 'inventory', permissionKey: 'inv.grn.create', route: '/inventory/grn/new?poId={entityId}', contextEntityTypes: ['purchase_order'], icon: 'arrow-right' },
  { id: 'cmd-010', code: 'ctx.raise_ncr', label: 'Raise NCR for this Inspection', module: 'quality', permissionKey: 'qa.ncr.create', route: '/quality/ncr/new?inspectionId={entityId}', contextEntityTypes: ['inspection'], icon: 'alert-triangle' },
  { id: 'cmd-011', code: 'ctx.create_po_from_pr', label: 'Create PO from this PR', module: 'procurement', permissionKey: 'proc.po.create', route: '/procurement/orders/new?prId={entityId}', contextEntityTypes: ['purchase_request'], icon: 'arrow-right' },
  { id: 'cmd-012', code: 'ctx.view_project_cost', label: 'View Project Cost Report', module: 'reports', permissionKey: 'rpt.project_cost.view', route: '/reports/project-cost?projectId={entityId}', contextEntityTypes: ['project'], icon: 'bar-chart' },
  
  // Approval Actions
  { id: 'cmd-013', code: 'approve.pending', label: 'Approve Pending Items', module: 'workflow', permissionKey: 'wf.task.act', route: '/workflow?filter=pending', contextEntityTypes: [], shortcut: 'a p', icon: 'check' },
  { id: 'cmd-014', code: 'view.exceptions', label: 'View My Exceptions', module: 'protocol', permissionKey: 'protocol.exception.view', route: '/admin/protocol/exceptions', contextEntityTypes: [], icon: 'alert-circle' },
];

// ===== SYNONYMS =====
export const synonyms: Synonym[] = [
  { id: 'syn-001', term: 'TMT', synonyms: ['reinforcement steel', 'rebar', 'steel bar'], module: 'inventory', createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'syn-002', term: 'PO', synonyms: ['purchase order', 'order'], module: 'procurement', createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'syn-003', term: 'PR', synonyms: ['purchase request', 'requisition'], module: 'procurement', createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'syn-004', term: 'GRN', synonyms: ['goods receipt', 'material receipt', 'receipt note'], module: 'inventory', createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'syn-005', term: 'DPR', synonyms: ['daily progress report', 'daily report', 'progress report'], module: 'project', createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'syn-006', term: 'BOQ', synonyms: ['bill of quantities', 'quantity sheet'], module: 'project', createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'syn-007', term: 'NCR', synonyms: ['non-conformance report', 'defect report', 'quality issue'], module: 'quality', createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'syn-008', term: 'RFI', synonyms: ['request for information', 'technical query'], module: 'project', createdAt: '2024-01-01', createdBy: 'user-001' },
];

// ===== SEARCH ANALYTICS =====
export const searchAnalytics: SearchAnalytics[] = [
  { id: 'analytics-001', query: 'steel', userId: 'user-010', timestamp: '2024-01-16T15:30:00Z', resultCount: 5, clickedResult: 'doc-009', isZeroResult: false },
  { id: 'analytics-002', query: 'TMT bar', userId: 'user-015', timestamp: '2024-01-16T15:25:00Z', resultCount: 3, clickedResult: 'doc-009', isZeroResult: false },
  { id: 'analytics-003', query: 'foundation drawing', userId: 'user-010', timestamp: '2024-01-16T14:00:00Z', resultCount: 1, clickedResult: 'doc-014', isZeroResult: false },
  { id: 'analytics-004', query: 'xyz123', userId: 'user-020', timestamp: '2024-01-16T13:00:00Z', resultCount: 0, isZeroResult: true },
  { id: 'analytics-005', query: 'cement', userId: 'user-021', timestamp: '2024-01-16T12:00:00Z', resultCount: 4, clickedResult: 'doc-010', isZeroResult: false },
];

// ===== PROTOCOL CONTROL POINT =====
export const protocolControlPoint: ProtocolControlPoint = {
  id: 'CP-SRCH-01',
  stage: 'VERIFY',
  control: 'Search results never reveal existence of records outside scope (including exception/finding records)',
  enforcement: 'BLOCK',
  status: 'OBSERVE',
};

// ===== HELPER FUNCTIONS =====
export function searchDocuments_query(query: string, userId: string, filters?: { entityType?: EntityType; projectId?: string; siteId?: string }): SearchResult {
  const userPermissions = ['company:comp-001', 'project:prj-001', 'project:prj-002', 'department:dept-eng', 'site:site-001', 'own:user-010', 'own:user-015'];
  
  let results = searchDocuments.filter(doc => {
    // ACL check
    const hasAccess = doc.aclTags.some(tag => userPermissions.includes(tag));
    if (!hasAccess) return false;
    
    // Query match
    const queryLower = query.toLowerCase();
    const matchesQuery = 
      doc.title.toLowerCase().includes(queryLower) ||
      doc.subtitle?.toLowerCase().includes(queryLower) ||
      doc.bodyText.toLowerCase().includes(queryLower) ||
      doc.keywords.some(k => k.toLowerCase().includes(queryLower));
    
    if (!matchesQuery) return false;
    
    // Filters
    if (filters?.entityType && doc.entityType !== filters.entityType) return false;
    if (filters?.projectId && doc.projectId !== filters.projectId) return false;
    if (filters?.siteId && doc.siteId !== filters.siteId) return false;
    
    return true;
  });
  
  // Calculate search scores
  results = results.map(doc => {
    const queryLower = query.toLowerCase();
    let score = 0;
    
    if (doc.title.toLowerCase().includes(queryLower)) score += 10;
    if (doc.subtitle?.toLowerCase().includes(queryLower)) score += 5;
    if (doc.keywords.some(k => k.toLowerCase() === queryLower)) score += 8;
    if (doc.bodyText.toLowerCase().includes(queryLower)) score += 2;
    
    return { ...doc, searchScore: score };
  });
  
  // Sort by score
  results.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
  
  // Generate facets
  const facets: SearchFacet[] = [
    {
      field: 'entityType',
      label: 'Type',
      values: Array.from(new Set(results.map(r => r.entityType))).map(type => ({
        value: type,
        count: results.filter(r => r.entityType === type).length
      }))
    },
    {
      field: 'status',
      label: 'Status',
      values: Array.from(new Set(results.map(r => r.status))).map(status => ({
        value: status,
        count: results.filter(r => r.status === status).length
      }))
    }
  ];
  
  return {
    documents: results,
    facets,
    total: results.length,
    query,
    page: 1,
    pageSize: 20
  };
}

export function getSearchSuggestions(query: string, userId: string): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];
  
  // Record suggestions
  const searchResult = searchDocuments_query(query, userId);
  searchResult.documents.slice(0, 5).forEach(doc => {
    suggestions.push({
      text: doc.title,
      type: 'record',
      entityType: doc.entityType,
      entityId: doc.entityId
    });
  });
  
  // Action suggestions
  const matchingActions = commandActions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );
  matchingActions.slice(0, 3).forEach(action => {
    suggestions.push({
      text: action.label,
      type: 'action',
      route: action.route,
      icon: action.icon
    });
  });
  
  // Navigation suggestions
  if (query.toLowerCase().includes('home')) {
    suggestions.push({ text: 'Go to Home', type: 'navigation', route: '/', icon: 'home' });
  }
  if (query.toLowerCase().includes('dashboard')) {
    suggestions.push({ text: 'Go to Dashboard', type: 'navigation', route: '/home/dash', icon: 'layout-dashboard' });
  }
  
  return suggestions;
}

export function getRecentItems(userId: string): RecentItem[] {
  return recentItems
    .filter(item => item.userId === userId)
    .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
    .slice(0, 10);
}

export function getFavourites(userId: string): Favourite[] {
  return favourites
    .filter(fav => fav.userId === userId)
    .sort((a, b) => a.position - b.position);
}

export function getContextActions(entityType: EntityType, entityId: string, userId: string): CommandAction[] {
  const userPermissions = ['proc.pr.create', 'proc.po.create', 'inv.grn.create', 'fin.bill.create', 'project.dpr.create', 'qa.ncr.create', 'rpt.project_cost.view'];
  
  return commandActions.filter(action => 
    action.contextEntityTypes.includes(entityType) &&
    userPermissions.includes(action.permissionKey)
  );
}

export function getZeroResultQueries(): SearchAnalytics[] {
  return searchAnalytics.filter(a => a.isZeroResult);
}

export function getSearchStats(): { totalDocuments: number; totalQueries: number; zeroResultRate: number; avgResults: number } {
  const totalQueries = searchAnalytics.length;
  const zeroResults = searchAnalytics.filter(a => a.isZeroResult).length;
  const avgResults = searchAnalytics.reduce((sum, a) => sum + a.resultCount, 0) / totalQueries;
  
  return {
    totalDocuments: searchDocuments.length,
    totalQueries,
    zeroResultRate: (zeroResults / totalQueries) * 100,
    avgResults
  };
}
