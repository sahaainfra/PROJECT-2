import React, { useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, BarChart3, CheckCircle, Clock, Database,
  FileText, Gauge, GitBranch, HardDrive, LineChart, Monitor, Server, Zap, XCircle,
  Radio, RefreshCw, Play, Pause, Eye, Shield, Key, Link, Code, X
} from 'lucide-react';
import {
  eventCatalogue, schemaVersions, subscriptions, deliveries, deadLetters,
  integrationMetrics, protocolControlPoints, getEventStats, getSubscriptionStats,
  getDLQStats, getOverallIntegrationHealth,
  type EventDefinition, type SchemaVersion, type Subscription, type DeadLetter
} from '../data/evbus';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'activity': Activity, 'alert-circle': AlertCircle, 'alert-triangle': AlertTriangle,
    'bar-chart': BarChart3, 'check-circle': CheckCircle, 'clock': Clock, 'database': Database,
    'file-text': FileText, 'gauge': Gauge, 'git-branch': GitBranch, 'hard-drive': HardDrive,
    'line-chart': LineChart, 'monitor': Monitor, 'server': Server, 'zap': Zap, 'x-circle': XCircle,
    'radio': Radio, 'refresh-cw': RefreshCw, 'play': Play, 'pause': Pause,
    'eye': Eye, 'shield': Shield, 'key': Key, 'link': Link, 'code': Code,
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

