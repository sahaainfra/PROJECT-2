import React, { useState } from 'react';
import {
  FileText, Layout, Palette, Hash, History, Eye, Edit, Plus, Copy, Archive,
  CheckCircle, Clock, AlertCircle, Filter, Search, Download, Upload,
  ChevronRight, ChevronDown, X, Save, Send, Settings, Users, Building2,
  DollarSign, Calendar, MapPin, FileCheck, FileWarning, TrendingUp
} from 'lucide-react';
import {
  templates, brandProfiles, variables, numberingRules, documentRevisions,
  protocolControlPoints, getTemplateStats, getTemplatesByCategory, getTemplatesByScope,
  getTemplatesByStatus, getTemplateUsageStats,
  type Template, type BrandProfile, type NumberingRule, type DocumentRevision
} from '../data/docfmt';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'file': FileText, 'layout': Layout, 'palette': Palette, 'hash': Hash,
    'history': History, 'eye': Eye, 'edit': Edit, 'plus': Plus, 'copy': Copy,
    'archive': Archive, 'check': CheckCircle, 'clock': Clock, 'alert': AlertCircle,
    'filter': Filter, 'search': Search, 'download': Download, 'upload': Upload,
    'chevron-right': ChevronRight, 'chevron-down': ChevronDown, 'x': X,
    'save': Save, 'send': Send, 'settings': Settings, 'users': Users,
    'building': Building2, 'dollar': DollarSign, 'calendar': Calendar,
    'map-pin': MapPin, 'file-check': FileCheck, 'file-warning': FileWarning,
    'trending-up': TrendingUp,
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

