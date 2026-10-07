import React, { useState } from 'react';
import {
  LayoutDashboard, Plus, Settings, Filter, RefreshCw, GripVertical, X, Edit, Save,
  TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Clock, FileText,
  Calendar, Bell, Briefcase, MapPin, User, ChevronRight, Eye, Download, MoreVertical
} from 'lucide-react';
import {
  widgets, kpis, defaultLayouts, userQuickActions, sampleWidgetData, protocolControlPoint,
  getWidgetsByModule, getWidgetsByType, getLayoutForUser, getKPIByCode, calculateRAGStatus, formatKPIValue,
  type Widget, type KPI, type Layout, type WidgetData, type DeviceType, type RAGStatus
} from '../data/dash';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'layout': LayoutDashboard, 'plus': Plus, 'settings': Settings, 'filter': Filter,
    'refresh': RefreshCw, 'grip': GripVertical, 'x': X, 'edit': Edit, 'save': Save,
    'trending-up': TrendingUp, 'trending-down': TrendingDown, 'minus': Minus,
    'alert': AlertCircle, 'check': CheckCircle, 'clock': Clock, 'file-text': FileText,
    'calendar': Calendar, 'bell': Bell, 'briefcase': Briefcase, 'map-pin': MapPin,
    'user': User, 'chevron-right': ChevronRight, 'eye': Eye, 'download': Download,
    'more': MoreVertical,
  };
  const IconComponent = icons[name] || LayoutDashboard;
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

