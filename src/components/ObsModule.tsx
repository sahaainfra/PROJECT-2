// Part 10 — Observability, Performance & Reliability
// System health, SLOs, incidents, metrics, and monitoring

import React, { useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, BarChart3, CheckCircle, Clock, Database,
  FileText, Gauge, GitBranch, HardDrive, LineChart, Monitor, Server, Zap, XCircle
} from 'lucide-react';
import {
  slos, incidents, alertRules, capacityRuns, healthChecks, metrics, traceSpans,
  logEntries, queueMetrics, jobMetrics, slowQueries, databaseMetrics,
  protocolControlPoints, errorTaxonomy, getSLOHealth, getIncidentStats, getOverallHealth,
  type SLO, type Incident, type AlertRule, type CapacityRun
} from '../data/obs';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, any> = {
    'activity': Activity, 'alert-circle': AlertCircle, 'alert-triangle': AlertTriangle,
    'bar-chart': BarChart3, 'check-circle': CheckCircle, 'clock': Clock, 'database': Database,
    'file-text': FileText, 'gauge': Gauge, 'git-branch': GitBranch, 'hard-drive': HardDrive,
    'line-chart': LineChart, 'monitor': Monitor, 'server': Server, 'zap': Zap, 'x-circle': XCircle,
  };
  const IconComponent = icons[name] || Activity;
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

