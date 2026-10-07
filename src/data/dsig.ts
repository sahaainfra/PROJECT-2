// Part 25 — Digital Signature & Trust Verification
// Digital signatures with DSC, e-sign, OTP, hash verification, QR codes, and tamper detection

export type SignatureMethod = 'dsc' | 'esign_provider' | 'internal_otp';
export type SignatureStatus = 'pending' | 'signed' | 'declined' | 'expired';
export type RequestStatus = 'CREATED' | 'PARTIALLY_SIGNED' | 'COMPLETED' | 'DECLINED' | 'EXPIRED';
export type WorkflowType = 'sequential' | 'parallel';

export interface SignatureRequest {
  id: string;
  requestNo: string;
  entityType: string;
  entityId: string;
  documentRevisionId: string;
  documentTitle: string;
  documentNumber: string;
  workflowType: WorkflowType;
  signers: {
    userId: string;
    userName: string;
    role: string;
    order: number;
    method: SignatureMethod;
    status: SignatureStatus;
    signedAt?: string;
    signatureId?: string;
  }[];
  status: RequestStatus;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  expiresAt: string;
  completedAt?: string;
  projectId?: string;
  projectName?: string;
}

export interface Signature {
  id: string;
  requestId: string;
  signerId: string;
  signerName: string;
  signerRole: string;
  method: SignatureMethod;
  certificateRef?: string;
  signedHashSha256: string;
  signedAt: string;
  ipAddress: string;
  deviceId: string;
  providerRef?: string;
  status: 'valid' | 'invalid' | 'revoked';
  signatureImage?: string;
  comments?: string;
}

export interface Verification {
  id: string;
  verificationCode: string;
  documentRevisionId: string;
  documentNumber: string;
  documentTitle: string;
  hash: string;
  publicEnabled: boolean;
  createdAt: string;
  expiresAt?: string;
  verificationCount: number;
  lastVerifiedAt?: string;
}

