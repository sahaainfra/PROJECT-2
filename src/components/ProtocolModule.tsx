import React, { useState } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Clock, FileText, Users, DollarSign,
  GitBranch, Zap, Eye, Settings, Activity, AlertCircle, X, ChevronRight,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import {
  controlPoints, controlPointModes, thresholds, evidenceRules, reasonCodes,
  exceptionMatrix, evaluations, exceptions, controlCycles, violations,
  escalations, escalationLadders, protocolControlPoints,
  getControlPointStats, getExceptionStats, getViolationStats, getEvaluationStats,
  type ControlPoint, type Exception, type Violation
} from '../data/protocol';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'shield': Shield, 'alert-triangle': AlertTriangle, 'check-circle': CheckCircle,
    'clock': Clock, 'file-text': FileText, 'users': Users, 'dollar': DollarSign,
    'git-branch': GitBranch, 'zap': Zap, 'eye': Eye, 'settings': Settings,
    'activity': Activity, 'alert-circle': AlertCircle, 'x': X,
    'chevron-right': ChevronRight, 'trending-up': TrendingUp,
    'trending-down': TrendingDown, 'minus': Minus,
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

export function ProtocolModule() {
  const [activeTab, setActiveTab] = useState<'control-points' | 'modes' | 'thresholds' | 'evidence' | 'reasons' | 'exceptions' | 'violations' | 'cycles' | 'observe'>('control-points');
  const [selectedCP, setSelectedCP] = useState<ControlPoint | null>(null);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  const tabs = [
    { id: 'control-points', label: 'Control Points', icon: 'shield' },
    { id: 'modes', label: 'Modes', icon: 'settings' },
    { id: 'thresholds', label: 'Thresholds', icon: 'dollar' },
    { id: 'evidence', label: 'Evidence Rules', icon: 'file-text' },
    { id: 'reasons', label: 'Reason Codes', icon: 'alert-circle' },
    { id: 'exceptions', label: 'Exceptions', icon: 'alert-triangle' },
    { id: 'violations', label: 'Violations', icon: 'x' },
    { id: 'cycles', label: 'Control Cycles', icon: 'git-branch' },
    { id: 'observe', label: 'OBSERVE Report', icon: 'eye' },
  ];

  const cpStats = getControlPointStats();
  const excStats = getExceptionStats();
  const violStats = getViolationStats();
  const evalStats = getEvaluationStats();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Administration</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Protocol Engine · ff.protocol</p>
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

        {/* CONTROL POINTS TAB */}
        {activeTab === 'control-points' && !selectedCP && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Control Points</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{cpStats.total} control points · {cpStats.enforce} enforced · {cpStats.observe} observing</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Control Point
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total CPs</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{cpStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Enforced</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{cpStats.enforce}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Observing</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{cpStats.observe}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Warning</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{cpStats.warn}</p>
              </div>
            </div>

            {/* Control Points List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Module</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Stage</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Check Type</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Enforcement</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {controlPoints.map(cp => {
                    const mode = controlPointModes.find(m => m.cpCode === cp.code);
                    return (
                      <tr key={cp.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedCP(cp)}>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{cp.code}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] uppercase">{cp.module}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip status={cp.stage} variant="info" />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{cp.checkType}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip
                            status={cp.enforcement}
                            variant={
                              cp.enforcement === 'BLOCK' ? 'error' :
                              cp.enforcement === 'EXCEPTION' ? 'warning' :
                              cp.enforcement === 'WARN' ? 'warning' :
                              'info'
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{cp.description}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-bold text-[var(--brand-primary)]">v{cp.version}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Protocol Control Points */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[var(--brand-primary)]" />
                Self-Referential Protocol Controls
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
          </div>
        )}

        {/* CONTROL POINT DETAIL */}
        {activeTab === 'control-points' && selectedCP && (
          <div className="space-y-6">
            <button onClick={() => setSelectedCP(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to control points
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedCP.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] uppercase">{selectedCP.module}</span>
                    <span className="text-xs font-bold text-[var(--brand-primary)]">v{selectedCP.version}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedCP.description}</h2>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Stage</p>
                  <StatusChip status={selectedCP.stage} variant="info" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Check Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedCP.checkType}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Enforcement</p>
                  <StatusChip
                    status={selectedCP.enforcement}
                    variant={
                      selectedCP.enforcement === 'BLOCK' ? 'error' :
                      selectedCP.enforcement === 'EXCEPTION' ? 'warning' :
                      'info'
                    }
                  />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Owner Role</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedCP.ownerRole}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Configuration</h3>
                <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedCP.configJson, null, 2)}
                </pre>
              </div>

              {selectedCP.thresholdKey && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Threshold</h3>
                  <p className="text-xs font-mono text-[var(--brand-primary)]">{selectedCP.thresholdKey}</p>
                </div>
              )}

              {selectedCP.evidenceRuleCode && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Evidence Rule</h3>
                  <p className="text-xs font-mono text-[var(--brand-primary)]">{selectedCP.evidenceRuleCode}</p>
                </div>
              )}

              {/* Recent Evaluations */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Recent Evaluations</h3>
                <div className="space-y-2">
                  {evaluations.filter(e => e.cpCode === selectedCP.code).slice(0, 5).map(evaluation => (
                    <div key={evaluation.id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                      <StatusChip
                        status={evaluation.result}
                        variant={
                          evaluation.result === 'PASS' ? 'success' :
                          evaluation.result === 'WARN' ? 'warning' :
                          evaluation.result === 'EXCEPTION_REQUIRED' ? 'warning' :
                          'error'
                        }
                      />
                      <span className="text-xs text-[var(--text-secondary)] flex-1">{evaluation.entityType} #{evaluation.entityId}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{new Date(evaluation.at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODES TAB */}
        {activeTab === 'modes' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Control Point Modes</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{controlPointModes.length} mode configurations · OFF → OBSERVE → WARN → ENFORCE</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Control Point</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Mode</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Effective From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {controlPointModes.map(mode => {
                    const cp = controlPoints.find(c => c.code === mode.cpCode);
                    return (
                      <tr key={mode.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{mode.cpCode}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] capitalize">{mode.scopeType}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{mode.scopeId || 'All'}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip
                            status={mode.mode}
                            variant={
                              mode.mode === 'ENFORCE' ? 'success' :
                              mode.mode === 'WARN' ? 'warning' :
                              mode.mode === 'OBSERVE' ? 'info' :
                              'neutral'
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(mode.effectiveFrom).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{mode.approvedBy}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* THRESHOLDS TAB */}
        {activeTab === 'thresholds' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Thresholds</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{thresholds.length} threshold configurations</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Threshold
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Key</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Unit</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Effective From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Effective To</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {thresholds.map(thresh => (
                    <tr key={thresh.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{thresh.key}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                        {thresh.scopeType}{thresh.scopeId ? ` (${thresh.scopeId})` : ''}
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-sm font-medium text-[var(--text-primary)]">{thresh.value}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{thresh.unit}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(thresh.effectiveFrom).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{thresh.effectiveTo ? new Date(thresh.effectiveTo).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{thresh.approvedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXCEPTIONS TAB */}
        {activeTab === 'exceptions' && !selectedException && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Exception Management</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{excStats.total} exceptions · {excStats.pending} pending · {excStats.emergency} emergency</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{excStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{excStats.pending}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Approved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{excStats.approved}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Emergency</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{excStats.emergency}</p>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Exception No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Control Point</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Requested By</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Deviation</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Emergency</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {exceptions.map(exc => (
                    <tr key={exc.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedException(exc)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{exc.exceptionNo}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{exc.type}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">{exc.cpCode}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{exc.requestedByName}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">
                        {exc.deviationValue} {exc.deviationUnit}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {exc.isEmergency ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">YES</span>
                        ) : (
                          <span className="text-xs text-[var(--text-disabled)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={exc.status.replace(/_/g, ' ')}
                          variant={
                            exc.status === 'APPROVED' || exc.status === 'CONSUMED' ? 'success' :
                            exc.status === 'SUBMITTED' || exc.status === 'DRAFT' ? 'warning' :
                            exc.status === 'REJECTED' ? 'error' :
                            'info'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(exc.requestedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXCEPTION DETAIL */}
        {activeTab === 'exceptions' && selectedException && (
          <div className="space-y-6">
            <button onClick={() => setSelectedException(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to exceptions
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedException.exceptionNo}</span>
                    <StatusChip
                      status={selectedException.status.replace(/_/g, ' ')}
                      variant={
                        selectedException.status === 'APPROVED' || selectedException.status === 'CONSUMED' ? 'success' :
                        selectedException.status === 'SUBMITTED' || selectedException.status === 'DRAFT' ? 'warning' :
                        'error'
                      }
                    />
                    {selectedException.isEmergency && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">EMERGENCY</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedException.type} Exception</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Control Point: {selectedException.cpCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Requested By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedException.requestedByName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Deviation</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedException.deviationValue} {selectedException.deviationUnit}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Cost Impact</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                    {selectedException.costImpact ? `₹${(selectedException.costImpact / 100000).toFixed(2)}L` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Consumed</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedException.consumedValue} / {selectedException.capValue || '∞'}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Reason</h3>
                <p className="text-xs font-mono text-[var(--brand-primary)] mb-2">{selectedException.reasonCode}</p>
                <p className="text-sm text-[var(--text-secondary)]">{selectedException.narrative}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Evidence Documents</h3>
                <div className="space-y-2">
                  {selectedException.evidenceDocIds.map(docId => (
                    <div key={docId} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-hover)]">
                      <FileText size={16} className="text-[var(--text-tertiary)]" />
                      <span className="text-xs font-mono text-[var(--text-primary)]">{docId}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedException.approvedAt && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Approval</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Approved By</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedException.approvedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Approved At</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedException.approvedAt!).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedException.isEmergency && selectedException.regulariseBy && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs font-medium text-amber-700 mb-1">⚠ Emergency Regularisation Required</p>
                    <p className="text-xs text-amber-600">Must be regularised by: {new Date(selectedException.regulariseBy).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIOLATIONS TAB */}
        {activeTab === 'violations' && !selectedViolation && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Violations</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{violStats.total} violations · {violStats.open} open · {violStats.escalated} escalated</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{violStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Open</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{violStats.open}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Resolved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{violStats.resolved}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Escalated</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{violStats.escalated}</p>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Control Point</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Actor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Raised At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {violations.map(viol => (
                    <tr key={viol.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedViolation(viol)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{viol.cpCode}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{viol.actorName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{viol.projectId || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={viol.severity}
                          variant={
                            viol.severity === 'critical' ? 'error' :
                            viol.severity === 'high' ? 'error' :
                            viol.severity === 'medium' ? 'warning' :
                            'info'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={viol.status}
                          variant={
                            viol.status === 'RESOLVED' ? 'success' :
                            viol.status === 'OPEN' ? 'error' :
                            viol.status === 'ESCALATED' ? 'warning' :
                            'info'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(viol.raisedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIOLATION DETAIL */}
        {activeTab === 'violations' && selectedViolation && (
          <div className="space-y-6">
            <button onClick={() => setSelectedViolation(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to violations
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedViolation.cpCode}</span>
                    <StatusChip
                      status={selectedViolation.severity}
                      variant={
                        selectedViolation.severity === 'critical' ? 'error' :
                        selectedViolation.severity === 'high' ? 'error' :
                        selectedViolation.severity === 'medium' ? 'warning' :
                        'info'
                      }
                    />
                    <StatusChip
                      status={selectedViolation.status}
                      variant={
                        selectedViolation.status === 'RESOLVED' ? 'success' :
                        selectedViolation.status === 'OPEN' ? 'error' :
                        'warning'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Violation Details</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Actor</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedViolation.actorName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Project</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedViolation.projectId || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Raised At</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedViolation.raisedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Evaluation ID</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 font-mono text-xs">{selectedViolation.evaluationId}</p>
                </div>
              </div>

              {selectedViolation.resolutionNote && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Resolution</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedViolation.resolutionNote}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Resolved By</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedViolation.resolvedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Resolved At</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedViolation.resolvedAt ? new Date(selectedViolation.resolvedAt).toLocaleString() : '—'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CYCLES TAB */}
        {activeTab === 'cycles' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Control Cycles</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{controlCycles.length} active cycles · 8-stage protocol tracking</p>
            </div>

            <div className="space-y-4">
              {controlCycles.map(cycle => (
                <div key={cycle.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{cycle.rootEntityType} #{cycle.rootEntityId}</span>
                        <StatusChip status={cycle.currentStage} variant="info" />
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{cycle.activityType}</h3>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">Responsible: {cycle.responsibleName}</p>
                    </div>
                    {cycle.isClosed && (
                      <StatusChip status="CLOSED" variant="success" />
                    )}
                  </div>

                  {/* 8-Stage Progress */}
                  <div className="grid grid-cols-8 gap-2 mt-4">
                    {(['PLAN', 'AUTHORIZE', 'EXECUTE', 'RECORD', 'VERIFY', 'ANALYZE', 'CONTROL', 'CLOSE'] as const).map(stage => {
                      const stageStatus = cycle.stageStatus[stage];
                      return (
                        <div key={stage} className="text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                            stageStatus.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                            stageStatus.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                            stageStatus.status === 'skipped' ? 'bg-gray-100 text-gray-400' :
                            'bg-[var(--surface-hover)] text-[var(--text-tertiary)]'
                          }`}>
                            {stageStatus.status === 'completed' ? '✓' :
                             stageStatus.status === 'in_progress' ? '⟳' :
                             stageStatus.status === 'skipped' ? '—' :
                             '○'}
                          </div>
                          <p className="text-[9px] text-[var(--text-tertiary)]">{stage}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'evidence' || activeTab === 'reasons' || activeTab === 'observe') && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {activeTab === 'evidence' && 'Evidence Rules'}
                {activeTab === 'reasons' && 'Reason Codes'}
                {activeTab === 'observe' && 'OBSERVE Impact Report'}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {activeTab === 'evidence' && `${evidenceRules.length} evidence rules configured`}
                {activeTab === 'reasons' && `${reasonCodes.length} reason codes available`}
                {activeTab === 'observe' && 'What would be blocked/warned if ENFORCE mode was active'}
              </p>
            </div>

            {activeTab === 'evidence' && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Transaction Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Required Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {evidenceRules.map(rule => (
                      <tr key={rule.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{rule.code}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rule.transactionType}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {rule.requiredItems.map((item, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                                {item.type} ({item.minCount})
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reasons' && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Module</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Min Chars</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {reasonCodes.map(rc => (
                      <tr key={rc.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{rc.code}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] uppercase">{rc.module}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{rc.category}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rc.description}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{rc.requiresNarrativeMinChars}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'observe' && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Evaluation Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-emerald-700">PASS</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">{evalStats.pass}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-700">WARN</p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">{evalStats.warn}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="text-xs text-orange-700">EXCEPTION</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">{evalStats.exception}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-700">BLOCK</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">{evalStats.block}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-4">
                  Total evaluations: {evalStats.total} · If all OBSERVE mode CPs were ENFORCE, {evalStats.block} actions would have been blocked
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
