import React, { useState } from 'react';
import {
  Key, FileText, Activity, AlertCircle, CheckCircle, Clock, XCircle,
  TrendingUp, TrendingDown, Minus, Shield, Zap, Database, Globe,
  Lock, Unlock, Eye, Edit, Trash2, Plus, Download, Upload, RefreshCw
} from 'lucide-react';
import {
  apiClients, apiCredentials, apiVersions, apiAuditLog, bulkJobs,
  rateLimitConfigs, apiEndpoints, protocolControlPoints,
  getClientStats, getVersionStats, getBulkJobStats, getApiUsage24h, getAverageLatency,
  type ApiClient, type ApiVersion, type BulkJob
} from '../data/devapi';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'key': Key, 'file-text': FileText, 'activity': Activity, 'alert-circle': AlertCircle,
    'check-circle': CheckCircle, 'clock': Clock, 'x-circle': XCircle, 'trending-up': TrendingUp,
    'trending-down': TrendingDown, 'minus': Minus, 'shield': Shield, 'zap': Zap,
    'database': Database, 'globe': Globe, 'lock': Lock, 'unlock': Unlock,
    'eye': Eye, 'edit': Edit, 'trash': Trash2, 'plus': Plus, 'download': Download,
    'upload': Upload, 'refresh': RefreshCw,
  };
  const IconComponent = icons[name] || Key;
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

