// Part 08 — Secure-by-Design Foundation
// Security console with zero-trust pipeline, route registry, and security controls

import React, { useState } from 'react';
import {
  Shield, Route, GitBranch, Package, Settings, AlertTriangle, CheckCircle,
  Lock, Eye, FileText, Clock, Users, Zap, AlertCircle
} from 'lucide-react';
import {
  routeRegistry, pipelinePolicies, pipelineRuns, riskAcceptances,
  dependencies, securityPolicies, rateLimitPolicies, uploadPolicies,
  secretRefs, legacyFindings, protocolControlPoints,
  getRouteRegistryCoverage, getPipelinePassRate, getOpenFindingsBySeverity,
  type RouteRegistryEntry, type PipelineRun, type Dependency, type LegacyFinding
} from '../data/secbase';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'shield': Shield,
    'route': Route,
    'git-branch': GitBranch,
    'package': Package,
    'settings': Settings,
    'alert-triangle': AlertTriangle,
    'check-circle': CheckCircle,
    'lock': Lock,
    'eye': Eye,
    'file-text': FileText,
    'clock': Clock,
    'users': Users,
    'zap': Zap,
    'alert-circle': AlertCircle,
  };
  const IconComponent = icons[name] || Shield;
  return <IconComponent size={size} className={className} />;
}

