import React, { useState } from 'react';
import {
  Bell, Settings, FileText, Megaphone, Users, CheckCircle, Clock, AlertCircle,
  Mail, MessageSquare, Smartphone, X, Filter, Archive, Eye, Edit, Send,
  TrendingUp, TrendingDown, Minus, Shield
} from 'lucide-react';
import {
  notificationCategories, notificationTemplates, notifications, userPreferences,
  deliveries, broadcasts, rooms, presence, protocolControlPoints,
  getNotificationStats, getDeliveryStats, getCategoryStats,
  type Notification, type NotificationTemplate, type UserPreference
} from '../data/rt';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'bell': Bell, 'settings': Settings, 'file-text': FileText, 'megaphone': Megaphone,
    'users': Users, 'check-circle': CheckCircle, 'clock': Clock, 'alert-circle': AlertCircle,
    'mail': Mail, 'message-square': MessageSquare, 'smartphone': Smartphone, 'x': X,
    'filter': Filter, 'archive': Archive, 'eye': Eye, 'edit': Edit, 'send': Send,
    'trending-up': TrendingUp, 'trending-down': TrendingDown, 'minus': Minus, 'shield': Shield,
  };
  const IconComponent = icons[name] || Bell;
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

export function RtModule() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences' | 'templates' | 'broadcasts' | 'delivery'>('notifications');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const tabs = [
    { id: 'notifications', label: 'Notification Center', icon: 'bell' },
    { id: 'preferences', label: 'Preferences', icon: 'settings' },
    { id: 'templates', label: 'Templates', icon: 'file-text' },
    { id: 'broadcasts', label: 'Broadcasts', icon: 'megaphone' },
    { id: 'delivery', label: 'Delivery Log', icon: 'mail' },
  ];

  const currentUser = 'user-010'; // Simulated current user
  const notifStats = getNotificationStats(currentUser);
  const deliveryStats = getDeliveryStats();
  const categoryStats = getCategoryStats();

  const filteredNotifications = notifications.filter(n => {
    if (n.userId !== currentUser) return false;
    if (filterPriority !== 'all' && n.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && n.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Notifications</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 16 · ff.rt</p>
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
              {t.id === 'notifications' && notifStats.unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{notifStats.unread}</span>
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

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && !selectedNotification && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notification Center</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{notifStats.unread} unread · {notifStats.total} total</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                  <CheckCircle size={16} /> Mark All Read
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Unread</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{notifStats.unread}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">High Priority</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{notifStats.high}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Critical</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{notifStats.critical}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{notifStats.total}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Category</label>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Categories</option>
                    {notificationCategories.map(cat => (
                      <option key={cat.id} value={cat.code}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notification List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="divide-y divide-[var(--divider)]">
                {filteredNotifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-[var(--surface-hover)] cursor-pointer ${!notif.readAt ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedNotification(notif)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        notif.priority === 'critical' ? 'bg-red-100 text-red-600' :
                        notif.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                        notif.priority === 'normal' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon name={
                          notif.category === 'APPROVAL_REQUIRED' ? 'check-circle' :
                          notif.category === 'TASK_ASSIGNED' ? 'clock' :
                          notif.category === 'EXCEPTION_REQUESTED' ? 'alert-circle' :
                          notif.category === 'VIOLATION_RAISED' ? 'x' :
                          notif.category === 'SAFETY_INCIDENT' ? 'alert-circle' :
                          'bell'
                        } size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{notif.categoryName}</span>
                          <StatusChip
                            status={notif.priority}
                            variant={
                              notif.priority === 'critical' ? 'error' :
                              notif.priority === 'high' ? 'warning' :
                              notif.priority === 'normal' ? 'info' :
                              'neutral'
                            }
                          />
                          {!notif.readAt && (
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{notif.title}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{notif.body}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
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

        {/* NOTIFICATION DETAIL */}
        {activeTab === 'notifications' && selectedNotification && (
          <div className="space-y-6">
            <button onClick={() => setSelectedNotification(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to notifications
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedNotification.priority === 'critical' ? 'bg-red-100 text-red-600' :
                    selectedNotification.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Icon name="bell" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{selectedNotification.categoryName}</span>
                      <StatusChip
                        status={selectedNotification.priority}
                        variant={
                          selectedNotification.priority === 'critical' ? 'error' :
                          selectedNotification.priority === 'high' ? 'warning' :
                          'info'
                        }
                      />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedNotification.title}</h2>
                  </div>
                </div>
                {!selectedNotification.readAt && (
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    Mark as Read
                  </button>
                )}
              </div>

              <div className="mt-6">
                <p className="text-sm text-[var(--text-secondary)]">{selectedNotification.body}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Received</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedNotification.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedNotification.readAt && (
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Read</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedNotification.readAt).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedNotification.entityType && (
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Related Entity</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedNotification.entityType} #{selectedNotification.entityId}</p>
                    </div>
                  )}
                  {selectedNotification.link && (
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Action</p>
                      <button className="text-sm font-medium text-[var(--brand-primary)] mt-1 hover:underline">
                        View Details →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notification Preferences</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Configure how you receive notifications</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Channels</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Digest</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Quiet Hours</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Mandatory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {userPreferences.filter(p => p.userId === currentUser).map(pref => {
                    const category = notificationCategories.find(c => c.code === pref.category);
                    return (
                      <tr key={pref.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{pref.categoryName}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{category?.module}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {pref.channels.map(ch => (
                              <span key={ch} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 capitalize">{ch.replace('_', ' ')}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{pref.digest}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                          {pref.quietHoursStart ? `${pref.quietHoursStart} - ${pref.quietHoursEnd}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {category?.mandatory ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">YES</span>
                          ) : (
                            <span className="text-xs text-[var(--text-disabled)]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && !selectedTemplate && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notification Templates</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{notificationTemplates.length} templates · Version controlled</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Template
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Module</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Channel</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Subject</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Mandatory</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Modified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {notificationTemplates.map(tmpl => (
                    <tr key={tmpl.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedTemplate(tmpl)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{tmpl.code}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] uppercase">{tmpl.module}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 capitalize">{tmpl.channel.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{tmpl.subject}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-[var(--brand-primary)]">v{tmpl.version}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tmpl.isMandatoryCategory ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">YES</span>
                        ) : (
                          <span className="text-xs text-[var(--text-disabled)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(tmpl.lastModifiedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEMPLATE DETAIL */}
        {activeTab === 'templates' && selectedTemplate && (
          <div className="space-y-6">
            <button onClick={() => setSelectedTemplate(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to templates
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedTemplate.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] uppercase">{selectedTemplate.module}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 capitalize">{selectedTemplate.channel.replace('_', ' ')}</span>
                    <span className="text-xs font-bold text-[var(--brand-primary)]">v{selectedTemplate.version}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedTemplate.subject}</h2>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)]">
                    Preview
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                    Edit
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Body</h3>
                <div className="p-4 rounded-lg bg-[var(--surface-hover)] font-mono text-xs text-[var(--text-secondary)] whitespace-pre-wrap">
                  {selectedTemplate.body}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Variables</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map(v => (
                    <span key={v} className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 font-mono">{`{{${v}}}`}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Created By</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedTemplate.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Last Modified</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedTemplate.lastModifiedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BROADCASTS TAB */}
        {activeTab === 'broadcasts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Broadcast Announcements</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{broadcasts.length} broadcasts sent</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Broadcast
              </button>
            </div>

            <div className="space-y-4">
              {broadcasts.map(bc => (
                <div key={bc.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusChip
                          status={bc.priority}
                          variant={
                            bc.priority === 'critical' ? 'error' :
                            bc.priority === 'high' ? 'warning' :
                            'info'
                          }
                        />
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{bc.scope}</span>
                        {bc.scopeName && <span className="text-xs text-[var(--text-tertiary)]">· {bc.scopeName}</span>}
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{bc.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-2">{bc.body}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[var(--divider)]">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Sent By</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{bc.createdByName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Sent At</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(bc.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Recipients</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{bc.recipientCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Read</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{bc.readCount} / {bc.deliveredCount}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[var(--text-tertiary)]">Channels:</span>
                      {bc.channels.map(ch => (
                        <span key={ch} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 capitalize">{ch.replace('_', ' ')}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELIVERY LOG TAB */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Delivery Log</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{deliveryStats.total} deliveries · {deliveryStats.delivered} delivered · {deliveryStats.failed} failed</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{deliveryStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Delivered</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{deliveryStats.delivered}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{deliveryStats.failed}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{deliveryStats.pending}</p>
              </div>
            </div>

            {/* Delivery List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Notification</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Channel</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Provider</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Attempts</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Sent At</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {deliveries.map(delivery => {
                    const notif = notifications.find(n => n.id === delivery.notificationId);
                    return (
                      <tr key={delivery.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3">
                          <p className="text-xs font-mono text-[var(--brand-primary)]">{delivery.notificationId}</p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">{notif?.title}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 capitalize">{delivery.channel.replace('_', ' ')}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{delivery.provider}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip
                            status={delivery.status}
                            variant={
                              delivery.status === 'delivered' ? 'success' :
                              delivery.status === 'failed' ? 'error' :
                              delivery.status === 'sent' ? 'info' :
                              'neutral'
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{delivery.attempts}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(delivery.sentAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-red-600 max-w-xs truncate">{delivery.error || '—'}</td>
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
