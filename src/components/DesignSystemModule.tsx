import React, { useState } from 'react';
import {
  Palette, Type, Layout, Box, MousePointer, Table, FileText, Navigation,
  Bell, AlertTriangle, CheckCircle, Info, Shield, Eye, Code, BookOpen,
  ChevronRight, ChevronDown, Copy, ExternalLink
} from 'lucide-react';
import {
  designTokens, components, pageTemplates, protocolControlPoint,
  getComponentsByCategory, getComponentStats, getPageTemplateStats
} from '../data/ds';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'palette': Palette, 'type': Type, 'layout': Layout, 'box': Box,
    'button': MousePointer, 'table': Table, 'form': FileText, 'navigation': Navigation,
    'bell': Bell, 'alert': AlertTriangle, 'check': CheckCircle, 'info': Info,
    'shield': Shield, 'eye': Eye, 'code': Code, 'book': BookOpen,
    'chevron-right': ChevronRight, 'chevron-down': ChevronDown, 'copy': Copy,
    'external-link': ExternalLink,
  };
  const IconComponent = icons[name] || Box;
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

export function DesignSystemModule() {
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'templates' | 'protocol' | 'accessibility'>('tokens');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const tabs = [
    { id: 'tokens', label: 'Design Tokens', icon: 'palette' },
    { id: 'components', label: 'Components', icon: 'box' },
    { id: 'templates', label: 'Page Templates', icon: 'layout' },
    { id: 'protocol', label: 'Protocol Components', icon: 'shield' },
    { id: 'accessibility', label: 'Accessibility', icon: 'eye' },
  ];

  const componentStats = getComponentStats();
  const templateStats = getPageTemplateStats();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Design System</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 19 · ff.ds</p>
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

        {/* TOKENS TAB */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Design Tokens</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Centralized design tokens for consistent UI across the application</p>
            </div>

            {/* Colors */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Colors</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Brand Colors</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(designTokens.colors.brand).map(([name, value]) => (
                      <div key={name} className="p-3 rounded-lg border border-[var(--border)]">
                        <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: value }} />
                        <p className="text-xs font-medium text-[var(--text-primary)] capitalize">{name}</p>
                        <p className="text-xs font-mono text-[var(--text-tertiary)]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Semantic Colors</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(designTokens.colors.semantic).slice(0, 5).map(([name, value]) => (
                      <div key={name} className="p-3 rounded-lg border border-[var(--border)]">
                        <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: value }} />
                        <p className="text-xs font-medium text-[var(--text-primary)] capitalize">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Typography</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Font Families</p>
                  <div className="space-y-2">
                    {Object.entries(designTokens.typography.fontFamily).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-4 p-2 rounded-lg bg-[var(--surface-hover)]">
                        <span className="text-xs font-mono text-[var(--text-tertiary)] w-24">{name}</span>
                        <span className="text-sm text-[var(--text-primary)]" style={{ fontFamily: value }}>Sample Text</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Font Sizes</p>
                  <div className="space-y-2">
                    {Object.entries(designTokens.typography.fontSize).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-4 p-2 rounded-lg bg-[var(--surface-hover)]">
                        <span className="text-xs font-mono text-[var(--text-tertiary)] w-16">{name}</span>
                        <span className="text-sm text-[var(--text-primary)]" style={{ fontSize: value }}>Sample Text</span>
                        <span className="text-xs font-mono text-[var(--text-secondary)] ml-auto">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Font Weights</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(designTokens.typography.fontWeight).map(([name, value]) => (
                      <div key={name} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                        <p className="text-sm text-[var(--text-primary)] capitalize" style={{ fontWeight: value }}>Sample</p>
                        <p className="text-xs font-mono text-[var(--text-tertiary)] mt-1">{name} ({value})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Spacing (4pt Grid)</h3>
              <div className="space-y-2">
                {Object.entries(designTokens.spacing).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-4 p-2 rounded-lg bg-[var(--surface-hover)]">
                    <span className="text-xs font-mono text-[var(--text-tertiary)] w-16">{name}</span>
                    <div className="h-4 bg-[var(--brand-primary)] rounded" style={{ width: value }} />
                    <span className="text-xs font-mono text-[var(--text-secondary)] ml-auto">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Border Radius</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {Object.entries(designTokens.radius).map(([name, value]) => (
                  <div key={name} className="p-3 rounded-lg border border-[var(--border)]">
                    <div className="w-full h-12 bg-[var(--brand-primary)] mb-2" style={{ borderRadius: value }} />
                    <p className="text-xs font-medium text-[var(--text-primary)] capitalize">{name}</p>
                    <p className="text-xs font-mono text-[var(--text-tertiary)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Elevation */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Elevation / Shadows</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(designTokens.elevation).map(([name, value]) => (
                  <div key={name} className="p-4 rounded-lg bg-[var(--surface)]" style={{ boxShadow: value }}>
                    <p className="text-xs font-medium text-[var(--text-primary)] capitalize mb-1">{name}</p>
                    <p className="text-xs font-mono text-[var(--text-tertiary)]">{value === 'none' ? 'none' : 'shadow'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMPONENTS TAB */}
        {activeTab === 'components' && !selectedComponent && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Component Library</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{componentStats.total} components · {Object.keys(componentStats.byCategory).length} categories</p>
            </div>

            {/* Category Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(componentStats.byCategory).map(([category, count]) => (
                <div key={category} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs text-[var(--text-tertiary)] capitalize">{category}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{count}</p>
                </div>
              ))}
            </div>

            {/* Components by Category */}
            {['buttons', 'inputs', 'data-display', 'navigation', 'feedback', 'layout', 'protocol'].map(category => {
              const categoryComponents = getComponentsByCategory(category);
              if (categoryComponents.length === 0) return null;

              return (
                <div key={category} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-hover)]">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] capitalize">{category}</h3>
                  </div>
                  <div className="divide-y divide-[var(--divider)]">
                    {categoryComponents.map(component => (
                      <div
                        key={component.id}
                        className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)] cursor-pointer"
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center shrink-0">
                          <Icon name="box" size={20} className="text-[var(--text-tertiary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{component.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)] truncate">{component.description}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="text-xs text-[var(--text-secondary)]">{component.variants?.length || 0} variants</span>
                          <span className="text-xs text-[var(--text-secondary)]">·</span>
                          <span className="text-xs text-[var(--text-secondary)]">{component.states?.length || 0} states</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* COMPONENT DETAIL */}
        {activeTab === 'components' && selectedComponent && (
          <div className="space-y-6">
            <button onClick={() => setSelectedComponent(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to components
            </button>

            {(() => {
              const component = components.find(c => c.id === selectedComponent);
              if (!component) return null;

              return (
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">{component.name}</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{component.description}</p>
                    </div>
                    <StatusChip status={component.category} variant="info" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Variants</h3>
                      <div className="flex flex-wrap gap-2">
                        {component.variants?.map(variant => (
                          <span key={variant} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 capitalize">{variant}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">States</h3>
                      <div className="flex flex-wrap gap-2">
                        {component.states?.map(state => (
                          <span key={state} className="text-xs px-2 py-1 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{state}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Accessibility</h3>
                    <div className="space-y-2">
                      {component.accessibility?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-500" />
                          <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Responsive Behavior</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                        <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Mobile</p>
                        <p className="text-xs text-[var(--text-secondary)]">{component.responsive?.mobile ? '✓ Supported' : '✗ Not supported'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                        <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Tablet</p>
                        <p className="text-xs text-[var(--text-secondary)]">{component.responsive?.tablet ? '✓ Supported' : '✗ Not supported'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                        <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Desktop</p>
                        <p className="text-xs text-[var(--text-secondary)]">{component.responsive?.desktop ? '✓ Supported' : '✗ Not supported'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && !selectedTemplate && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Page Templates</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{templateStats.total} templates · {Object.keys(templateStats.byUseCase).length} use cases covered</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageTemplates.map(template => (
                <div
                  key={template.id}
                  className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] cursor-pointer"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-2">{template.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.components.slice(0, 4).map(comp => (
                      <span key={comp} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">{comp}</span>
                    ))}
                    {template.components.length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">+{template.components.length - 4}</span>
                    )}
                  </div>
                  <div className="pt-3 border-t border-[var(--divider)]">
                    <p className="text-xs text-[var(--text-tertiary)]">{template.useCases.length} use cases</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEMPLATE DETAIL */}
        {activeTab === 'templates' && selectedTemplate && (
          <div className="space-y-6">
            <button onClick={() => setSelectedTemplate(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to templates
            </button>

            {(() => {
              const template = pageTemplates.find(t => t.id === selectedTemplate);
              if (!template) return null;

              return (
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{template.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">{template.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Components Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {template.components.map(comp => (
                          <span key={comp} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">{comp}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Use Cases</h3>
                      <div className="space-y-2">
                        {template.useCases.map((useCase, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-hover)]">
                            <CheckCircle size={16} className="text-emerald-500" />
                            <span className="text-sm text-[var(--text-secondary)]">{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Responsive</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                          <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Mobile</p>
                          <p className="text-xs text-[var(--text-secondary)]">{template.responsive ? '✓ Supported' : '✗ Not supported'}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                          <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Tablet</p>
                          <p className="text-xs text-[var(--text-secondary)]">{template.responsive ? '✓ Supported' : '✗ Not supported'}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[var(--surface-hover)]">
                          <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Desktop</p>
                          <p className="text-xs text-[var(--text-secondary)]">{template.responsive ? '✓ Supported' : '✗ Not supported'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PROTOCOL TAB */}
        {activeTab === 'protocol' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Protocol Components</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Components for protocol control and compliance tracking</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[var(--brand-primary)]" />
                Protocol Control Point
              </h3>
              <div className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                <span className="text-xs font-mono font-medium text-[var(--brand-primary)] shrink-0">{protocolControlPoint.id}</span>
                <StatusChip status={protocolControlPoint.stage} variant="info" />
                <span className="text-sm text-[var(--text-primary)] flex-1">{protocolControlPoint.control}</span>
                <StatusChip status={protocolControlPoint.status} variant="warning" />
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Protocol Components</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {getComponentsByCategory('protocol').map(component => (
                  <div key={component.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center shrink-0">
                      <Icon name="shield" size={20} className="text-[var(--brand-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{component.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{component.description}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-xs text-[var(--text-secondary)]">{component.variants?.length || 0} variants</span>
                      <span className="text-xs text-[var(--text-secondary)]">·</span>
                      <span className="text-xs text-[var(--text-secondary)]">{component.states?.length || 0} states</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACCESSIBILITY TAB */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Accessibility</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">WCAG 2.1 AA compliance and accessibility features</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Accessibility Standards</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-900">WCAG 2.1 AA Compliance</p>
                    <p className="text-xs text-emerald-700 mt-1">All components meet WCAG 2.1 AA accessibility standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <CheckCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Keyboard Navigation</p>
                    <p className="text-xs text-blue-700 mt-1">Full keyboard support for all interactive components</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <CheckCircle size={20} className="text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Screen Reader Support</p>
                    <p className="text-xs text-purple-700 mt-1">ARIA labels and roles for screen reader compatibility</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <CheckCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Focus Management</p>
                    <p className="text-xs text-amber-700 mt-1">Visible focus indicators and proper focus order</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                  <CheckCircle size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Color Contrast</p>
                    <p className="text-xs text-indigo-700 mt-1">Minimum 4.5:1 contrast ratio for text, 3:1 for large text</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Accessibility Features by Component</h3>
              <div className="space-y-3">
                {components.filter(c => c.accessibility && c.accessibility.length > 0).slice(0, 10).map(component => (
                  <div key={component.id} className="p-3 rounded-lg border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{component.name}</p>
                      <span className="text-xs text-[var(--text-tertiary)]">{component.accessibility?.length || 0} features</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {component.accessibility?.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{feature}</span>
                      ))}
                      {(component.accessibility?.length || 0) > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                          +{(component.accessibility?.length || 0) - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