export function EvBusModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalogue' | 'schemas' | 'subscriptions' | 'dlq' | 'deliveries'>('overview');
  const [selectedEvent, setSelectedEvent] = useState<EventDefinition | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<SchemaVersion | null>(null);
  const [selectedDLQ, setSelectedDLQ] = useState<DeadLetter | null>(null);

  const tabs = [
    { id: 'overview', label: 'Integration Monitor', icon: 'activity' },
    { id: 'catalogue', label: 'Event Catalogue', icon: 'file-text' },
    { id: 'schemas', label: 'Schema Registry', icon: 'code' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'radio' },
    { id: 'dlq', label: 'Dead Letter Queue', icon: 'alert-triangle' },
    { id: 'deliveries', label: 'Delivery Log', icon: 'zap' },
  ];

  const eventStats = getEventStats();
  const subscriptionStats = getSubscriptionStats();
  const dlqStats = getDLQStats();
  const overallHealth = getOverallIntegrationHealth();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Technical Console</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Event Bus · ff.evbus</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event Bus & Integration Platform</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Real-time event backbone · Schema registry · Consumer monitoring · Dead letter management</p>
            </div>

            {/* Overall Health Status */}
            <div className={`bg-[var(--card-bg)] rounded-xl border-2 p-6 ${
              overallHealth === 'healthy' ? 'border-emerald-300' :
              overallHealth === 'degraded' ? 'border-amber-300' :
              'border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Overall Integration Health</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {integrationMetrics.length} integrations · {subscriptionStats.active} active subscriptions
                  </p>
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
                <p className="text-xs text-[var(--text-tertiary)]">Event Types</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{eventStats.total}</p>
                <p className="text-xs text-emerald-600 mt-1">{eventStats.active} active</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Subscriptions</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{subscriptionStats.total}</p>
                <p className="text-xs text-amber-600 mt-1">{subscriptionStats.suspended} suspended</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">DLQ Messages</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{dlqStats.total}</p>
                <p className="text-xs text-red-600 mt-1">{dlqStats.pending} pending</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">24h Events</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {integrationMetrics.reduce((sum, m) => sum + m.totalEvents24h, 0).toLocaleString()}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">processed</p>
              </div>
            </div>

            {/* Integration Health Grid */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Integration Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {integrationMetrics.map(metric => (
                  <div key={metric.subscriptionId} className={`p-4 rounded-lg border ${
                    metric.status === 'healthy' ? 'bg-emerald-50 border-emerald-200' :
                    metric.status === 'degraded' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">{metric.subscriptionName}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        metric.status === 'healthy' ? 'bg-emerald-500' :
                        metric.status === 'degraded' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-[var(--text-tertiary)]">Events/24h</p>
                        <p className="font-medium text-[var(--text-primary)]">{metric.totalEvents24h}</p>
                      </div>
                      <div>
                        <p className="text-[var(--text-tertiary)]">Success Rate</p>
                        <p className="font-medium text-[var(--text-primary)]">{metric.successRate24h}%</p>
                      </div>
                      <div>
                        <p className="text-[var(--text-tertiary)]">Lag</p>
                        <p className="font-medium text-[var(--text-primary)]">{metric.lagSeconds}s</p>
                      </div>
                    </div>
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

        {/* CATALOGUE TAB */}
        {activeTab === 'catalogue' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event Catalogue</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{eventCatalogue.length} registered event types · Versioned schemas · Subscriber tracking</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Event Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Module</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Aggregate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Subscribers</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Avg/Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {eventCatalogue.map(event => (
                    <tr key={event.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedEvent(event)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{event.eventType}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] uppercase">{event.module}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{event.aggregate}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)] max-w-xs truncate">{event.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-mono font-medium text-[var(--text-primary)]">v{event.currentVersion}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{event.subscriberCount}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{event.avgDailyVolume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
                <div className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-mono text-[var(--brand-primary)]">{selectedEvent.eventType}</p>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-1">{selectedEvent.description}</h3>
                      </div>
                      <button onClick={() => setSelectedEvent(null)} className="p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Module</p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mt-1 uppercase">{selectedEvent.module}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Aggregate</p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedEvent.aggregate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Current Version</p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mt-1">v{selectedEvent.currentVersion}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Published</p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedEvent.publishedAt}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">Payload Schema</p>
                      <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(selectedEvent.payloadSchema, null, 2)}
                      </pre>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Subscribers</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{selectedEvent.subscriberCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Avg Daily Volume</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{selectedEvent.avgDailyVolume}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCHEMAS TAB */}
        {activeTab === 'schemas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Schema Registry</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{schemaVersions.length} schema versions · Compatibility tracking · Version lifecycle</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + Register Schema
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Event Type</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Changelog</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Published</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Sunset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {schemaVersions.map(schema => (
                    <tr key={schema.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedSchema(schema)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{schema.eventType}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">v{schema.version}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={schema.status} 
                          variant={
                            schema.status === 'published' ? 'success' :
                            schema.status === 'deprecated' ? 'warning' :
                            schema.status === 'retired' ? 'error' :
                            'neutral'
                          } 
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{schema.changelog}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{schema.publishedAt || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{schema.sunsetAt || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Schema Detail Modal */}
            {selectedSchema && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSchema(null)}>
                <div className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-mono text-[var(--brand-primary)]">{selectedSchema.eventType} v{selectedSchema.version}</p>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-1">Schema Details</h3>
                      </div>
                      <button onClick={() => setSelectedSchema(null)} className="p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Status</p>
                        <StatusChip status={selectedSchema.status} variant={
                          selectedSchema.status === 'published' ? 'success' :
                          selectedSchema.status === 'deprecated' ? 'warning' :
                          'neutral'
                        } />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Published</p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedSchema.publishedAt || '—'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">Changelog</p>
                      <p className="text-sm text-[var(--text-secondary)]">{selectedSchema.changelog}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">JSON Schema</p>
                      <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto max-h-64">
                        {JSON.stringify(selectedSchema.jsonSchema, null, 2)}
                      </pre>
                    </div>
                    {selectedSchema.compatibilityReport && (
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)] mb-2">Compatibility Report</p>
                        <div className="space-y-2">
                          {selectedSchema.compatibilityReport.breaking.length > 0 && (
                            <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                              <p className="text-xs font-medium text-red-700">Breaking Changes:</p>
                              <ul className="text-xs text-red-600 mt-1 list-disc list-inside">
                                {selectedSchema.compatibilityReport.breaking.map((b, i) => <li key={i}>{b}</li>)}
                              </ul>
                            </div>
                          )}
                          {selectedSchema.compatibilityReport.additive.length > 0 && (
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                              <p className="text-xs font-medium text-emerald-700">Additive Changes:</p>
                              <ul className="text-xs text-emerald-600 mt-1 list-disc list-inside">
                                {selectedSchema.compatibilityReport.additive.map((a, i) => <li key={i}>{a}</li>)}
                              </ul>
                            </div>
                          )}
                          {selectedSchema.compatibilityReport.deprecated.length > 0 && (
                            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                              <p className="text-xs font-medium text-amber-700">Deprecated Fields:</p>
                              <ul className="text-xs text-amber-600 mt-1 list-disc list-inside">
                                {selectedSchema.compatibilityReport.deprecated.map((d, i) => <li key={i}>{d}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Subscriptions</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{subscriptions.length} subscriptions · {subscriptions.filter(s => s.type === 'internal').length} internal · {subscriptions.filter(s => s.type === 'webhook').length} webhooks</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Subscription
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Name</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Events</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Lag (s)</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Error Rate</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Failures</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {subscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{sub.name}</p>
                        {sub.endpoint && <p className="text-xs font-mono text-[var(--text-tertiary)] mt-1 truncate">{sub.endpoint}</p>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{sub.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {sub.eventTypes.slice(0, 3).map(et => (
                            <span key={et} className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">{et}</span>
                          ))}
                          {sub.eventTypes.length > 3 && (
                            <span className="text-xs text-[var(--text-tertiary)]">+{sub.eventTypes.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={sub.status} 
                          variant={sub.status === 'active' ? 'success' : sub.status === 'suspended' ? 'warning' : 'neutral'} 
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{sub.lagSeconds}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{(sub.errorRate24h * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{sub.failureCount}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{sub.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DLQ TAB */}
        {activeTab === 'dlq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dead Letter Queue</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{deadLetters.length} failed messages · {dlqStats.pending} pending replay · {dlqStats.financial} financial events</p>
              </div>
              <button className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                Replay All Pending
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Consumer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Event Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Failures</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">First Failed</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {deadLetters.map(dl => (
                    <tr key={dl.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{dl.consumer}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{dl.eventType}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{dl.reason}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-red-600 font-bold">{dl.failureCount}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(dl.firstFailedAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={dl.status} 
                          variant={
                            dl.status === 'pending' ? 'error' :
                            dl.status === 'approved' ? 'info' :
                            dl.status === 'dry_run' ? 'warning' :
                            dl.status === 'replayed' ? 'success' :
                            'neutral'
                          } 
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {dl.status === 'pending' && (
                          <button 
                            onClick={() => setSelectedDLQ(dl)}
                            className="px-3 py-1 text-xs bg-[var(--brand-primary)] text-white rounded hover:bg-[var(--brand-primary-hover)]"
                          >
                            Replay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DLQ Replay Modal */}
            {selectedDLQ && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDLQ(null)}>
                <div className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-mono text-[var(--brand-primary)]">{selectedDLQ.eventType}</p>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-1">Replay Dead Letter</h3>
                      </div>
                      <button onClick={() => setSelectedDLQ(null)} className="p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs font-medium text-amber-700 mb-1">⚠ Financial Event Detected</p>
                      <p className="text-xs text-amber-600">This is a financial event. Replay requires approval and dry-run first.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Consumer</p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedDLQ.consumer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Failure Count</p>
                        <p className="text-sm font-medium text-red-600 mt-1">{selectedDLQ.failureCount}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">Last Error</p>
                      <p className="text-sm text-[var(--text-secondary)] bg-[var(--surface-hover)] p-2 rounded">{selectedDLQ.lastError}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">Payload</p>
                      <pre className="text-xs font-mono bg-[var(--surface-hover)] p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(selectedDLQ.payload, null, 2)}
                      </pre>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                      <button className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Dry Run First
                      </button>
                      <button className="flex-1 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                        Request Approval
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DELIVERIES TAB */}
        {activeTab === 'deliveries' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Delivery Log</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Recent event deliveries · Success/failure tracking · Latency monitoring</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Subscription</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Event Type</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Attempt</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">HTTP</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Latency</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Delivered</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {deliveries.map(delivery => (
                    <tr key={delivery.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-xs text-[var(--text-primary)]">{delivery.subscriptionName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{delivery.eventType}</td>
                      <td className="px-4 py-3 text-center font-tabular text-xs text-[var(--text-primary)]">{delivery.attempt}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={delivery.status} 
                          variant={
                            delivery.status === 'delivered' ? 'success' :
                            delivery.status === 'failed' ? 'error' :
                            delivery.status === 'retrying' ? 'warning' :
                            'neutral'
                          } 
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">
                        {delivery.httpStatus || '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">
                        {delivery.latencyMs ? `${delivery.latencyMs}ms` : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {delivery.deliveredAt ? new Date(delivery.deliveredAt).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-red-600 max-w-xs truncate">
                        {delivery.error || '—'}
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
