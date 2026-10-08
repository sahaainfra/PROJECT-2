// Part 08 — Secure-by-Design Foundation
// Zero-trust request pipeline, route registry, and security controls

export type PipelineGate = 'sast' | 'dast' | 'secrets' | 'dependency' | 'container' | 'licence' | 'sbom' | 'security_tests' | 'unit' | 'integration' | 'regression';
export type PipelineResult = 'pass' | 'fail' | 'waived';
export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type DependencyStatus = 'approved' | 'blocked' | 'deprecated' | 'pending_review';
export type RiskAcceptanceStatus = 'requested' | 'approved' | 'expired' | 'closed';
export type LegacyFindingType = 'string_sql' | 'missing_authz' | 'hardcoded_secret' | 'tls_verification_disabled' | 'wildcard_cors' | 'unsafe_upload' | 'verbose_errors' | 'client_only_authz';
export type LegacyFindingStatus = 'open' | 'planned' | 'fixed_behind_flag' | 'verified' | 'closed';

export interface RouteRegistryEntry {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  pathPattern: string;
  apiVersion: string;
  permissionKey: string;
  scopeRule: 'company' | 'project' | 'site' | 'department' | 'resource_owner' | 'public';
  schemaRef: string;
  rateLimitGroup: string;
  idempotencyRequired: boolean;
  auditEvent: string;
  ownerModule: string;
  registeredAt: string;
  registeredBy: string;
}

export interface PipelinePolicy {
  id: string;
  gate: PipelineGate;
  environment: 'development' | 'staging' | 'production';
  blockThreshold: FindingSeverity;
  exceptionRequires: string;
  approvedBy: string;
  effectiveFrom: string;
}

export interface PipelineRun {
  id: string;
  buildRef: string;
  commitSha: string;
  gate: PipelineGate;
  result: PipelineResult;
  findingsBySeverity: Record<FindingSeverity, number>;
  reportDocumentId?: string;
  timestamp: string;
  duration: string;
}

export interface RiskAcceptance {
  id: string;
  findingRef: string;
  severity: FindingSeverity;
  justification: string;
  compensatingControls: string;
  requestedBy: string;
  approvedBy?: string;
  expiresAt: string;
  status: RiskAcceptanceStatus;
  createdAt: string;
}

export interface Dependency {
  id: string;
  ecosystem: 'npm' | 'pypi' | 'maven' | 'nuget' | 'go';
  package: string;
  version: string;
  sourceRegistry: string;
  licenceSpdx: string;
  openAdvisories: number;
  addedBy: string;
  reviewedBy?: string;
  status: DependencyStatus;
  addedAt: string;
}

export interface SecurityPolicy {
  id: string;
  passwordMinLength: number;
  passwordComplexity: 'basic' | 'moderate' | 'strong';
  passwordHistoryCount: number;
  lockoutThreshold: number;
  lockoutMinutes: number;
  sessionIdleMinutes: number;
  sessionAbsoluteHours: number;
  maxConcurrentSessionsPrivileged: number;
  mfaRequiredRoles: string[];
  effectiveFrom: string;
  approvedBy: string;
}

export interface MFAPfactor {
  id: string;
  userId: string;
  type: 'totp' | 'webauthn';
  label: string;
  verifiedAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
}

export interface RateLimitPolicy {
  id: string;
  group: 'login' | 'otp' | 'reset' | 'api' | 'upload' | 'messaging' | 'search' | 'report' | 'import' | 'export' | 'socket';
  role?: string;
  limit: number;
  windowSeconds: number;
  burst: number;
  action: 'throttle' | 'block' | 'challenge';
}

export interface UploadPolicy {
  id: string;
  context: string;
  allowedMime: string[];
  magicByteCheck: boolean;
  maxBytes: number;
  scanRequired: boolean;
  storageClass: 'private' | 'public';
}

export interface SecretRef {
  id: string;
  name: string;
  environment: 'development' | 'staging' | 'production';
  vaultPath: string;
  owner: string;
  rotationDays: number;
  lastRotatedAt: string;
}

export interface LegacyFinding {
  id: string;
  type: LegacyFindingType;
  location: string;
  severity: FindingSeverity;
  description: string;
  remediationPlan: string;
  flagCode?: string;
  status: LegacyFindingStatus;
  discoveredAt: string;
  assignedTo?: string;
}

