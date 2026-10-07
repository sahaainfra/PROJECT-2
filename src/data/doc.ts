// Part 24 — Advanced Document Control
// Document management with revision control, workflows, transmittals, RFIs, and correspondence

export type DocumentType = 'drawing' | 'spec' | 'method_statement' | 'contract' | 'boq' | 'letter' | 'rfi' | 'si' | 'report' | 'certificate' | 'photo' | 'other';
export type Discipline = 'civil' | 'structural' | 'MEP' | 'architectural' | 'geotechnical' | 'environmental';
export type RevisionStatus = 'WIP' | 'FOR_REVIEW' | 'APPROVED' | 'APPROVED_WITH_COMMENTS' | 'REJECTED' | 'SUPERSEDED';
export type ReviewCode = 'A' | 'B' | 'C' | 'D';
export type DocumentStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED' | 'ARCHIVED';
export type Confidentiality = 'public' | 'internal' | 'restricted' | 'confidential';
export type TransmittalPurpose = 'for_info' | 'for_approval' | 'for_construction';
export type CorrespondenceDirection = 'inward' | 'outward';
export type RFIStatus = 'DRAFT' | 'SENT' | 'RESPONDED' | 'CLOSED';
export type CorrespondenceStatus = 'RECEIVED' | 'SENT' | 'ACTION_PENDING' | 'CLOSED';
export type LinkRelation = 'attachment' | 'reference' | 'evidence' | 'supersedes';

