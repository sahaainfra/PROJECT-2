import React, { useState } from 'react';
import {
  connectors, endpoints, messages, webhooks, apiClients, deadLetters,
  protocolControlPoints, getConnectorStats, getMessageStats, getThroughputByType,
  type Connector, type IntegrationMessage, type Webhook as WebhookType, type ApiClient, type DeadLetter
} from '../data/intg';

import {
  Plug, Mail, MessageSquare, Smartphone, CreditCard, FileText, MapPin, Scan,
  BarChart3, Bell, Database, Globe, CheckCircle, XCircle, AlertCircle,
  Clock, RefreshCw, Shield, Key, Webhook, Activity, TrendingUp, TrendingDown, Minus
} from 'lucide-react';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'plug': Plug, 'mail': Mail, 'message-square': MessageSquare, 'smartphone': Smartphone,
    'credit-card': CreditCard, 'file-text': FileText, 'map': MapPin, 'scan': Scan,
    'bar-chart': BarChart3, 'bell': Bell, 'database': Database, 'globe': Globe,
    'check-circle': CheckCircle, 'x-circle': XCircle, 'alert-circle': AlertCircle,
    'clock': Clock, 'refresh-cw': RefreshCw, 'shield': Shield, 'key': Key,
    'webhook': Webhook, 'activity': Activity, 'trending-up': TrendingUp,
    'trending-down': TrendingDown, 'minus': Minus,
  };
  const IconComponent = icons[name] || Plug;
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