// ===== ROUTE REGISTRY =====
export const routeRegistry: RouteRegistryEntry[] = [
  { id: 'route-001', method: 'GET', pathPattern: '/api/v1/projects', apiVersion: 'v1', permissionKey: 'org.project.view', scopeRule: 'project', schemaRef: 'project-list.json', rateLimitGroup: 'api', idempotencyRequired: false, auditEvent: 'project.list', ownerModule: 'org', registeredAt: '2024-01-10', registeredBy: 'system' },
  { id: 'route-002', method: 'POST', pathPattern: '/api/v1/projects', apiVersion: 'v1', permissionKey: 'org.project.create', scopeRule: 'company', schemaRef: 'project-create.json', rateLimitGroup: 'api', idempotencyRequired: true, auditEvent: 'project.create', ownerModule: 'org', registeredAt: '2024-01-10', registeredBy: 'system' },
  { id: 'route-003', method: 'GET', pathPattern: '/api/v1/projects/:id', apiVersion: 'v1', permissionKey: 'org.project.view', scopeRule: 'project', schemaRef: 'project-detail.json', rateLimitGroup: 'api', idempotencyRequired: false, auditEvent: 'project.view', ownerModule: 'org', registeredAt: '2024-01-10', registeredBy: 'system' },
  { id: 'route-004', method: 'POST', pathPattern: '/api/v1/purchase-orders', apiVersion: 'v1', permissionKey: 'proc.po.create', scopeRule: 'project', schemaRef: 'po-create.json', rateLimitGroup: 'api', idempotencyRequired: true, auditEvent: 'po.create', ownerModule: 'proc', registeredAt: '2024-01-10', registeredBy: 'system' },
  { id: 'route-005', method: 'POST', pathPattern: '/api/v1/purchase-orders/:id/approve', apiVersion: 'v1', permissionKey: 'proc.po.approve', scopeRule: 'project', schemaRef: 'po-approve.json', rateLimitGroup: 'api', idempotencyRequired: true, auditEvent: 'po.approve', ownerModule: 'proc', registeredAt: '2024-01-10', registeredBy: 'system' },
  { id: 'route-006', method: 'POST', pathPattern: '/api/v1/auth/login', apiVersion: 'v1', permissionKey: 'public', scopeRule: 'public', schemaRef: 'login.json', rateLimitGroup: 'login', idempotencyRequired: false, auditEvent: 'auth.login', ownerModule: 'auth', registeredAt: '2024-01-10', registeredBy: 'system' },
  { id: 'route-007', method: 'GET', pathPattern: '/api/v1/audit/logs', apiVersion: 'v1', permissionKey: 'audit.log.view', scopeRule: 'company', schemaRef: 'audit-list.json', rateLimitGroup: 'report', idempotencyRequired: false, auditEvent: 'audit.list', ownerModule: 'audit', registeredAt: '2024-01-16', registeredBy: 'system' },
];

// ===== PIPELINE POLICIES =====
export const pipelinePolicies: PipelinePolicy[] = [
  { id: 'policy-001', gate: 'secrets', environment: 'production', blockThreshold: 'high', exceptionRequires: 'CISO approval', approvedBy: 'CISO', effectiveFrom: '2024-01-01' },
  { id: 'policy-002', gate: 'dependency', environment: 'production', blockThreshold: 'critical', exceptionRequires: 'CISO + Management approval', approvedBy: 'CISO', effectiveFrom: '2024-01-01' },
  { id: 'policy-003', gate: 'sast', environment: 'production', blockThreshold: 'high', exceptionRequires: 'CISO approval', approvedBy: 'CISO', effectiveFrom: '2024-01-01' },
  { id: 'policy-004', gate: 'security_tests', environment: 'production', blockThreshold: 'medium', exceptionRequires: 'Security Lead approval', approvedBy: 'Security Lead', effectiveFrom: '2024-01-01' },
  { id: 'policy-005', gate: 'container', environment: 'production', blockThreshold: 'critical', exceptionRequires: 'CISO approval', approvedBy: 'CISO', effectiveFrom: '2024-01-01' },
];

// ===== PIPELINE RUNS =====
export const pipelineRuns: PipelineRun[] = [
  { id: 'run-001', buildRef: 'build-2024-01-16-001', commitSha: 'a1b2c3d4', gate: 'secrets', result: 'pass', findingsBySeverity: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }, timestamp: '2024-01-16T10:00:00Z', duration: '12s' },
  { id: 'run-002', buildRef: 'build-2024-01-16-001', commitSha: 'a1b2c3d4', gate: 'dependency', result: 'pass', findingsBySeverity: { critical: 0, high: 0, medium: 2, low: 5, info: 12 }, timestamp: '2024-01-16T10:01:00Z', duration: '45s' },
  { id: 'run-003', buildRef: 'build-2024-01-16-001', commitSha: 'a1b2c3d4', gate: 'sast', result: 'pass', findingsBySeverity: { critical: 0, high: 0, medium: 1, low: 3, info: 8 }, timestamp: '2024-01-16T10:02:00Z', duration: '1m 30s' },
  { id: 'run-004', buildRef: 'build-2024-01-16-001', commitSha: 'a1b2c3d4', gate: 'security_tests', result: 'pass', findingsBySeverity: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }, timestamp: '2024-01-16T10:04:00Z', duration: '2m 15s' },
  { id: 'run-005', buildRef: 'build-2024-01-15-002', commitSha: 'e5f6g7h8', gate: 'secrets', result: 'fail', findingsBySeverity: { critical: 0, high: 1, medium: 0, low: 0, info: 0 }, reportDocumentId: 'doc-001', timestamp: '2024-01-15T14:00:00Z', duration: '10s' },
];