export function DocfmtModule() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library' | 'designer' | 'brand' | 'numbering' | 'revisions'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandProfile | null>(null);
  const [selectedRevision, setSelectedRevision] = useState<DocumentRevision | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout' },
    { id: 'library', label: 'Template Library', icon: 'file' },
    { id: 'designer', label: 'Template Designer', icon: 'edit' },
    { id: 'brand', label: 'Brand Profiles', icon: 'palette' },
    { id: 'numbering', label: 'Numbering Rules', icon: 'hash' },
    { id: 'revisions', label: 'Revision History', icon: 'history' },
  ];

  const templateStats = getTemplateStats();
  const usageStats = getTemplateUsageStats();

  // Filter templates
  const filteredTemplates = templates.filter(tmpl => {
    if (filterCategory !== 'all' && tmpl.category !== filterCategory) return false;
    if (filterScope !== 'all' && tmpl.scope !== filterScope) return false;
    if (filterStatus !== 'all' && tmpl.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tmpl.name.toLowerCase().includes(query) ||
        tmpl.code.toLowerCase().includes(query) ||
        tmpl.documentType.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Document Templates</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 26 · ff.docfmt</p>
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

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Document Template Dashboard</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Overview of template usage, approvals, and statistics</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total Templates</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{templateStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Active</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{templateStats.active}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Draft</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{templateStats.draft}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{templateStats.approved}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Retired</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">{templateStats.retired}</p>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-500" />
                  Most Used Templates
                </h3>
                <div className="space-y-3">
                  {usageStats.mostUsed.map((tmpl, idx) => (
                    <div key={tmpl.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-hover)]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[var(--brand-primary)] w-6">{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{tmpl.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{tmpl.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--text-primary)]">{tmpl.usageCount}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">uses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <FileWarning size={16} className="text-amber-500" />
                  Recently Updated Templates
                </h3>
                <div className="space-y-3">
                  {templates
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 5)
                    .map(tmpl => (
                      <div key={tmpl.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-hover)]">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{tmpl.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">v{tmpl.version} · {tmpl.documentType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--text-tertiary)]">{new Date(tmpl.updatedAt).toLocaleDateString()}</p>
                          <StatusChip
                            status={tmpl.status}
                            variant={
                              tmpl.status === 'active' ? 'success' :
                              tmpl.status === 'approved' ? 'info' :
                              tmpl.status === 'draft' ? 'warning' :
                              'neutral'
                            }
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Protocol Control Points */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <FileCheck size={16} className="text-[var(--brand-primary)]" />
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

        {/* TEMPLATE LIBRARY TAB */}
        {activeTab === 'library' && !selectedTemplate && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Template Library</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{filteredTemplates.length} templates available</p>
              </div>
              <button
                onClick={() => setActiveTab('designer')}
                className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2"
              >
                <Plus size={16} /> New Template
              </button>
            </div>

            {/* Filters */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Search</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search templates..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Category</label>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Categories</option>
                    <option value="commercial">Commercial</option>
                    <option value="financial">Financial</option>
                    <option value="procurement">Procurement</option>
                    <option value="construction">Construction</option>
                    <option value="quality">Quality</option>
                    <option value="planning">Planning</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Scope</label>
                  <select
                    value={filterScope}
                    onChange={e => setFilterScope(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Scopes</option>
                    <option value="corporate">Corporate</option>
                    <option value="company">Company</option>
                    <option value="project">Project</option>
                    <option value="client">Client</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="approved">Approved</option>
                    <option value="draft">Draft</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(tmpl => (
                <div
                  key={tmpl.id}
                  className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] cursor-pointer transition-colors"
                  onClick={() => setSelectedTemplate(tmpl)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-mono text-[var(--brand-primary)] mb-1">{tmpl.code}</p>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{tmpl.name}</h3>
                    </div>
                    <StatusChip
                      status={tmpl.status}
                      variant={
                        tmpl.status === 'active' ? 'success' :
                        tmpl.status === 'approved' ? 'info' :
                        tmpl.status === 'draft' ? 'warning' :
                        'neutral'
                      }
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Icon name="file" size={14} className="text-[var(--text-tertiary)]" />
                      <span className="text-[var(--text-secondary)]">{tmpl.documentType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Icon name="users" size={14} className="text-[var(--text-tertiary)]" />
                      <span className="text-[var(--text-secondary)] capitalize">{tmpl.audience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Icon name="building" size={14} className="text-[var(--text-tertiary)]" />
                      <span className="text-[var(--text-secondary)] capitalize">{tmpl.scope}</span>
                      {tmpl.projectName && <span className="text-[var(--text-tertiary)]">· {tmpl.projectName}</span>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--divider)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">v{tmpl.version}</span>
                    <span className="text-[var(--text-tertiary)]">{tmpl.usageCount} uses</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEMPLATE DETAIL */}
        {activeTab === 'library' && selectedTemplate && (
          <div className="space-y-6">
            <button onClick={() => setSelectedTemplate(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to template library
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedTemplate.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">v{selectedTemplate.version}</span>
                    <StatusChip
                      status={selectedTemplate.status}
                      variant={
                        selectedTemplate.status === 'active' ? 'success' :
                        selectedTemplate.status === 'approved' ? 'info' :
                        selectedTemplate.status === 'draft' ? 'warning' :
                        'neutral'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedTemplate.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedTemplate.documentType} · {selectedTemplate.module}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                    <Eye size={14} /> Preview
                  </button>
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                    <Copy size={14} /> Clone
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                    <Edit size={14} /> Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Category</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedTemplate.category}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Audience</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedTemplate.audience}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Scope</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedTemplate.scope}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Usage Count</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedTemplate.usageCount}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Template Information</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[var(--text-tertiary)]">Owner</p>
                    <p className="text-[var(--text-primary)] mt-1">{selectedTemplate.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)]">Approved By</p>
                    <p className="text-[var(--text-primary)] mt-1">{selectedTemplate.approvedByName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)]">Effective From</p>
                    <p className="text-[var(--text-primary)] mt-1">{new Date(selectedTemplate.effectiveFrom).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)]">Last Updated</p>
                    <p className="text-[var(--text-primary)] mt-1">{new Date(selectedTemplate.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Variables ({selectedTemplate.variablesJson.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variablesJson.map((v, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 font-mono">{`{{${v}}}`}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Document Settings</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[var(--text-tertiary)]">Paper Size</p>
                    <p className="text-[var(--text-primary)] mt-1">{selectedTemplate.paperSize}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)]">Orientation</p>
                    <p className="text-[var(--text-primary)] mt-1 capitalize">{selectedTemplate.orientation}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)]">Margins</p>
                    <p className="text-[var(--text-primary)] mt-1">
                      T:{selectedTemplate.margins.top} R:{selectedTemplate.margins.right} B:{selectedTemplate.margins.bottom} L:{selectedTemplate.margins.left}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BRAND PROFILES TAB */}
        {activeTab === 'brand' && !selectedBrand && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Brand Profiles</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{brandProfiles.length} brand profiles configured</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New Brand Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandProfiles.map(brand => (
                <div
                  key={brand.id}
                  className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] cursor-pointer transition-colors"
                  onClick={() => setSelectedBrand(brand)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center">
                      <Icon name="building" size={32} className="text-[var(--text-tertiary)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{brand.companyName}</h3>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1 capitalize">{brand.scopeType} Level</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-2">{brand.scopeName}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Icon name="file" size={14} className="text-[var(--text-tertiary)]" />
                      <span className="text-[var(--text-secondary)]">GSTIN: {brand.gstin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="mail" size={14} className="text-[var(--text-tertiary)]" />
                      <span className="text-[var(--text-secondary)]">{brand.email}</span>
                    </div>
                    {brand.bankDetails.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Icon name="dollar" size={14} className="text-[var(--text-tertiary)]" />
                        <span className="text-[var(--text-secondary)]">{brand.bankDetails.length} bank account(s)</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[var(--divider)] flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: brand.colors.primary }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: brand.colors.secondary }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: brand.colors.accent }} />
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)]">Updated: {new Date(brand.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRAND DETAIL */}
        {activeTab === 'brand' && selectedBrand && (
          <div className="space-y-6">
            <button onClick={() => setSelectedBrand(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to brand profiles
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedBrand.companyName}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 capitalize">{selectedBrand.scopeType} Level · {selectedBrand.scopeName}</p>
                </div>
                <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Company Information</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[var(--text-tertiary)]">Registered Address</p>
                      <p className="text-[var(--text-primary)] mt-1">{selectedBrand.registeredAddress}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">Contact</p>
                      <p className="text-[var(--text-primary)] mt-1">{selectedBrand.contacts}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">Email</p>
                      <p className="text-[var(--text-primary)] mt-1">{selectedBrand.email}</p>
                    </div>
                    {selectedBrand.website && (
                      <div>
                        <p className="text-[var(--text-tertiary)]">Website</p>
                        <p className="text-[var(--text-primary)] mt-1">{selectedBrand.website}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Tax Information</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[var(--text-tertiary)]">GSTIN</p>
                      <p className="text-[var(--text-primary)] mt-1 font-mono">{selectedBrand.gstin}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">PAN</p>
                      <p className="text-[var(--text-primary)] mt-1 font-mono">{selectedBrand.pan}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-tertiary)]">CIN</p>
                      <p className="text-[var(--text-primary)] mt-1 font-mono">{selectedBrand.cin}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBrand.bankDetails.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Bank Details</h3>
                  <div className="space-y-3">
                    {selectedBrand.bankDetails.map((bank, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{bank.bankName}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-[var(--text-tertiary)]">Account Number</p>
                            <p className="text-[var(--text-primary)] mt-1 font-mono">{bank.accountNumber}</p>
                          </div>
                          <div>
                            <p className="text-[var(--text-tertiary)]">IFSC Code</p>
                            <p className="text-[var(--text-primary)] mt-1 font-mono">{bank.ifscCode}</p>
                          </div>
                          <div>
                            <p className="text-[var(--text-tertiary)]">Branch</p>
                            <p className="text-[var(--text-primary)] mt-1">{bank.branch}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Brand Colors</h3>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg mb-2" style={{ backgroundColor: selectedBrand.colors.primary }} />
                    <p className="text-xs text-[var(--text-tertiary)]">Primary</p>
                    <p className="text-xs font-mono text-[var(--text-primary)]">{selectedBrand.colors.primary}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg mb-2" style={{ backgroundColor: selectedBrand.colors.secondary }} />
                    <p className="text-xs text-[var(--text-tertiary)]">Secondary</p>
                    <p className="text-xs font-mono text-[var(--text-primary)]">{selectedBrand.colors.secondary}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg mb-2" style={{ backgroundColor: selectedBrand.colors.accent }} />
                    <p className="text-xs text-[var(--text-tertiary)]">Accent</p>
                    <p className="text-xs font-mono text-[var(--text-primary)]">{selectedBrand.colors.accent}</p>
                  </div>
                </div>
              </div>

              {selectedBrand.footerNotes && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Footer Notes</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{selectedBrand.footerNotes}</p>
                </div>
              )}

              {selectedBrand.disclaimers && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Disclaimers</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{selectedBrand.disclaimers}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NUMBERING RULES TAB */}
        {activeTab === 'numbering' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Numbering Rules</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{numberingRules.length} numbering rules configured</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New Rule
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Pattern</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Gapless</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Reset Rule</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Current Seq</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {numberingRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{rule.documentType}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{rule.pattern}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                        <span className="capitalize">{rule.scope}</span>
                        {rule.scopeName && <span className="text-[var(--text-tertiary)]"> · {rule.scopeName}</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rule.isGapless ? (
                          <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                        ) : (
                          <X size={16} className="text-[var(--text-disabled)] mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">
                          {rule.resetRule.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{rule.currentSequence}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {rule.lastGenerated ? new Date(rule.lastGenerated).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVISIONS TAB */}
        {activeTab === 'revisions' && !selectedRevision && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Revision History</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{documentRevisions.length} document revisions tracked</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Revision</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {documentRevisions.map(rev => (
                    <tr key={rev.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedRevision(rev)}>
                      <td className="px-4 py-3">
                        <p className="text-xs font-mono text-[var(--brand-primary)]">{rev.documentNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{rev.documentType}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-[var(--text-primary)]">v{rev.versionNo}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{rev.revisionNo}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(rev.revisionDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{rev.reason}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rev.approvedByName}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={rev.status}
                          variant={
                            rev.status === 'issued' ? 'success' :
                            rev.status === 'superseded' ? 'neutral' :
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

        {/* REVISION DETAIL */}
        {activeTab === 'revisions' && selectedRevision && (
          <div className="space-y-6">
            <button onClick={() => setSelectedRevision(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to revision history
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedRevision.documentNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">v{selectedRevision.versionNo}</span>
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedRevision.revisionNo}</span>
                    <StatusChip
                      status={selectedRevision.status}
                      variant={
                        selectedRevision.status === 'issued' ? 'success' :
                        selectedRevision.status === 'superseded' ? 'neutral' :
                        'error'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedRevision.documentType} Revision</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Revision Date</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedRevision.revisionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Prepared By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRevision.preparedByName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Checked By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRevision.checkedByName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Approved By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRevision.approvedByName}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Reason for Revision</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedRevision.reason}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Change Summary</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedRevision.changeSummary}</p>
              </div>

              {selectedRevision.previousVersionId && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Previous Version</h3>
                  <p className="text-xs font-mono text-[var(--brand-primary)]">{selectedRevision.previousVersionId}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DESIGNER TAB (Placeholder) */}
        {activeTab === 'designer' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Template Designer</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Visual template designer with live preview</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-12 text-center">
              <Icon name="edit" size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-sm text-[var(--text-secondary)]">Template Designer</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">Visual drag-and-drop template editor with live preview will be available in the next update</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
