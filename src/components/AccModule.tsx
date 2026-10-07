import React, { useState } from 'react';
import {
  Users, UserCheck, FileText, Clock, CheckCircle, AlertCircle, TrendingUp,
  TrendingDown, Minus, Shield, Calendar, MapPin, Briefcase, X, ChevronRight
} from 'lucide-react';
import {
  raciAssignments, actionLedger, complianceScores, responsibilityItems, processCatalogue,
  protocolControlPoints, getRACIStats, getLedgerStats, getUserResponsibilities,
  getOverdueResponsibilities, getAverageScore,
  type RACIAssignment, type ActionLedgerEntry, type ComplianceScore
} from '../data/acc';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'users': Users, 'user-check': UserCheck, 'file-text': FileText, 'clock': Clock,
    'check-circle': CheckCircle, 'alert-circle': AlertCircle, 'trending-up': TrendingUp,
    'trending-down': TrendingDown, 'minus': Minus, 'shield': Shield, 'calendar': Calendar,
    'map-pin': MapPin, 'briefcase': Briefcase, 'x': X, 'chevron-right': ChevronRight,
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

export function AccModule() {
  const [activeTab, setActiveTab] = useState<'my-accountability' | 'raci' | 'ledger' | 'team' | 'scores'>('my-accountability');
  const [selectedRACI, setSelectedRACI] = useState<RACIAssignment | null>(null);
  const [selectedLedger, setSelectedLedger] = useState<ActionLedgerEntry | null>(null);
  const [selectedScore, setSelectedScore] = useState<ComplianceScore | null>(null);

  const tabs = [
    { id: 'my-accountability', label: 'My Accountability', icon: 'user-check' },
    { id: 'raci', label: 'RACI Matrix', icon: 'users' },
    { id: 'ledger', label: 'Action Ledger', icon: 'file-text' },
    { id: 'team', label: 'Team View', icon: 'briefcase' },
    { id: 'scores', label: 'Compliance Scores', icon: 'trending-up' },
  ];

  const raciStats = getRACIStats();
  const ledgerStats = getLedgerStats();
  const myResponsibilities = getUserResponsibilities('user-010'); // Simulated current user
  const overdueItems = getOverdueResponsibilities();
  const avgScore = getAverageScore();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Accountability</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 15 · ff.acc</p>
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

        {/* MY ACCOUNTABILITY TAB */}
        {activeTab === 'my-accountability' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Accountability</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Your responsibilities, compliance score, and action items</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">My Responsibilities</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{myResponsibilities.length}</p>
                <p className="text-xs text-amber-600 mt-1">{overdueItems.length} overdue</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Compliance Score</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{avgScore}%</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">This month</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Actions Today</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{ledgerStats.today}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Total: {ledgerStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">RACI Assignments</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{raciStats.total}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Active assignments</p>
              </div>
            </div>

            {/* My Responsibilities */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">My Responsibilities</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {myResponsibilities.map(item => (
                  <div key={item.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      item.itemType === 'task' ? 'bg-blue-100 text-blue-600' :
                      item.itemType === 'approval' ? 'bg-purple-100 text-purple-600' :
                      item.itemType === 'exception' ? 'bg-amber-100 text-amber-600' :
                      item.itemType === 'violation' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name={
                        item.itemType === 'task' ? 'check-circle' :
                        item.itemType === 'approval' ? 'user-check' :
                        item.itemType === 'exception' ? 'alert-circle' :
                        item.itemType === 'violation' ? 'x' :
                        'clock'
                      } size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{item.docNo}</span>
                        <StatusChip
                          status={item.itemType.replace('_', ' ')}
                          variant={
                            item.itemType === 'task' ? 'info' :
                            item.itemType === 'approval' ? 'info' :
                            item.itemType === 'exception' ? 'warning' :
                            item.itemType === 'violation' ? 'error' :
                            'neutral'
                          }
                        />
                        {item.isOverdue && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">OVERDUE</span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-primary)]">{item.description}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Due: {new Date(item.dueAt).toLocaleString()}
                        {item.projectName && ` · ${item.projectName}`}
                      </p>
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

        {/* RACI MATRIX TAB */}
        {activeTab === 'raci' && !selectedRACI && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">RACI Matrix</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{raciStats.total} assignments · Responsible, Accountable, Consulted, Informed</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Assignment
              </button>
            </div>

            {/* Summary by Scope */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">By Project</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{raciStats.byScope.project || 0}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">By Site</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{raciStats.byScope.site || 0}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">By Department</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{raciStats.byScope.department || 0}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">By Company</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{raciStats.byScope.company || 0}</p>
              </div>
            </div>

            {/* RACI Assignments List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Process</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Responsible</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Accountable</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Consulted</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Informed</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Valid From</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {raciAssignments.map(raci => (
                    <tr key={raci.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedRACI(raci)}>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--text-primary)]">{raci.scopeName}</p>
                        <p className="text-xs text-[var(--text-tertiary)] capitalize">{raci.scopeType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--text-primary)]">{raci.processName}</p>
                        <p className="text-xs font-mono text-[var(--text-tertiary)]">{raci.processCode}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{raci.responsibleUserName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{raci.accountableUserName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{raci.consultedUserNames.length}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{raci.informedUserNames.length}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(raci.validFrom).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RACI DETAIL */}
        {activeTab === 'raci' && selectedRACI && (
          <div className="space-y-6">
            <button onClick={() => setSelectedRACI(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to RACI matrix
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedRACI.processName}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {selectedRACI.scopeType}: {selectedRACI.scopeName}
                  </p>
                </div>
                <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Responsible */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs font-medium text-blue-700 mb-2">RESPONSIBLE (R)</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedRACI.responsibleUserName}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Does the work</p>
                </div>

                {/* Accountable */}
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-medium text-emerald-700 mb-2">ACCOUNTABLE (A)</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedRACI.accountableUserName}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Ultimately answerable</p>
                </div>

                {/* Consulted */}
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-medium text-amber-700 mb-2">CONSULTED (C)</p>
                  <div className="space-y-1">
                    {selectedRACI.consultedUserNames.length > 0 ? (
                      selectedRACI.consultedUserNames.map((name, idx) => (
                        <p key={idx} className="text-sm text-[var(--text-primary)]">{name}</p>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--text-tertiary)] italic">None assigned</p>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">Provide input</p>
                </div>

                {/* Informed */}
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">INFORMED (I)</p>
                  <div className="space-y-1">
                    {selectedRACI.informedUserNames.length > 0 ? (
                      selectedRACI.informedUserNames.map((name, idx) => (
                        <p key={idx} className="text-sm text-[var(--text-primary)]">{name}</p>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--text-tertiary)] italic">None assigned</p>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">Keep informed</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Valid From</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedRACI.validFrom).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Valid To</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                      {selectedRACI.validTo ? new Date(selectedRACI.validTo).toLocaleDateString() : 'Ongoing'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Assigned By</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRACI.assignedByName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTION LEDGER TAB */}
        {activeTab === 'ledger' && !selectedLedger && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Action Ledger</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{ledgerStats.total} actions recorded · Append-only audit trail</p>
            </div>

            {/* Summary by Action */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Created</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{ledgerStats.byAction.CREATED || 0}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Approved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{ledgerStats.byAction.APPROVED || 0}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Executed</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{ledgerStats.byAction.EXECUTED || 0}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Exceptions</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {(ledgerStats.byAction.EXCEPTION_REQUESTED || 0) + (ledgerStats.byAction.EXCEPTION_APPROVED || 0)}
                </p>
              </div>
            </div>

            {/* Ledger Entries */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Entity</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Action</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Actor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {actionLedger.map(entry => (
                    <tr key={entry.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedLedger(entry)}>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(entry.at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{entry.docNo}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{entry.entityType}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={entry.action}
                          variant={
                            entry.action === 'APPROVED' ? 'success' :
                            entry.action === 'REJECTED' || entry.action === 'RETURNED' ? 'error' :
                            entry.action.includes('EXCEPTION') ? 'warning' :
                            'info'
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-[var(--text-primary)]">{entry.actorName}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{entry.actorRole}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{entry.projectName || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)] max-w-xs truncate">
                        {entry.narrative || entry.reasonCode || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEDGER DETAIL */}
        {activeTab === 'ledger' && selectedLedger && (
          <div className="space-y-6">
            <button onClick={() => setSelectedLedger(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to action ledger
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedLedger.docNo}</span>
                    <StatusChip
                      status={selectedLedger.action}
                      variant={
                        selectedLedger.action === 'APPROVED' ? 'success' :
                        selectedLedger.action === 'REJECTED' || selectedLedger.action === 'RETURNED' ? 'error' :
                        selectedLedger.action.includes('EXCEPTION') ? 'warning' :
                        'info'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedLedger.entityType} Action</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Actor</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedLedger.actorName}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{selectedLedger.actorRole}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Timestamp</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedLedger.at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Project</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedLedger.projectName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Site</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedLedger.siteName || '—'}</p>
                </div>
              </div>

              {selectedLedger.narrative && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Narrative</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedLedger.narrative}</p>
                </div>
              )}

              {selectedLedger.reasonCode && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Reason Code</h3>
                  <p className="text-xs font-mono text-[var(--brand-primary)]">{selectedLedger.reasonCode}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Traceability</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Audit ID</p>
                    <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">{selectedLedger.auditId || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Workflow Task</p>
                    <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">{selectedLedger.workflowTaskId || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Protocol Evaluation</p>
                    <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">{selectedLedger.protocolEvaluationId || '—'}</p>
                  </div>
                </div>
              </div>

              {selectedLedger.lat && selectedLedger.lng && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Location</h3>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[var(--text-tertiary)]" />
                    <p className="text-xs font-mono text-[var(--text-secondary)]">
                      {selectedLedger.lat.toFixed(4)}, {selectedLedger.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAM VIEW TAB */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team Accountability</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Team responsibilities, workload, and compliance overview</p>
            </div>

            {/* Team Members */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Team Members</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {['user-015', 'user-020', 'user-021', 'user-022', 'user-025'].map(userId => {
                  const userItems = getUserResponsibilities(userId);
                  const userScore = complianceScores.find(s => s.subjectId === userId);
                  const userName = userItems[0]?.userName || userId;
                  const overdueCount = userItems.filter(i => i.isOverdue).length;

                  return (
                    <div key={userId} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{userName}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{userItems.length} responsibilities</p>
                      </div>
                      <div className="text-right">
                        {userScore && (
                          <div>
                            <p className="text-lg font-bold text-[var(--text-primary)]">{userScore.score}%</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Compliance</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {overdueCount > 0 && (
                          <div>
                            <p className="text-lg font-bold text-red-600">{overdueCount}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Overdue</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* COMPLIANCE SCORES TAB */}
        {activeTab === 'scores' && !selectedScore && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Compliance Scores</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{complianceScores.length} scores · Calculated nightly</p>
            </div>

            {/* Average Score */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Average Compliance Score</p>
                  <p className="text-4xl font-bold text-emerald-600 mt-2">{avgScore}%</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Across all users this month</p>
                </div>
                <div className="w-32 h-32 rounded-full border-8 border-emerald-200 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">{avgScore}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">/ 100</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scores List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Period</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Score</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">On-Time</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Quality</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Compliance</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {complianceScores.map(score => (
                    <tr key={score.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedScore(score)}>
                      <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{score.subjectName}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{score.subjectType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{score.period}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-lg font-bold ${
                          score.score >= 90 ? 'text-emerald-600' :
                          score.score >= 80 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {score.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{score.components.onTimeCompletion}%</td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{score.components.qualityScore}%</td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{score.components.complianceRate}%</td>
                      <td className="px-4 py-3 text-center">
                        <Icon
                          name={score.trend === 'up' ? 'trending-up' : score.trend === 'down' ? 'trending-down' : 'minus'}
                          size={16}
                          className={
                            score.trend === 'up' ? 'text-emerald-500 mx-auto' :
                            score.trend === 'down' ? 'text-red-500 mx-auto' :
                            'text-gray-400 mx-auto'
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

        {/* SCORE DETAIL */}
        {activeTab === 'scores' && selectedScore && (
          <div className="space-y-6">
            <button onClick={() => setSelectedScore(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to compliance scores
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedScore.subjectName}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 capitalize">{selectedScore.subjectType} · {selectedScore.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-emerald-600">{selectedScore.score}%</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Overall Score</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">On-Time Completion</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedScore.components.onTimeCompletion}%</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-700 mb-1">Quality Score</p>
                  <p className="text-2xl font-bold text-emerald-900">{selectedScore.components.qualityScore}%</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-xs text-purple-700 mb-1">Compliance Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{selectedScore.components.complianceRate}%</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700 mb-1">Exception Rate</p>
                  <p className="text-2xl font-bold text-amber-900">{selectedScore.components.exceptionRate}%</p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700 mb-1">Violations</p>
                  <p className="text-2xl font-bold text-red-900">{selectedScore.components.violationCount}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Calculated At</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedScore.calculatedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      name={selectedScore.trend === 'up' ? 'trending-up' : selectedScore.trend === 'down' ? 'trending-down' : 'minus'}
                      size={20}
                      className={
                        selectedScore.trend === 'up' ? 'text-emerald-500' :
                        selectedScore.trend === 'down' ? 'text-red-500' :
                        'text-gray-400'
                      }
                    />
                    <span className={`text-sm font-medium ${
                      selectedScore.trend === 'up' ? 'text-emerald-600' :
                      selectedScore.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {selectedScore.trend === 'up' ? 'Improving' : selectedScore.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <button className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)]">
                  Appeal Score
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