// ===== RISK ACCEPTANCES =====
export const riskAcceptances: RiskAcceptance[] = [
  { id: 'risk-001', findingRef: 'SAST-2024-001', severity: 'medium', justification: 'False positive - code path not reachable', compensatingControls: 'Manual code review completed', requestedBy: 'Engineer A', approvedBy: 'Security Lead', expiresAt: '2024-07-15', status: 'approved', createdAt: '2024-01-15' },
  { id: 'risk-002', findingRef: 'DEP-2024-005', severity: 'low', justification: 'Dependency used in dev only, not in production bundle', compensatingControls: 'Isolated in dev dependencies', requestedBy: 'Engineer B', approvedBy: 'Security Lead', expiresAt: '2024-04-15', status: 'approved', createdAt: '2024-01-14' },
];

// ===== DEPENDENCIES =====
export const dependencies: Dependency[] = [
  { id: 'dep-001', ecosystem: 'npm', package: 'react', version: '18.2.0', sourceRegistry: 'npmjs.org', licenceSpdx: 'MIT', openAdvisories: 0, addedBy: 'system', reviewedBy: 'Security Lead', status: 'approved', addedAt: '2024-01-01' },
  { id: 'dep-002', ecosystem: 'npm', package: 'react-router-dom', version: '6.8.0', sourceRegistry: 'npmjs.org', licenceSpdx: 'MIT', openAdvisories: 0, addedBy: 'system', reviewedBy: 'Security Lead', status: 'approved', addedAt: '2024-01-01' },
  { id: 'dep-003', ecosystem: 'npm', package: 'lucide-react', version: '0.294.0', sourceRegistry: 'npmjs.org', licenceSpdx: 'ISC', openAdvisories: 0, addedBy: 'system', reviewedBy: 'Security Lead', status: 'approved', addedAt: '2024-01-01' },
  { id: 'dep-004', ecosystem: 'npm', package: 'recharts', version: '2.10.0', sourceRegistry: 'npmjs.org', licenceSpdx: 'MIT', openAdvisories: 1, addedBy: 'system', reviewedBy: 'Security Lead', status: 'approved', addedAt: '2024-01-01' },
  { id: 'dep-005', ecosystem: 'npm', package: 'axios', version: '1.6.0', sourceRegistry: 'npmjs.org', licenceSpdx: 'MIT', openAdvisories: 0, addedBy: 'system', reviewedBy: 'Security Lead', status: 'approved', addedAt: '2024-01-01' },
];

// ===== SECURITY POLICIES =====
export const securityPolicies: SecurityPolicy[] = [
  {
    id: 'policy-001',
    passwordMinLength: 12,
    passwordComplexity: 'strong',
    passwordHistoryCount: 5,
    lockoutThreshold: 5,
    lockoutMinutes: 30,
    sessionIdleMinutes: 30,
    sessionAbsoluteHours: 8,
    maxConcurrentSessionsPrivileged: 2,
    mfaRequiredRoles: ['SUPER_ADMIN', 'MANAGEMENT', 'ACCOUNTS_MANAGER', 'PROJECT_MANAGER'],
    effectiveFrom: '2024-01-01',
    approvedBy: 'CISO',
  },
];

// ===== RATE LIMIT POLICIES =====
export const rateLimitPolicies: RateLimitPolicy[] = [
  { id: 'rl-001', group: 'login', limit: 5, windowSeconds: 300, burst: 2, action: 'block' },
  { id: 'rl-002', group: 'otp', limit: 3, windowSeconds: 60, burst: 1, action: 'block' },
  { id: 'rl-003', group: 'reset', limit: 3, windowSeconds: 3600, burst: 1, action: 'block' },
  { id: 'rl-004', group: 'api', limit: 1000, windowSeconds: 60, burst: 100, action: 'throttle' },
  { id: 'rl-005', group: 'upload', limit: 50, windowSeconds: 60, burst: 10, action: 'throttle' },
  { id: 'rl-006', group: 'report', limit: 10, windowSeconds: 60, burst: 2, action: 'throttle' },
];

