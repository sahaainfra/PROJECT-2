// Part 26 — Document Template & Format Management Center
// Template lifecycle, variable engine, numbering rules, brand profiles, and revision control

export type TemplateStatus = 'draft' | 'approved' | 'active' | 'retired';
export type TemplateCategory = 'commercial' | 'financial' | 'procurement' | 'construction' | 'planning' | 'quality' | 'HSE' | 'HR' | 'contract' | 'asset' | 'certificate' | 'statutory' | 'internal';
export type TemplateAudience = 'internal' | 'client' | 'vendor' | 'supplier' | 'statutory';
export type TemplateScope = 'corporate' | 'company' | 'project' | 'client';
export type DocumentType = 'PO' | 'WO' | 'PR' | 'RFQ' | 'Invoice' | 'Bill' | 'GRN' | 'NCR' | 'RFI' | 'Certificate' | 'Inspection_Report' | 'Claim' | 'Notice' | 'Correspondence' | 'DLP_Complaint' | 'Quotation' | 'RA_Bill' | 'MB' | 'BOQ' | 'Estimate' | 'Rate_Analysis' | 'MIS_Report';
export type NumberingScope = 'company' | 'project' | 'department' | 'FY';
export type ResetRule = 'yearly' | 'monthly' | 'never' | 'project_wise';
export type RevisionStatus = 'issued' | 'superseded' | 'cancelled';

