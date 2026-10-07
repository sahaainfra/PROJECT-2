// Part 03 — CI/CD & Release Engineering Data
// Technical Console — DS-32, hidden from business users

export type GateStatus = 'pass' | 'fail' | 'skip' | 'running' | 'pending' | 'warn';
export type ReleaseStatus = 'DRAFT' | 'CANDIDATE' | 'STAGING_VERIFIED' | 'APPROVED' | 'DEPLOYING' | 'LIVE' | 'ROLLED_BACK';
export type FlagStatus = 'active' | 'killed' | 'stale';

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  description: string;
  mandatory: boolean;
  avgDuration: string;
}

export interface GateResult {
  gateId: string;
  status: GateStatus;
  duration: string;
  metrics?: Record<string, string | number>;
  reportLink?: string;
  startedAt: string;
  finishedAt?: string;
}

export interface Release {
  id: string;
  version: string;
  commitSha: string;
  parts: string[];
  status: ReleaseStatus;
  risk: 'low' | 'medium' | 'high' | 'critical';
  rollbackPlan: string;
  author: string;
  approvedBy?: string;
  approvedAt?: string;
  deployedAt?: string;
  createdAt: string;
  gates: GateResult[];
  notes?: string;
}

export interface FeatureFlag {
  key: string;
  partNo: string;
  description: string;
  owner: string;
  defaults: { dev: boolean; staging: boolean; production: boolean };
  targeting?: string;
  killSwitch: boolean;
  status: FlagStatus;
  lastChanged: string;
  changeHistory: { date: string; env: string; oldVal: boolean; newVal: boolean; by: string; reason: string }[];
}

export interface EvidenceBundle {
  partNo: string;
  partName: string;
  status: 'complete' | 'in-progress' | 'pending';
  testsPassed: number;
  testsFailed: number;
  testsSkipped: number;
  coverage: number;
  schemaDiff: 'empty' | 'additive' | 'destructive';
  goldenOutputs: 'unchanged' | 'changed-approved' | 'changed-unapproved';
  openApiDiff: 'no-breaking' | 'breaking';
  permissionTests: 'pass' | 'fail';
  protocolMatrix: 'pass' | 'fail';
  designGates: 'pass' | 'fail';
  auditRecord: 'approved' | 'pending' | 'missing';
  screenshots: { mobile: boolean; tablet: boolean; desktop: boolean };
  artifacts: string[];
}

export interface QuarantinedTest {
  id: string;
  testName: string;
  suite: string;
  reason: string;
  owner: string;
  expiresAt: string;
  status: 'quarantined' | 'resolved' | 'expired';
  filedAt: string;
}

export interface GateThreshold {
  id: string;
  name: string;
  metric: string;
  threshold: string;
  currentValue: string;
  status: 'pass' | 'warn' | 'fail';
  lastUpdated: string;
}

// ===== PIPELINE STAGES =====
export const pipelineStages: PipelineStage[] = [
  { id: 'install', name: 'Install', order: 1, description: 'Lockfile validation, dependency install', mandatory: true, avgDuration: '45s' },
  { id: 'lint', name: 'Lint', order: 2, description: 'ESLint, Prettier, token lint, icon lint, nav lint', mandatory: true, avgDuration: '12s' },
  { id: 'typecheck', name: 'Type Check', order: 3, description: 'TypeScript strict mode, zero errors', mandatory: true, avgDuration: '18s' },
  { id: 'unit', name: 'Unit Tests', order: 4, description: 'Vitest unit suite, coverage floor 80%', mandatory: true, avgDuration: '35s' },
  { id: 'integration', name: 'Integration', order: 5, description: 'Ephemeral DB, service integration tests', mandatory: true, avgDuration: '1m 20s' },
  { id: 'contract', name: 'API Contract', order: 6, description: 'OpenAPI diff, consumer contract tests', mandatory: true, avgDuration: '22s' },
  { id: 'auth', name: 'Authorisation', order: 7, description: 'Generated permission tests (allow/deny/scope)', mandatory: true, avgDuration: '28s' },
  { id: 'migration', name: 'Migration', order: 8, description: 'Up→Down→Up, schema diff of pre-existing = empty', mandatory: true, avgDuration: '45s' },
  { id: 'e2e', name: 'E2E Smoke', order: 9, description: 'Playwright at 360/820/1440 px', mandatory: true, avgDuration: '2m 30s' },
  { id: 'security', name: 'Security Scan', order: 10, description: 'SAST, dependency, secret, container (Part 08)', mandatory: true, avgDuration: '1m 45s' },
  { id: 'perf', name: 'Perf Smoke', order: 11, description: 'p95 latency budgets, bundle size', mandatory: true, avgDuration: '55s' },
  { id: 'build', name: 'Build', order: 12, description: 'Production build, artefact signing', mandatory: true, avgDuration: '40s' },
  { id: 'staging', name: 'Deploy Staging', order: 13, description: 'Blue/green deploy to staging', mandatory: true, avgDuration: '1m 10s' },
  { id: 'smoke', name: 'Staging Smoke', order: 14, description: 'Health checks, critical path smoke', mandatory: true, avgDuration: '30s' },
  { id: 'approval', name: 'Manual Approval', order: 15, description: 'Release Manager + Product Owner', mandatory: true, avgDuration: '—' },
  { id: 'production', name: 'Production', order: 16, description: 'Canary → full rollout, auto-rollback on SLO breach', mandatory: true, avgDuration: '5m' },
];

