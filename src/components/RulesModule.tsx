import React, { useState } from 'react';
import {
  Table, Grid3X3 as Grid, Shield, Play, AlertTriangle, CheckCircle, Clock, FileText,
  Users, DollarSign, GitBranch, Zap, Eye
} from 'lucide-react';
import {
  decisionTables, authorityMatrix, simulationRuns, stateMachines, emergencyApprovals,
  protocolControlPoints, getDecisionTableStats, getAuthorityMatrixStats, getEmergencyStats,
  evaluateDecision,
  type DecisionTable, type AuthorityMatrix, type SimulationRun, type EmergencyApproval
} from '../data/rules';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'table': Table, 'grid': Grid, 'shield': Shield, 'play': Play, 'alert-triangle': AlertTriangle,
    'check-circle': CheckCircle, 'clock': Clock, 'file-text': FileText, 'users': Users,
    'dollar': DollarSign, 'git-branch': GitBranch, 'zap': Zap, 'eye': Eye,
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

export function RulesModule() {
  const [activeTab, setActiveTab] = useState<'decision-tables' | 'authority-matrix' | 'simulation' | 'state-machines' | 'emergency'>('decision-tables');
  const [selectedTable, setSelectedTable] = useState<DecisionTable | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationRun | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyApproval | null>(null);

  const tabs = [
    { id: 'decision-tables', label: 'Decision Tables', icon: 'table' },
    { id: 'authority-matrix', label: 'Authority Matrix', icon: 'shield' },
    { id: 'simulation', label: 'Simulation', icon: 'play' },
    { id: 'state-machines', label: 'State Machines', icon: 'git-branch' },
    { id: 'emergency', label: 'Emergency Approvals', icon: 'alert-triangle' },
  ];

  const dtStats = getDecisionTableStats();
  const authStats = getAuthorityMatrixStats();
  const emgStats = getEmergencyStats();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Administration</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Rules Engine · ff.rules</p>
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

        {/* DECISION TABLES TAB */}
        {activeTab === 'decision-tables' && !selectedTable && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Decision Tables</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{dtStats.total} tables · {dtStats.active} active · DMN-style routing rules</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Decision Table
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total Tables</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{dtStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Active</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{dtStats.active}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Draft</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{dtStats.draft}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Simulated</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{dtStats.simulated}</p>
              </div>
            </div>

            {/* Decision Tables List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document Type</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Hit Policy</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Rules</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Effective From</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {decisionTables.map(dt => (
                    <tr key={dt.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedTable(dt)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{dt.code}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{dt.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{dt.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{dt.documentType}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-[var(--brand-primary)]">v{dt.version}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={dt.status}
                          variant={
                            dt.status === 'active' ? 'success' :
                            dt.status === 'simulated' ? 'info' :
                            dt.status === 'approved' ? 'success' :
                            dt.status === 'superseded' ? 'neutral' :
                            'warning'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{dt.hitPolicy}</td>
                      <td className="px-4 py-3 text-center font-tabular text-sm text-[var(--text-primary)]">{dt.rules.length}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(dt.effectiveFrom).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {/* DECISION TABLE DETAIL */}
        {activeTab === 'decision-tables' && selectedTable && (
          <div className="space-y-6">
            <button onClick={() => setSelectedTable(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to decision tables
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedTable.code}</span>
                    <span className="text-sm font-bold text-[var(--brand-primary)]">v{selectedTable.version}</span>
                    <StatusChip
                      status={selectedTable.status}
                      variant={
                        selectedTable.status === 'active' ? 'success' :
                        selectedTable.status === 'simulated' ? 'info' :
                        'warning'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedTable.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedTable.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Simulate
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Document Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedTable.documentType}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Hit Policy</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedTable.hitPolicy}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Rules Count</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedTable.rules.length}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Effective From</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedTable.effectiveFrom).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Inputs */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Input Columns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedTable.inputs.map(input => (
                    <div key={input.id} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs font-mono text-[var(--brand-primary)]">{input.name}</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{input.label}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">Type: {input.type}</p>
                      {input.enumValues && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {input.enumValues.map(v => (
                            <span key={v} className="text-xs px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-secondary)]">{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Outputs */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Output Columns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedTable.outputs.map(output => (
                    <div key={output.id} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs font-mono text-[var(--brand-primary)]">{output.name}</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{output.label}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">Type: {output.type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules Grid */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Rules ({selectedTable.rules.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                        <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">#</th>
                        {selectedTable.inputs.map(input => (
                          <th key={input.id} className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">{input.label}</th>
                        ))}
                        <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">→</th>
                        {selectedTable.outputs.map(output => (
                          <th key={output.id} className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">{output.label}</th>
                        ))}
                        <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">Annotation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--divider)]">
                      {selectedTable.rules.map(rule => (
                        <tr key={rule.id} className="hover:bg-[var(--surface-hover)]">
                          <td className="px-3 py-2 font-bold text-[var(--brand-primary)]">{rule.priority}</td>
                          {selectedTable.inputs.map(input => (
                            <td key={input.id} className="px-3 py-2 font-mono text-[var(--text-primary)]">
                              {String(rule.inputs[input.name])}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-center text-[var(--text-tertiary)]">→</td>
                          {selectedTable.outputs.map(output => (
                            <td key={output.id} className="px-3 py-2 font-mono text-[var(--text-primary)]">
                              {Array.isArray(rule.outputs[output.name])
                                ? rule.outputs[output.name].join(', ')
                                : String(rule.outputs[output.name])}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-[var(--text-tertiary)] italic">{rule.annotation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUTHORITY MATRIX TAB */}
        {activeTab === 'authority-matrix' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Authority Matrix</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{authStats.total} authority limits · Effective-dated approval limits per role</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + Add Authority Limit
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Company</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Max Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Effective From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Effective To</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {authorityMatrix.map(auth => (
                    <tr key={auth.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{auth.roleName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{auth.documentType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{auth.companyName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{auth.projectName || 'All Projects'}</td>
                      <td className="px-4 py-3 text-right font-tabular text-sm font-medium text-[var(--text-primary)]">
                        ₹{(auth.maxAmount / 10000000).toFixed(2)} Cr
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(auth.effectiveFrom).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{auth.effectiveTo ? new Date(auth.effectiveTo).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{auth.approvedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SIMULATION TAB */}
        {activeTab === 'simulation' && !selectedSimulation && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Rule Simulation</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{simulationRuns.length} simulations · Test routing changes before activation</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Simulation
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Decision Table</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Period</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Documents</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Changed</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Unchanged</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Run By</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Run At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {simulationRuns.map(sim => (
                    <tr key={sim.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedSimulation(sim)}>
                      <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{sim.decisionTableName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-[var(--brand-primary)]">v{sim.version}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {new Date(sim.periodFrom).toLocaleDateString()} - {new Date(sim.periodTo).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-sm text-[var(--text-primary)]">{sim.documentCount}</td>
                      <td className="px-4 py-3 text-right font-tabular text-sm text-amber-600">{sim.changedRoutings}</td>
                      <td className="px-4 py-3 text-right font-tabular text-sm text-emerald-600">{sim.unchangedRoutings}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={sim.status} variant={sim.status === 'completed' ? 'success' : sim.status === 'running' ? 'info' : 'error'} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{sim.runBy}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(sim.runAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SIMULATION DETAIL */}
        {activeTab === 'simulation' && selectedSimulation && (
          <div className="space-y-6">
            <button onClick={() => setSelectedSimulation(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to simulations
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedSimulation.decisionTableName}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Version {selectedSimulation.version} · {selectedSimulation.status}</p>
                </div>
                <StatusChip status={selectedSimulation.status} variant={selectedSimulation.status === 'completed' ? 'success' : 'info'} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Period</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                    {new Date(selectedSimulation.periodFrom).toLocaleDateString()} - {new Date(selectedSimulation.periodTo).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Documents Tested</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{selectedSimulation.documentCount}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Changed Routings</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{selectedSimulation.changedRoutings}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Unchanged Routings</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{selectedSimulation.unchangedRoutings}</p>
                </div>
              </div>

              {selectedSimulation.summary && (
                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs font-medium text-blue-700 mb-1">Summary</p>
                  <p className="text-sm text-blue-600">{selectedSimulation.summary}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <p className="text-xs text-[var(--text-tertiary)]">Run by {selectedSimulation.runBy} on {new Date(selectedSimulation.runAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* STATE MACHINES TAB */}
        {activeTab === 'state-machines' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">State Machines</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{stateMachines.length} lifecycle definitions · State transitions and guards</p>
            </div>

            <div className="space-y-4">
              {stateMachines.map(sm => (
                <div key={sm.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-[var(--brand-primary)]">v{sm.version}</span>
                        <StatusChip status={sm.status} variant={sm.status === 'active' ? 'success' : 'neutral'} />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{sm.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">Document Type: {sm.documentType}</p>
                    </div>
                  </div>

                  {/* States */}
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase mb-2">States ({sm.states.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {sm.states.map(state => (
                        <div
                          key={state.id}
                          className={`px-3 py-2 rounded-lg border-2 ${
                            state.isInitial ? 'border-blue-500 bg-blue-50' :
                            state.isFinal ? 'border-gray-500 bg-gray-50' :
                            state.isLocked ? 'border-emerald-500 bg-emerald-50' :
                            'border-[var(--border)] bg-[var(--surface-hover)]'
                          }`}
                        >
                          <p className="text-xs font-mono text-[var(--text-primary)]">{state.code}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{state.name}</p>
                          {state.isInitial && <p className="text-[10px] text-blue-600 mt-1">Initial</p>}
                          {state.isFinal && <p className="text-[10px] text-gray-600 mt-1">Final</p>}
                          {state.isLocked && <p className="text-[10px] text-emerald-600 mt-1">Locked</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transitions */}
                  <div className="mt-6">
                    <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase mb-2">Transitions ({sm.transitions.length})</h4>
                    <div className="space-y-2">
                      {sm.transitions.map(trans => {
                        const fromState = sm.states.find(s => s.id === trans.fromStateId);
                        const toState = sm.states.find(s => s.id === trans.toStateId);
                        return (
                          <div key={trans.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                            <span className="text-xs font-mono text-[var(--text-primary)]">{fromState?.code}</span>
                            <span className="text-xs text-[var(--text-tertiary)]">→</span>
                            <span className="text-xs font-mono text-[var(--text-primary)]">{toState?.code}</span>
                            <span className="text-xs text-[var(--text-secondary)] flex-1">{trans.name}</span>
                            {trans.guardExpression && (
                              <span className="text-xs font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{trans.guardExpression}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMERGENCY APPROVALS TAB */}
        {activeTab === 'emergency' && !selectedEmergency && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Emergency Approvals</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{emgStats.total} emergency approvals · {emgStats.pending} pending regularisation</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{emgStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{emgStats.pending}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Regularised</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{emgStats.regularised}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Expired</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{emgStats.expired}</p>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Regularise By</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {emergencyApprovals.map(emg => (
                    <tr key={emg.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedEmergency(emg)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{emg.documentNumber}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{emg.documentType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{emg.reason}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{emg.projectName}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">₹{(emg.amount / 100000).toFixed(2)}L</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{emg.approvedByName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(emg.regulariseBy).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={emg.status}
                          variant={
                            emg.status === 'regularised' ? 'success' :
                            emg.status === 'pending' ? 'warning' :
                            'error'
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

        {/* EMERGENCY DETAIL */}
        {activeTab === 'emergency' && selectedEmergency && (
          <div className="space-y-6">
            <button onClick={() => setSelectedEmergency(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to emergency approvals
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedEmergency.documentNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{selectedEmergency.documentType}</span>
                    <StatusChip
                      status={selectedEmergency.status}
                      variant={
                        selectedEmergency.status === 'regularised' ? 'success' :
                        selectedEmergency.status === 'pending' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Emergency Approval</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-tertiary)]">Amount</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] font-tabular">₹{(selectedEmergency.amount / 100000).toFixed(2)}L</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Project</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedEmergency.projectName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Approved By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedEmergency.approvedByName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Approved At</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedEmergency.approvedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Regularise By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedEmergency.regulariseBy).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Reason</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedEmergency.reason}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Evidence Documents</h3>
                <div className="space-y-2">
                  {selectedEmergency.evidenceIds.map(evidId => (
                    <div key={evidId} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-hover)]">
                      <FileText size={16} className="text-[var(--text-tertiary)]" />
                      <span className="text-xs font-mono text-[var(--text-primary)]">{evidId}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedEmergency.regularisedAt && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Regularisation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Regularised At</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedEmergency.regularisedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Regularised By</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedEmergency.regularisedBy}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