export function IntgModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'connectors' | 'messages' | 'dlq' | 'api-clients' | 'webhooks'>('overview');
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<IntegrationMessage | null>(null);
  const [selectedDLQ, setSelectedDLQ] = useState<DeadLetter | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'activity' },
    { id: 'connectors', label: 'Connectors', icon: 'plug' },
    { id: 'messages', label: 'Message Log', icon: 'file-text' },
    { id: 'dlq', label: 'Dead Letter Queue', icon: 'alert-circle' },
    { id: 'api-clients', label: 'API Clients', icon: 'key' },
    { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
  ];

  const connectorStats = getConnectorStats();
  const messageStats = getMessageStats();
  const throughputByType = getThroughputByType();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Administration</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Integrations · ff.intg</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Integration Hub</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{connectorStats.total} connectors · {messageStats.total} messages · {deadLetters.length} in DLQ</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Active Connectors</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{connectorStats.active}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">of {connectorStats.total} total</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Healthy</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{connectorStats.healthy}</p>
                <p className="text-xs text-amber-600 mt-1">{connectorStats.degraded} degraded</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Messages (24h)</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{messageStats.total}</p>
                <p className="text-xs text-emerald-600 mt-1">{messageStats.delivered} delivered</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Dead Letters</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{deadLetters.length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">pending replay</p>
              </div>
            </div>

            {/* Connector Health Grid */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Connector Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {connectors.map(connector => (
                  <div key={connector.id} className={`p-3 rounded-lg border ${
                    connector.health === 'healthy' ? 'bg-emerald-50 border-emerald-200' :
                    connector.health === 'degraded' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">{connector.name}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        connector.health === 'healthy' ? 'bg-emerald-500' :
                        connector.health === 'degraded' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-[var(--text-tertiary)]">Throughput</p>
                        <p className="font-medium text-[var(--text-primary)]">{connector.throughputLast24h}/24h</p>
                      </div>
                      <div>
                        <p className="text-[var(--text-tertiary)]">Failure Rate</p>
                        <p className={`font-medium ${connector.failureRateLast24h > 0.05 ? 'text-red-600' : 'text-[var(--text-primary)]'}`}>
                          {(connector.failureRateLast24h * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Throughput by Type */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Throughput by Type (24h)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(throughputByType).map(([type, count]) => (
                  <div key={type} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                    <p className="text-xs text-[var(--text-tertiary)] capitalize">{type}</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{count}</p>
                  </div>
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
          </div>
        )}

        {/* CONNECTORS TAB */}
        {activeTab === 'connectors' && !selectedConnector && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Integration Connectors</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{connectors.length} connectors configured</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Connector
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Provider</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Health</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Throughput</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Failure Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {connectors.map(connector => (
                    <tr key={connector.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedConnector(connector)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{connector.code}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{connector.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{connector.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{connector.type}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{connector.provider}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={connector.status}
                          variant={
                            connector.status === 'active' ? 'success' :
                            connector.status === 'error' ? 'error' :
                            connector.status === 'testing' ? 'info' :
                            'neutral'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={connector.health}
                          variant={
                            connector.health === 'healthy' ? 'success' :
                            connector.health === 'degraded' ? 'warning' :
                            connector.health === 'unhealthy' ? 'error' :
                            'neutral'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{connector.throughputLast24h}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs">
                        <span className={connector.failureRateLast24h > 0.05 ? 'text-red-600 font-bold' : 'text-[var(--text-secondary)]'}>
                          {(connector.failureRateLast24h * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONNECTOR DETAIL */}
        {activeTab === 'connectors' && selectedConnector && (
          <div className="space-y-6">
            <button onClick={() => setSelectedConnector(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to connectors
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedConnector.code}</span>
                    <StatusChip
                      status={selectedConnector.status}
                      variant={
                        selectedConnector.status === 'active' ? 'success' :
                        selectedConnector.status === 'error' ? 'error' :
                        'info'
                      }
                    />
                    <StatusChip
                      status={selectedConnector.health}
                      variant={
                        selectedConnector.health === 'healthy' ? 'success' :
                        selectedConnector.health === 'degraded' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedConnector.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedConnector.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Test Connection
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedConnector.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Provider</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedConnector.provider}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Throughput (24h)</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedConnector.throughputLast24h}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Failure Rate</p>
                  <p className={`text-sm font-medium mt-1 ${selectedConnector.failureRateLast24h > 0.05 ? 'text-red-600' : 'text-[var(--text-primary)]'}`}>
                    {(selectedConnector.failureRateLast24h * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Configuration</h3>
                <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedConnector.configJson, null, 2)}
                </pre>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Credentials</h3>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-mono text-amber-700">{selectedConnector.secretRef}</p>
                  <p className="text-xs text-amber-600 mt-1">Stored securely in vault · Never displayed after save</p>
                </div>
              </div>

              {selectedConnector.errorMessage && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Last Error</h3>
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-700">{selectedConnector.errorMessage}</p>
                    <p className="text-xs text-red-600 mt-1">At: {new Date(selectedConnector.lastErrorAt!).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Last Checked</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                      {selectedConnector.lastCheckedAt ? new Date(selectedConnector.lastCheckedAt).toLocaleString() : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Last Success</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                      {selectedConnector.lastSuccessAt ? new Date(selectedConnector.lastSuccessAt).toLocaleString() : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && !selectedMessage && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Message Log</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{messageStats.total} messages · {messageStats.delivered} delivered · {messageStats.failed} failed</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{messageStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Delivered</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{messageStats.delivered}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{messageStats.failed}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{messageStats.pending}</p>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Connector</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Direction</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Entity</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Attempts</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Created</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{msg.connectorCode}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{msg.direction}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                        {msg.entityType} #{msg.entityId}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={msg.status}
                          variant={
                            msg.status === 'delivered' ? 'success' :
                            msg.status === 'failed' ? 'error' :
                            msg.status === 'retrying' ? 'warning' :
                            'info'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{msg.attempts}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(msg.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-red-600 max-w-xs truncate">{msg.error || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MESSAGE DETAIL */}
        {activeTab === 'messages' && selectedMessage && (
          <div className="space-y-6">
            <button onClick={() => setSelectedMessage(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to message log
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedMessage.connectorCode}</span>
                    <StatusChip
                      status={selectedMessage.status}
                      variant={
                        selectedMessage.status === 'delivered' ? 'success' :
                        selectedMessage.status === 'failed' ? 'error' :
                        'info'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Message Detail</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Direction</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedMessage.direction}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Correlation ID</p>
                  <p className="text-xs font-mono text-[var(--text-primary)] mt-1">{selectedMessage.correlationId}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Entity</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedMessage.entityType} #{selectedMessage.entityId}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Attempts</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedMessage.attempts}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Request (Redacted)</h3>
                <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedMessage.requestRedacted, null, 2)}
                </pre>
              </div>

              {selectedMessage.responseRedacted && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Response (Redacted)</h3>
                  <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedMessage.responseRedacted, null, 2)}
                  </pre>
                </div>
              )}

              {selectedMessage.error && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Error</h3>
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-700">{selectedMessage.error}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Created</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedMessage.sentAt && (
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Sent</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedMessage.sentAt).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedMessage.deliveredAt && (
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Delivered</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedMessage.deliveredAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DLQ TAB */}
        {activeTab === 'dlq' && !selectedDLQ && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dead Letter Queue</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{deadLetters.length} messages pending replay</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Message ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Connector</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Attempts</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Created</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {deadLetters.map(dl => (
                    <tr key={dl.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{dl.messageId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{dl.connectorCode}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{dl.reason}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-red-600 font-bold">{dl.attempts}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(dl.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedDLQ(dl)}
                          className="px-3 py-1 text-xs bg-[var(--brand-primary)] text-white rounded hover:bg-[var(--brand-primary-hover)]"
                        >
                          Replay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DLQ DETAIL */}
        {activeTab === 'dlq' && selectedDLQ && (
          <div className="space-y-6">
            <button onClick={() => setSelectedDLQ(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to DLQ
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Dead Letter Detail</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Message ID: {selectedDLQ.messageId}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Dry Run
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Replay Now
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Connector</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDLQ.connectorCode}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Attempts</p>
                  <p className="text-sm font-medium text-red-600 mt-1">{selectedDLQ.attempts}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Reason</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedDLQ.reason}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Last Error</h3>
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700">{selectedDLQ.lastError}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Payload (Redacted)</h3>
                <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedDLQ.payloadRedacted, null, 2)}
                </pre>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <p className="text-xs text-[var(--text-tertiary)]">Created: {new Date(selectedDLQ.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* API CLIENTS TAB */}
        {activeTab === 'api-clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">API Clients</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{apiClients.length} clients configured</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Client
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Client ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scopes</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">IP Allowlist</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Rate Limit</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Expires</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {apiClients.map(client => (
                    <tr key={client.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{client.clientId}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{client.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {client.scopes.slice(0, 2).map(scope => (
                            <span key={scope} className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] font-mono">{scope}</span>
                          ))}
                          {client.scopes.length > 2 && (
                            <span className="text-xs text-[var(--text-tertiary)]">+{client.scopes.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--text-tertiary)]">
                        {client.ipAllowlist.length > 0 ? client.ipAllowlist.join(', ') : 'Any'}
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">
                        {client.rateLimit}/{client.rateLimitWindow}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {client.expiresAt ? new Date(client.expiresAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={client.isActive ? 'Active' : 'Inactive'} variant={client.isActive ? 'success' : 'neutral'} />
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

        {/* WEBHOOKS TAB */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Webhooks</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{webhooks.length} webhooks configured</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Webhook
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Event</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Target URL</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Failures</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Triggered</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Success</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {webhooks.map(webhook => (
                    <tr key={webhook.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{webhook.eventName}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] max-w-xs truncate">{webhook.targetUrl}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={webhook.isActive ? 'Active' : 'Inactive'} variant={webhook.isActive ? 'success' : 'neutral'} />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs">
                        <span className={webhook.failureCount > 0 ? 'text-red-600 font-bold' : 'text-[var(--text-secondary)]'}>
                          {webhook.failureCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {webhook.lastTriggeredAt ? new Date(webhook.lastTriggeredAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {webhook.lastSuccessAt ? new Date(webhook.lastSuccessAt).toLocaleString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