// StatusChip component
function StatusChip({ status, variant }: { status: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }) {
  const colors = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function SecBaseModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'pipeline' | 'dependencies' | 'policies' | 'legacy' | 'risks'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'shield' },
    { id: 'routes', label: 'Route Registry', icon: 'route' },
    { id: 'pipeline', label: 'Security Pipeline', icon: 'git-branch' },
    { id: 'dependencies', label: 'Dependencies', icon: 'package' },
    { id: 'policies', label: 'Policies', icon: 'settings' },
    { id: 'legacy', label: 'Legacy Findings', icon: 'alert-triangle' },
    { id: 'risks', label: 'Risk Acceptances', icon: 'alert-circle' },
  ];

  const routeCoverage = getRouteRegistryCoverage();
  const pipelinePassRate = getPipelinePassRate();
  const openFindings = getOpenFindingsBySeverity();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Technical Console</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Security · ff.secbase</p>
        </div>
        <nav className="space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                activeTab === t.id
                  ? 'bg-[var(--brand-primary)] text-white font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Mobile tab selector */}
        <div className="lg:hidden mb-4">
          <select
            value={activeTab}
            onChange={e => setActiveTab(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
          >
            {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Secure-by-Design Foundation</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Zero-trust request pipeline · Route registry · CI/CD security gates · SEC-1 to SEC-28</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Route Coverage</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{routeCoverage.percentage}%</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{routeCoverage.registered}/{routeCoverage.total} registered</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pipeline Pass Rate</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{pipelinePassRate}%</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Last 30 days</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Open Findings</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {openFindings.critical + openFindings.high + openFindings.medium}
                </p>
                <p className="text-xs text-red-600 mt-1">{openFindings.critical} critical</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Legacy Findings</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{legacyFindings.filter(f => f.status !== 'closed').length}</p>
                <p className="text-xs text-amber-600 mt-1">{legacyFindings.filter(f => f.status === 'open').length} open</p>
              </div>
            </div>

            {/* Zero-Trust Pipeline */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[var(--brand-primary)]" />
                Zero-Trust Request Pipeline
              </h3>
              <div className="flex items-center justify-between">
                {['Authenticate', 'Authorise', 'Validate', 'Execute', 'Audit'].map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                        <Icon name={idx === 0 ? 'lock' : idx === 1 ? 'shield' : idx === 2 ? 'check-circle' : idx === 3 ? 'zap' : 'eye'} size={20} />
                      </div>
                      <p className="text-xs font-medium text-[var(--text-primary)]">{step}</p>
                    </div>
                    {idx < 4 && (
                      <div className="flex-1 h-0.5 bg-emerald-200 mx-2" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Protocol Control Points */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[var(--brand-primary)]" />
                Protocol Control Points
              </h3>
              <div className="space-y-3">
                {protocolControlPoints.map(cp => (
                  <div key={cp.id} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-mono font-medium text-[var(--brand-primary)] shrink-0">{cp.id}</span>
                    <StatusChip status={cp.stage} variant="info" />
                    <span className="text-sm text-[var(--text-primary)] flex-1">{cp.control}</span>
                    <StatusChip status={cp.status} variant="warning" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Pipeline Runs */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent Pipeline Runs</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {pipelineRuns.slice(-5).reverse().map(run => (
                  <div key={run.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      run.result === 'pass' ? 'bg-emerald-100 text-emerald-600' :
                      run.result === 'fail' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <Icon name={run.result === 'pass' ? 'check-circle' : run.result === 'fail' ? 'alert-circle' : 'clock'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{run.gate}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{run.buildRef} · {run.commitSha.substring(0, 8)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusChip status={run.result} variant={run.result === 'pass' ? 'success' : run.result === 'fail' ? 'error' : 'warning'} />
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">{run.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROUTE REGISTRY TAB */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Route Registry</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{routeRegistry.length} registered routes · Every route requires permission, scope rule, schema, and rate-limit group</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Method</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Path</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Permission</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Idempotent</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Rate Limit</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Module</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {routeRegistry.map(route => (
                      <tr key={route.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            route.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                            route.method === 'POST' ? 'bg-emerald-100 text-emerald-700' :
                            route.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>{route.method}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{route.pathPattern}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{route.permissionKey}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{route.scopeRule}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {route.idempotencyRequired ? (
                            <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-[var(--text-disabled)]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{route.rateLimitGroup}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{route.ownerModule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Security Pipeline</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">CI/CD security gates · SEC-23, SEC-24 · Builds with critical findings blocked from production</p>
            </div>

            {/* Pipeline Policies */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Pipeline Policies</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {pipelinePolicies.map(policy => (
                  <div key={policy.id} className="px-4 py-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center shrink-0">
                      <Icon name="shield" size={20} className="text-[var(--text-tertiary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{policy.gate}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">Block threshold: {policy.blockThreshold} · {policy.environment}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-[var(--text-secondary)]">Approved by {policy.approvedBy}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">Effective: {policy.effectiveFrom}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Runs */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent Pipeline Runs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Build</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Gate</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Result</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Critical</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">High</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Medium</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Duration</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {pipelineRuns.map(run => (
                      <tr key={run.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3">
                          <p className="text-xs font-mono text-[var(--text-primary)]">{run.buildRef}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{run.commitSha.substring(0, 8)}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] capitalize">{run.gate}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip status={run.result} variant={run.result === 'pass' ? 'success' : run.result === 'fail' ? 'error' : 'warning'} />
                        </td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-red-600">{run.findingsBySeverity.critical}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-orange-600">{run.findingsBySeverity.high}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-amber-600">{run.findingsBySeverity.medium}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{run.duration}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(run.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DEPENDENCIES TAB */}
        {activeTab === 'dependencies' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dependency Inventory</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{dependencies.length} dependencies · Licence compliance · Advisory tracking · SBOM generation</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Ecosystem</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Package</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Version</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Licence</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Advisories</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reviewed By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {dependencies.map(dep => (
                      <tr key={dep.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{dep.ecosystem}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{dep.package}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{dep.version}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{dep.licenceSpdx}</td>
                        <td className="px-4 py-3 text-center">
                          {dep.openAdvisories > 0 ? (
                            <span className="text-xs font-bold text-red-600">{dep.openAdvisories}</span>
                          ) : (
                            <span className="text-xs text-emerald-600">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={dep.status} 
                            variant={dep.status === 'approved' ? 'success' : dep.status === 'blocked' ? 'error' : dep.status === 'deprecated' ? 'warning' : 'neutral'} 
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{dep.reviewedBy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* POLICIES TAB */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Security Policies</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Password, session, MFA, rate limit, and upload policies</p>
            </div>

            {/* Security Policies */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Authentication & Session Policies</h3>
              {securityPolicies.map(policy => (
                <div key={policy.id} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Password Min Length</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{policy.passwordMinLength}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Complexity</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{policy.passwordComplexity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Lockout Threshold</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{policy.lockoutThreshold} attempts</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Lockout Duration</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{policy.lockoutMinutes} minutes</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Session Idle Timeout</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{policy.sessionIdleMinutes} minutes</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Session Absolute</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{policy.sessionAbsoluteHours} hours</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Max Concurrent (Privileged)</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{policy.maxConcurrentSessionsPrivileged}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">MFA Required Roles</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{policy.mfaRequiredRoles.length}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rate Limit Policies */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Rate Limit Policies</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Group</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Limit</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Window</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Burst</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {rateLimitPolicies.map(policy => (
                      <tr key={policy.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm text-[var(--text-primary)] capitalize">{policy.group}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{policy.limit}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{policy.windowSeconds}s</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{policy.burst}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={policy.action} 
                            variant={policy.action === 'block' ? 'error' : policy.action === 'challenge' ? 'warning' : 'info'} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LEGACY FINDINGS TAB */}
        {activeTab === 'legacy' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Legacy Security Findings</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{legacyFindings.length} findings · Remediation tracking · Feature flag deployment</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Location</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {legacyFindings.map(finding => (
                      <tr key={finding.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                            {finding.type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">{finding.location}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{finding.description}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={finding.severity} 
                            variant={finding.severity === 'critical' ? 'error' : finding.severity === 'high' ? 'error' : finding.severity === 'medium' ? 'warning' : 'info'} 
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={finding.status.replace(/_/g, ' ')} 
                            variant={
                              finding.status === 'closed' ? 'success' :
                              finding.status === 'verified' ? 'success' :
                              finding.status === 'fixed_behind_flag' ? 'info' :
                              finding.status === 'planned' ? 'warning' :
                              'error'
                            } 
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{finding.assignedTo || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RISK ACCEPTANCES TAB */}
        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Risk Acceptances</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{riskAcceptances.length} time-limited risk acceptances · Expiry tracking</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Finding Ref</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Justification</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Requested By</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Expires</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {riskAcceptances.map(risk => (
                      <tr key={risk.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{risk.findingRef}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={risk.severity} 
                            variant={risk.severity === 'critical' ? 'error' : risk.severity === 'high' ? 'error' : risk.severity === 'medium' ? 'warning' : 'info'} 
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{risk.justification}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{risk.requestedBy}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{risk.approvedBy || '—'}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(risk.expiresAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={risk.status} 
                            variant={risk.status === 'approved' ? 'success' : risk.status === 'expired' ? 'error' : 'warning'} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