// KPI Card Component
function KPICard({ data, kpi, onClick }: { data: WidgetData; kpi?: KPI; onClick?: () => void }) {
  const value = typeof data.value === 'number' ? data.value : parseFloat(String(data.value)) || 0;
  const previousValue = typeof data.previousValue === 'number' ? data.previousValue : parseFloat(String(data.previousValue)) || 0;
  const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const ragStatus = kpi ? calculateRAGStatus(value, kpi) : data.status || 'green';
  
  const ragColors = {
    red: 'border-red-300 bg-red-50',
    amber: 'border-amber-300 bg-amber-50',
    green: 'border-emerald-300 bg-emerald-50',
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 ${ragColors[ragStatus]} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-[var(--text-tertiary)]">{data.label}</p>
        <div className={`w-2 h-2 rounded-full ${
          ragStatus === 'green' ? 'bg-emerald-500' :
          ragStatus === 'amber' ? 'bg-amber-500' :
          'bg-red-500'
        }`} />
      </div>
      
      <div className="flex items-end justify-between mb-2">
        <p className="text-3xl font-bold text-[var(--text-primary)]">
          {kpi ? formatKPIValue(value, kpi.unit) : value}
        </p>
        {change !== 0 && (
          <div className={`flex items-center gap-1 text-xs ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <Icon name={change > 0 ? 'trending-up' : 'trending-down'} size={14} />
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {data.trend && data.trend.length > 0 && (
        <div className="flex items-end gap-1 h-12 mt-2">
          {data.trend.map((point, idx) => {
            const maxValue = Math.max(...data.trend!.map(p => p.value));
            const height = (point.value / maxValue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[var(--brand-primary)] rounded-t opacity-60"
                  style={{ height: `${height}%` }}
                  title={`${point.label}: ${point.value}`}
                />
                <span className="text-[9px] text-[var(--text-tertiary)]">{point.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {data.asOf && (
        <p className="text-[10px] text-[var(--text-tertiary)] mt-2">
          As of: {new Date(data.asOf).toLocaleString()}
        </p>
      )}
    </div>
  );
}

// Widget Container Component
function WidgetContainer({ widget, data, onEdit, onRemove }: {
  widget: Widget;
  data: WidgetData;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  if (data.loading) {
    return (
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={24} className="animate-spin text-[var(--brand-primary)] mx-auto mb-2" />
          <p className="text-xs text-[var(--text-tertiary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-4 rounded-xl border border-red-300 bg-red-50 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
          <p className="text-xs text-red-700">Error loading widget</p>
          <p className="text-xs text-red-600 mt-1">{data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] h-full">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{widget.name}</h3>
          <p className="text-xs text-[var(--text-tertiary)]">{widget.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-1 rounded hover:bg-[var(--surface-hover)]">
            <Edit size={14} className="text-[var(--text-tertiary)]" />
          </button>
          <button onClick={onRemove} className="p-1 rounded hover:bg-[var(--surface-hover)]">
            <X size={14} className="text-[var(--text-tertiary)]" />
          </button>
        </div>
      </div>

      {widget.type === 'kpi' && (
        <KPICard data={data} kpi={kpis.find(k => k.code === widget.code)} />
      )}

      {widget.type === 'list' && data.items && (
        <div className="space-y-2">
          {data.items.slice(0, 5).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] cursor-pointer">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                item.status === 'high' || item.status === 'critical' ? 'bg-red-100 text-red-600' :
                item.status === 'warn' || item.status === 'normal' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Icon name={
                  item.type === 'approval' ? 'check' :
                  item.type === 'exception' ? 'alert' :
                  item.type === 'overdue' ? 'clock' :
                  item.type === 'safety' ? 'alert' :
                  'file-text'
                } size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">{item.subtitle || item.message || item.time}</p>
              </div>
              {item.dueDate && (
                <span className="text-xs text-[var(--text-tertiary)] shrink-0">{item.dueDate}</span>
              )}
            </div>
          ))}
          {data.drillLink && (
            <button className="w-full text-xs text-[var(--brand-primary)] hover:underline mt-2 text-left">
              View all →
            </button>
          )}
        </div>
      )}

      {widget.type === 'table' && data.items && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-2 py-1 text-left text-[var(--text-tertiary)]">Name</th>
                <th className="px-2 py-1 text-left text-[var(--text-tertiary)]">Status</th>
                <th className="px-2 py-1 text-right text-[var(--text-tertiary)]">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--divider)]">
              {data.items.slice(0, 5).map((item, idx) => (
                <tr key={idx} className="hover:bg-[var(--surface-hover)]">
                  <td className="px-2 py-1 text-[var(--text-primary)]">{item.name || item.title}</td>
                  <td className="px-2 py-1">
                    <StatusChip status={item.status} variant={item.status === 'active' ? 'success' : 'neutral'} />
                  </td>
                  <td className="px-2 py-1 text-right text-[var(--text-secondary)]">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {widget.type === 'chart' && data.items && (
        <div className="space-y-3">
          {data.items.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--text-secondary)]">{item.category}</span>
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {item.actual} / {item.planned} {item.unit}
                </span>
              </div>
              <div className="h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.variance >= 0 ? 'bg-emerald-500' :
                    item.variance > -10 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(item.actual / item.planned) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {widget.type === 'custom' && widget.code === 'quick_actions' && (
        <div className="grid grid-cols-3 gap-2">
          {data.items?.map((item, idx) => (
            <button
              key={idx}
              className="p-3 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] text-center"
            >
              <Icon name={item.icon} size={20} className="text-[var(--brand-primary)] mx-auto mb-1" />
              <p className="text-xs text-[var(--text-primary)]">{item.title}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashModule() {
  const [editMode, setEditMode] = useState(false);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);
  const [showKPIDetail, setShowKPIDetail] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [filters, setFilters] = useState({ projectId: '', siteId: '', period: '' });

  const currentUser = 'user-010'; // Simulated current user
  const currentLayout = getLayoutForUser(currentUser, device);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Workspace</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Personalized dashboard with real-time updates</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-2 text-sm rounded-lg ${
                editMode ? 'bg-[var(--brand-primary)] text-white' : 'border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {editMode ? '✓ Done' : '✎ Edit'}
            </button>
            <button
              onClick={() => setShowWidgetGallery(true)}
              className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2"
            >
              <Plus size={16} /> Add Widget
            </button>
          </div>
        </div>

        {/* Global Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--text-tertiary)]" />
            <select
              value={filters.projectId}
              onChange={e => setFilters({ ...filters, projectId: e.target.value })}
              className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
            >
              <option value="">All Projects</option>
              <option value="prj-001">Metro Tower Phase II</option>
              <option value="prj-002">Highway Bridge NH-48</option>
            </select>
          </div>
          <select
            value={filters.siteId}
            onChange={e => setFilters({ ...filters, siteId: e.target.value })}
            className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
          >
            <option value="">All Sites</option>
            <option value="site-001">Metro Tower Site A</option>
            <option value="site-002">Metro Tower Site B</option>
          </select>
          <select
            value={filters.period}
            onChange={e => setFilters({ ...filters, period: e.target.value })}
            className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <div className="flex-1" />
          <div className="flex items-center gap-1 bg-[var(--surface-hover)] rounded-lg p-1">
            {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map(d => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`px-3 py-1 text-xs rounded ${device === d ? 'bg-[var(--surface)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentLayout ? (
          <div className={`grid gap-4 ${
            device === 'desktop' ? 'grid-cols-12' :
            device === 'tablet' ? 'grid-cols-8' :
            'grid-cols-4'
          }`}>
            {currentLayout.items.map((item, idx) => {
              const widget = widgets.find(w => w.code === item.widgetCode);
              const data = sampleWidgetData[item.widgetCode];
              
              if (!widget || !data) return null;

              return (
                <div
                  key={idx}
                  className={`${
                    device === 'desktop' ? `col-span-${item.w} row-span-${item.h}` :
                    device === 'tablet' ? `col-span-${Math.min(item.w, 8)} row-span-${item.h}` :
                    'col-span-4'
                  }`}
                  style={{ gridColumn: `span ${item.w}`, gridRow: `span ${item.h}` }}
                >
                  {editMode && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[var(--surface)] rounded-lg shadow-md p-1">
                      <button className="p-1 rounded hover:bg-[var(--surface-hover)]">
                        <GripVertical size={14} className="text-[var(--text-tertiary)]" />
                      </button>
                      <button className="p-1 rounded hover:bg-[var(--surface-hover)]">
                        <Edit size={14} className="text-[var(--text-tertiary)]" />
                      </button>
                      <button className="p-1 rounded hover:bg-[var(--surface-hover)]">
                        <X size={14} className="text-[var(--text-tertiary)]" />
                      </button>
                    </div>
                  )}
                  <WidgetContainer
                    widget={widget}
                    data={data}
                    onEdit={() => {}}
                    onRemove={() => {}}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <LayoutDashboard size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-sm text-[var(--text-secondary)]">No layout configured for this device</p>
              <button className="mt-4 px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg">
                Create Layout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Widget Gallery Drawer */}
      {showWidgetGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowWidgetGallery(false)}>
          <div className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Widget Gallery</h3>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Add widgets to your workspace</p>
              </div>
              <button onClick={() => setShowWidgetGallery(false)} className="p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {['workflow', 'notification', 'org', 'protocol', 'accountability', 'shell'].map(module => {
                  const moduleWidgets = getWidgetsByModule(module);
                  if (moduleWidgets.length === 0) return null;

                  return (
                    <div key={module}>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 capitalize">{module}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {moduleWidgets.map(widget => (
                          <div key={widget.id} className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--brand-primary)] cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <Icon name={
                                widget.type === 'kpi' ? 'trending-up' :
                                widget.type === 'list' ? 'file-text' :
                                widget.type === 'table' ? 'layout' :
                                widget.type === 'chart' ? 'trending-up' :
                                'layout'
                              } size={20} className="text-[var(--brand-primary)]" />
                              <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{widget.type}</span>
                            </div>
                            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{widget.name}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">{widget.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Detail Drawer */}
      {showKPIDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowKPIDetail(null)}>
          <div className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">KPI Detail</h3>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{showKPIDetail}</p>
              </div>
              <button onClick={() => setShowKPIDetail(null)} className="p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const kpi = kpis.find(k => k.code === showKPIDetail);
                const data = sampleWidgetData[showKPIDetail];
                if (!kpi || !data) return null;

                return (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Definition</h4>
                      <div className="p-4 rounded-lg bg-[var(--surface-hover)]">
                        <p className="text-xs text-[var(--text-tertiary)] mb-1">Formula</p>
                        <p className="text-sm font-mono text-[var(--text-primary)]">{kpi.formulaDescription}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Thresholds</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-xs text-red-700 mb-1">Red</p>
                          <p className="text-lg font-bold text-red-900">{kpi.thresholds.red}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs text-amber-700 mb-1">Amber</p>
                          <p className="text-lg font-bold text-amber-900">{kpi.thresholds.amber}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <p className="text-xs text-emerald-700 mb-1">Green</p>
                          <p className="text-lg font-bold text-emerald-900">{kpi.thresholds.green}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Current Value</h4>
                      <KPICard data={data} kpi={kpi} />
                    </div>

                    {data.drillLink && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Drill Down</h4>
                        <button className="w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-left">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">View Source Data</p>
                              <p className="text-xs text-[var(--text-tertiary)] mt-1">{data.drillLink}</p>
                            </div>
                            <ChevronRight size={20} className="text-[var(--text-tertiary)]" />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Protocol Control Point */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-medium text-[var(--brand-primary)]">{protocolControlPoint.id}</span>
          <StatusChip status={protocolControlPoint.stage} variant="info" />
          <span className="text-xs text-[var(--text-secondary)] flex-1">{protocolControlPoint.control}</span>
          <StatusChip status={protocolControlPoint.status} variant="warning" />
        </div>
      </div>
    </div>
  );
}