export function ObsModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'slos' | 'incidents' | 'alerts' | 'metrics' | 'traces' | 'logs' | 'queues' | 'database' | 'capacity'>('overview');

  const tabs = [
    { id: 'overview', label: 'System Health', icon: 'activity' },
    { id: 'slos', label: 'SLOs', icon: 'gauge' },
    { id: 'incidents', label: 'Incidents', icon: 'alert-circle' },
    { id: 'alerts', label: 'Alert Rules', icon: 'alert-triangle' },
    { id: 'metrics', label: 'Metrics', icon: 'line-chart' },
    { id: 'traces', label: 'Traces', icon: 'git-branch' },
    { id: 'logs', label: 'Logs', icon: 'file-text' },
    { id: 'queues', label: 'Queues & Jobs', icon: 'server' },
    { id: 'database', label: 'Database', icon: 'database' },
    { id: 'capacity', label: 'Capacity Tests', icon: 'bar-chart' },
  ];

  const sloHealth = getSLOHealth();
  const incidentStats = getIncidentStats();
  const overallHealth = getOverallHealth();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Technical Console</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Observability · ff.obs</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">System Health & Observability</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Real-time monitoring · SLO tracking · Incident management · Performance metrics</p>
            </div>

            {/* Overall Health Status */}
            <div className={`bg-[var(--card-bg)] rounded-xl border-2 p-6 ${
              overallHealth === 'healthy' ? 'border-emerald-300' :
              overallHealth === 'degraded' ? 'border-amber-300' :
              'border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Overall System Health</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Last checked: {new Date(healthChecks[0].checkedAt).toLocaleString()}</p>
                </div>
                <div className={`text-4xl font-bold ${
                  overallHealth === 'healthy' ? 'text-emerald-600' :
                  overallHealth === 'degraded' ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {overallHealth === 'healthy' ? '✓' : overallHealth === 'degraded' ? '⚠' : '✗'}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">SLOs On Track</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{sloHealth.onTrack}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">of {slos.length} total</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Open Incidents</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{incidentStats.open}</p>
                <p className="text-xs text-amber-600 mt-1">{incidentStats.mitigated} mitigated</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Active Alerts</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{alertRules.filter(a => a.status === 'active').length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{alertRules.reduce((sum, a) => sum + a.triggerCount, 0)} triggered</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Slow Queries</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{slowQueries.length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">avg {Math.round(slowQueries.reduce((sum, q) => sum + q.avgDuration, 0) / slowQueries.length)}ms</p>
              </div>
            </div>

            {/* Dependency Health */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Dependency Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {healthChecks.map(check => (
                  <div key={check.id} className={`p-3 rounded-lg border ${
                    check.status === 'healthy' ? 'bg-emerald-50 border-emerald-200' :
                    check.status === 'degraded' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[var(--text-primary)]">{check.service}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        check.status === 'healthy' ? 'bg-emerald-500' :
                        check.status === 'degraded' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">{check.latency}ms</p>
                    {check.message && <p className="text-xs text-[var(--text-secondary)] mt-1">{check.message}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Control Points */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Monitor size={16} className="text-[var(--brand-primary)]" />
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

            {/* Recent Incidents */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent Incidents</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {incidents.slice(0, 3).map(incident => (
                  <div key={incident.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      incident.severity === 'SEV1' ? 'bg-red-100 text-red-600' :
                      incident.severity === 'SEV2' ? 'bg-orange-100 text-orange-600' :
                      incident.severity === 'SEV3' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <AlertCircle size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{incident.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{incident.summary}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusChip 
                        status={incident.severity} 
                        variant={
                          incident.severity === 'SEV1' ? 'error' :
                          incident.severity === 'SEV2' ? 'error' :
                          incident.severity === 'SEV3' ? 'warning' :
                          'info'
                        } 
                      />
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">{new Date(incident.startedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLOs TAB */}
        {activeTab === 'slos' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Service Level Objectives</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{slos.length} SLOs · Error budget tracking · Burn rate monitoring</p>
            </div>

            <div className="space-y-4">
              {slos.map(slo => (
                <div key={slo.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{slo.code}</span>
                        <StatusChip status={slo.status} variant="success" />
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{slo.journey}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{slo.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{slo.currentPct}%</p>
                      <p className="text-xs text-[var(--text-tertiary)]">Target: {slo.targetPct}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Error Budget Remaining</p>
                      <p className={`text-lg font-bold mt-1 ${
                        slo.errorBudgetRemaining > 20 ? 'text-emerald-600' :
                        slo.errorBudgetRemaining > 0 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {slo.errorBudgetRemaining}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Window</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{slo.windowDays} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Owner</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{slo.ownerName}</p>
                    </div>
                  </div>

                  <div className="h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        slo.errorBudgetRemaining > 20 ? 'bg-emerald-500' :
                        slo.errorBudgetRemaining > 0 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, slo.currentPct))}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    Last measured: {new Date(slo.lastMeasuredAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Incident Management</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{incidents.length} incidents · {incidentStats.open} open · {incidentStats.reviewed} reviewed</p>
              </div>
              <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                + Declare Incident
              </button>
            </div>

            <div className="space-y-4">
              {incidents.map(incident => (
                <div key={incident.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        incident.severity === 'SEV1' ? 'bg-red-100 text-red-600' :
                        incident.severity === 'SEV2' ? 'bg-orange-100 text-orange-600' :
                        incident.severity === 'SEV3' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[var(--brand-primary)]">{incident.code}</span>
                          <StatusChip 
                            status={incident.severity} 
                            variant={
                              incident.severity === 'SEV1' ? 'error' :
                              incident.severity === 'SEV2' ? 'error' :
                              incident.severity === 'SEV3' ? 'warning' :
                              'info'
                            } 
                          />
                          <StatusChip 
                            status={incident.status.replace('_', ' ')} 
                            variant={
                              incident.status === 'OPEN' || incident.status === 'ACKNOWLEDGED' ? 'error' :
                              incident.status === 'MITIGATED' ? 'warning' :
                              incident.status === 'RESOLVED' ? 'success' :
                              'info'
                            } 
                          />
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-1">{incident.title}</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{incident.summary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Started</p>
                      <p className="text-sm text-[var(--text-primary)] mt-1">{new Date(incident.startedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Detected By</p>
                      <p className="text-sm text-[var(--text-primary)] mt-1">{incident.detectedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Affected Services</p>
                      <p className="text-sm text-[var(--text-primary)] mt-1">{incident.affectedServices.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Actions</p>
                      <p className="text-sm text-[var(--text-primary)] mt-1">
                        {incident.actions.filter(a => a.completed).length}/{incident.actions.length}
                      </p>
                    </div>
                  </div>

                  {incident.rootCause && (
                    <div className="p-3 rounded-lg bg-[var(--surface-hover)] mb-3">
                      <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Root Cause</p>
                      <p className="text-sm text-[var(--text-secondary)]">{incident.rootCause}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                    <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Impact</p>
                    <p className="text-sm text-[var(--text-secondary)]">{incident.impactDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Alert Rules</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{alertRules.length} rules · Automated monitoring and alerting</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Query</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Owner</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Triggers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {alertRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{rule.code}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{rule.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{rule.description}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)] max-w-xs truncate">{rule.query}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={rule.severity} 
                          variant={
                            rule.severity === 'SEV1' ? 'error' :
                            rule.severity === 'SEV2' ? 'error' :
                            rule.severity === 'SEV3' ? 'warning' :
                            'info'
                          } 
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rule.ownerName}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={rule.status} variant={rule.status === 'active' ? 'success' : 'neutral'} />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{rule.triggerCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Metrics</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">RED metrics · USE metrics · Business health metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map(metric => (
                <div key={metric.name} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{metric.name}</h3>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">{metric.description}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{metric.type}</span>
                  </div>

                  <div className="h-32 flex items-end gap-1">
                    {metric.data.map((point, idx) => {
                      const maxValue = Math.max(...metric.data.map(d => d.value));
                      const height = (point.value / maxValue) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-[var(--brand-primary)] rounded-t hover:bg-[var(--brand-primary-hover)] transition-colors"
                            style={{ height: `${height}%` }}
                            title={`${point.value} ${metric.unit}`}
                          />
                          <span className="text-[9px] text-[var(--text-tertiary)]">
                            {new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--divider)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">Unit: {metric.unit}</span>
                    <span className="font-tabular font-medium text-[var(--text-primary)]">
                      Latest: {metric.data[metric.data.length - 1]?.value} {metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRACES TAB */}
        {activeTab === 'traces' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Distributed Traces</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">OpenTelemetry traces · Request flow visualization</p>
            </div>

            <div className="space-y-4">
              {Array.from(new Set(traceSpans.map(s => s.traceId))).map(traceId => {
                const spans = traceSpans.filter(s => s.traceId === traceId);
                const rootSpan = spans.find(s => !s.parentSpanId);
                return (
                  <div key={traceId} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-mono text-[var(--brand-primary)]">{traceId}</p>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-1">{rootSpan?.operationName}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--text-primary)]">{rootSpan?.duration}ms</p>
                        <StatusChip status={rootSpan?.status || 'ok'} variant={rootSpan?.status === 'ok' ? 'success' : 'error'} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {spans.map(span => (
                        <div key={span.spanId} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                          <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)] shrink-0" style={{ marginLeft: `${(span.parentSpanId ? 20 : 0)}px` }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--text-primary)]">{span.operationName}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">{span.serviceName}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-tabular text-[var(--text-primary)]">{span.duration}ms</p>
                            <StatusChip status={span.status} variant={span.status === 'ok' ? 'success' : 'error'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Structured Logs</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">JSON logs · Correlation IDs · PII redaction</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Timestamp</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Level</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Service</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Message</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Correlation ID</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {logEntries.map(log => (
                      <tr key={log.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)] font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={log.level} 
                            variant={
                              log.level === 'error' ? 'error' :
                              log.level === 'warn' ? 'warning' :
                              log.level === 'info' ? 'info' :
                              'neutral'
                            } 
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{log.service}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-primary)] max-w-xs truncate">{log.message}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{log.correlationId}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">
                          {log.durationMs ? `${log.durationMs}ms` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Error Taxonomy */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Error Taxonomy (SA-17)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {errorTaxonomy.map(err => (
                  <div key={err.code} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-[var(--brand-primary)]">{err.code}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{err.description}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 italic">"{err.userMessage}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUEUES TAB */}
        {activeTab === 'queues' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Queues & Jobs</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Queue depth · Job monitoring · Dead letter tracking</p>
            </div>

            {/* Queue Metrics */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Queue Metrics</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Queue</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Depth</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Oldest (sec)</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Retries</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Dead Letter</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Rate/min</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {queueMetrics.map(queue => (
                      <tr key={queue.queueName} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{queue.queueName}</td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-primary)]">{queue.depth}</td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-secondary)]">{queue.oldestMessageAge}</td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-secondary)]">{queue.retries}</td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-primary)]">
                          <span className={queue.deadLetterCount > 0 ? 'text-red-600 font-bold' : ''}>{queue.deadLetterCount}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-secondary)]">{queue.processingRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Job Metrics */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Background Jobs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Job Name</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Run</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Next Run</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Avg Duration</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {jobMetrics.map(job => (
                      <tr key={job.jobId} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{job.jobName}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={job.status} 
                            variant={
                              job.status === 'idle' ? 'success' :
                              job.status === 'running' ? 'info' :
                              job.status === 'failed' ? 'error' :
                              'warning'
                            } 
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                          {job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                          {job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{job.avgDuration}ms</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{job.successRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DATABASE TAB */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Database Monitoring</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Connection pool · Slow queries · Table growth · Lock waits</p>
            </div>

            {/* Connection Pool */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Connection Pool</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Pool Size</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{databaseMetrics.connectionPoolSize}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Active</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{databaseMetrics.activeConnections}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Idle</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{databaseMetrics.idleConnections}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Waiting</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{databaseMetrics.waitingConnections}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Utilization</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    {Math.round((databaseMetrics.activeConnections / databaseMetrics.connectionPoolSize) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Slow Queries */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Slow Queries</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Table</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Query</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Avg (ms)</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Max (ms)</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Calls</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Rows Scanned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {slowQueries.map(query => (
                      <tr key={query.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{query.table}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)] max-w-xs truncate">{query.query}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-amber-600">{query.avgDuration}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-red-600">{query.maxDuration}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{query.callCount}</td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{query.rowsScanned.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Growth */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Table Growth</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Table</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Size (MB)</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Growth Rate (MB/day)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {databaseMetrics.tableGrowth.map(table => (
                      <tr key={table.table} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{table.table}</td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-primary)]">{table.sizeMB.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-secondary)]">{table.growthRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CAPACITY TAB */}
        {activeTab === 'capacity' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Capacity Tests</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{capacityRuns.length} test runs · Production scale simulation</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + Run Capacity Test
              </button>
            </div>

            <div className="space-y-4">
              {capacityRuns.map(run => (
                <div key={run.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{run.scenario}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{run.description}</p>
                    </div>
                    <StatusChip 
                      status={run.results.passed ? 'PASSED' : 'FAILED'} 
                      variant={run.results.passed ? 'success' : 'error'} 
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Projects</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{run.volumes.projects}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">BOQ Lines</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{(run.volumes.boqLines / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Stock Transactions</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{(run.volumes.stockTransactions / 1000000).toFixed(0)}M</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Concurrent Users</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{run.volumes.concurrentUsers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Avg Response</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{run.results.avgResponseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Error Rate</p>
                      <p className={`text-lg font-bold mt-1 ${run.results.errorRate > 0.1 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {run.results.errorRate}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs text-[var(--text-tertiary)]">P95 Response</p>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{run.results.p95ResponseTime}ms</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs text-[var(--text-tertiary)]">P99 Response</p>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{run.results.p99ResponseTime}ms</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs text-[var(--text-tertiary)]">Throughput</p>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{run.results.throughput} req/s</p>
                    </div>
                  </div>

                  {run.notes && (
                    <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Notes</p>
                      <p className="text-sm text-[var(--text-secondary)]">{run.notes}</p>
                    </div>
                  )}

                  <p className="text-xs text-[var(--text-tertiary)] mt-3">
                    Run at: {new Date(run.runAt).toLocaleString()} · By: {run.runBy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