export function DevApiModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'versions' | 'audit' | 'bulk' | 'ratelimits'>('overview');
  const [selectedClient, setSelectedClient] = useState<ApiClient | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ApiVersion | null>(null);
  const [selectedJob, setSelectedJob] = useState<BulkJob | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'activity' },
    { id: 'clients', label: 'API Clients', icon: 'key' },
    { id: 'versions', label: 'API Versions', icon: 'globe' },
    { id: 'audit', label: 'Audit Log', icon: 'file-text' },
    { id: 'bulk', label: 'Bulk Jobs', icon: 'database' },
    { id: 'ratelimits', label: 'Rate Limits', icon: 'zap' },
  ];

  const clientStats = getClientStats();
  const versionStats = getVersionStats();
  const bulkJobStats = getBulkJobStats();
  const usage24h = getApiUsage24h();
  const avgLatency = getAverageLatency();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Technical Console</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Developer API · ff.devapi</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">API & Developer Platform</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">OAuth2/OIDC clients · API versioning · Rate limiting · Bulk operations</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Active Clients</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{clientStats.active}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">of {clientStats.total} total</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">API Requests (24h)</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{usage24h.toLocaleString()}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">avg {avgLatency}ms latency</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">API Versions</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{versionStats.ga}</p>
                <p className="text-xs text-blue-600 mt-1">{versionStats.beta} beta</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Bulk Jobs</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{bulkJobStats.completed}</p>
                <p className="text-xs text-emerald-600 mt-1">{bulkJobStats.inProgress} in progress</p>
              </div>
            </div>

            {/* API Endpoints Summary */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">API Endpoints</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                  <p className="text-xs text-[var(--text-tertiary)]">Total Endpoints</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{apiEndpoints.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                  <p className="text-xs text-[var(--text-tertiary)]">GA Versions</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1">{apiEndpoints.filter(e => !e.isDeprecated).length}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                  <p className="text-xs text-[var(--text-tertiary)]">Deprecated</p>
                  <p className="text-xl font-bold text-amber-600 mt-1">{apiEndpoints.filter(e => e.isDeprecated).length}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                  <p className="text-xs text-[var(--text-tertiary)]">Rate Limit Groups</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{rateLimitConfigs.length}</p>
                </div>
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

            {/* Recent API Activity */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent API Activity</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {apiAuditLog.slice(0, 5).map(log => (
                  <div key={log.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      log.status >= 200 && log.status < 300 ? 'bg-emerald-100 text-emerald-600' :
                      log.status >= 400 && log.status < 500 ? 'bg-amber-100 text-amber-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <Icon name={log.method === 'GET' ? 'eye' : log.method === 'POST' ? 'plus' : 'edit'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{log.clientName}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">
                        {log.method} {log.route} · {log.status} · {log.latencyMs}ms
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-[var(--text-tertiary)]">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{log.records} records</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && !selectedClient && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">API Clients</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{clientStats.total} clients · {clientStats.active} active · {clientStats.pending} pending approval</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + Register Client
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Client Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Owner</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scopes</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Requests (24h)</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Error Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {apiClients.map(client => (
                    <tr key={client.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedClient(client)}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{client.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{client.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{client.type.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{client.ownerName}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {client.scopes.slice(0, 2).map(scope => (
                            <span key={scope} className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">{scope}</span>
                          ))}
                          {client.scopes.length > 2 && (
                            <span className="text-xs text-[var(--text-tertiary)]">+{client.scopes.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={client.status.replace('_', ' ')}
                          variant={
                            client.status === 'active' ? 'success' :
                            client.status === 'security_review' || client.status === 'requested' ? 'warning' :
                            client.status === 'suspended' || client.status === 'revoked' ? 'error' :
                            'neutral'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{client.requestCount24h.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs">
                        <span className={client.errorRate24h > 0.05 ? 'text-red-600 font-bold' : 'text-[var(--text-secondary)]'}>
                          {(client.errorRate24h * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {client.lastUsedAt ? new Date(client.lastUsedAt).toLocaleString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CLIENT DETAIL */}
        {activeTab === 'clients' && selectedClient && (
          <div className="space-y-6">
            <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to API clients
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedClient.id}</span>
                    <StatusChip
                      status={selectedClient.status.replace('_', ' ')}
                      variant={
                        selectedClient.status === 'active' ? 'success' :
                        selectedClient.status === 'security_review' || selectedClient.status === 'requested' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedClient.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Owner: {selectedClient.ownerName}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Rotate Credentials
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedClient.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Created</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Requests (24h)</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedClient.requestCount24h.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Error Rate</p>
                  <p className={`text-sm font-medium mt-1 ${selectedClient.errorRate24h > 0.05 ? 'text-red-600' : 'text-[var(--text-primary)]'}`}>
                    {(selectedClient.errorRate24h * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Scopes</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.scopes.map(scope => (
                    <span key={scope} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-mono">{scope}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Company Scope</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.companyScope.map(company => (
                    <span key={company} className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-mono">{company}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">IP Allowlist</h3>
                {selectedClient.ipAllowlist.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.ipAllowlist.map(ip => (
                      <span key={ip} className="text-xs px-2 py-1 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] font-mono">{ip}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-tertiary)] italic">No IP restrictions</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Credentials</h3>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-mono text-amber-700">vault://api/{selectedClient.id}-secret</p>
                  <p className="text-xs text-amber-600 mt-1">Stored securely in vault · Never displayed after creation</p>
                </div>
              </div>

              {selectedClient.expiresAt && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <p className="text-xs text-[var(--text-tertiary)]">Expires: {new Date(selectedClient.expiresAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VERSIONS TAB */}
        {activeTab === 'versions' && !selectedVersion && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">API Versions</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{versionStats.total} versions · {versionStats.ga} GA · {versionStats.beta} beta · {versionStats.deprecated} deprecated</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">API</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Released</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Sunset</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Changelog</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {apiVersions.map(version => (
                    <tr key={version.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedVersion(version)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{version.api}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-[var(--brand-primary)]">{version.version}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={version.status.toUpperCase()}
                          variant={
                            version.status === 'ga' ? 'success' :
                            version.status === 'beta' ? 'info' :
                            version.status === 'deprecated' ? 'warning' :
                            'neutral'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(version.releasedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {version.sunsetAt ? new Date(version.sunsetAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{version.changelog}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VERSION DETAIL */}
        {activeTab === 'versions' && selectedVersion && (
          <div className="space-y-6">
            <button onClick={() => setSelectedVersion(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to API versions
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedVersion.api}</span>
                    <span className="text-lg font-bold text-[var(--brand-primary)]">{selectedVersion.version}</span>
                    <StatusChip
                      status={selectedVersion.status.toUpperCase()}
                      variant={
                        selectedVersion.status === 'ga' ? 'success' :
                        selectedVersion.status === 'beta' ? 'info' :
                        'warning'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">API Version Details</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Released</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedVersion.releasedAt).toLocaleDateString()}</p>
                </div>
                {selectedVersion.sunsetAt && (
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Sunset Date</p>
                    <p className="text-sm font-medium text-amber-600 mt-1">{new Date(selectedVersion.sunsetAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Changelog</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedVersion.changelog}</p>
              </div>

              {selectedVersion.breakingChanges.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Breaking Changes</h3>
                  <div className="space-y-2">
                    {selectedVersion.breakingChanges.map((change, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-xs text-red-700">{change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVersion.deprecatedFeatures.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Deprecated Features</h3>
                  <div className="space-y-2">
                    {selectedVersion.deprecatedFeatures.map((feature, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-xs text-amber-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">API Audit Log</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{apiAuditLog.length} API calls logged · Complete audit trail</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Method</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Route</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Latency</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Records</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {apiAuditLog.map(log => (
                    <tr key={log.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-primary)]">{log.clientName}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                          log.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                          log.method === 'POST' ? 'bg-emerald-100 text-emerald-700' :
                          log.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>{log.method}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)] max-w-xs truncate">{log.route}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold ${
                          log.status >= 200 && log.status < 300 ? 'text-emerald-600' :
                          log.status >= 400 && log.status < 500 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>{log.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{log.latencyMs}ms</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{log.records}</td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--text-tertiary)]">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BULK JOBS TAB */}
        {activeTab === 'bulk' && !selectedJob && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Bulk Jobs</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{bulkJobStats.total} jobs · {bulkJobStats.completed} completed · {bulkJobStats.inProgress} in progress</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Bulk Job
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Job ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Client</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Template</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Progress</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Success</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {bulkJobs.map(job => (
                    <tr key={job.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedJob(job)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{job.id}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{job.clientName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{job.type}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{job.templateCode}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={job.status}
                          variant={
                            job.status === 'completed' ? 'success' :
                            job.status === 'failed' ? 'error' :
                            job.status === 'importing' || job.status === 'validating' || job.status === 'preview' ? 'info' :
                            'neutral'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">
                        {job.processedRecords}/{job.totalRecords}
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-emerald-600">{job.successRecords}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs">
                        <span className={job.errorRecords > 0 ? 'text-red-600 font-bold' : 'text-[var(--text-secondary)]'}>
                          {job.errorRecords}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BULK JOB DETAIL */}
        {activeTab === 'bulk' && selectedJob && (
          <div className="space-y-6">
            <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to bulk jobs
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedJob.id}</span>
                    <StatusChip
                      status={selectedJob.status}
                      variant={
                        selectedJob.status === 'completed' ? 'success' :
                        selectedJob.status === 'failed' ? 'error' :
                        'info'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Bulk Job Detail</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedJob.clientName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedJob.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Template</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 font-mono">{selectedJob.templateCode}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Started</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedJob.startedAt).toLocaleString()}</p>
                </div>
                {selectedJob.completedAt && (
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Completed</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedJob.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">Processed</span>
                    <span className="font-medium text-[var(--text-primary)]">{selectedJob.processedRecords} / {selectedJob.totalRecords}</span>
                  </div>
                  <div className="h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand-primary)] rounded-full transition-all"
                      style={{ width: `${(selectedJob.processedRecords / selectedJob.totalRecords) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-xs text-emerald-700">Success</p>
                      <p className="text-lg font-bold text-emerald-900">{selectedJob.successRecords}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-xs text-red-700">Errors</p>
                      <p className="text-lg font-bold text-red-900">{selectedJob.errorRecords}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedJob.error && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Error</h3>
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-700">{selectedJob.error}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)] flex gap-2">
                {selectedJob.reportFileId && (
                  <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download size={14} /> Download Report
                  </button>
                )}
                {selectedJob.status === 'failed' && (
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                    <RefreshCw size={14} /> Retry Job
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RATE LIMITS TAB */}
        {activeTab === 'ratelimits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Rate Limit Configuration</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{rateLimitConfigs.length} rate limit rules configured</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Rule
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Route Group</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Requests/Min</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Burst Limit</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {rateLimitConfigs.map(config => {
                    const client = apiClients.find(c => c.id === config.clientId);
                    return (
                      <tr key={config.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-xs text-[var(--text-primary)]">
                          {client ? client.name : 'Global Default'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{config.routeGroup}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-tabular text-sm text-[var(--text-primary)]">{config.requestsPerMinute}</td>
                        <td className="px-4 py-3 text-right font-tabular text-sm text-[var(--text-primary)]">{config.burstLimit}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip status={config.isActive ? 'Active' : 'Inactive'} variant={config.isActive ? 'success' : 'neutral'} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