// ===== UPLOAD POLICIES =====
export const uploadPolicies: UploadPolicy[] = [
  { id: 'upload-001', context: 'document', allowedMime: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], magicByteCheck: true, maxBytes: 10485760, scanRequired: true, storageClass: 'private' },
  { id: 'upload-002', context: 'avatar', allowedMime: ['image/jpeg', 'image/png'], magicByteCheck: true, maxBytes: 1048576, scanRequired: false, storageClass: 'public' },
  { id: 'upload-003', context: 'import', allowedMime: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'], magicByteCheck: true, maxBytes: 52428800, scanRequired: true, storageClass: 'private' },
];

// ===== SECRET REFERENCES =====
export const secretRefs: SecretRef[] = [
  { id: 'secret-001', name: 'DATABASE_URL', environment: 'production', vaultPath: 'secret/data/erp/prod/database', owner: 'DevOps', rotationDays: 90, lastRotatedAt: '2024-01-01' },
  { id: 'secret-002', name: 'JWT_SECRET', environment: 'production', vaultPath: 'secret/data/erp/prod/jwt', owner: 'DevOps', rotationDays: 180, lastRotatedAt: '2024-01-01' },
  { id: 'secret-003', name: 'AWS_ACCESS_KEY', environment: 'production', vaultPath: 'secret/data/erp/prod/aws', owner: 'DevOps', rotationDays: 90, lastRotatedAt: '2024-01-01' },
  { id: 'secret-004', name: 'SMTP_PASSWORD', environment: 'production', vaultPath: 'secret/data/erp/prod/smtp', owner: 'DevOps', rotationDays: 180, lastRotatedAt: '2024-01-01' },
];

// ===== LEGACY FINDINGS =====
export const legacyFindings: LegacyFinding[] = [
  { id: 'legacy-001', type: 'string_sql', location: 'src/services/legacy-report.ts:45', severity: 'high', description: 'String-built SQL query without parameterization', remediationPlan: 'Migrate to parameterized queries', flagCode: 'ff.secbase.legacy.sql', status: 'planned', discoveredAt: '2024-01-10', assignedTo: 'Engineer A' },
  { id: 'legacy-002', type: 'missing_authz', location: 'src/controllers/legacy-export.ts:23', severity: 'medium', description: 'Missing server-side authorization check', remediationPlan: 'Add authorization middleware', flagCode: 'ff.secbase.legacy.authz', status: 'fixed_behind_flag', discoveredAt: '2024-01-10', assignedTo: 'Engineer B' },
  { id: 'legacy-003', type: 'verbose_errors', location: 'src/middleware/error-handler.ts:12', severity: 'low', description: 'Verbose error messages exposed to client', remediationPlan: 'Implement safe error handler', flagCode: 'ff.secbase.legacy.errors', status: 'verified', discoveredAt: '2024-01-10', assignedTo: 'Engineer C' },
  { id: 'legacy-004', type: 'wildcard_cors', location: 'src/config/cors.ts:8', severity: 'medium', description: 'Wildcard CORS origin in production', remediationPlan: 'Restrict to allow-list of origins', flagCode: 'ff.secbase.legacy.cors', status: 'planned', discoveredAt: '2024-01-12', assignedTo: 'Engineer A' },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints = [
  { id: 'CP-SDL-01', stage: 'VERIFY', control: 'Builds with critical vulnerabilities, exposed secrets or failing security tests blocked from production', enforcement: 'BLOCK (release)', status: 'OBSERVE' },
  { id: 'CP-SDL-02', stage: 'PLAN', control: 'Every route, job, socket event and webhook registered with permission, scope rule, schema and rate-limit group before merge', enforcement: 'BLOCK (build)', status: 'OBSERVE' },
  { id: 'CP-SDL-03', stage: 'EXECUTE', control: 'Every request passes Authenticate → Authorise → Validate → Execute → Audit', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-SDL-04', stage: 'APPROVE', control: 'New third-party dependencies reviewed for source, licence, maintenance and advisories before use', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-SDL-05', stage: 'MONITOR', control: 'Authentication failures, lockouts, rate-limit breaches and refresh-token reuse beyond thresholds', enforcement: 'MONITOR', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====

export function getRouteRegistryCoverage(): { registered: number; total: number; percentage: number } {
  // Simulated coverage calculation
  const registered = routeRegistry.length;
  const total = 50; // Estimated total routes
  return {
    registered,
    total,
    percentage: Math.round((registered / total) * 100),
  };
}

export function getPipelinePassRate(): number {
  const passed = pipelineRuns.filter(r => r.result === 'pass').length;
  const total = pipelineRuns.length;
  return total > 0 ? Math.round((passed / total) * 100) : 0;
}

export function getOpenFindingsBySeverity(): Record<FindingSeverity, number> {
  return pipelineRuns.reduce((acc, run) => {
    if (run.result === 'fail') {
      Object.entries(run.findingsBySeverity).forEach(([severity, count]) => {
        acc[severity as FindingSeverity] += count;
      });
    }
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0, info: 0 });
}