// ===== RELEASES =====
export const releases: Release[] = [
  {
    id: 'REL-001', version: '0.1.0', commitSha: 'a3f8c21', parts: ['Part 00'], status: 'LIVE', risk: 'low',
    rollbackPlan: 'Revert to tag erp-baseline-v0, restore DB backup', author: 'Tech Lead',
    approvedBy: 'Release Manager', approvedAt: '2024-01-10T14:30:00Z', deployedAt: '2024-01-10T15:00:00Z',
    createdAt: '2024-01-10T12:00:00Z',
    gates: [
      { gateId: 'lint', status: 'pass', duration: '11s', startedAt: '2024-01-10T12:01:00Z', finishedAt: '2024-01-10T12:01:11Z' },
      { gateId: 'typecheck', status: 'pass', duration: '17s', startedAt: '2024-01-10T12:01:12Z', finishedAt: '2024-01-10T12:01:29Z' },
      { gateId: 'unit', status: 'pass', duration: '32s', metrics: { coverage: 84, tests: 142 }, startedAt: '2024-01-10T12:01:30Z', finishedAt: '2024-01-10T12:02:02Z' },
      { gateId: 'integration', status: 'pass', duration: '1m 15s', startedAt: '2024-01-10T12:02:03Z', finishedAt: '2024-01-10T12:03:18Z' },
      { gateId: 'contract', status: 'pass', duration: '20s', startedAt: '2024-01-10T12:03:19Z', finishedAt: '2024-01-10T12:03:39Z' },
      { gateId: 'auth', status: 'pass', duration: '25s', startedAt: '2024-01-10T12:03:40Z', finishedAt: '2024-01-10T12:04:05Z' },
      { gateId: 'migration', status: 'pass', duration: '42s', metrics: { 'schema-diff': 'empty' }, startedAt: '2024-01-10T12:04:06Z', finishedAt: '2024-01-10T12:04:48Z' },
      { gateId: 'e2e', status: 'pass', duration: '2m 22s', metrics: { '360px': 'pass', '820px': 'pass', '1440px': 'pass' }, startedAt: '2024-01-10T12:04:49Z', finishedAt: '2024-01-10T12:07:11Z' },
      { gateId: 'security', status: 'pass', duration: '1m 40s', startedAt: '2024-01-10T12:07:12Z', finishedAt: '2024-01-10T12:08:52Z' },
      { gateId: 'perf', status: 'pass', duration: '50s', metrics: { 'p95-list': '320ms', 'bundle': '245KB' }, startedAt: '2024-01-10T12:08:53Z', finishedAt: '2024-01-10T12:09:43Z' },
      { gateId: 'build', status: 'pass', duration: '38s', startedAt: '2024-01-10T12:09:44Z', finishedAt: '2024-01-10T12:10:22Z' },
    ],
  },
  {
    id: 'REL-002', version: '0.2.0', commitSha: 'b7d2e45', parts: ['Part 01'], status: 'LIVE', risk: 'low',
    rollbackPlan: 'Disable ff.audit, no schema changes', author: 'Tech Lead',
    approvedBy: 'Product Owner', approvedAt: '2024-01-12T10:00:00Z', deployedAt: '2024-01-12T10:30:00Z',
    createdAt: '2024-01-12T08:00:00Z',
    gates: pipelineStages.slice(0, 12).map(s => ({ gateId: s.id, status: 'pass' as const, duration: s.avgDuration, startedAt: '2024-01-12T08:01:00Z', finishedAt: '2024-01-12T08:10:00Z' })),
  },
  {
    id: 'REL-003', version: '0.3.0', commitSha: 'c9f1a67', parts: ['Part 02'], status: 'STAGING_VERIFIED', risk: 'low',
    rollbackPlan: 'Disable ff.preview, no production data affected', author: 'Tech Lead',
    createdAt: '2024-01-15T09:00:00Z',
    gates: pipelineStages.slice(0, 14).map(s => ({ gateId: s.id, status: 'pass' as const, duration: s.avgDuration, startedAt: '2024-01-15T09:01:00Z', finishedAt: '2024-01-15T09:12:00Z' })),
  },
  {
    id: 'REL-004', version: '0.4.0', commitSha: 'd2e5f89', parts: ['Part 03'], status: 'CANDIDATE', risk: 'medium',
    rollbackPlan: 'Disable ff.cicd, down-migrate cicd_* tables', author: 'Tech Lead',
    createdAt: '2024-01-16T11:00:00Z',
    gates: [
      ...pipelineStages.slice(0, 11).map(s => ({ gateId: s.id, status: 'pass' as const, duration: s.avgDuration, startedAt: '2024-01-16T11:01:00Z', finishedAt: '2024-01-16T11:10:00Z' })),
      { gateId: 'build', status: 'running', duration: '—', startedAt: '2024-01-16T11:10:01Z' },
      ...pipelineStages.slice(12).map(s => ({ gateId: s.id, status: 'pending' as const, duration: '—', startedAt: '2024-01-16T11:00:00Z' })),
    ],
  },
  {
    id: 'REL-005', version: '0.0.9-rc1', commitSha: 'e4g7h12', parts: ['Part 04 (draft)'], status: 'DRAFT', risk: 'high',
    rollbackPlan: 'TBD — migration review pending', author: 'Engineer A',
    createdAt: '2024-01-16T14:00:00Z',
    gates: [
      { gateId: 'lint', status: 'pass', duration: '12s', startedAt: '2024-01-16T14:01:00Z', finishedAt: '2024-01-16T14:01:12Z' },
      { gateId: 'typecheck', status: 'pass', duration: '19s', startedAt: '2024-01-16T14:01:13Z', finishedAt: '2024-01-16T14:01:32Z' },
      { gateId: 'unit', status: 'fail', duration: '38s', metrics: { coverage: 72, tests: 89, failed: 3 }, startedAt: '2024-01-16T14:01:33Z', finishedAt: '2024-01-16T14:02:11Z', reportLink: '/evidence/part-004/unit-fail.log' },
      { gateId: 'migration', status: 'fail', duration: '44s', metrics: { 'schema-diff': 'destructive', detail: 'DROP COLUMN projects.legacy_code' }, startedAt: '2024-01-16T14:03:00Z', finishedAt: '2024-01-16T14:03:44Z', reportLink: '/evidence/part-004/migration-fail.log' },
    ],
  },
];