export interface SignatureHistory {
  id: string;
  documentRevisionId: string;
  documentNumber: string;
  action: 'signed' | 'verified' | 'declined' | 'expired' | 'tampered';
  actorId: string;
  actorName: string;
  at: string;
  details: string;
  ipAddress?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== SIGNATURE REQUESTS =====
export const signatureRequests: SignatureRequest[] = [
  {
    id: 'req-001', requestNo: 'SIG-2024-001',
    entityType: 'Contract', entityId: 'contract-001',
    documentRevisionId: 'rev-contract-001',
    documentTitle: 'Main Contract Agreement - Metro Tower',
    documentNumber: 'MT-CON-001',
    workflowType: 'sequential',
    signers: [
      { userId: 'user-002', userName: 'Priya Sharma', role: 'CFO', order: 1, method: 'dsc', status: 'signed', signedAt: '2024-01-15T10:30:00Z', signatureId: 'sig-001' },
      { userId: 'user-001', userName: 'Rajesh Kumar', role: 'Project Director', order: 2, method: 'dsc', status: 'signed', signedAt: '2024-01-15T14:00:00Z', signatureId: 'sig-002' },
      { userId: 'user-030', userName: 'Client Representative', role: 'Client', order: 3, method: 'esign_provider', status: 'signed', signedAt: '2024-01-16T09:00:00Z', signatureId: 'sig-003' },
    ],
    status: 'COMPLETED',
    requestedBy: 'user-001', requestedByName: 'Rajesh Kumar',
    requestedAt: '2024-01-15T09:00:00Z', expiresAt: '2024-01-22T09:00:00Z',
    completedAt: '2024-01-16T09:00:00Z',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
  {
    id: 'req-002', requestNo: 'SIG-2024-002',
    entityType: 'Bill', entityId: 'bill-447',
    documentRevisionId: 'rev-bill-447',
    documentTitle: 'Subcontractor Bill - Raj Constructions',
    documentNumber: 'B-447',
    workflowType: 'sequential',
    signers: [
      { userId: 'user-025', userName: 'Anil Mehta', role: 'QS Engineer', order: 1, method: 'internal_otp', status: 'signed', signedAt: '2024-01-16T16:00:00Z', signatureId: 'sig-004' },
      { userId: 'user-011', userName: 'Commercial Manager', role: 'Commercial Manager', order: 2, method: 'dsc', status: 'pending' },
      { userId: 'user-022', userName: 'Vikram Desai', role: 'Accounts Manager', order: 3, method: 'dsc', status: 'pending' },
    ],
    status: 'PARTIALLY_SIGNED',
    requestedBy: 'user-025', requestedByName: 'Anil Mehta',
    requestedAt: '2024-01-16T15:00:00Z', expiresAt: '2024-01-23T15:00:00Z',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
  {
    id: 'req-003', requestNo: 'SIG-2024-003',
    entityType: 'Certificate', entityId: 'cert-001',
    documentRevisionId: 'rev-cert-001',
    documentTitle: 'Completion Certificate - Foundation Work',
    documentNumber: 'CERT-2024-001',
    workflowType: 'parallel',
    signers: [
      { userId: 'user-010', userName: 'Rajesh Kumar', role: 'Project Manager', order: 1, method: 'dsc', status: 'signed', signedAt: '2024-01-16T11:00:00Z', signatureId: 'sig-005' },
      { userId: 'user-026', userName: 'Krishna Rao', role: 'QA Manager', order: 1, method: 'dsc', status: 'signed', signedAt: '2024-01-16T11:30:00Z', signatureId: 'sig-006' },
      { userId: 'user-027', userName: 'HSE Manager', role: 'HSE Manager', order: 1, method: 'dsc', status: 'pending' },
    ],
    status: 'PARTIALLY_SIGNED',
    requestedBy: 'user-010', requestedByName: 'Rajesh Kumar',
    requestedAt: '2024-01-16T10:00:00Z', expiresAt: '2024-01-23T10:00:00Z',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
  {
    id: 'req-004', requestNo: 'SIG-2024-004',
    entityType: 'Drawing', entityId: 'doc-001',
    documentRevisionId: 'rev-003',
    documentTitle: 'Foundation Layout Plan',
    documentNumber: 'MT-STR-DWG-001',
    workflowType: 'sequential',
    signers: [
      { userId: 'user-025', userName: 'Anil Mehta', role: 'Design Engineer', order: 1, method: 'dsc', status: 'signed', signedAt: '2024-01-15T16:00:00Z', signatureId: 'sig-007' },
      { userId: 'user-010', userName: 'Rajesh Kumar', role: 'Project Manager', order: 2, method: 'dsc', status: 'signed', signedAt: '2024-01-15T17:00:00Z', signatureId: 'sig-008' },
    ],
    status: 'COMPLETED',
    requestedBy: 'user-025', requestedByName: 'Anil Mehta',
    requestedAt: '2024-01-15T15:00:00Z', expiresAt: '2024-01-22T15:00:00Z',
    completedAt: '2024-01-15T17:00:00Z',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
  {
    id: 'req-005', requestNo: 'SIG-2024-005',
    entityType: 'Letter', entityId: 'letter-001',
    documentRevisionId: 'rev-letter-001',
    documentTitle: 'Variation Order Approval Letter',
    documentNumber: 'LTR-2024-001',
    workflowType: 'sequential',
    signers: [
      { userId: 'user-010', userName: 'Rajesh Kumar', role: 'Project Manager', order: 1, method: 'internal_otp', status: 'declined' },
    ],
    status: 'DECLINED',
    requestedBy: 'user-011', requestedByName: 'Commercial Manager',
    requestedAt: '2024-01-14T10:00:00Z', expiresAt: '2024-01-21T10:00:00Z',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II'
  },
];

// ===== SIGNATURES =====
export const signatures: Signature[] = [
  {
    id: 'sig-001', requestId: 'req-001', signerId: 'user-002', signerName: 'Priya Sharma', signerRole: 'CFO',
    method: 'dsc', certificateRef: 'DSC-PRIYA-2024-001',
    signedHashSha256: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    signedAt: '2024-01-15T10:30:00Z', ipAddress: '192.168.1.102', deviceId: 'dev-004',
    status: 'valid', signatureImage: 'data:image/png;base64,...'
  },
  {
    id: 'sig-002', requestId: 'req-001', signerId: 'user-001', signerName: 'Rajesh Kumar', signerRole: 'Project Director',
    method: 'dsc', certificateRef: 'DSC-RAJESH-2024-001',
    signedHashSha256: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
    signedAt: '2024-01-15T14:00:00Z', ipAddress: '192.168.1.100', deviceId: 'dev-001',
    status: 'valid', signatureImage: 'data:image/png;base64,...'
  },
  {
    id: 'sig-003', requestId: 'req-001', signerId: 'user-030', signerName: 'Client Representative', signerRole: 'Client',
    method: 'esign_provider', certificateRef: 'ESIGN-CLIENT-2024-001',
    signedHashSha256: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2',
    signedAt: '2024-01-16T09:00:00Z', ipAddress: '203.0.113.50', deviceId: 'external',
    providerRef: 'ADOBESIGN-TXN-12345',
    status: 'valid'
  },
  {
    id: 'sig-004', requestId: 'req-002', signerId: 'user-025', signerName: 'Anil Mehta', signerRole: 'QS Engineer',
    method: 'internal_otp',
    signedHashSha256: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3',
    signedAt: '2024-01-16T16:00:00Z', ipAddress: '192.168.1.105', deviceId: 'dev-006',
    status: 'valid', comments: 'Verified quantities and rates'
  },
  {
    id: 'sig-005', requestId: 'req-003', signerId: 'user-010', signerName: 'Rajesh Kumar', signerRole: 'Project Manager',
    method: 'dsc', certificateRef: 'DSC-RAJESH-2024-001',
    signedHashSha256: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4',
    signedAt: '2024-01-16T11:00:00Z', ipAddress: '192.168.1.100', deviceId: 'dev-001',
    status: 'valid'
  },
  {
    id: 'sig-006', requestId: 'req-003', signerId: 'user-026', signerName: 'Krishna Rao', signerRole: 'QA Manager',
    method: 'dsc', certificateRef: 'DSC-KRISHNA-2024-001',
    signedHashSha256: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5',
    signedAt: '2024-01-16T11:30:00Z', ipAddress: '192.168.1.106', deviceId: 'dev-007',
    status: 'valid', comments: 'Quality standards met'
  },
  {
    id: 'sig-007', requestId: 'req-004', signerId: 'user-025', signerName: 'Anil Mehta', signerRole: 'Design Engineer',
    method: 'dsc', certificateRef: 'DSC-ANIL-2024-001',
    signedHashSha256: 'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6',
    signedAt: '2024-01-15T16:00:00Z', ipAddress: '192.168.1.105', deviceId: 'dev-006',
    status: 'valid'
  },
  {
    id: 'sig-008', requestId: 'req-004', signerId: 'user-010', signerName: 'Rajesh Kumar', signerRole: 'Project Manager',
    method: 'dsc', certificateRef: 'DSC-RAJESH-2024-001',
    signedHashSha256: 'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7',
    signedAt: '2024-01-15T17:00:00Z', ipAddress: '192.168.1.100', deviceId: 'dev-001',
    status: 'valid'
  },
];

// ===== VERIFICATIONS =====
export const verifications: Verification[] = [
  {
    id: 'ver-001', verificationCode: 'VERIFY-MT-CON-001-2024',
    documentRevisionId: 'rev-contract-001', documentNumber: 'MT-CON-001',
    documentTitle: 'Main Contract Agreement - Metro Tower',
    hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    publicEnabled: true, createdAt: '2024-01-16T09:00:00Z',
    expiresAt: '2025-01-16T09:00:00Z', verificationCount: 15,
    lastVerifiedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 'ver-002', verificationCode: 'VERIFY-MT-STR-DWG-001-2024',
    documentRevisionId: 'rev-003', documentNumber: 'MT-STR-DWG-001',
    documentTitle: 'Foundation Layout Plan',
    hash: 'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6',
    publicEnabled: false, createdAt: '2024-01-15T17:00:00Z',
    verificationCount: 8, lastVerifiedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'ver-003', verificationCode: 'VERIFY-B-447-2024',
    documentRevisionId: 'rev-bill-447', documentNumber: 'B-447',
    documentTitle: 'Subcontractor Bill - Raj Constructions',
    hash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3',
    publicEnabled: false, createdAt: '2024-01-16T16:00:00Z',
    verificationCount: 3, lastVerifiedAt: '2024-01-16T16:30:00Z'
  },
];

// ===== SIGNATURE HISTORY =====
export const signatureHistory: SignatureHistory[] = [
  {
    id: 'hist-001', documentRevisionId: 'rev-contract-001', documentNumber: 'MT-CON-001',
    action: 'signed', actorId: 'user-002', actorName: 'Priya Sharma',
    at: '2024-01-15T10:30:00Z', details: 'Signed using DSC', ipAddress: '192.168.1.102'
  },
  {
    id: 'hist-002', documentRevisionId: 'rev-contract-001', documentNumber: 'MT-CON-001',
    action: 'signed', actorId: 'user-001', actorName: 'Rajesh Kumar',
    at: '2024-01-15T14:00:00Z', details: 'Signed using DSC', ipAddress: '192.168.1.100'
  },
  {
    id: 'hist-003', documentRevisionId: 'rev-contract-001', documentNumber: 'MT-CON-001',
    action: 'signed', actorId: 'user-030', actorName: 'Client Representative',
    at: '2024-01-16T09:00:00Z', details: 'Signed using e-sign provider (Adobe Sign)', ipAddress: '203.0.113.50'
  },
  {
    id: 'hist-004', documentRevisionId: 'rev-contract-001', documentNumber: 'MT-CON-001',
    action: 'verified', actorId: 'user-010', actorName: 'Rajesh Kumar',
    at: '2024-01-16T14:30:00Z', details: 'Document verified via QR code', ipAddress: '192.168.1.100'
  },
  {
    id: 'hist-005', documentRevisionId: 'rev-bill-447', documentNumber: 'B-447',
    action: 'signed', actorId: 'user-025', actorName: 'Anil Mehta',
    at: '2024-01-16T16:00:00Z', details: 'Signed using OTP verification', ipAddress: '192.168.1.105'
  },
  {
    id: 'hist-006', documentRevisionId: 'rev-003', documentNumber: 'MT-STR-DWG-001',
    action: 'signed', actorId: 'user-025', actorName: 'Anil Mehta',
    at: '2024-01-15T16:00:00Z', details: 'Signed using DSC', ipAddress: '192.168.1.105'
  },
  {
    id: 'hist-007', documentRevisionId: 'rev-003', documentNumber: 'MT-STR-DWG-001',
    action: 'signed', actorId: 'user-010', actorName: 'Rajesh Kumar',
    at: '2024-01-15T17:00:00Z', details: 'Signed using DSC', ipAddress: '192.168.1.100'
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-SIG-01', stage: 'APPROVE', control: 'Signer authorised for document type and value', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-SIG-02', stage: 'VERIFY', control: 'Signed documents immutable; edits create new revision', enforcement: 'BLOCK', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getSignatureRequestStats(): { total: number; completed: number; pending: number; declined: number; expired: number } {
  return {
    total: signatureRequests.length,
    completed: signatureRequests.filter(r => r.status === 'COMPLETED').length,
    pending: signatureRequests.filter(r => r.status === 'PARTIALLY_SIGNED' || r.status === 'CREATED').length,
    declined: signatureRequests.filter(r => r.status === 'DECLINED').length,
    expired: signatureRequests.filter(r => r.status === 'EXPIRED').length,
  };
}

export function getMyPendingSignatures(userId: string): SignatureRequest[] {
  return signatureRequests.filter(req => 
    req.status !== 'COMPLETED' && 
    req.status !== 'DECLINED' && 
    req.status !== 'EXPIRED' &&
    req.signers.some(s => s.userId === userId && s.status === 'pending')
  );
}

export function getSignatureMethodLabel(method: SignatureMethod): string {
  switch (method) {
    case 'dsc': return 'Digital Signature Certificate (DSC)';
    case 'esign_provider': return 'E-Sign Provider';
    case 'internal_otp': return 'Internal OTP Verification';
    default: return method;
  }
}

export function getRequestStatusLabel(status: RequestStatus): string {
  switch (status) {
    case 'CREATED': return 'Created';
    case 'PARTIALLY_SIGNED': return 'Partially Signed';
    case 'COMPLETED': return 'Completed';
    case 'DECLINED': return 'Declined';
    case 'EXPIRED': return 'Expired';
    default: return status;
  }
}

export function getRequestStatusVariant(status: RequestStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'PARTIALLY_SIGNED':
    case 'CREATED': return 'info';
    case 'DECLINED': return 'error';
    case 'EXPIRED': return 'warning';
    default: return 'neutral';
  }
}

export function verifyDocumentHash(documentRevisionId: string, uploadedHash: string): { valid: boolean; message: string } {
  const verification = verifications.find(v => v.documentRevisionId === documentRevisionId);
  if (!verification) {
    return { valid: false, message: 'No verification record found for this document' };
  }
  
  if (verification.hash === uploadedHash) {
    return { valid: true, message: 'Document hash matches - document is authentic and untampered' };
  } else {
    return { valid: false, message: 'Document hash mismatch - document may have been tampered with' };
  }
}

export function getSignatureProgress(request: SignatureRequest): { signed: number; total: number; percentage: number } {
  const signed = request.signers.filter(s => s.status === 'signed').length;
  const total = request.signers.length;
  const percentage = Math.round((signed / total) * 100);
  return { signed, total, percentage };
}