export interface Template {
  id: string;
  code: string;
  name: string;
  documentType: DocumentType;
  module: string;
  category: TemplateCategory;
  audience: TemplateAudience;
  scope: TemplateScope;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  version: number;
  status: TemplateStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  ownerId: string;
  ownerName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  layoutJson: Record<string, any>;
  variablesJson: string[];
  sectionsJson: Record<string, any>;
  paperSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number };
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandProfile {
  id: string;
  scopeType: 'company' | 'legal_entity' | 'project';
  scopeId: string;
  scopeName: string;
  logoAsset: string;
  companyName: string;
  registeredAddress: string;
  contacts: string;
  email: string;
  website: string;
  gstin: string;
  pan: string;
  cin: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  }[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  footerNotes: string;
  disclaimers: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Variable {
  id: string;
  code: string;
  entity: string;
  path: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percentage' | 'address' | 'list';
  format?: string;
  mandatoryDefault: boolean;
  maskingPolicy?: 'none' | 'partial' | 'full';
  description: string;
  example: string;
}

export interface NumberingRule {
  id: string;
  documentType: DocumentType;
  scope: NumberingScope;
  scopeId?: string;
  scopeName?: string;
  pattern: string;
  prefix: string;
  sequenceLength: number;
  resetRule: ResetRule;
  isGapless: boolean;
  revisionPattern?: string;
  currentSequence: number;
  lastGenerated?: string;
  lastGeneratedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRevision {
  id: string;
  documentType: DocumentType;
  documentId: string;
  documentNumber: string;
  versionNo: number;
  revisionNo: string;
  revisionDate: string;
  reason: string;
  preparedBy: string;
  preparedByName: string;
  checkedBy?: string;
  checkedByName?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  approvedBy: string;
  approvedByName: string;
  previousVersionId?: string;
  changeSummary: string;
  fileDocumentId: string;
  status: RevisionStatus;
  createdAt: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== TEMPLATES =====
export const templates: Template[] = [
  {
    id: 'tmpl-001', code: 'TPL-PO-STD', name: 'Standard Purchase Order',
    documentType: 'PO', module: 'procurement', category: 'procurement',
    audience: 'vendor', scope: 'corporate', version: 3, status: 'active',
    effectiveFrom: '2024-01-01', ownerId: 'user-020', ownerName: 'Amit Shah',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma', approvedAt: '2023-12-15',
    layoutJson: { sections: ['header', 'parties', 'items', 'totals', 'terms', 'signatures', 'footer'] },
    variablesJson: ['po_number', 'po_date', 'supplier_name', 'supplier_gstin', 'project_name', 'items', 'total_amount', 'gst_amount', 'grand_total', 'payment_terms', 'delivery_terms'],
    sectionsJson: { header: { show: true }, parties: { show: true }, items: { show: true }, totals: { show: true }, terms: { show: true }, signatures: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 20, right: 15, bottom: 20, left: 15 },
    usageCount: 389, createdAt: '2023-06-01', updatedAt: '2024-01-01'
  },
  {
    id: 'tmpl-002', code: 'TPL-INV-STD', name: 'Standard Invoice',
    documentType: 'Invoice', module: 'finance', category: 'financial',
    audience: 'client', scope: 'corporate', version: 2, status: 'active',
    effectiveFrom: '2024-01-01', ownerId: 'user-022', ownerName: 'Vikram Desai',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma', approvedAt: '2023-12-20',
    layoutJson: { sections: ['header', 'bill_to', 'items', 'tax_summary', 'totals', 'bank_details', 'terms', 'footer'] },
    variablesJson: ['invoice_number', 'invoice_date', 'client_name', 'client_gstin', 'project_name', 'items', 'taxable_value', 'cgst', 'sgst', 'igst', 'total_tax', 'grand_total', 'bank_details'],
    sectionsJson: { header: { show: true }, bill_to: { show: true }, items: { show: true }, tax_summary: { show: true }, totals: { show: true }, bank_details: { show: true }, terms: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 20, right: 15, bottom: 20, left: 15 },
    usageCount: 245, createdAt: '2023-07-15', updatedAt: '2024-01-01'
  },
  {
    id: 'tmpl-003', code: 'TPL-BILL-RA', name: 'RA Bill Format',
    documentType: 'RA_Bill', module: 'finance', category: 'commercial',
    audience: 'client', scope: 'project', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    version: 1, status: 'active', effectiveFrom: '2024-01-01',
    ownerId: 'user-011', ownerName: 'Suresh Patel',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma', approvedAt: '2023-12-25',
    layoutJson: { sections: ['header', 'project_info', 'bill_details', 'measurements', 'totals', 'certifications', 'footer'] },
    variablesJson: ['bill_number', 'bill_date', 'project_name', 'client_name', 'contractor_name', 'period_from', 'period_to', 'measurements', 'total_amount', 'retention', 'payable_amount'],
    sectionsJson: { header: { show: true }, project_info: { show: true }, bill_details: { show: true }, measurements: { show: true }, totals: { show: true }, certifications: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 20, right: 15, bottom: 20, left: 15 },
    usageCount: 45, createdAt: '2023-11-01', updatedAt: '2024-01-01'
  },
  {
    id: 'tmpl-004', code: 'TPL-CERT-COMP', name: 'Completion Certificate',
    documentType: 'Certificate', module: 'construction', category: 'certificate',
    audience: 'client', scope: 'corporate', version: 2, status: 'active',
    effectiveFrom: '2024-01-01', ownerId: 'user-010', ownerName: 'Rajesh Kumar',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma', approvedAt: '2023-12-10',
    layoutJson: { sections: ['header', 'certificate_body', 'project_details', 'signatures', 'seal', 'footer'] },
    variablesJson: ['certificate_number', 'certificate_date', 'project_name', 'client_name', 'completion_date', 'defects_liability_period', 'prepared_by', 'checked_by', 'approved_by'],
    sectionsJson: { header: { show: true }, certificate_body: { show: true }, project_details: { show: true }, signatures: { show: true }, seal: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 25, right: 20, bottom: 25, left: 20 },
    usageCount: 12, createdAt: '2023-08-01', updatedAt: '2024-01-01'
  },
  {
    id: 'tmpl-005', code: 'TPL-INSPECTION-STD', name: 'Standard Inspection Report',
    documentType: 'Inspection_Report', module: 'quality', category: 'quality',
    audience: 'internal', scope: 'corporate', version: 1, status: 'active',
    effectiveFrom: '2024-01-01', ownerId: 'user-026', ownerName: 'Krishna Rao',
    approvedBy: 'user-010', approvedByName: 'Rajesh Kumar', approvedAt: '2023-12-05',
    layoutJson: { sections: ['header', 'inspection_details', 'checklist', 'findings', 'recommendations', 'signatures', 'attachments', 'footer'] },
    variablesJson: ['inspection_number', 'inspection_date', 'project_name', 'site_name', 'inspector_name', 'inspection_type', 'checklist_items', 'findings', 'recommendations', 'status'],
    sectionsJson: { header: { show: true }, inspection_details: { show: true }, checklist: { show: true }, findings: { show: true }, recommendations: { show: true }, signatures: { show: true }, attachments: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 20, right: 15, bottom: 20, left: 15 },
    usageCount: 78, createdAt: '2023-09-15', updatedAt: '2024-01-01'
  },
  {
    id: 'tmpl-006', code: 'TPL-WO-STD', name: 'Standard Work Order',
    documentType: 'WO', module: 'construction', category: 'construction',
    audience: 'vendor', scope: 'corporate', version: 2, status: 'active',
    effectiveFrom: '2024-01-01', ownerId: 'user-010', ownerName: 'Rajesh Kumar',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma', approvedAt: '2023-12-18',
    layoutJson: { sections: ['header', 'parties', 'scope_of_work', 'schedule', 'payment_terms', 'signatures', 'footer'] },
    variablesJson: ['wo_number', 'wo_date', 'contractor_name', 'contractor_gstin', 'project_name', 'scope_description', 'start_date', 'completion_date', 'contract_value', 'payment_schedule'],
    sectionsJson: { header: { show: true }, parties: { show: true }, scope_of_work: { show: true }, schedule: { show: true }, payment_terms: { show: true }, signatures: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 20, right: 15, bottom: 20, left: 15 },
    usageCount: 156, createdAt: '2023-07-01', updatedAt: '2024-01-01'
  },
  {
    id: 'tmpl-007', code: 'TPL-NCR-STD', name: 'Non-Conformance Report',
    documentType: 'NCR', module: 'quality', category: 'quality',
    audience: 'internal', scope: 'corporate', version: 1, status: 'approved',
    effectiveFrom: '2024-02-01', ownerId: 'user-026', ownerName: 'Krishna Rao',
    approvedBy: 'user-010', approvedByName: 'Rajesh Kumar', approvedAt: '2024-01-10',
    layoutJson: { sections: ['header', 'ncr_details', 'description', 'root_cause', 'corrective_action', 'preventive_action', 'signatures', 'footer'] },
    variablesJson: ['ncr_number', 'ncr_date', 'project_name', 'site_name', 'raised_by', 'description', 'root_cause', 'corrective_action', 'preventive_action', 'target_date', 'status'],
    sectionsJson: { header: { show: true }, ncr_details: { show: true }, description: { show: true }, root_cause: { show: true }, corrective_action: { show: true }, preventive_action: { show: true }, signatures: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 20, right: 15, bottom: 20, left: 15 },
    usageCount: 0, createdAt: '2024-01-05', updatedAt: '2024-01-10'
  },
  {
    id: 'tmpl-008', code: 'TPL-MIS-MONTHLY', name: 'Monthly Progress Report',
    documentType: 'MIS_Report', module: 'planning', category: 'planning',
    audience: 'client', scope: 'project', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    version: 1, status: 'draft', effectiveFrom: '2024-02-01',
    ownerId: 'user-010', ownerName: 'Rajesh Kumar',
    layoutJson: { sections: ['header', 'executive_summary', 'progress_charts', 'financial_summary', 'issues_risks', 'next_month_plan', 'appendices', 'footer'] },
    variablesJson: ['report_month', 'project_name', 'client_name', 'planned_progress', 'actual_progress', 'variance', 'financial_position', 'key_issues', 'risks', 'next_month_activities'],
    sectionsJson: { header: { show: true }, executive_summary: { show: true }, progress_charts: { show: true }, financial_summary: { show: true }, issues_risks: { show: true }, next_month_plan: { show: true }, appendices: { show: true }, footer: { show: true } },
    paperSize: 'A4', orientation: 'portrait', margins: { top: 20, right: 15, bottom: 20, left: 15 },
    usageCount: 0, createdAt: '2024-01-12', updatedAt: '2024-01-12'
  },
];

// ===== BRAND PROFILES =====
export const brandProfiles: BrandProfile[] = [
  {
    id: 'brand-001', scopeType: 'company', scopeId: 'comp-001', scopeName: 'Apex Construction Pvt. Ltd.',
    logoAsset: '/assets/logos/apex-construction-logo.png',
    companyName: 'Apex Construction Pvt. Ltd.',
    registeredAddress: '123 Business Park, Andheri East, Mumbai - 400069, Maharashtra, India',
    contacts: '+91-22-12345678, +91-22-87654321',
    email: 'info@apexconstruction.com',
    website: 'www.apexconstruction.com',
    gstin: '27AAACA1234F1Z5',
    pan: 'AAACA1234F',
    cin: 'U45201MH2010PTC123456',
    bankDetails: [
      { bankName: 'HDFC Bank', accountNumber: '50100123456789', ifscCode: 'HDFC0001234', branch: 'Andheri East, Mumbai' },
      { bankName: 'ICICI Bank', accountNumber: '123401005678901', ifscCode: 'ICIC0005678', branch: 'Powai, Mumbai' }
    ],
    colors: { primary: '#1B5E8C', secondary: '#2E7D5B', accent: '#D4740B' },
    fonts: { heading: 'Arial Bold', body: 'Arial Regular' },
    footerNotes: 'This is a computer-generated document. For any queries, please contact our accounts department.',
    disclaimers: 'The information contained in this document is confidential and intended solely for the recipient. Any unauthorized use or distribution is strictly prohibited.',
    updatedAt: '2024-01-01', updatedBy: 'user-001'
  },
  {
    id: 'brand-002', scopeType: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    logoAsset: '/assets/logos/metro-tower-logo.png',
    companyName: 'Metro Tower Phase II Project',
    registeredAddress: 'Site Office, Plot No. 45, Sector 12, Mumbai - 400001',
    contacts: '+91-22-98765432',
    email: 'metrotower@apexconstruction.com',
    website: '',
    gstin: '27AAACA1234F1Z5',
    pan: 'AAACA1234F',
    cin: 'U45201MH2010PTC123456',
    bankDetails: [],
    colors: { primary: '#0D47A1', secondary: '#1976D2', accent: '#FF6F00' },
    fonts: { heading: 'Calibri Bold', body: 'Calibri Regular' },
    footerNotes: 'Metro Tower Phase II Project - All documents subject to project-specific terms and conditions.',
    disclaimers: '',
    updatedAt: '2024-01-05', updatedBy: 'user-010'
  },
];

// ===== VARIABLES =====
export const variables: Variable[] = [
  // Company Variables
  { id: 'var-001', code: 'company_name', entity: 'company', path: 'name', type: 'string', mandatoryDefault: true, description: 'Company legal name', example: 'Apex Construction Pvt. Ltd.' },
  { id: 'var-002', code: 'company_gstin', entity: 'company', path: 'gstin', type: 'string', mandatoryDefault: true, description: 'Company GSTIN', example: '27AAACA1234F1Z5' },
  { id: 'var-003', code: 'company_pan', entity: 'company', path: 'pan', type: 'string', mandatoryDefault: true, description: 'Company PAN', example: 'AAACA1234F' },
  { id: 'var-004', code: 'company_address', entity: 'company', path: 'registeredAddress', type: 'address', mandatoryDefault: true, description: 'Registered office address', example: '123 Business Park, Mumbai' },
  
  // Project Variables
  { id: 'var-005', code: 'project_name', entity: 'project', path: 'name', type: 'string', mandatoryDefault: true, description: 'Project name', example: 'Metro Tower Phase II' },
  { id: 'var-006', code: 'project_code', entity: 'project', path: 'code', type: 'string', mandatoryDefault: true, description: 'Project code', example: 'PRJ-001' },
  { id: 'var-007', code: 'project_location', entity: 'project', path: 'location', type: 'address', mandatoryDefault: false, description: 'Project location', example: 'Mumbai, Maharashtra' },
  
  // Document Variables
  { id: 'var-008', code: 'po_number', entity: 'purchase_order', path: 'poNumber', type: 'string', mandatoryDefault: true, description: 'Purchase order number', example: 'PO-2024-0892' },
  { id: 'var-009', code: 'po_date', entity: 'purchase_order', path: 'poDate', type: 'date', format: 'dd-MMM-yyyy', mandatoryDefault: true, description: 'Purchase order date', example: '15-Jan-2024' },
  { id: 'var-010', code: 'invoice_number', entity: 'invoice', path: 'invoiceNumber', type: 'string', mandatoryDefault: true, description: 'Invoice number', example: 'INV-2024-0245' },
  { id: 'var-011', code: 'invoice_date', entity: 'invoice', path: 'invoiceDate', type: 'date', format: 'dd-MMM-yyyy', mandatoryDefault: true, description: 'Invoice date', example: '16-Jan-2024' },
  
  // Party Variables
  { id: 'var-012', code: 'supplier_name', entity: 'vendor', path: 'name', type: 'string', mandatoryDefault: true, description: 'Supplier/Vendor name', example: 'Steel India Ltd.' },
  { id: 'var-013', code: 'supplier_gstin', entity: 'vendor', path: 'gstin', type: 'string', mandatoryDefault: true, description: 'Supplier GSTIN', example: '27AABCS5678F1Z3' },
  { id: 'var-014', code: 'client_name', entity: 'client', path: 'name', type: 'string', mandatoryDefault: true, description: 'Client name', example: 'Metro Corp Ltd.' },
  { id: 'var-015', code: 'client_gstin', entity: 'client', path: 'gstin', type: 'string', mandatoryDefault: true, description: 'Client GSTIN', example: '27AABCM1234F1Z5' },
  
  // Financial Variables
  { id: 'var-016', code: 'total_amount', entity: 'document', path: 'totalAmount', type: 'currency', format: 'INR', mandatoryDefault: true, description: 'Total amount before tax', example: '₹12,50,000.00' },
  { id: 'var-017', code: 'gst_amount', entity: 'document', path: 'gstAmount', type: 'currency', format: 'INR', mandatoryDefault: true, description: 'GST amount', example: '₹2,25,000.00' },
  { id: 'var-018', code: 'grand_total', entity: 'document', path: 'grandTotal', type: 'currency', format: 'INR', mandatoryDefault: true, description: 'Grand total including tax', example: '₹14,75,000.00' },
  
  // Date Variables
  { id: 'var-019', code: 'current_date', entity: 'system', path: 'currentDate', type: 'date', format: 'dd-MMM-yyyy', mandatoryDefault: true, description: 'Current system date', example: '16-Jan-2024' },
  { id: 'var-020', code: 'delivery_date', entity: 'purchase_order', path: 'deliveryDate', type: 'date', format: 'dd-MMM-yyyy', mandatoryDefault: false, description: 'Delivery date', example: '30-Jan-2024' },
  
  // User Variables
  { id: 'var-021', code: 'prepared_by', entity: 'user', path: 'name', type: 'string', mandatoryDefault: true, description: 'Document preparer name', example: 'Rajesh Kumar' },
  { id: 'var-022', code: 'approved_by', entity: 'user', path: 'name', type: 'string', mandatoryDefault: true, description: 'Document approver name', example: 'Priya Sharma' },
];

// ===== NUMBERING RULES =====
export const numberingRules: NumberingRule[] = [
  {
    id: 'num-001', documentType: 'PO', scope: 'company', pattern: 'PO/{FY}/{SEQ}',
    prefix: 'PO', sequenceLength: 4, resetRule: 'yearly', isGapless: true,
    currentSequence: 893, lastGenerated: '2024-01-16', lastGeneratedBy: 'user-020',
    createdAt: '2024-01-01', updatedAt: '2024-01-16'
  },
  {
    id: 'num-002', documentType: 'Invoice', scope: 'company', pattern: 'INV/{FY}/{SEQ}',
    prefix: 'INV', sequenceLength: 4, resetRule: 'yearly', isGapless: true,
    currentSequence: 245, lastGenerated: '2024-01-16', lastGeneratedBy: 'user-022',
    createdAt: '2024-01-01', updatedAt: '2024-01-16'
  },
  {
    id: 'num-003', documentType: 'WO', scope: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    pattern: 'WO/{PROJECT}/{FY}/{SEQ}', prefix: 'WO', sequenceLength: 3, resetRule: 'project_wise',
    isGapless: true, currentSequence: 45, lastGenerated: '2024-01-15', lastGeneratedBy: 'user-010',
    createdAt: '2024-01-01', updatedAt: '2024-01-15'
  },
  {
    id: 'num-004', documentType: 'Bill', scope: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    pattern: 'B/{PROJECT}/{SEQ}', prefix: 'B', sequenceLength: 3, resetRule: 'never',
    isGapless: true, currentSequence: 447, lastGenerated: '2024-01-16', lastGeneratedBy: 'user-022',
    createdAt: '2024-01-01', updatedAt: '2024-01-16'
  },
  {
    id: 'num-005', documentType: 'GRN', scope: 'company', pattern: 'GRN/{FY}/{SEQ}',
    prefix: 'GRN', sequenceLength: 4, resetRule: 'yearly', isGapless: true,
    currentSequence: 1205, lastGenerated: '2024-01-16', lastGeneratedBy: 'user-021',
    createdAt: '2024-01-01', updatedAt: '2024-01-16'
  },
  {
    id: 'num-006', documentType: 'NCR', scope: 'company', pattern: 'NCR/{FY}/{SEQ}',
    prefix: 'NCR', sequenceLength: 3, resetRule: 'yearly', isGapless: false,
    currentSequence: 23, lastGenerated: '2024-01-14', lastGeneratedBy: 'user-026',
    createdAt: '2024-01-01', updatedAt: '2024-01-14'
  },
  {
    id: 'num-007', documentType: 'RFI', scope: 'project', scopeId: 'prj-001', scopeName: 'Metro Tower Phase II',
    pattern: 'RFI/{PROJECT}/{SEQ}', prefix: 'RFI', sequenceLength: 3, resetRule: 'project_wise',
    isGapless: false, currentSequence: 89, lastGenerated: '2024-01-16', lastGeneratedBy: 'user-015',
    createdAt: '2024-01-01', updatedAt: '2024-01-16'
  },
  {
    id: 'num-008', documentType: 'Certificate', scope: 'company', pattern: 'CERT/{FY}/{SEQ}',
    prefix: 'CERT', sequenceLength: 3, resetRule: 'yearly', isGapless: true,
    currentSequence: 12, lastGenerated: '2024-01-16', lastGeneratedBy: 'user-010',
    createdAt: '2024-01-01', updatedAt: '2024-01-16'
  },
];

// ===== DOCUMENT REVISIONS =====
export const documentRevisions: DocumentRevision[] = [
  {
    id: 'rev-001', documentType: 'PO', documentId: 'po-089', documentNumber: 'PO-2024-0892',
    versionNo: 1, revisionNo: 'P01', revisionDate: '2024-01-15',
    reason: 'Initial issue', preparedBy: 'user-020', preparedByName: 'Amit Shah',
    checkedBy: 'user-010', checkedByName: 'Rajesh Kumar',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma',
    changeSummary: 'New purchase order for steel supply',
    fileDocumentId: 'doc-003', status: 'superseded', createdAt: '2024-01-15'
  },
  {
    id: 'rev-002', documentType: 'PO', documentId: 'po-089', documentNumber: 'PO-2024-0892',
    versionNo: 2, revisionNo: 'P02', revisionDate: '2024-01-16',
    reason: 'Quantity revision based on site requirement', preparedBy: 'user-020', preparedByName: 'Amit Shah',
    checkedBy: 'user-010', checkedByName: 'Rajesh Kumar',
    verifiedBy: 'user-025', verifiedByName: 'Anil Mehta',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma',
    previousVersionId: 'rev-001',
    changeSummary: 'Revised quantity from 50 MT to 55 MT',
    fileDocumentId: 'doc-003', status: 'issued', createdAt: '2024-01-16'
  },
  {
    id: 'rev-003', documentType: 'Invoice', documentId: 'inv-245', documentNumber: 'INV-2024-0245',
    versionNo: 1, revisionNo: 'P01', revisionDate: '2024-01-16',
    reason: 'Initial invoice for December work', preparedBy: 'user-022', preparedByName: 'Vikram Desai',
    checkedBy: 'user-002', checkedByName: 'Priya Sharma',
    approvedBy: 'user-002', approvedByName: 'Priya Sharma',
    changeSummary: 'New invoice generated',
    fileDocumentId: 'doc-012', status: 'issued', createdAt: '2024-01-16'
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-FMT-01', stage: 'APPROVE', control: 'Templates approved (financial/statutory by Finance/Compliance) before activation; active versions immutable', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-FMT-02', stage: 'VERIFY', control: 'Mandatory variables and brand fields validated before generation', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-FMT-03', stage: 'RECORD', control: 'Every issued revision stores reason, preparer/checker/approver and change summary', enforcement: 'BLOCK', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getTemplateStats(): { total: number; active: number; draft: number; approved: number; retired: number } {
  return {
    total: templates.length,
    active: templates.filter(t => t.status === 'active').length,
    draft: templates.filter(t => t.status === 'draft').length,
    approved: templates.filter(t => t.status === 'approved').length,
    retired: templates.filter(t => t.status === 'retired').length,
  };
}

export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return templates.filter(t => t.category === category);
}

export function getTemplatesByScope(scope: TemplateScope): Template[] {
  return templates.filter(t => t.scope === scope);
}

export function getTemplatesByStatus(status: TemplateStatus): Template[] {
  return templates.filter(t => t.status === status);
}

export function getNumberingRuleByDocType(docType: DocumentType, scopeId?: string): NumberingRule | null {
  return numberingRules.find(r => r.documentType === docType && (!scopeId || r.scopeId === scopeId)) || null;
}

export function generateNextNumber(rule: NumberingRule): string {
  const sequence = String(rule.currentSequence + 1).padStart(rule.sequenceLength, '0');
  const fy = new Date().getFullYear() + '-' + String(new Date().getFullYear() + 1).slice(-2);
  
  return rule.pattern
    .replace('{FY}', fy)
    .replace('{SEQ}', sequence)
    .replace('{PROJECT}', rule.scopeId || 'CORP');
}

export function getTemplateUsageStats(): { mostUsed: Template[]; leastUsed: Template[] } {
  const sorted = [...templates].sort((a, b) => b.usageCount - a.usageCount);
  return {
    mostUsed: sorted.slice(0, 5),
    leastUsed: sorted.slice(-5).reverse(),
  };
}
