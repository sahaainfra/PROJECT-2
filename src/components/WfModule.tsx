import React, { useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, BarChart3, CheckCircle, Clock, Database,
  FileText, Gauge, GitBranch, HardDrive, LineChart, Monitor, Server, Zap, XCircle,
  Radio, RefreshCw, Play, Pause, Eye, Shield, Key, Link, Code, X, Inbox,
  Users, ArrowRight, ChevronRight, ChevronDown, Send, MessageSquare, UserCheck,
  Calendar, Filter, MoreHorizontal, Download, Upload, Edit, Trash, Plus, Search
} from 'lucide-react';
import {
  workflowDefinitions, workflowInstances, delegations, slaCalendars,
  protocolControlPoints, getMyTasks, getOverdueTasks, getInstanceStats,
  type WorkflowDefinition, type WorkflowInstance, type WorkflowTask
} from '../data/wf';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, any> = {
    'activity': Activity, 'alert-circle': AlertCircle, 'alert-triangle': AlertTriangle,
    'bar-chart': BarChart3, 'check-circle': CheckCircle, 'clock': Clock, 'database': Database,
    'file-text': FileText, 'gauge': Gauge, 'git-branch': GitBranch, 'hard-drive': HardDrive,
    'line-chart': LineChart, 'monitor': Monitor, 'server': Server, 'zap': Zap, 'x-circle': XCircle,
    'radio': Radio, 'refresh-cw': RefreshCw, 'play': Play, 'pause': Pause,
    'eye': Eye, 'shield': Shield, 'key': Key, 'link': Link, 'code': Code,
    'inbox': Inbox, 'users': Users, 'arrow-right': ArrowRight, 'chevron-right': ChevronRight,
    'chevron-down': ChevronDown, 'send': Send, 'message-square': MessageSquare,
    'user-check': UserCheck, 'calendar': Calendar, 'filter': Filter, 'more': MoreHorizontal,
    'download': Download, 'upload': Upload, 'edit': Edit, 'trash': Trash, 'plus': Plus,
    'search': Search, 'x': X,
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

export function WfModule() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'definitions' | 'instances' | 'delegations' | 'monitor'>('inbox');
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<WorkflowDefinition | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);

  const tabs = [
    { id: 'inbox', label: 'My Approvals', icon: 'inbox' },
    { id: 'definitions', label: 'Workflow Designer', icon: 'git-branch' },
    { id: 'instances', label: 'All Instances', icon: 'file-text' },
    { id: 'delegations', label: 'Delegations', icon: 'users' },
    { id: 'monitor', label: 'Admin Monitor', icon: 'monitor' },
  ];

  const myTasks = getMyTasks('user-010'); // Simulated current user
  const overdueTasks = getOverdueTasks();
  const instanceStats = getInstanceStats();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Workflow Engine</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 12 · ff.wf</p>
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
              {t.id === 'inbox' && myTasks.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{myTasks.length}</span>
              )}
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

        {/* INBOX TAB */}
        {activeTab === 'inbox' && !selectedInstance && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Approvals</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{myTasks.length} pending · {overdueTasks.length} overdue</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                  <Filter size={16} /> Filter
                </button>
                <button className="px-3 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                  <CheckCircle size={16} /> Bulk Approve
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{myTasks.length}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Overdue</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{overdueTasks.length}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Approved (30d)</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">24</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Avg Turnaround</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">18h</p>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Pending Approvals</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {workflowInstances
                  .filter(inst => inst.tasks.some(t => t.assigneeUserId === 'user-010' && t.status === 'pending'))
                  .map(inst => {
                    const myTask = inst.tasks.find(t => t.assigneeUserId === 'user-010' && t.status === 'pending')!;
                    return (
                      <div key={inst.id} className="p-4 hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedInstance(inst)}>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                            inst.docType === 'PO' ? 'bg-blue-100 text-blue-600' :
                            inst.docType === 'Bill' ? 'bg-emerald-100 text-emerald-600' :
                            inst.docType === 'PR' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon name="file-text" size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-[var(--brand-primary)]">{inst.docNumber}</span>
                              <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{inst.docType}</span>
                              {myTask.slaPercentRemaining < 50 && (
                                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">SLA At Risk</span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{inst.docTitle}</p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              Submitted by {inst.submittedByName} · {new Date(inst.submittedAt).toLocaleDateString()}
                              {inst.amountSnapshot > 0 && ` · ₹${(inst.amountSnapshot / 100000).toFixed(2)}L`}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                              Step {myTask.stepSeq}: {myTask.stepName} · Due: {new Date(myTask.dueAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedTask(myTask); setShowActionModal(true); }}
                              className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* INSTANCE DETAIL */}
        {activeTab === 'inbox' && selectedInstance && (
          <div className="space-y-6">
            <button onClick={() => setSelectedInstance(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <Icon name="arrow-right" size={16} className="rotate-180" /> Back to inbox
            </button>

            {/* Document Header */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedInstance.docNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{selectedInstance.docType}</span>
                    <StatusChip
                      status={selectedInstance.status}
                      variant={
                        selectedInstance.status === 'APPROVED' ? 'success' :
                        selectedInstance.status === 'IN_PROGRESS' ? 'info' :
                        selectedInstance.status === 'RETURNED' ? 'warning' :
                        'error'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedInstance.docTitle}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Submitted by {selectedInstance.submittedByName} · {new Date(selectedInstance.submittedAt).toLocaleString()}
                  </p>
                </div>
                {selectedInstance.amountSnapshot > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-tertiary)]">Amount</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] font-tabular">
                      ₹{(selectedInstance.amountSnapshot / 100000).toFixed(2)}L
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--divider)]">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Project</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedInstance.projectName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Definition Version</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">v{selectedInstance.definitionVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Current Step</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedInstance.currentStepSeq}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Completed</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                    {selectedInstance.completedAt ? new Date(selectedInstance.completedAt).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Timeline */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Approval Timeline</h3>
              <div className="space-y-4">
                {selectedInstance.tasks.map((task, idx) => (
                  <div key={task.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        task.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                        task.status === 'pending' ? 'bg-blue-100 text-blue-600' :
                        task.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        task.status === 'returned' ? 'bg-amber-100 text-amber-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon name={
                          task.status === 'approved' ? 'check-circle' :
                          task.status === 'pending' ? 'clock' :
                          task.status === 'rejected' ? 'x-circle' :
                          'alert-circle'
                        } size={20} />
                      </div>
                      {idx < selectedInstance.tasks.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-2 ${
                          task.status === 'approved' ? 'bg-emerald-200' : 'bg-[var(--border)]'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">Step {task.stepSeq}: {task.stepName}</p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">
                            Assigned to: {task.assigneeName}
                            {task.delegatedFrom && ` (on behalf of ${task.delegatedFrom})`}
                          </p>
                        </div>
                        <StatusChip
                          status={task.status}
                          variant={
                            task.status === 'approved' ? 'success' :
                            task.status === 'pending' ? 'info' :
                            task.status === 'rejected' ? 'error' :
                            'warning'
                          }
                        />
                      </div>
                      {task.comment && (
                        <div className="mt-2 p-2 rounded-lg bg-[var(--surface-hover)]">
                          <p className="text-xs text-[var(--text-secondary)]">{task.comment}</p>
                        </div>
                      )}
                      {task.actedAt && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-2">
                          {task.status === 'approved' ? 'Approved' : task.status === 'rejected' ? 'Rejected' : 'Acted'} on {new Date(task.actedAt).toLocaleString()}
                        </p>
                      )}
                      {task.status === 'pending' && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[var(--text-tertiary)]">SLA Progress</span>
                            <span className="text-xs text-[var(--text-secondary)]">{task.slaPercentRemaining}%</span>
                          </div>
                          <div className="h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                task.slaPercentRemaining > 50 ? 'bg-emerald-500' :
                                task.slaPercentRemaining > 20 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${task.slaPercentRemaining}%` }}
                            />
                          </div>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">Due: {new Date(task.dueAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Log */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Action Log</h3>
              <div className="space-y-2">
                {selectedInstance.actionLog.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      log.action === 'submit' ? 'bg-blue-100 text-blue-600' :
                      log.action === 'approve' ? 'bg-emerald-100 text-emerald-600' :
                      log.action === 'reject' ? 'bg-red-100 text-red-600' :
                      log.action === 'return' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name={
                        log.action === 'submit' ? 'send' :
                        log.action === 'approve' ? 'check-circle' :
                        log.action === 'reject' ? 'x-circle' :
                        log.action === 'return' ? 'arrow-right' :
                        'message-square'
                      } size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)]">
                        <span className="font-medium">{log.actorName}</span>
                        {' '}{log.action === 'submit' ? 'submitted' : log.action === 'approve' ? 'approved' : log.action === 'reject' ? 'rejected' : log.action === 'return' ? 'returned' : log.action}
                        {log.onBehalfOf && <span className="text-xs text-[var(--text-tertiary)]"> (on behalf of {log.onBehalfOf})</span>}
                      </p>
                      {log.comment && <p className="text-xs text-[var(--text-secondary)] mt-1">{log.comment}</p>}
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">{new Date(log.at).toLocaleString()} · {log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {selectedInstance.status === 'IN_PROGRESS' && selectedInstance.tasks.some(t => t.assigneeUserId === 'user-010' && t.status === 'pending') && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const task = selectedInstance.tasks.find(t => t.assigneeUserId === 'user-010' && t.status === 'pending');
                    if (task) { setSelectedTask(task); setShowActionModal(true); }
                  }}
                  className="flex-1 px-4 py-3 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]"
                >
                  Review & Approve
                </button>
                <button className="px-4 py-3 text-sm border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--surface-hover)]">
                  Return
                </button>
                <button className="px-4 py-3 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {/* DEFINITIONS TAB */}
        {activeTab === 'definitions' && !selectedDefinition && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Workflow Definitions</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{workflowDefinitions.length} definitions · Visual designer · Version control</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Definition
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflowDefinitions.map(def => (
                <div key={def.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] cursor-pointer" onClick={() => setSelectedDefinition(def)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{def.code}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">v{def.version}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{def.name}</h3>
                    </div>
                    <StatusChip status={def.isActive ? 'Active' : 'Inactive'} variant={def.isActive ? 'success' : 'neutral'} />
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mb-3">Document Type: {def.docType}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs text-[var(--text-tertiary)]">Steps</p>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{def.steps.length}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs text-[var(--text-tertiary)]">Instances</p>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{def.instanceCount}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--surface-hover)]">
                      <p className="text-xs text-[var(--text-tertiary)]">Avg TAT</p>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{def.avgTurnaroundHours}h</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEFINITION DETAIL */}
        {activeTab === 'definitions' && selectedDefinition && (
          <div className="space-y-6">
            <button onClick={() => setSelectedDefinition(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <Icon name="arrow-right" size={16} className="rotate-180" /> Back to definitions
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedDefinition.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">v{selectedDefinition.version}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedDefinition.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Document Type: {selectedDefinition.docType} · Effective: {selectedDefinition.effectiveFrom}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)]">
                    Simulate
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    Edit
                  </button>
                </div>
              </div>

              {/* Steps Visualization */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Workflow Steps</h3>
                <div className="space-y-3">
                  {selectedDefinition.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-start gap-4 p-4 rounded-lg border border-[var(--border)]">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shrink-0 font-bold">
                        {step.seq}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{step.name}</p>
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{step.type.replace('_', ' ')}</span>
                        </div>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          Approver: {step.approverRuleType} = {step.approverRuleValue}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="text-[var(--text-tertiary)]">SLA: {step.slaHours}h</span>
                          {step.escalateToRule && <span className="text-amber-600">Escalates to: {step.escalateToRule}</span>}
                          {step.mandatoryComment && <span className="text-blue-600">Comment required</span>}
                          {step.mandatoryDocuments && <span className="text-blue-600">Documents required</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              {selectedDefinition.conditions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Conditions</h3>
                  <div className="space-y-2">
                    {selectedDefinition.conditions.map(cond => (
                      <div key={cond.id} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                        <p className="text-xs font-mono text-[var(--text-primary)]">{cond.expression}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Action: <span className="font-medium">{cond.action}</span>
                          {cond.targetStepSeq && ` → Step ${cond.targetStepSeq}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INSTANCES TAB */}
        {activeTab === 'instances' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">All Workflow Instances</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{instanceStats.total} total · {instanceStats.inProgress} in progress · {instanceStats.approved} approved</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Title</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Submitted By</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Submitted</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Step</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {workflowInstances.map(inst => (
                    <tr key={inst.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => { setActiveTab('inbox'); setSelectedInstance(inst); }}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{inst.docNumber}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{inst.docType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-primary)] max-w-xs truncate">{inst.docTitle}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={inst.status}
                          variant={
                            inst.status === 'APPROVED' ? 'success' :
                            inst.status === 'IN_PROGRESS' ? 'info' :
                            inst.status === 'RETURNED' ? 'warning' :
                            'error'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{inst.submittedByName}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">
                        {inst.amountSnapshot > 0 ? `₹${(inst.amountSnapshot / 100000).toFixed(2)}L` : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(inst.submittedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)]">{inst.currentStepSeq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DELEGATIONS TAB */}
        {activeTab === 'delegations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Delegations</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{delegations.length} delegations · {delegations.filter(d => d.status === 'active').length} active</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Delegation
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Delegator</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Delegate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document Types</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Period</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {delegations.map(del => (
                    <tr key={del.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-xs text-[var(--text-primary)]">{del.delegatorName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-primary)]">{del.delegateName}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {del.docTypes.map(dt => (
                            <span key={dt} className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{dt}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{del.scope}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {new Date(del.from).toLocaleDateString()} - {new Date(del.to).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{del.reason}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={del.status}
                          variant={del.status === 'active' ? 'success' : del.status === 'expired' ? 'neutral' : 'warning'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MONITOR TAB */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Monitor</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Instance statistics · Overdue tracking · SLA compliance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total Instances</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{instanceStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{instanceStats.inProgress}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Approved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{instanceStats.approved}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{instanceStats.overdue}</p>
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
      </div>

      {/* Action Modal */}
      {showActionModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowActionModal(false)}>
          <div className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Review & Approve</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Step: {selectedTask.stepName}</p>
                </div>
                <button onClick={() => setShowActionModal(false)} className="p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Comment</label>
                <textarea
                  className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  rows={4}
                  placeholder="Add your comments..."
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Reason Code (if rejecting/returning)</label>
                <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]">
                  <option value="">Select reason...</option>
                  <option value="SPEC_MISMATCH">Specification mismatch</option>
                  <option value="BUDGET_EXCEED">Budget exceeded</option>
                  <option value="DOC_MISSING">Documents missing</option>
                  <option value="VENDOR_ISSUE">Vendor issue</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
                  Approve
                </button>
                <button className="flex-1 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                  Return
                </button>
                <button className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