// ===== FEATURE FLAGS =====
export const featureFlags: FeatureFlag[] = [
  {
    key: 'ff.pgm', partNo: 'Part 00', description: 'Program baseline, shell, theme, navigation', owner: 'Tech Lead',
    defaults: { dev: true, staging: true, production: true }, killSwitch: false, status: 'active', lastChanged: '2024-01-10',
    changeHistory: [
      { date: '2024-01-08', env: 'dev', oldVal: false, newVal: true, by: 'Tech Lead', reason: 'Initial development' },
      { date: '2024-01-09', env: 'staging', oldVal: false, newVal: true, by: 'Release Manager', reason: 'Staging verification' },
      { date: '2024-01-10', env: 'production', oldVal: false, newVal: true, by: 'Release Manager', reason: 'Production release v0.1.0' },
    ],
  },
  {
    key: 'ff.pgm.theme', partNo: 'Part 00', description: 'Theme bridge for existing screens', owner: 'Tech Lead',
    defaults: { dev: true, staging: true, production: true }, killSwitch: false, status: 'active', lastChanged: '2024-01-10',
    changeHistory: [
      { date: '2024-01-10', env: 'production', oldVal: false, newVal: true, by: 'Release Manager', reason: 'Released with Part 00' },
    ],
  },
  {
    key: 'ff.tech_console', partNo: 'Part 00', description: 'Technical Console access', owner: 'Tech Lead',
    defaults: { dev: true, staging: true, production: true }, killSwitch: false, status: 'active', lastChanged: '2024-01-10',
    changeHistory: [],
  },
  {
    key: 'ff.audit', partNo: 'Part 01', description: 'System audit dashboard', owner: 'Tech Lead',
    defaults: { dev: true, staging: true, production: true }, killSwitch: false, status: 'active', lastChanged: '2024-01-12',
    changeHistory: [
      { date: '2024-01-11', env: 'dev', oldVal: false, newVal: true, by: 'Tech Lead', reason: 'Development' },
      { date: '2024-01-12', env: 'production', oldVal: false, newVal: true, by: 'Release Manager', reason: 'Released with Part 01' },
    ],
  },
  {
    key: 'ff.preview', partNo: 'Part 02', description: 'Preview environment for stakeholders', owner: 'Tech Lead',
    defaults: { dev: true, staging: true, production: true }, killSwitch: false, status: 'active', lastChanged: '2024-01-15',
    changeHistory: [
      { date: '2024-01-14', env: 'dev', oldVal: false, newVal: true, by: 'Tech Lead', reason: 'Preview development' },
      { date: '2024-01-15', env: 'production', oldVal: false, newVal: true, by: 'Release Manager', reason: 'Released with Part 02' },
    ],
  },
  {
    key: 'ff.cicd', partNo: 'Part 03', description: 'CI/CD pipeline & quality gates', owner: 'Release Manager',
    defaults: { dev: true, staging: true, production: false }, killSwitch: false, status: 'active', lastChanged: '2024-01-16',
    changeHistory: [
      { date: '2024-01-16', env: 'dev', oldVal: false, newVal: true, by: 'Tech Lead', reason: 'Pipeline development' },
    ],
  },
];

