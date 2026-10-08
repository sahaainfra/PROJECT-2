// Part 07 — Audit, Security & Governance Foundation
// Comprehensive audit and security console

import React, { useState } from 'react';
import { 
  FileText, Clock, Monitor, Shield, CheckCircle, LayoutDashboard,
  Plus, Edit, Trash, Check, X, Lock
} from 'lucide-react';
import { 
  auditLog, loginHistory, activeSessions, securityEvents, 
  reasonCodes, verificationHistory, protocolControlPoints,
  getAuditLogByEntity, getAuditLogByUser, getActiveSessionsByUser,
  getSecurityEventsByStatus, verifyHashChain,
  type AuditLogEntry, type ActiveSession, type SecurityEvent
} from '../data/audit_sec';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'layout-dashboard': LayoutDashboard,
    'file-text': FileText,
    'clock': Clock,
    'monitor': Monitor,
    'shield': Shield,
    'check-circle': CheckCircle,
    'plus': Plus,
    'edit': Edit,
    'trash': Trash,
    'check': Check,
    'x': X,
    'lock': Lock,
  };
  const IconComponent = icons[name] || FileText;
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

export function AuditSecModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'timeline' | 'sessions' | 'security' | 'verification'>('overview');
  const [selectedRecord, setSelectedRecord] = useState<{ entityType: string; entityId: string } | null>(null);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [auditFilter, setAuditFilter] = useState({ entityType: '', userId: '', action: '', startDate: '', endDate: '' });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { id: 'audit', label: 'Audit Log', icon: 'file-text' },
    { id: 'timeline', label: 'Record Timeline', icon: 'clock' },
    { id: 'sessions', label: 'Sessions', icon: 'monitor' },
    { id: 'security', label: 'Security Events', icon: 'shield' },
    { id: 'verification', label: 'Hash Verification', icon: 'check-circle' },
  ];

  const filteredAuditLog = auditLog.filter(entry => {
    if (auditFilter.entityType && entry.entityType !== auditFilter.entityType) return false;
    if (auditFilter.userId && entry.userId !== auditFilter.userId) return false;
    if (auditFilter.action && entry.action !== auditFilter.action) return false;
    if (auditFilter.startDate && new Date(entry.timestamp) < new Date(auditFilter.startDate)) return false;
    if (auditFilter.endDate && new Date(entry.timestamp) > new Date(auditFilter.endDate)) return false;
    return true;
  });

  const recordAuditLog = selectedRecord ? getAuditLogByEntity(selectedRecord.entityType, selectedRecord.entityId) : [];
  const hashVerification = verifyHashChain();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Administration</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Audit & Security · ff.audit_sec</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit & Security Dashboard</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Tamper-evident audit trail with hash chaining · Session management · Security event monitoring</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Audit Entries</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{auditLog.length}</p>
                <p className="text-xs text-emerald-600 mt-1">Last 24h: {auditLog.filter(e => new Date(e.timestamp) > new Date(Date.now() - 86400000)).length}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Active Sessions</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{activeSessions.filter(s => s.isActive).length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{activeSessions.filter(s => !s.isActive).length} revoked</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Security Events</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{securityEvents.length}</p>
                <p className="text-xs text-red-600 mt-1">{securityEvents.filter(e => e.status === 'OPEN').length} open</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Hash Chain</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{hashVerification.valid ? '✓' : '✗'}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{hashVerification.brokenCount} broken</p>
              </div>
            </div>

            {/* Recent Audit Activity */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent Audit Activity</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {auditLog.slice(-5).reverse().map(entry => (
                  <div key={entry.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      entry.action === 'create' ? 'bg-emerald-100 text-emerald-600' :
                      entry.action === 'update' ? 'bg-blue-100 text-blue-600' :
                      entry.action === 'delete' ? 'bg-red-100 text-red-600' :
                      entry.action === 'approve' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name={
                        entry.action === 'create' ? 'plus' :
                        entry.action === 'update' ? 'edit' :
                        entry.action === 'delete' ? 'trash' :
                        entry.action === 'approve' ? 'check' : 'file-text'
                      } size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{entry.userName}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">
                        {entry.action} {entry.entityType} {entry.entityName && `(${entry.entityName})`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-[var(--text-tertiary)]">{new Date(entry.timestamp).toLocaleString()}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{entry.ipAddress}</p>
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

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Log Explorer</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Tamper-evident audit trail · Hash-chained entries · Append-only</p>
            </div>

            {/* Filters */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Entity Type</label>
                  <select
                    value={auditFilter.entityType}
                    onChange={e => setAuditFilter({ ...auditFilter, entityType: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="">All</option>
                    <option value="Project">Project</option>
                    <option value="PurchaseOrder">Purchase Order</option>
                    <option value="GRN">GRN</option>
                    <option value="Employee">Employee</option>
                    <option value="Role">Role</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">User</label>
                  <select
                    value={auditFilter.userId}
                    onChange={e => setAuditFilter({ ...auditFilter, userId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="">All Users</option>
                    <option value="user-001">Rajesh Kumar</option>
                    <option value="user-002">Priya Sharma</option>
                    <option value="user-010">Rajesh Kumar (PM)</option>
                    <option value="user-015">Ravi Sharma</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Action</label>
                  <select
                    value={auditFilter.action}
                    onChange={e => setAuditFilter({ ...auditFilter, action: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="">All Actions</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="approve">Approve</option>
                    <option value="view_sensitive">View Sensitive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={auditFilter.startDate}
                    onChange={e => setAuditFilter({ ...auditFilter, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={auditFilter.endDate}
                    onChange={e => setAuditFilter({ ...auditFilter, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Timestamp</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Action</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Entity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">IP Address</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {filteredAuditLog.map(entry => (
                      <tr key={entry.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(entry.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-[var(--text-primary)]">{entry.userName}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{entry.userRole}</p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusChip 
                            status={entry.action} 
                            variant={
                              entry.action === 'create' ? 'success' :
                              entry.action === 'update' ? 'info' :
                              entry.action === 'delete' ? 'error' :
                              entry.action === 'approve' ? 'success' :
                              'neutral'
                            } 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-[var(--text-primary)]">{entry.entityType}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{entry.entityName || entry.entityId}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">
                          {entry.reason || '—'}
                          {entry.reasonCode && <span className="ml-1 text-[var(--brand-primary)]">({entry.reasonCode})</span>}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-[var(--text-tertiary)]">{entry.ipAddress}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-mono text-[var(--text-tertiary)]">{entry.hash.substring(0, 8)}...</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RECORD TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Record Timeline</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">View complete audit trail for any record · Side-by-side comparison</p>
            </div>

            {/* Record Selector */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Entity Type</label>
                  <select
                    value={selectedRecord?.entityType || ''}
                    onChange={e => setSelectedRecord({ entityType: e.target.value, entityId: '' })}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="">Select entity type...</option>
                    <option value="Project">Project</option>
                    <option value="PurchaseOrder">Purchase Order</option>
                    <option value="GRN">GRN</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Entity ID</label>
                  <select
                    value={selectedRecord?.entityId || ''}
                    onChange={e => setSelectedRecord(selectedRecord ? { ...selectedRecord, entityId: e.target.value } : null)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                    disabled={!selectedRecord?.entityType}
                  >
                    <option value="">Select entity...</option>
                    {selectedRecord?.entityType === 'Project' && <option value="prj-001">Metro Tower Phase II</option>}
                    {selectedRecord?.entityType === 'PurchaseOrder' && <option value="po-001">PO-2024-0892</option>}
                    {selectedRecord?.entityType === 'GRN' && <option value="grn-001">GRN-2024-1205</option>}
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {selectedRecord && recordAuditLog.length > 0 && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">
                  Audit Trail for {recordAuditLog[0].entityType} - {recordAuditLog[0].entityName}
                </h3>
                <div className="space-y-4">
                  {recordAuditLog.map((entry, idx) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          entry.action === 'create' ? 'bg-emerald-100 text-emerald-600' :
                          entry.action === 'update' ? 'bg-blue-100 text-blue-600' :
                          entry.action === 'approve' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon name={
                            entry.action === 'create' ? 'plus' :
                            entry.action === 'update' ? 'edit' :
                            entry.action === 'approve' ? 'check' : 'file-text'
                          } size={20} />
                        </div>
                        {idx < recordAuditLog.length - 1 && (
                          <div className="w-0.5 flex-1 bg-[var(--border)] mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{entry.userName}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">{entry.userRole} · {new Date(entry.timestamp).toLocaleString()}</p>
                          </div>
                          <StatusChip 
                            status={entry.action} 
                            variant={
                              entry.action === 'create' ? 'success' :
                              entry.action === 'update' ? 'info' :
                              entry.action === 'approve' ? 'success' :
                              'neutral'
                            } 
                          />
                        </div>
                        {entry.reason && (
                          <p className="text-sm text-[var(--text-secondary)] mb-2">Reason: {entry.reason}</p>
                        )}
                        {entry.changedFields && entry.changedFields.length > 0 && (
                          <div className="mt-2 p-3 rounded-lg bg-[var(--surface-hover)]">
                            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Changed Fields:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.changedFields.map(field => (
                                <span key={field} className="text-xs px-2 py-1 rounded bg-[var(--surface)] text-[var(--text-secondary)]">
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-[var(--text-tertiary)] mt-2 font-mono">Hash: {entry.hash}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord && recordAuditLog.length === 0 && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
                <p className="text-sm text-[var(--text-secondary)]">No audit entries found for this record</p>
              </div>
            )}
          </div>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Session Management</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Active sessions · Device tracking · Revoke capability</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Device</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Browser / OS</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">IP Address</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Location</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Seen</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {activeSessions.map(session => (
                    <tr key={session.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--text-primary)]">{session.userName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--text-primary)]">{session.deviceName}</p>
                        <p className="text-xs text-[var(--text-tertiary)] capitalize">{session.deviceType}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                        {session.browser}<br />{session.os}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--text-tertiary)]">{session.ipAddress}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{session.location || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(session.lastSeenAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={session.isActive ? 'Active' : 'Revoked'} variant={session.isActive ? 'success' : 'neutral'} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {session.isActive ? (
                          <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Revoke
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--text-tertiary)]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Login History */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent Login History</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {loginHistory.slice(-10).reverse().map(login => (
                  <div key={login.id} className="px-4 py-3 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      login.result === 'success' ? 'bg-emerald-100 text-emerald-600' :
                      login.result === 'fail' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <Icon name={login.result === 'success' ? 'check' : login.result === 'fail' ? 'x' : 'lock'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{login.userName}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {login.deviceName} · {login.method} · {login.geoHint || 'Unknown location'}
                      </p>
                      {login.failureReason && (
                        <p className="text-xs text-red-600 mt-1">{login.failureReason}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-[var(--text-tertiary)]">{new Date(login.timestamp).toLocaleString()}</p>
                      <p className="text-xs font-mono text-[var(--text-tertiary)]">{login.ipAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECURITY EVENTS TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Security Events Console</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Security event detection · Brute force · Privileged changes · Bulk exports</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {securityEvents.map(event => (
                    <tr key={event.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(event.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                          {event.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--text-primary)]">{event.title}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{event.description}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                        {event.userName || 'System'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={event.severity} 
                          variant={
                            event.severity === 'critical' ? 'error' :
                            event.severity === 'high' ? 'error' :
                            event.severity === 'medium' ? 'warning' :
                            'info'
                          } 
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={event.status} 
                          variant={
                            event.status === 'OPEN' ? 'error' :
                            event.status === 'ACKNOWLEDGED' ? 'warning' :
                            event.status === 'RESOLVED' ? 'success' :
                            'neutral'
                          } 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HASH VERIFICATION TAB */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Hash Chain Verification</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Tamper-evident audit trail · Nightly verification · Integrity monitoring</p>
            </div>

            {/* Current Status */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Current Chain Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Total Records</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{auditLog.length}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Verified</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{auditLog.length}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Broken</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{hashVerification.brokenCount}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Status</p>
                  <p className={`text-2xl font-bold mt-1 ${hashVerification.valid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {hashVerification.valid ? '✓ Valid' : '✗ Invalid'}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification History */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Verification History</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Run Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Range</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Total</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Verified</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Broken</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Run By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {verificationHistory.map(verify => (
                    <tr key={verify.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(verify.runAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)]">
                        {verify.startId} → {verify.endId}
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{verify.totalRecords}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-emerald-600">{verify.verifiedCount}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{verify.brokenCount}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={verify.status} 
                          variant={verify.status === 'success' ? 'success' : verify.status === 'partial' ? 'warning' : 'error'} 
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{verify.runBy}</td>
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
