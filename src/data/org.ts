// Part 05 — Organization, Company, Project & Site Master Data
// Enterprise hierarchy: Company → Group → Legal Entity → Branch → Department → Project → Site

export type ProjectLifecycleStatus = 
  | 'Proposed' | 'Tendering' | 'Awarded' | 'Mobilisation' 
  | 'Active' | 'On Hold' | 'Substantially Complete' | 'DLP' 
  | 'Closed' | 'Archived';

export type SiteStatus = 
  | 'Planned' | 'Mobilising' | 'Active' | 'Suspended' | 'Demobilising' | 'Closed';

export type ProjectType = 
  | 'building' | 'road' | 'bridge' | 'irrigation' | 'railway' | 'industrial' | 'infra' | 'other';

export type ContractMode = 
  | 'item-rate' | 'LS' | 'EPC' | 'HAM' | 'cost-plus' | 'subcontract' | 'other';

export type GeofenceType = 'circle' | 'polygon';

export type CostCentreType = 'project' | 'overhead' | 'plant' | 'department';

export interface Company {
  id: string;
  code: string;
  name: string;
  legalName: string;
  pan: string;
  cin: string;
  baseCurrency: string;
  address: string;
  isActive: boolean;
}

export interface Group {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface LegalEntity {
  id: string;
  groupId: string;
  code: string;
  legalName: string;
  pan: string;
  cin: string;
  registeredAddress: string;
  baseCurrency: string;
  gstins: { stateCode: string; gstin: string }[];
  isActive: boolean;
}

export interface Branch {
  id: string;
  companyId: string;
  legalEntityId?: string;
  type: 'branch' | 'regional-office' | 'site-office' | 'yard' | 'plant-depot';
  code: string;
  name: string;
  address: string;
  stateCode: string;
  gstin?: string;
  lat?: number;
  lng?: number;
  isActive: boolean;
}

export interface BusinessUnit {
  id: string;
  companyId: string;
  code: string;
  name: string;
  headUserId: string;
  headUserName: string;
  isActive: boolean;
}

export interface Division {
  id: string;
  businessUnitId: string;
  code: string;
  name: string;
  headUserId: string;
  headUserName: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  divisionId?: string;
  costCentreId?: string;
  code: string;
  name: string;
  headUserId: string;
  headUserName: string;
  level: 'Management' | 'Department Head' | 'Manager' | 'Project Manager' | 'Engineer' | 'Executive' | 'Operational';
  isActive: boolean;
}

export interface CostCentre {
  id: string;
  companyId: string;
  code: string;
  name: string;
  parentId?: string;
  type: CostCentreType;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
}

export interface ProfitCentre {
  id: string;
  companyId: string;
  code: string;
  name: string;
  parentId?: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  companyId: string;
  companyName: string;
  businessUnitId?: string;
  businessUnitName?: string;
  divisionId?: string;
  divisionName?: string;
  clientId: string;
  clientName: string;
  projectType: ProjectType;
  contractMode: ContractMode;
  contractValue: number;
  stateCode: string;
  district: string;
  startDate: string;
  plannedFinish: string;
  revisedFinish?: string;
  lifecycleStatus: ProjectLifecycleStatus;
  legacyStatus?: string;
  projectManagerId: string;
  projectManagerName: string;
  planningManagerId?: string;
  commercialManagerId?: string;
  costCentreId?: string;
  profitCentreId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Site {
  id: string;
  siteCode: string;
  name: string;
  projectId: string;
  projectName: string;
  siteManagerId: string;
  siteManagerName: string;
  address: string;
  stateCode: string;
  lat: number;
  lng: number;
  status: SiteStatus;
  timezone: string;
  geofenceId?: string;
  isActive: boolean;
}

export interface Geofence {
  id: string;
  siteId: string;
  type: GeofenceType;
  centerLat?: number;
  centerLng?: number;
  radiusM?: number;
  polygonGeoJson?: any;
  accuracyToleranceM: number;
  validFrom: string;
  validTo?: string;
  version: number;
  approvedBy: string;
  approvedByName: string;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export interface ProjectAllocation {
  id: string;
  userId: string;
  userName: string;
  employeeId?: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  roleOnProject: string;
  fromDate: string;
  toDate?: string;
  allocationPercent: number;
  isActive: boolean;
}

export interface StatusMapping {
  entity: 'project' | 'site';
  legacyValue: string;
  lifecycleValue: string;
}

// ===== SAMPLE DATA =====

export const companies: Company[] = [
  {
    id: 'comp-001', code: 'ACME', name: 'Apex Construction', legalName: 'Apex Construction Pvt. Ltd.',
    pan: 'AAACA1234F', cin: 'U45201MH2010PTC123456', baseCurrency: 'INR',
    address: 'Mumbai, Maharashtra', isActive: true,
  },
];

export const groups: Group[] = [
  { id: 'grp-001', companyId: 'comp-001', code: 'INFRA', name: 'Infrastructure Group', isActive: true },
  { id: 'grp-002', companyId: 'comp-001', code: 'BLDG', name: 'Building Group', isActive: true },
];

export const legalEntities: LegalEntity[] = [
  {
    id: 'le-001', groupId: 'grp-001', code: 'ACME-INFRA', legalName: 'Apex Infrastructure Ltd.',
    pan: 'AAACI5678G', cin: 'U45201MH2012PTC234567', registeredAddress: 'Mumbai, MH',
    baseCurrency: 'INR', gstins: [
      { stateCode: '27', gstin: '27AAACI5678G1Z5' },
      { stateCode: '09', gstin: '09AAACI5678G1Z3' },
    ], isActive: true,
  },
];

export const branches: Branch[] = [
  { id: 'br-001', companyId: 'comp-001', legalEntityId: 'le-001', type: 'branch', code: 'HO-MUM', name: 'Head Office Mumbai', address: 'Andheri East, Mumbai', stateCode: '27', gstin: '27AAACI5678G1Z5', lat: 19.1136, lng: 72.8697, isActive: true },
  { id: 'br-002', companyId: 'comp-001', type: 'regional-office', code: 'RO-DEL', name: 'Regional Office Delhi', address: 'Nehru Place, Delhi', stateCode: '07', gstin: '07AAACI5678G1Z1', lat: 28.5494, lng: 77.2515, isActive: true },
  { id: 'br-003', companyId: 'comp-001', type: 'regional-office', code: 'RO-BLR', name: 'Regional Office Bangalore', address: 'Koramangala, Bangalore', stateCode: '29', gstin: '29AAACI5678G1Z9', lat: 12.9352, lng: 77.6245, isActive: true },
];

export const businessUnits: BusinessUnit[] = [
  { id: 'bu-001', companyId: 'comp-001', code: 'BU-INFRA', name: 'Infrastructure BU', headUserId: 'user-001', headUserName: 'Rajesh Kumar', isActive: true },
  { id: 'bu-002', companyId: 'comp-001', code: 'BU-BLDG', name: 'Building BU', headUserId: 'user-002', headUserName: 'Priya Sharma', isActive: true },
];

export const divisions: Division[] = [
  { id: 'div-001', businessUnitId: 'bu-001', code: 'DIV-ROAD', name: 'Roads Division', headUserId: 'user-003', headUserName: 'Amit Patel', isActive: true },
  { id: 'div-002', businessUnitId: 'bu-001', code: 'DIV-BRIDGE', name: 'Bridges Division', headUserId: 'user-004', headUserName: 'Suresh Nair', isActive: true },
  { id: 'div-003', businessUnitId: 'bu-002', code: 'DIV-COMM', name: 'Commercial Buildings', headUserId: 'user-005', headUserName: 'Vikram Singh', isActive: true },
];

export const departments: Department[] = [
  { id: 'dept-001', divisionId: 'div-001', code: 'DEPT-ENG', name: 'Engineering', headUserId: 'user-006', headUserName: 'Mahesh Gupta', level: 'Department Head', isActive: true },
  { id: 'dept-002', divisionId: 'div-001', code: 'DEPT-QC', name: 'Quality Control', headUserId: 'user-007', headUserName: 'Krishna Rao', level: 'Department Head', isActive: true },
  { id: 'dept-003', divisionId: 'div-003', code: 'DEPT-ARCH', name: 'Architecture', headUserId: 'user-008', headUserName: 'Anjali Mehta', level: 'Department Head', isActive: true },
];

export const costCentres: CostCentre[] = [
  { id: 'cc-001', companyId: 'comp-001', code: 'CC-OH', name: 'Overheads', type: 'overhead', validFrom: '2024-04-01', isActive: true },
  { id: 'cc-002', companyId: 'comp-001', code: 'CC-PLANT', name: 'Plant & Machinery', type: 'plant', validFrom: '2024-04-01', isActive: true },
  { id: 'cc-003', companyId: 'comp-001', code: 'CC-PRJ001', name: 'Metro Tower Project', type: 'project', validFrom: '2024-04-01', isActive: true },
];

export const profitCentres: ProfitCentre[] = [
  { id: 'pc-001', companyId: 'comp-001', code: 'PC-INFRA', name: 'Infrastructure P&L', isActive: true },
  { id: 'pc-002', companyId: 'comp-001', code: 'PC-BLDG', name: 'Building P&L', isActive: true },
];

export const projects: Project[] = [
  {
    id: 'prj-001', code: 'PRJ-001', name: 'Metro Tower Phase II', companyId: 'comp-001', companyName: 'Apex Construction',
    businessUnitId: 'bu-002', businessUnitName: 'Building BU', divisionId: 'div-003', divisionName: 'Commercial Buildings',
    clientId: 'client-001', clientName: 'Metro Corp Ltd.', projectType: 'building', contractMode: 'item-rate',
    contractValue: 450000000, stateCode: '27', district: 'Mumbai',
    startDate: '2023-03-01', plannedFinish: '2024-12-31', lifecycleStatus: 'Active', legacyStatus: 'In Progress',
    projectManagerId: 'user-010', projectManagerName: 'Rajesh Kumar',
    costCentreId: 'cc-003', profitCentreId: 'pc-002', isActive: true, createdAt: '2023-02-15', createdBy: 'user-001',
  },
  {
    id: 'prj-002', code: 'PRJ-002', name: 'Highway Bridge NH-48', companyId: 'comp-001', companyName: 'Apex Construction',
    businessUnitId: 'bu-001', businessUnitName: 'Infrastructure BU', divisionId: 'div-002', divisionName: 'Bridges Division',
    clientId: 'client-002', clientName: 'NHAI', projectType: 'bridge', contractMode: 'EPC',
    contractValue: 285000000, stateCode: '08', district: 'Jaipur',
    startDate: '2023-06-01', plannedFinish: '2025-05-31', lifecycleStatus: 'Active', legacyStatus: 'Running',
    projectManagerId: 'user-011', projectManagerName: 'Suresh Patel',
    costCentreId: 'cc-003', profitCentreId: 'pc-001', isActive: true, createdAt: '2023-05-10', createdBy: 'user-001',
  },
  {
    id: 'prj-003', code: 'PRJ-003', name: 'Residential Complex B7', companyId: 'comp-001', companyName: 'Apex Construction',
    businessUnitId: 'bu-002', businessUnitName: 'Building BU', divisionId: 'div-003', divisionName: 'Commercial Buildings',
    clientId: 'client-003', clientName: 'Skyline Developers', projectType: 'building', contractMode: 'LS',
    contractValue: 120000000, stateCode: '27', district: 'Pune',
    startDate: '2023-09-01', plannedFinish: '2025-02-28', lifecycleStatus: 'On Hold', legacyStatus: 'Paused',
    projectManagerId: 'user-012', projectManagerName: 'Vikram Desai',
    profitCentreId: 'pc-002', isActive: true, createdAt: '2023-08-20', createdBy: 'user-002',
  },
  {
    id: 'prj-004', code: 'PRJ-004', name: 'Industrial Park Unit 3', companyId: 'comp-001', companyName: 'Apex Construction',
    businessUnitId: 'bu-001', businessUnitName: 'Infrastructure BU', divisionId: 'div-001', divisionName: 'Roads Division',
    clientId: 'client-004', clientName: 'MIDC', projectType: 'industrial', contractMode: 'item-rate',
    contractValue: 670000000, stateCode: '33', district: 'Chennai',
    startDate: '2022-11-01', plannedFinish: '2024-10-31', revisedFinish: '2025-01-31', lifecycleStatus: 'Substantially Complete', legacyStatus: 'Near Completion',
    projectManagerId: 'user-013', projectManagerName: 'Arun Krishnan',
    profitCentreId: 'pc-001', isActive: true, createdAt: '2022-10-15', createdBy: 'user-001',
  },
  {
    id: 'prj-005', code: 'PRJ-005', name: 'Water Treatment Plant', companyId: 'comp-001', companyName: 'Apex Construction',
    businessUnitId: 'bu-001', businessUnitName: 'Infrastructure BU', divisionId: 'div-001', divisionName: 'Roads Division',
    clientId: 'client-005', clientName: 'BWSSB', projectType: 'infra', contractMode: 'EPC',
    contractValue: 85000000, stateCode: '29', district: 'Bangalore',
    startDate: '2024-04-01', plannedFinish: '2025-03-31', lifecycleStatus: 'Mobilisation', legacyStatus: 'Starting',
    projectManagerId: 'user-014', projectManagerName: 'Deepak Rao',
    profitCentreId: 'pc-001', isActive: true, createdAt: '2024-03-15', createdBy: 'user-001',
  },
  {
    id: 'prj-006', code: 'PRJ-006', name: 'Railway Station Modernization', companyId: 'comp-001', companyName: 'Apex Construction',
    businessUnitId: 'bu-001', businessUnitName: 'Infrastructure BU', divisionId: 'div-001', divisionName: 'Roads Division',
    clientId: 'client-006', clientName: 'Indian Railways', projectType: 'railway', contractMode: 'item-rate',
    contractValue: 1250000000, stateCode: '07', district: 'Delhi',
    startDate: '2024-06-01', plannedFinish: '2026-05-31', lifecycleStatus: 'Tendering', legacyStatus: 'Bid Stage',
    projectManagerId: 'user-001', projectManagerName: 'Rajesh Kumar',
    profitCentreId: 'pc-001', isActive: true, createdAt: '2024-05-01', createdBy: 'user-001',
  },
];

export const sites: Site[] = [
  { id: 'site-001', siteCode: 'SITE-A', name: 'Metro Tower Site A', projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteManagerId: 'user-015', siteManagerName: 'Ravi Sharma', address: 'Andheri West, Mumbai', stateCode: '27', lat: 19.1365, lng: 72.8347, status: 'Active', timezone: 'Asia/Kolkata', geofenceId: 'geo-001', isActive: true },
  { id: 'site-002', siteCode: 'SITE-B', name: 'Metro Tower Site B', projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteManagerId: 'user-016', siteManagerName: 'Sanjay Verma', address: 'Goregaon East, Mumbai', stateCode: '27', lat: 19.1634, lng: 72.8623, status: 'Active', timezone: 'Asia/Kolkata', geofenceId: 'geo-002', isActive: true },
  { id: 'site-003', siteCode: 'SITE-01', name: 'NH-48 Bridge Site', projectId: 'prj-002', projectName: 'Highway Bridge NH-48', siteManagerId: 'user-017', siteManagerName: 'Mohan Lal', address: 'KM 48, NH-48, Jaipur', stateCode: '08', lat: 26.9124, lng: 75.7873, status: 'Active', timezone: 'Asia/Kolkata', geofenceId: 'geo-003', isActive: true },
  { id: 'site-004', siteCode: 'SITE-P1', name: 'Pune Complex Main', projectId: 'prj-003', projectName: 'Residential Complex B7', siteManagerId: 'user-018', siteManagerName: 'Kiran Patil', address: 'Hinjewadi, Pune', stateCode: '27', lat: 18.5912, lng: 73.7390, status: 'Suspended', timezone: 'Asia/Kolkata', isActive: true },
  { id: 'site-005', siteCode: 'SITE-IP3', name: 'Industrial Park Unit 3', projectId: 'prj-004', projectName: 'Industrial Park Unit 3', siteManagerId: 'user-019', siteManagerName: 'Ramesh Iyer', address: 'Sriperumbudur, Chennai', stateCode: '33', lat: 13.0050, lng: 80.0458, status: 'Demobilising', timezone: 'Asia/Kolkata', isActive: true },
];

export const geofences: Geofence[] = [
  { id: 'geo-001', siteId: 'site-001', type: 'circle', centerLat: 19.1365, centerLng: 72.8347, radiusM: 200, accuracyToleranceM: 50, validFrom: '2023-03-01', version: 2, approvedBy: 'user-001', approvedByName: 'Rajesh Kumar', reason: 'Extended boundary for new work area', createdAt: '2023-06-15', createdBy: 'user-001' },
  { id: 'geo-002', siteId: 'site-002', type: 'circle', centerLat: 19.1634, centerLng: 72.8623, radiusM: 150, accuracyToleranceM: 50, validFrom: '2023-04-01', version: 1, approvedBy: 'user-001', approvedByName: 'Rajesh Kumar', reason: 'Initial geofence setup', createdAt: '2023-04-01', createdBy: 'user-001' },
  { id: 'geo-003', siteId: 'site-003', type: 'polygon', polygonGeoJson: { type: 'Polygon', coordinates: [[[75.785, 26.910], [75.790, 26.910], [75.790, 26.915], [75.785, 26.915], [75.785, 26.910]]] }, accuracyToleranceM: 30, validFrom: '2023-06-01', version: 1, approvedBy: 'user-001', approvedByName: 'Rajesh Kumar', reason: 'Bridge construction zone', createdAt: '2023-06-01', createdBy: 'user-001' },
];

export const allocations: ProjectAllocation[] = [
  { id: 'alloc-001', userId: 'user-010', userName: 'Rajesh Kumar', projectId: 'prj-001', projectName: 'Metro Tower Phase II', roleOnProject: 'Project Manager', fromDate: '2023-03-01', allocationPercent: 100, isActive: true },
  { id: 'alloc-002', userId: 'user-015', userName: 'Ravi Sharma', projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-001', siteName: 'Site A', roleOnProject: 'Site Engineer', fromDate: '2023-03-15', allocationPercent: 100, isActive: true },
  { id: 'alloc-003', userId: 'user-016', userName: 'Sanjay Verma', projectId: 'prj-001', projectName: 'Metro Tower Phase II', siteId: 'site-002', siteName: 'Site B', roleOnProject: 'Site Engineer', fromDate: '2023-04-01', allocationPercent: 100, isActive: true },
  { id: 'alloc-004', userId: 'user-011', userName: 'Suresh Patel', projectId: 'prj-002', projectName: 'Highway Bridge NH-48', roleOnProject: 'Project Manager', fromDate: '2023-06-01', allocationPercent: 100, isActive: true },
  { id: 'alloc-005', userId: 'user-017', userName: 'Mohan Lal', projectId: 'prj-002', projectName: 'Highway Bridge NH-48', siteId: 'site-003', siteName: 'NH-48 Site', roleOnProject: 'Site Engineer', fromDate: '2023-06-15', allocationPercent: 100, isActive: true },
  { id: 'alloc-006', userId: 'user-012', userName: 'Vikram Desai', projectId: 'prj-003', projectName: 'Residential Complex B7', roleOnProject: 'Project Manager', fromDate: '2023-09-01', allocationPercent: 50, isActive: true },
  { id: 'alloc-007', userId: 'user-013', userName: 'Arun Krishnan', projectId: 'prj-004', projectName: 'Industrial Park Unit 3', roleOnProject: 'Project Manager', fromDate: '2022-11-01', allocationPercent: 100, isActive: true },
  { id: 'alloc-008', userId: 'user-014', userName: 'Deepak Rao', projectId: 'prj-005', projectName: 'Water Treatment Plant', roleOnProject: 'Project Manager', fromDate: '2024-04-01', allocationPercent: 100, isActive: true },
];

export const statusMappings: StatusMapping[] = [
  { entity: 'project', legacyValue: 'In Progress', lifecycleValue: 'Active' },
  { entity: 'project', legacyValue: 'Running', lifecycleValue: 'Active' },
  { entity: 'project', legacyValue: 'Paused', lifecycleValue: 'On Hold' },
  { entity: 'project', legacyValue: 'Near Completion', lifecycleValue: 'Substantially Complete' },
  { entity: 'project', legacyValue: 'Starting', lifecycleValue: 'Mobilisation' },
  { entity: 'project', legacyValue: 'Bid Stage', lifecycleValue: 'Tendering' },
  { entity: 'site', legacyValue: 'Working', lifecycleValue: 'Active' },
  { entity: 'site', legacyValue: 'Stopped', lifecycleValue: 'Suspended' },
  { entity: 'site', legacyValue: 'Closing', lifecycleValue: 'Demobilising' },
];

// ===== LIFECYCLE HELPERS =====

export const projectLifecycleOrder: ProjectLifecycleStatus[] = [
  'Proposed', 'Tendering', 'Awarded', 'Mobilisation', 'Active', 'On Hold', 'Substantially Complete', 'DLP', 'Closed', 'Archived'
];

export const siteLifecycleOrder: SiteStatus[] = [
  'Planned', 'Mobilising', 'Active', 'Suspended', 'Demobilising', 'Closed'
];

export function getProjectStatusVariant(status: ProjectLifecycleStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'Active': return 'success';
    case 'Mobilisation': case 'Awarded': return 'info';
    case 'On Hold': return 'warning';
    case 'Closed': case 'Archived': return 'neutral';
    case 'Substantially Complete': case 'DLP': return 'info';
    case 'Proposed': case 'Tendering': return 'neutral';
    default: return 'neutral';
  }
}

export function getSiteStatusVariant(status: SiteStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'Active': return 'success';
    case 'Mobilising': return 'info';
    case 'Suspended': return 'warning';
    case 'Demobilising': case 'Closed': return 'neutral';
    case 'Planned': return 'info';
    default: return 'neutral';
  }
}

export function getNextProjectStatuses(current: ProjectLifecycleStatus): ProjectLifecycleStatus[] {
  const idx = projectLifecycleOrder.indexOf(current);
  if (idx === -1 || idx >= projectLifecycleOrder.length - 1) return [];
  // Allow forward movement and On Hold toggle
  const next = projectLifecycleOrder[idx + 1];
  if (current === 'Active') return [next, 'On Hold' as ProjectLifecycleStatus];
  if (current === 'On Hold') return ['Active' as ProjectLifecycleStatus];
  return [next];
}

export function getNextSiteStatuses(current: SiteStatus): SiteStatus[] {
  const idx = siteLifecycleOrder.indexOf(current);
  if (idx === -1 || idx >= siteLifecycleOrder.length - 1) return [];
  const next = siteLifecycleOrder[idx + 1];
  if (current === 'Active') return [next, 'Suspended'];
  if (current === 'Suspended') return ['Active'];
  return [next];
}

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-ORG-01', stage: 'PLAN', control: 'Project/site cannot move to Active until PM, site manager, cost centre, geofence and RACI are assigned', enforcement: 'EXCEPTION (PROCESS_DEVIATION)', status: 'OBSERVE' },
  { id: 'CP-ORG-02', stage: 'APPROVE', control: 'Geofence and hierarchy changes require maker-checker with reason', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-ORG-03', stage: 'CLOSE', control: 'Project closure blocked with open POs, WAs, exceptions, findings, unreconciled stock or unposted bills', enforcement: 'EXCEPTION', status: 'OBSERVE' },
];
