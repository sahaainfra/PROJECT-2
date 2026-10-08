import React, { useState } from 'react';
import {
  CheckSquare, Calendar, Layout, List, Filter, Search, Plus, Clock, AlertCircle,
  Users, Paperclip, MessageSquare, ChevronDown, ChevronRight, X, Edit, Trash2,
  MoreVertical, ArrowRight, Link2, FileText, Image, Upload, Send, Check, Circle,
  AlertTriangle, Shield, GitBranch, MessageCircle
} from 'lucide-react';
import {
  tasks, taskDependencies, checklistItems, taskComments, meetings, protocolControlPoints,
  getTaskStats, getMyTasks, getTaskChecklist, getTaskComments, getTaskDependencies,
  getPriorityColor, getStatusColor, getSourceIcon,
  type Task, type TaskStatus, type TaskPriority
} from '../data/task';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'check-square': CheckSquare, 'calendar': Calendar, 'layout': Layout, 'list': List,
    'filter': Filter, 'search': Search, 'plus': Plus, 'clock': Clock, 'alert': AlertCircle,
    'users': Users, 'paperclip': Paperclip, 'message': MessageSquare,
    'chevron-down': ChevronDown, 'chevron-right': ChevronRight, 'x': X, 'edit': Edit,
    'trash': Trash2, 'more': MoreVertical, 'arrow-right': ArrowRight, 'link': Link2,
    'file': FileText, 'image': Image, 'upload': Upload, 'send': Send, 'check': Check,
    'circle': Circle, 'alert-triangle': AlertTriangle, 'shield': Shield,
    'git-branch': GitBranch, 'message-circle': MessageCircle, 'file-warning': AlertTriangle,
  };
  const IconComponent = icons[name] || CheckSquare;
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
      {status.replace(/_/g, ' ')}
    </span>
  );
}