// ===== EVIDENCE BUNDLES =====
export const evidenceBundles: EvidenceBundle[] = [
  {
    partNo: 'Part 00', partName: 'Program Baseline & Design Foundation', status: 'complete',
    testsPassed: 142, testsFailed: 0, testsSkipped: 0, coverage: 84,
    schemaDiff: 'empty', goldenOutputs: 'unchanged', openApiDiff: 'no-breaking',
    permissionTests: 'pass', protocolMatrix: 'pass', designGates: 'pass', auditRecord: 'approved',
    screenshots: { mobile: true, tablet: true, desktop: true },
    artifacts: ['test-report.xml', 'coverage.html', 'schema-diff.json', 'screenshots-360.png', 'screenshots-820.png', 'screenshots-1440.png', 'audit-part-000.md'],
  },
  {
    partNo: 'Part 01', partName: 'System Audit & Architecture Discovery', status: 'complete',
    testsPassed: 38, testsFailed: 0, testsSkipped: 0, coverage: 91,
    schemaDiff: 'empty', goldenOutputs: 'unchanged', openApiDiff: 'no-breaking',
    permissionTests: 'pass', protocolMatrix: 'pass', designGates: 'pass', auditRecord: 'approved',
    screenshots: { mobile: true, tablet: true, desktop: true },
    artifacts: ['test-report.xml', 'coverage.html', 'audit-part-001.md', 'EXISTING_SYSTEM_MAP.md'],
  },
  {
    partNo: 'Part 02', partName: 'Live Dashboard Preview', status: 'complete',
    testsPassed: 67, testsFailed: 0, testsSkipped: 0, coverage: 88,
    schemaDiff: 'empty', goldenOutputs: 'unchanged', openApiDiff: 'no-breaking',
    permissionTests: 'pass', protocolMatrix: 'pass', designGates: 'pass', auditRecord: 'approved',
    screenshots: { mobile: true, tablet: true, desktop: true },
    artifacts: ['test-report.xml', 'coverage.html', 'audit-part-002.md', 'fixture-contract.json'],
  },
  {
    partNo: 'Part 03', partName: 'Quality Gates & CI/CD', status: 'in-progress',
    testsPassed: 45, testsFailed: 0, testsSkipped: 2, coverage: 82,
    schemaDiff: 'additive', goldenOutputs: 'unchanged', openApiDiff: 'no-breaking',
    permissionTests: 'pass', protocolMatrix: 'pass', designGates: 'pass', auditRecord: 'pending',
    screenshots: { mobile: true, tablet: true, desktop: true },
    artifacts: ['test-report.xml', 'coverage.html', 'pipeline-config.yml'],
  },
  {
    partNo: 'Part 04', partName: 'Shared Services (planned)', status: 'pending',
    testsPassed: 0, testsFailed: 3, testsSkipped: 12, coverage: 0,
    schemaDiff: 'destructive', goldenOutputs: 'changed-unapproved', openApiDiff: 'breaking',
    permissionTests: 'fail', protocolMatrix: 'fail', designGates: 'pass', auditRecord: 'missing',
    screenshots: { mobile: false, tablet: false, desktop: false },
    artifacts: [],
  },
];