export interface Document {
  id: string;
  docNo: string;
  projectId: string;
  projectName: string;
  type: DocumentType;
  discipline: Discipline;
  title: string;
  originator: string;
  currentRevisionId: string;
  status: DocumentStatus;
  confidentiality: Confidentiality;
  legacyPath?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface DocumentRevision {
  id: string;
  documentId: string;
  revisionCode: string;
  fileId: string;
  checksumSha256: string;
  size: number;
  mime: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  status: RevisionStatus;
  reviewCode?: ReviewCode;
  commentsSummary?: string;
  supersededAt?: string;
}

export interface DocumentFile {
  id: string;
  storageKey: string;
  bucket: string;
  checksum: string;
  size: number;
  mime: string;
  virusScanStatus: 'pending' | 'clean' | 'infected';
  createdAt: string;
}

export interface DocumentReview {
  id: string;
  revisionId: string;
  reviewerId: string;
  reviewerName: string;
  commentsJson: { comment: string; page?: number; timestamp: string }[];
  markupFileId?: string;
  outcome: 'approved' | 'approved_with_comments' | 'rejected';
  reviewCode: ReviewCode;
  at: string;
}

export interface Transmittal {
  id: string;
  transmittalNo: string;
  projectId: string;
  projectName: string;
  toParty: string;
  purpose: TransmittalPurpose;
  items: { revisionId: string; documentNo: string; revisionCode: string; title: string }[];
  sentAt: string;
  sentBy: string;
  sentByName: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  status: 'sent' | 'acknowledged';
}

export interface Distribution {
  id: string;
  revisionId: string;
  recipientType: 'user' | 'party';
  recipientId: string;
  recipientName: string;
  copyType: 'controlled' | 'uncontrolled';
  sentAt: string;
  acknowledgedAt?: string;
}

export interface DocumentLink {
  id: string;
  documentId: string;
  entityType: string;
  entityId: string;
  relation: LinkRelation;
  linkedAt: string;
  linkedBy: string;
}

export interface RFI {
  id: string;
  rfiNo: string;
  projectId: string;
  projectName: string;
  subject: string;
  question: string;
  raisedBy: string;
  raisedByName: string;
  toParty: string;
  requiredBy: string;
  response?: string;
  respondedBy?: string;
  respondedByName?: string;
  respondedAt?: string;
  status: RFIStatus;
  costImpact?: number;
  timeImpactDays?: number;
  createdAt: string;
  updatedAt: string;
  documentIds: string[];
}

export interface Correspondence {
  id: string;
  refNo: string;
  direction: CorrespondenceDirection;
  date: string;
  from: string;
  to: string;
  subject: string;
  summary: string;
  documentId?: string;
  replyToId?: string;
  actionRequiredBy?: string;
  actionDeadline?: string;
  status: CorrespondenceStatus;
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NumberingScheme {
  id: string;
  projectId: string;
  docType: DocumentType;
  pattern: string;
  lastSequence: number;
  createdAt: string;
  createdBy: string;
}

export interface DocumentACL {
  id: string;
  documentId: string;
  principalType: 'user' | 'role' | 'party';
  principalId: string;
  principalName: string;
  permission: 'view' | 'download' | 'edit' | 'review';
  grantedAt: string;
  grantedBy: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== DOCUMENTS =====
export const documents: Document[] = [
  {
    id: 'doc-001', docNo: 'MT-STR-DWG-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    type: 'drawing', discipline: 'structural', title: 'Foundation Layout Plan',
    originator: 'Structural Design Team', currentRevisionId: 'rev-003', status: 'APPROVED',
    confidentiality: 'internal', createdAt: '2024-01-05T10:00:00Z', createdBy: 'user-010',
    updatedAt: '2024-01-15T14:00:00Z', updatedBy: 'user-010'
  },
  {
    id: 'doc-002', docNo: 'MT-CIV-SPEC-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    type: 'spec', discipline: 'civil', title: 'Concrete Specification',
    originator: 'Design Team', currentRevisionId: 'rev-004', status: 'APPROVED',
    confidentiality: 'internal', createdAt: '2024-01-03T09:00:00Z', createdBy: 'user-010',
    updatedAt: '2024-01-12T11:00:00Z', updatedBy: 'user-010'
  },
  {
    id: 'doc-003', docNo: 'MT-MEP-DWG-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    type: 'drawing', discipline: 'MEP', title: 'Electrical Layout - Ground Floor',
    originator: 'MEP Design Team', currentRevisionId: 'rev-002', status: 'UNDER_REVIEW',
    confidentiality: 'internal', createdAt: '2024-01-10T14:00:00Z', createdBy: 'user-025',
    updatedAt: '2024-01-16T09:00:00Z', updatedBy: 'user-025'
  },
  {
    id: 'doc-004', docNo: 'HB-STR-MS-001', projectId: 'prj-002', projectName: 'Highway Bridge NH-48',
    type: 'method_statement', discipline: 'structural', title: 'Pier Construction Method Statement',
    originator: 'Construction Team', currentRevisionId: 'rev-001', status: 'APPROVED',
    confidentiality: 'internal', createdAt: '2024-01-08T10:00:00Z', createdBy: 'user-011',
    updatedAt: '2024-01-14T16:00:00Z', updatedBy: 'user-011'
  },
  {
    id: 'doc-005', docNo: 'MT-CON-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    type: 'contract', discipline: 'civil', title: 'Main Contract Agreement',
    originator: 'Legal Team', currentRevisionId: 'rev-001', status: 'APPROVED',
    confidentiality: 'restricted', createdAt: '2023-12-01T09:00:00Z', createdBy: 'user-002',
    updatedAt: '2023-12-01T09:00:00Z', updatedBy: 'user-002'
  },
  {
    id: 'doc-006', docNo: 'MT-RFI-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    type: 'rfi', discipline: 'structural', title: 'Clarification on Foundation Depth',
    originator: 'Site Team', currentRevisionId: 'rev-001', status: 'APPROVED',
    confidentiality: 'internal', createdAt: '2024-01-12T11:00:00Z', createdBy: 'user-015',
    updatedAt: '2024-01-13T15:00:00Z', updatedBy: 'user-010'
  },
];

// ===== REVISIONS =====
export const revisions: DocumentRevision[] = [
  {
    id: 'rev-001', documentId: 'doc-001', revisionCode: 'P01', fileId: 'file-001',
    checksumSha256: 'abc123def456', size: 2500000, mime: 'application/pdf',
    uploadedBy: 'user-010', uploadedByName: 'Rajesh Kumar', uploadedAt: '2024-01-05T10:00:00Z',
    status: 'SUPERSEDED', reviewCode: 'B', commentsSummary: 'Minor corrections required',
    supersededAt: '2024-01-10T14:00:00Z'
  },
  {
    id: 'rev-002', documentId: 'doc-001', revisionCode: 'P02', fileId: 'file-002',
    checksumSha256: 'def456ghi789', size: 2600000, mime: 'application/pdf',
    uploadedBy: 'user-010', uploadedByName: 'Rajesh Kumar', uploadedAt: '2024-01-10T14:00:00Z',
    status: 'SUPERSEDED', reviewCode: 'A', commentsSummary: 'Approved with minor comments',
    supersededAt: '2024-01-15T14:00:00Z'
  },
  {
    id: 'rev-003', documentId: 'doc-001', revisionCode: 'C01', fileId: 'file-003',
    checksumSha256: 'ghi789jkl012', size: 2700000, mime: 'application/pdf',
    uploadedBy: 'user-010', uploadedByName: 'Rajesh Kumar', uploadedAt: '2024-01-15T14:00:00Z',
    status: 'APPROVED', reviewCode: 'A', commentsSummary: 'Approved for construction'
  },
  {
    id: 'rev-004', documentId: 'doc-002', revisionCode: 'P01', fileId: 'file-004',
    checksumSha256: 'jkl012mno345', size: 1800000, mime: 'application/pdf',
    uploadedBy: 'user-010', uploadedByName: 'Rajesh Kumar', uploadedAt: '2024-01-03T09:00:00Z',
    status: 'APPROVED', reviewCode: 'A', commentsSummary: 'Approved'
  },
  {
    id: 'rev-005', documentId: 'doc-003', revisionCode: 'P01', fileId: 'file-005',
    checksumSha256: 'mno345pqr678', size: 3200000, mime: 'application/pdf',
    uploadedBy: 'user-025', uploadedByName: 'Anil Mehta', uploadedAt: '2024-01-10T14:00:00Z',
    status: 'FOR_REVIEW'
  },
  {
    id: 'rev-006', documentId: 'doc-003', revisionCode: 'P02', fileId: 'file-006',
    checksumSha256: 'pqr678stu901', size: 3300000, mime: 'application/pdf',
    uploadedBy: 'user-025', uploadedByName: 'Anil Mehta', uploadedAt: '2024-01-16T09:00:00Z',
    status: 'FOR_REVIEW'
  },
];

// ===== FILES =====
export const files: DocumentFile[] = [
  { id: 'file-001', storageKey: 'docs/mt-str-dwg-001-p01.pdf', bucket: 'erp-documents', checksum: 'abc123def456', size: 2500000, mime: 'application/pdf', virusScanStatus: 'clean', createdAt: '2024-01-05T10:00:00Z' },
  { id: 'file-002', storageKey: 'docs/mt-str-dwg-001-p02.pdf', bucket: 'erp-documents', checksum: 'def456ghi789', size: 2600000, mime: 'application/pdf', virusScanStatus: 'clean', createdAt: '2024-01-10T14:00:00Z' },
  { id: 'file-003', storageKey: 'docs/mt-str-dwg-001-c01.pdf', bucket: 'erp-documents', checksum: 'ghi789jkl012', size: 2700000, mime: 'application/pdf', virusScanStatus: 'clean', createdAt: '2024-01-15T14:00:00Z' },
  { id: 'file-004', storageKey: 'docs/mt-civ-spec-001-p01.pdf', bucket: 'erp-documents', checksum: 'jkl012mno345', size: 1800000, mime: 'application/pdf', virusScanStatus: 'clean', createdAt: '2024-01-03T09:00:00Z' },
  { id: 'file-005', storageKey: 'docs/mt-mep-dwg-001-p01.pdf', bucket: 'erp-documents', checksum: 'mno345pqr678', size: 3200000, mime: 'application/pdf', virusScanStatus: 'clean', createdAt: '2024-01-10T14:00:00Z' },
  { id: 'file-006', storageKey: 'docs/mt-mep-dwg-001-p02.pdf', bucket: 'erp-documents', checksum: 'pqr678stu901', size: 3300000, mime: 'application/pdf', virusScanStatus: 'clean', createdAt: '2024-01-16T09:00:00Z' },
];

// ===== REVIEWS =====
export const reviews: DocumentReview[] = [
  {
    id: 'review-001', revisionId: 'rev-001', reviewerId: 'user-025', reviewerName: 'Anil Mehta',
    commentsJson: [
      { comment: 'Foundation depth needs clarification', page: 2, timestamp: '2024-01-08T10:00:00Z' },
      { comment: 'Reinforcement details missing', page: 3, timestamp: '2024-01-08T10:05:00Z' }
    ],
    markupFileId: 'markup-001', outcome: 'approved_with_comments', reviewCode: 'B', at: '2024-01-08T10:30:00Z'
  },
  {
    id: 'review-002', revisionId: 'rev-002', reviewerId: 'user-025', reviewerName: 'Anil Mehta',
    commentsJson: [
      { comment: 'Minor dimension correction needed', page: 1, timestamp: '2024-01-12T14:00:00Z' }
    ],
    outcome: 'approved_with_comments', reviewCode: 'A', at: '2024-01-12T14:30:00Z'
  },
  {
    id: 'review-003', revisionId: 'rev-003', reviewerId: 'user-025', reviewerName: 'Anil Mehta',
    commentsJson: [],
    outcome: 'approved', reviewCode: 'A', at: '2024-01-15T16:00:00Z'
  },
];

// ===== TRANSMITTALS =====
export const transmittals: Transmittal[] = [
  {
    id: 'trans-001', transmittalNo: 'TRN-MT-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    toParty: 'Client - Metro Corp Ltd.', purpose: 'for_approval',
    items: [
      { revisionId: 'rev-003', documentNo: 'MT-STR-DWG-001', revisionCode: 'C01', title: 'Foundation Layout Plan' }
    ],
    sentAt: '2024-01-16T10:00:00Z', sentBy: 'user-010', sentByName: 'Rajesh Kumar',
    acknowledgedAt: '2024-01-16T14:00:00Z', acknowledgedBy: 'client-user-001', status: 'acknowledged'
  },
  {
    id: 'trans-002', transmittalNo: 'TRN-MT-002', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    toParty: 'Subcontractor - Raj Constructions', purpose: 'for_construction',
    items: [
      { revisionId: 'rev-003', documentNo: 'MT-STR-DWG-001', revisionCode: 'C01', title: 'Foundation Layout Plan' },
      { revisionId: 'rev-004', documentNo: 'MT-CIV-SPEC-001', revisionCode: 'P01', title: 'Concrete Specification' }
    ],
    sentAt: '2024-01-16T15:00:00Z', sentBy: 'user-010', sentByName: 'Rajesh Kumar',
    status: 'sent'
  },
];

// ===== RFIs =====
export const rfis: RFI[] = [
  {
    id: 'rfi-001', rfiNo: 'RFI-MT-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    subject: 'Clarification on Foundation Depth', question: 'Please clarify the foundation depth at grid line A-5. Drawing shows 2.5m but site conditions suggest 3.0m may be required.',
    raisedBy: 'user-015', raisedByName: 'Ravi Sharma', toParty: 'Design Team',
    requiredBy: '2024-01-15', response: 'Foundation depth revised to 3.0m at grid line A-5 due to soil conditions. Revised drawing MT-STR-DWG-001-C01 issued.',
    respondedBy: 'user-010', respondedByName: 'Rajesh Kumar', respondedAt: '2024-01-13T15:00:00Z',
    status: 'CLOSED', costImpact: 150000, timeImpactDays: 2,
    createdAt: '2024-01-12T11:00:00Z', updatedAt: '2024-01-13T15:00:00Z',
    documentIds: ['doc-001', 'doc-006']
  },
  {
    id: 'rfi-002', rfiNo: 'RFI-MT-002', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    subject: 'MEP Duct Routing Conflict', question: 'HVAC duct routing conflicts with structural beam at level 2. Please advise on resolution.',
    raisedBy: 'user-025', raisedByName: 'Anil Mehta', toParty: 'Structural Design Team',
    requiredBy: '2024-01-20', status: 'SENT',
    createdAt: '2024-01-16T09:00:00Z', updatedAt: '2024-01-16T09:00:00Z',
    documentIds: ['doc-003']
  },
];

// ===== CORRESPONDENCE =====
export const correspondence: Correspondence[] = [
  {
    id: 'corr-001', refNo: 'CORR-MT-IN-001', direction: 'inward', date: '2024-01-15',
    from: 'Client - Metro Corp Ltd.', to: 'Apex Construction',
    subject: 'Approval of Foundation Drawing', summary: 'Client has approved foundation layout drawing MT-STR-DWG-001-C01 for construction.',
    documentId: 'doc-001', status: 'CLOSED', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'corr-002', refNo: 'CORR-MT-OUT-001', direction: 'outward', date: '2024-01-16',
    from: 'Apex Construction', to: 'Subcontractor - Raj Constructions',
    subject: 'Issuance of Approved Drawings', summary: 'Transmittal of approved foundation drawing and concrete specification for construction.',
    documentId: 'doc-001', status: 'CLOSED', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    createdAt: '2024-01-16T15:00:00Z', updatedAt: '2024-01-16T15:00:00Z'
  },
];

// ===== DOCUMENT LINKS =====
export const documentLinks: DocumentLink[] = [
  { id: 'link-001', documentId: 'doc-001', entityType: 'WorkOrder', entityId: 'wo-001', relation: 'reference', linkedAt: '2024-01-15T14:00:00Z', linkedBy: 'user-010' },
  { id: 'link-002', documentId: 'doc-001', entityType: 'MeasurementBook', entityId: 'mb-001', relation: 'reference', linkedAt: '2024-01-16T10:00:00Z', linkedBy: 'user-015' },
  { id: 'link-003', documentId: 'doc-002', entityType: 'WorkOrder', entityId: 'wo-001', relation: 'reference', linkedAt: '2024-01-15T14:00:00Z', linkedBy: 'user-010' },
  { id: 'link-004', documentId: 'doc-006', entityType: 'RFI', entityId: 'rfi-001', relation: 'evidence', linkedAt: '2024-01-13T15:00:00Z', linkedBy: 'user-010' },
];

// ===== NUMBERING SCHEMES =====
export const numberingSchemes: NumberingScheme[] = [
  { id: 'scheme-001', projectId: 'prj-001', docType: 'drawing', pattern: '{PROJECT}-{DISC}-{TYPE}-{SEQ}', lastSequence: 1, createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'scheme-002', projectId: 'prj-001', docType: 'spec', pattern: '{PROJECT}-{DISC}-SPEC-{SEQ}', lastSequence: 1, createdAt: '2024-01-01', createdBy: 'user-001' },
  { id: 'scheme-003', projectId: 'prj-002', docType: 'drawing', pattern: '{PROJECT}-{DISC}-{TYPE}-{SEQ}', lastSequence: 0, createdAt: '2024-01-01', createdBy: 'user-001' },
];

// ===== DOCUMENT ACL =====
export const documentACL: DocumentACL[] = [
  { id: 'acl-001', documentId: 'doc-001', principalType: 'role', principalId: 'role-003', principalName: 'Project Manager', permission: 'view', grantedAt: '2024-01-05', grantedBy: 'user-001' },
  { id: 'acl-002', documentId: 'doc-001', principalType: 'role', principalId: 'role-003', principalName: 'Project Manager', permission: 'download', grantedAt: '2024-01-05', grantedBy: 'user-001' },
  { id: 'acl-003', documentId: 'doc-001', principalType: 'role', principalId: 'role-004', principalName: 'Site Engineer', permission: 'view', grantedAt: '2024-01-05', grantedBy: 'user-001' },
  { id: 'acl-004', documentId: 'doc-005', principalType: 'role', principalId: 'role-002', principalName: 'Management / CFO', permission: 'view', grantedAt: '2023-12-01', grantedBy: 'user-001' },
  { id: 'acl-005', documentId: 'doc-005', principalType: 'user', principalId: 'user-010', principalName: 'Rajesh Kumar', permission: 'view', grantedAt: '2023-12-01', grantedBy: 'user-001' },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-DOC-01', stage: 'VERIFY', control: 'Only current approved-for-construction revisions can be referenced by WA/MB/IR', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-DOC-02', stage: 'RECORD', control: 'Mandatory documents per PC-5 attached before submit', enforcement: 'EXCEPTION', status: 'OBSERVE' },
  { id: 'CP-DOC-03', stage: 'MONITOR', control: 'RFI/correspondence response deadlines', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getDocumentsByProject(projectId: string): Document[] {
  return documents.filter(d => d.projectId === projectId);
}

export function getDocumentsByType(type: DocumentType): Document[] {
  return documents.filter(d => d.type === type);
}

export function getRevisionsByDocument(documentId: string): DocumentRevision[] {
  return revisions.filter(r => r.documentId === documentId).sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export function getCurrentRevision(documentId: string): DocumentRevision | null {
  const docRevisions = getRevisionsByDocument(documentId);
  return docRevisions.find(r => r.status === 'APPROVED' || r.status === 'APPROVED_WITH_COMMENTS') || docRevisions[0] || null;
}

export function getRFIsByProject(projectId: string): RFI[] {
  return rfis.filter(r => r.projectId === projectId);
}

export function getOpenRFIs(): RFI[] {
  return rfis.filter(r => r.status === 'SENT' || r.status === 'DRAFT');
}

export function getDocumentStats(): { total: number; approved: number; underReview: number; superseded: number } {
  return {
    total: documents.length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
    underReview: documents.filter(d => d.status === 'UNDER_REVIEW').length,
    superseded: documents.filter(d => d.status === 'SUPERSEDED').length,
  };
}

export function getRFIStats(): { total: number; open: number; responded: number; closed: number } {
  return {
    total: rfis.length,
    open: rfis.filter(r => r.status === 'SENT' || r.status === 'DRAFT').length,
    responded: rfis.filter(r => r.status === 'RESPONDED').length,
    closed: rfis.filter(r => r.status === 'CLOSED').length,
  };
}