// Priority Badge component
function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const colors = getPriorityColor(priority);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${colors}`}>
      {priority.toUpperCase()}
    </span>
  );
}

export function TaskModule() {
  const [activeView, setActiveView] = useState<'my-tasks' | 'kanban' | 'calendar' | 'meetings'>('my-tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = 'user-010'; // Simulated current user
  const taskStats = getTaskStats();
  const myTasks = getMyTasks(currentUser);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.taskNo.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Kanban columns
  const kanbanColumns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'OPEN', label: 'Open', color: 'bg-gray-100' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100' },
    { status: 'BLOCKED', label: 'Blocked', color: 'bg-amber-100' },
    { status: 'DONE', label: 'Done', color: 'bg-emerald-100' },
  ];

  const views = [
    { id: 'my-tasks', label: 'My Tasks', icon: 'check-square', count: myTasks.length },
    { id: 'kanban', label: 'Kanban Board', icon: 'layout' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
    { id: 'meetings', label: 'Meetings', icon: 'users', count: meetings.filter(m => m.status === 'scheduled').length },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Tasks</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 27 · ff.task</p>
        </div>
        <nav className="space-y-1">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                activeView === v.id
                  ? 'bg-[var(--brand-primary)] text-white font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Icon name={v.icon} size={16} />
              {v.label}
              {v.count !== undefined && (
                <span className="ml-auto bg-[var(--surface-hover)] text-[var(--text-secondary)] text-xs rounded-full px-2 py-0.5">
                  {v.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-[var(--divider)]">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 px-2">Quick Stats</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[var(--surface-hover)]">
              <span className="text-xs text-[var(--text-secondary)]">Total Tasks</span>
              <span className="text-xs font-bold text-[var(--text-primary)]">{taskStats.total}</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[var(--surface-hover)]">
              <span className="text-xs text-[var(--text-secondary)]">Overdue</span>
              <span className="text-xs font-bold text-red-600">{taskStats.overdue}</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[var(--surface-hover)]">
              <span className="text-xs text-[var(--text-secondary)]">In Progress</span>
              <span className="text-xs font-bold text-blue-600">{taskStats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[var(--surface-hover)]">
              <span className="text-xs text-[var(--text-secondary)]">Completed</span>
              <span className="text-xs font-bold text-emerald-600">{taskStats.done}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Mobile view selector */}
        <div className="lg:hidden mb-4">
          <select
            value={activeView}
            onChange={e => setActiveView(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
          >
            {views.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
          </select>
        </div>

        {/* MY TASKS VIEW */}
        {activeView === 'my-tasks' && !selectedTask && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Tasks</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{myTasks.length} tasks assigned to you</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New Task
              </button>
            </div>

            {/* Filters */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Search</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={e => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {myTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4 hover:border-[var(--brand-primary)] cursor-pointer transition-colors"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      task.isOverdue ? 'bg-red-100 text-red-600' :
                      task.status === 'DONE' ? 'bg-emerald-100 text-emerald-600' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name={task.isOverdue ? 'alert' : task.status === 'DONE' ? 'check' : 'clock'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{task.taskNo}</span>
                        <PriorityBadge priority={task.priority} />
                        <StatusChip status={task.status} variant={getStatusColor(task.status)} />
                        {task.isOverdue && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                            OVERDUE ({task.daysOverdue}d)
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{task.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {task.projectName && (
                          <span className="flex items-center gap-1">
                            <Icon name="file" size={12} /> {task.projectName}
                          </span>
                        )}
                        {task.checklistProgress > 0 && (
                          <span className="flex items-center gap-1">
                            <CheckSquare size={12} /> {task.checklistProgress}%
                          </span>
                        )}
                        {task.commentCount > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} /> {task.commentCount}
                          </span>
                        )}
                        {task.attachmentCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Paperclip size={12} /> {task.attachmentCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

        {/* TASK DETAIL */}
        {activeView === 'my-tasks' && selectedTask && (
          <div className="space-y-6">
            <button onClick={() => setSelectedTask(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to my tasks
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedTask.taskNo}</span>
                    <PriorityBadge priority={selectedTask.priority} />
                    <StatusChip status={selectedTask.status} variant={getStatusColor(selectedTask.status)} />
                    {selectedTask.isOverdue && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                        OVERDUE ({selectedTask.daysOverdue}d)
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedTask.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Assigned to: {selectedTask.assigneeName}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                    <Edit size={14} /> Edit
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                    <Check size={14} /> Mark Complete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Source</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize flex items-center gap-2">
                    <Icon name={getSourceIcon(selectedTask.source)} size={14} />
                    {selectedTask.source}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Start Date</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedTask.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Due Date</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">SLA</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedTask.slaHours} hours</p>
                </div>
              </div>

              {selectedTask.projectName && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Project Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[var(--text-tertiary)]">Project</p>
                      <p className="text-[var(--text-primary)] mt-1">{selectedTask.projectName}</p>
                    </div>
                    {selectedTask.siteName && (
                      <div>
                        <p className="text-[var(--text-tertiary)]">Site</p>
                        <p className="text-[var(--text-primary)] mt-1">{selectedTask.siteName}</p>
                      </div>
                    )}
                    {selectedTask.recordNo && (
                      <div>
                        <p className="text-[var(--text-tertiary)]">Related Record</p>
                        <p className="text-[var(--brand-primary)] mt-1 font-mono">{selectedTask.recordNo}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Description</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedTask.description}</p>
              </div>

              {/* Checklist */}
              {selectedTask.checklistProgress > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)]">Checklist</h3>
                    <span className="text-xs text-[var(--text-tertiary)]">{selectedTask.checklistProgress}% complete</span>
                  </div>
                  <div className="space-y-2">
                    {getTaskChecklist(selectedTask.id).map(item => (
                      <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          item.done ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--border)]'
                        }`}>
                          {item.done && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${item.done ? 'text-[var(--text-tertiary)] line-through' : 'text-[var(--text-primary)]'}`}>
                            {item.text}
                          </p>
                          {item.done && item.doneByName && (
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              Completed by {item.doneByName} on {new Date(item.doneAt!).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {selectedTask.dependencyCount > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Dependencies</h3>
                  <div className="space-y-2">
                    {getTaskDependencies(selectedTask.id).map(dep => (
                      <div key={dep.id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                        <Icon name="arrow-right" size={16} className="text-[var(--text-tertiary)]" />
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{dep.dependsOnTaskNo}</span>
                        <span className="text-xs text-[var(--text-secondary)]">Must be completed first</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                  Comments ({getTaskComments(selectedTask.id).length})
                </h3>
                <div className="space-y-3">
                  {getTaskComments(selectedTask.id).map(comment => (
                    <div key={comment.id} className={`p-3 rounded-lg ${comment.isSystem ? 'bg-blue-50 border border-blue-200' : 'bg-[var(--surface-hover)]'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-xs font-bold">
                            {comment.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{comment.userName}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">{new Date(comment.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] ml-10">{comment.body}</p>
                      {comment.attachments.length > 0 && (
                        <div className="mt-2 ml-10 space-y-1">
                          {comment.attachments.map(att => (
                            <div key={att.id} className="flex items-center gap-2 p-2 rounded bg-[var(--surface)] text-xs">
                              <Paperclip size={12} className="text-[var(--text-tertiary)]" />
                              <span className="text-[var(--text-primary)]">{att.fileName}</span>
                              <span className="text-[var(--text-tertiary)]">({(att.fileSize / 1024).toFixed(1)} KB)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  />
                  <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KANBAN VIEW */}
        {activeView === 'kanban' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Kanban Board</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Visual task management by status</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {kanbanColumns.map(column => {
                const columnTasks = filteredTasks.filter(t => t.status === column.status);
                return (
                  <div key={column.status} className="space-y-3">
                    <div className={`p-3 rounded-lg ${column.color}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{column.label}</h3>
                        <span className="text-xs font-bold text-[var(--text-primary)] bg-white px-2 py-0.5 rounded">
                          {columnTasks.length}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {columnTasks.map(task => (
                        <div
                          key={task.id}
                          className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-3 hover:border-[var(--brand-primary)] cursor-pointer transition-colors"
                          onClick={() => { setActiveView('my-tasks'); setSelectedTask(task); }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <PriorityBadge priority={task.priority} />
                            <span className="text-xs font-mono text-[var(--text-tertiary)]">{task.taskNo}</span>
                          </div>
                          <p className="text-sm font-medium text-[var(--text-primary)] mb-2 line-clamp-2">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                            <Calendar size={12} />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
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

        {/* CALENDAR VIEW */}
        {activeView === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendar View</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Task timeline and due dates</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="text-center text-sm text-[var(--text-secondary)]">
                Calendar view will display tasks organized by due date with drag-and-drop rescheduling capability
              </div>
            </div>
          </div>
        )}

        {/* MEETINGS VIEW */}
        {activeView === 'meetings' && !selectedMeeting && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Meetings</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{meetings.length} meetings · {meetings.filter(m => m.status === 'scheduled').length} scheduled</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New Meeting
              </button>
            </div>

            <div className="space-y-4">
              {meetings.map(meeting => (
                <div
                  key={meeting.id}
                  className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] cursor-pointer transition-colors"
                  onClick={() => setSelectedMeeting(meeting.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{meeting.meetingNo}</span>
                        <StatusChip
                          status={meeting.status}
                          variant={meeting.status === 'completed' ? 'success' : meeting.status === 'scheduled' ? 'info' : 'neutral'}
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{meeting.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{meeting.projectName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-tertiary)]">{new Date(meeting.date).toLocaleDateString()}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{meeting.startTime} - {meeting.endTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {meeting.attendees.length} attendees
                    </span>
                    {meeting.actionItems.length > 0 && (
                      <span className="flex items-center gap-1">
                        <CheckSquare size={12} /> {meeting.actionItems.length} action items
                      </span>
                    )}
                    {meeting.taskIds.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Link2 size={12} /> {meeting.taskIds.length} tasks created
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEETING DETAIL */}
        {activeView === 'meetings' && selectedMeeting && (
          <div className="space-y-6">
            <button onClick={() => setSelectedMeeting(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to meetings
            </button>

            {(() => {
              const meeting = meetings.find(m => m.id === selectedMeeting);
              if (!meeting) return null;

              return (
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{meeting.meetingNo}</span>
                        <StatusChip
                          status={meeting.status}
                          variant={meeting.status === 'completed' ? 'success' : 'info'}
                        />
                      </div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">{meeting.title}</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{meeting.projectName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Date</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(meeting.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Time</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{meeting.startTime} - {meeting.endTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Location</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{meeting.location || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Organizer</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{meeting.organizerName}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Attendees ({meeting.attendees.length})</h3>
                    <div className="space-y-2">
                      {meeting.attendees.map((attendee, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-xs font-bold">
                            {attendee.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-[var(--text-primary)]">{attendee.userName}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">{attendee.role}</p>
                          </div>
                          <StatusChip
                            status={attendee.attended ? 'Attended' : 'Absent'}
                            variant={attendee.attended ? 'success' : 'neutral'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {meeting.minutes && (
                    <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Meeting Minutes</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{meeting.minutes}</p>
                    </div>
                  )}

                  {meeting.actionItems.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Action Items ({meeting.actionItems.length})</h3>
                      <div className="space-y-2">
                        {meeting.actionItems.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                            <CheckSquare size={16} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
                            <span className="text-sm text-[var(--text-primary)]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {meeting.taskIds.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Tasks Created ({meeting.taskIds.length})</h3>
                      <div className="space-y-2">
                        {meeting.taskIds.map(taskId => {
                          const task = tasks.find(t => t.id === taskId);
                          if (!task) return null;
                          return (
                            <div key={taskId} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                              <span className="text-xs font-mono text-[var(--brand-primary)]">{task.taskNo}</span>
                              <span className="text-sm text-[var(--text-primary)] flex-1">{task.title}</span>
                              <StatusChip status={task.status} variant={getStatusColor(task.status)} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