// ===== QUARANTINED TESTS =====
export const quarantinedTests: QuarantinedTest[] = [
  { id: 'QT-001', testName: 'should handle concurrent stock updates', suite: 'inventory.integration', reason: 'Flaky under CI load — timing issue', owner: 'Engineer B', expiresAt: '2024-02-15', status: 'quarantined', filedAt: '2024-01-10' },
  { id: 'QT-002', testName: 'should render dashboard at 360px', suite: 'e2e.responsive', reason: 'Intermittent font loading timeout', owner: 'Engineer C', expiresAt: '2024-02-01', status: 'quarantined', filedAt: '2024-01-12' },
  { id: 'QT-003', testName: 'should calculate FIFO valuation correctly', suite: 'inventory.calculation', reason: 'Resolved — re-enabled', owner: 'Engineer B', expiresAt: '2024-01-20', status: 'resolved', filedAt: '2024-01-05' },
];

// ===== GATE THRESHOLDS =====
export const gateThresholds: GateThreshold[] = [
  { id: 'GT-001', name: 'Lint Errors', metric: 'lint.errors', threshold: '0', currentValue: '0', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-002', name: 'Type Errors', metric: 'tsc.errors', threshold: '0', currentValue: '0', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-003', name: 'Unit Coverage (new code)', metric: 'coverage.lines.new', threshold: '≥ 80%', currentValue: '84%', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-004', name: 'Failed Tests', metric: 'tests.failed', threshold: '0', currentValue: '0', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-005', name: 'Breaking API Changes', metric: 'openapi.breaking', threshold: '0', currentValue: '0', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-006', name: 'Destructive Migrations', metric: 'migration.destructive', threshold: '0', currentValue: '0', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-007', name: 'Bundle Size', metric: 'build.bundleSize', threshold: '≤ 300KB', currentValue: '245KB', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-008', name: 'p95 List API', metric: 'perf.p95.list', threshold: '≤ 500ms', currentValue: '320ms', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-009', name: 'p95 Record Page', metric: 'perf.p95.record', threshold: '≤ 1000ms', currentValue: '680ms', status: 'pass', lastUpdated: '2024-01-16' },
  { id: 'GT-010', name: 'p95 Dashboard', metric: 'perf.p95.dashboard', threshold: '≤ 3000ms', currentValue: '2100ms', status: 'pass', lastUpdated: '2024-01-16' },
];

// ===== REGRESSION SUITES =====
export const regressionSuites = [
  { id: 'tender-to-award', name: 'Tender to Award', status: 'planned', partOwner: 'Part 22', testsCount: 0 },
  { id: 'project-baseline', name: 'Project Baseline', status: 'active', partOwner: 'Part 20', testsCount: 24 },
  { id: 'procure-to-pay', name: 'Procure to Pay', status: 'planned', partOwner: 'Part 22', testsCount: 0 },
  { id: 'material-receipt', name: 'Material Receipt / Issue', status: 'planned', partOwner: 'Part 23', testsCount: 0 },
  { id: 'dpr-progress', name: 'DPR / Progress', status: 'planned', partOwner: 'Part 21', testsCount: 0 },
  { id: 'ra-billing', name: 'RA Billing', status: 'planned', partOwner: 'Part 39', testsCount: 0 },
  { id: 'subcontract-billing', name: 'Subcontract Billing', status: 'planned', partOwner: 'Part 39', testsCount: 0 },
  { id: 'payroll', name: 'Payroll', status: 'planned', partOwner: 'Part 42', testsCount: 0 },
  { id: 'accounting-close', name: 'Accounting Close', status: 'planned', partOwner: 'Part 39', testsCount: 0 },
  { id: 'change-order', name: 'Change Order', status: 'planned', partOwner: 'Part 35', testsCount: 0 },
  { id: 'claims', name: 'Claims', status: 'planned', partOwner: 'Part 35', testsCount: 0 },
  { id: 'mobile-offline', name: 'Mobile Offline Sync', status: 'planned', partOwner: 'Part 46', testsCount: 0 },
  { id: 'permissions-audit', name: 'Permissions & Audit', status: 'active', partOwner: 'Part 06/07', testsCount: 42 },
];
