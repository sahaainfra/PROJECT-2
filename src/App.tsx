import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Home, FolderOpen, ShoppingCart, Warehouse, DollarSign, Users, Shield, BarChart3,
  Building2, GitBranch, Calculator, CalendarDays, FileText, ClipboardList, Truck, FileCheck,
  Package, Boxes, ArrowUpRight, Receipt, PieChart, Clock, User, Search, AlertTriangle,
  LayoutDashboard, FileBarChart, Bell, Settings, Moon, Sun, Monitor, Menu, X,
  ChevronDown, ChevronRight, LogOut, UserCircle, Command, Maximize2, Minimize2,
  Eye, EyeOff, Contrast, Layers, Grid3X3, Zap, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, AlertCircle, Info, ArrowRight, MoreHorizontal, Filter,
  Download, RefreshCw, ChevronLeft, Hash, Activity, Target, Briefcase, HardHat, Flag
} from 'lucide-react';
import { lightTokens, darkTokens, highContrastTokens, type DesignTokens, type ThemeMode, type DensityMode } from './design/tokens';
import { navigationRegistry, type NavGroup, type NavEntry } from './data/navigation';
import {
  stackInfo, modulesInventory, dbEntities, apiInventory, calculationsInventory,
  riskRegister, conflicts, gapMatrix, controlInventory, dependencyMap, socketEvents, backgroundJobs
} from './data/audit';
import {
  personas, widgetRegistry, initialFeedback, getWidgetsForPersona,
  type PersonaKey, type WidgetDef, type FeedbackEntry, type Persona
} from './data/preview';
import {
  pipelineStages, releases, featureFlags as cicdFlags, evidenceBundles,
  quarantinedTests, gateThresholds, regressionSuites,
  type Release, type GateResult, type FeatureFlag, type EvidenceBundle
} from './data/cicd';
import {
  serviceHooks, outboxMetrics, jobMetrics, numberSeriesStatus,
  errorCodes, protocolControlPoints, sampleModuleActions
} from './data/core';
import {
  companies, groups, legalEntities, branches, businessUnits, divisions,
  departments, costCentres, profitCentres, projects, sites, geofences,
  allocations, statusMappings, projectLifecycleOrder, siteLifecycleOrder,
  getProjectStatusVariant, getSiteStatusVariant, getNextProjectStatuses,
  getNextSiteStatuses, protocolControlPoints as orgProtocolControlPoints,
  type Project, type Site, type ProjectAllocation
} from './data/org';
import {
  permissions, roles, rolePermissions, userRoleAssignments, fieldPolicies,
  recordRules, sodRules, legacyPermissionMap, protocolControlPoints as iamProtocolControlPoints,
  getPermissionsByModule, getRolePermissions, getUserAssignments, checkSodConflict,
  type Permission, type Role, type UserRoleAssignment, type SodRule
} from './data/iam';
import { AuditSecModule } from './components/AuditSecModule';
import { SecBaseModule } from './components/SecBaseModule';
import { IdSodModule } from './components/IdSodModule';
import { ObsModule } from './components/ObsModule';
import { EvBusModule } from './components/EvBusModule';
import { WfModule } from './components/WfModule';
import { RulesModule } from './components/RulesModule';
import { ProtocolModule } from './components/ProtocolModule';

// ===== FEATURE FLAGS (ff.pgm) =====
const featureFlags: Record<string, boolean> = {
  'ff.pgm': true,
  'ff.pgm.theme': true,
  'ff.tech_console': true,
  'ff.audit': true,
  'ff.preview': true,
  'ff.cicd': true,
  'ff.core': true,
  'ff.org': true,
  'ff.iam': true,
  'ff.audit_sec': true,
  'ff.secbase': true,
  'ff.idsod': true,
  'ff.obs': true,
  'ff.evbus': true,
  'ff.wf': true,
  'ff.rules': true,
  'ff.protocol': true,
};

function isEnabled(flagKey: string): boolean {
  return featureFlags[flagKey] ?? false;
}

// ===== THEME CONTEXT =====
interface ThemeContextType {
  theme: ThemeMode;
  density: DensityMode;
  tokens: DesignTokens;
  setTheme: (t: ThemeMode) => void;
  setDensity: (d: DensityMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  density: 'cozy',
  tokens: lightTokens,
  setTheme: () => {},
  setDensity: () => {},
});

function useTheme() { return useContext(ThemeContext); }

function getTokensForTheme(theme: ThemeMode): DesignTokens {
  switch (theme) {
    case 'dark': return darkTokens;
    case 'high-contrast': return highContrastTokens;
    default: return lightTokens;
  }
}

// ===== ICON MAP =====
const iconMap: Record<string, React.ComponentType<any>> = {
  home: Home, grid: Grid3X3, folder: FolderOpen, building: Building2, sitemap: GitBranch,
  'git-branch': GitBranch, calculator: Calculator, calendar: CalendarDays, 'file-text': FileText,
  clipboard: ClipboardList, truck: Truck, 'file-check': FileCheck, cart: ShoppingCart,
  warehouse: Warehouse, package: Package, boxes: Boxes, 'arrow-up-right': ArrowUpRight,
  dollar: DollarSign, receipt: Receipt, users: Users, 'pie-chart': PieChart,
  'user-check': Shield, clock: Clock, user: User, search: Search,
  'alert-triangle': AlertTriangle, 'alert-circle': AlertCircle,
  'layout-dashboard': LayoutDashboard, 'file-bar-chart': FileBarChart, shield: Shield,
  'bar-chart': BarChart3, layers: Layers, database: Boxes, target: Target,
  flag: Flag, activity: Activity,
};

function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const IconComponent = iconMap[name] || Grid3X3;
  return <IconComponent size={size} className={className} />;
}

// ===== SHELL BAR =====
function ShellBar({ onToggleSidebar, sidebarCollapsed }: { onToggleSidebar: () => void; sidebarCollapsed: boolean }) {
  const { theme, setTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="h-14 flex items-center px-4 gap-3 bg-[var(--shell-bg)] text-[var(--shell-text)] relative z-50 shrink-0">
      <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <HardHat size={18} className="text-white" />
        </div>
        <span className="font-semibold text-sm hidden sm:block">Construction ERP</span>
      </div>

      {/* Context Switcher */}
      <div className="hidden md:flex items-center gap-1 ml-4 px-3 py-1.5 rounded-lg bg-white/10 text-sm">
        <Briefcase size={14} className="opacity-70" />
        <span className="font-medium">Apex Construction Ltd.</span>
        <ChevronDown size={14} className="opacity-50" />
        <span className="mx-1 opacity-30">|</span>
        <Building2 size={14} className="opacity-70" />
        <span className="font-medium">Metro Tower Project</span>
        <ChevronDown size={14} className="opacity-50" />
      </div>

      <div className="flex-1" />

      {/* Global Search */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors"
      >
        <Search size={16} className="opacity-70" />
        <span className="opacity-70">Search...</span>
        <kbd className="text-xs opacity-50 bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      {/* Theme Toggle */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          title="Light theme"
        >
          <Sun size={18} />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          title="Dark theme"
        >
          <Moon size={18} />
        </button>
        <button
          onClick={() => setTheme('high-contrast')}
          className={`p-2 rounded-lg transition-colors hidden sm:block ${theme === 'high-contrast' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          title="High contrast"
        >
          <Contrast size={18} />
        </button>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">3</span>
        </button>
        {showNotif && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
              <span className="font-semibold text-sm text-[var(--text-primary)]">Notifications</span>
              <span className="text-xs text-[var(--text-tertiary)]">3 unread</span>
            </div>
            {[
              { title: 'PO-2024-0892 pending approval', time: '5 min ago', type: 'warning' },
              { title: 'GRN received at Site B', time: '1 hour ago', type: 'info' },
              { title: 'Safety incident reported', time: '2 hours ago', type: 'error' },
            ].map((n, i) => (
              <div key={i} className="p-3 border-b border-[var(--divider)] hover:bg-[var(--surface-hover)] cursor-pointer">
                <p className="text-sm text-[var(--text-primary)]">{n.title}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Menu */}
      <div className="relative">
        <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
            RK
          </div>
          <span className="hidden lg:block text-sm">Rajesh Kumar</span>
        </button>
        {showUser && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-3 border-b border-[var(--border)]">
              <p className="font-medium text-sm text-[var(--text-primary)]">Rajesh Kumar</p>
              <p className="text-xs text-[var(--text-tertiary)]">Project Manager</p>
            </div>
            <button onClick={() => navigate('/preferences')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)]">
              <Settings size={16} /> Preferences
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)]">
              <UserCircle size={16} /> Profile
            </button>
            <div className="border-t border-[var(--divider)]">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute inset-0 top-full bg-[var(--overlay)] z-50 flex items-start justify-center pt-8" onClick={() => setShowSearch(false)}>
          <div className="w-full max-w-xl bg-[var(--surface)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
              <Search size={20} className="text-[var(--text-tertiary)]" />
              <input autoFocus placeholder="Search modules, records, reports..." className="flex-1 bg-transparent text-[var(--text-primary)] outline-none text-sm" />
              <kbd className="text-xs text-[var(--text-tertiary)] bg-[var(--surface-hover)] px-2 py-1 rounded">ESC</kbd>
            </div>
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-[var(--text-tertiary)] uppercase">Quick Actions</p>
              {['New Purchase Request', 'Create Project', 'View My Approvals', 'Stock Report'].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--surface-hover)] text-sm text-[var(--text-primary)]">
                  <ArrowRight size={14} className="text-[var(--text-tertiary)]" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ===== SIDEBAR NAVIGATION =====
function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate: (route: string) => void }) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['home', 'project-management', 'procurement']);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col transition-all duration-300 overflow-hidden shrink-0`}>
      <nav className="flex-1 overflow-y-auto py-2">
        {navigationRegistry.map(group => (
          <div key={group.id} className="mb-1">
            <button
              onClick={() => !collapsed && toggleGroup(group.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              } ${expandedGroups.includes(group.id) || collapsed ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
              title={collapsed ? group.label : undefined}
            >
              <Icon name={group.iconKey} size={20} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronRight size={14} className={`transition-transform ${expandedGroups.includes(group.id) ? 'rotate-90' : ''}`} />
                </>
              )}
            </button>
            {!collapsed && expandedGroups.includes(group.id) && (
              <div className="ml-2">
                {group.entries.filter(e => isEnabled(e.featureFlag)).map(entry => {
                  const isActive = location.pathname === entry.route || (entry.route !== '/' && location.pathname.startsWith(entry.route));
                  return (
                    <button
                      key={entry.id}
                      onClick={() => onNavigate(entry.route)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg mx-1 transition-colors ${
                        isActive
                          ? 'bg-[var(--brand-primary)] text-white font-medium'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon name={entry.iconKey} size={16} className="shrink-0" />
                      <span className="flex-1 text-left">{entry.label}</span>
                      {entry.badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-[var(--brand-primary)] text-white'}`}>
                          {entry.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[var(--surface-hover)]">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-xs text-[var(--text-secondary)]">System Online</span>
            <span className="ml-auto text-xs text-[var(--text-tertiary)]">v0.1.0</span>
          </div>
        </div>
      )}
    </aside>
  );
}

// ===== KPI CARD =====
function KPICard({ title, value, change, changeType, icon, color }: {
  title: string; value: string; change: string; changeType: 'up' | 'down' | 'neutral'; icon: string; color: string;
}) {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 font-tabular">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon name={icon} size={20} className="text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3">
        {changeType === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
        {changeType === 'down' && <TrendingDown size={14} className="text-red-500" />}
        <span className={`text-xs font-medium ${changeType === 'up' ? 'text-emerald-500' : changeType === 'down' ? 'text-red-500' : 'text-[var(--text-tertiary)]'}`}>
          {change}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">vs last month</span>
      </div>
    </div>
  );
}

// ===== LAUNCHPAD TILE =====
function LaunchpadTile({ label, icon, count, color, route, onClick }: {
  label: string; icon: string; count?: number; color: string; route: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:shadow-lg hover:border-[var(--brand-primary)] transition-all duration-200 text-left"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
        <Icon name={icon} size={24} className="text-white" />
      </div>
      <p className="font-medium text-sm text-[var(--text-primary)]">{label}</p>
      {count !== undefined && (
        <p className="text-xs text-[var(--text-tertiary)] mt-1">{count} active</p>
      )}
    </button>
  );
}

// ===== STATUS CHIP (DS-6) =====
function StatusChip({ status, variant }: { status: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'critical' }) {
  const colors = {
    success: 'bg-[var(--semantic-success-bg)] text-[var(--semantic-success)]',
    warning: 'bg-[var(--semantic-warning-bg)] text-[var(--semantic-warning)]',
    error: 'bg-[var(--semantic-error-bg)] text-[var(--semantic-error)]',
    info: 'bg-[var(--semantic-info-bg)] text-[var(--semantic-info)]',
    neutral: 'bg-[var(--surface-hover)] text-[var(--text-secondary)]',
    critical: 'bg-[var(--semantic-critical-bg)] text-[var(--semantic-critical)]',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[variant]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

// ===== HOME / LAUNCHPAD PAGE =====
function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Home</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Welcome back, Rajesh. Here's your project overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-tertiary)]">Last updated: 2 min ago</span>
          <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Projects" value="12" change="+2" changeType="up" icon="building" color="bg-blue-500" />
        <KPICard title="Pending Approvals" value="8" change="-3" changeType="down" icon="clipboard" color="bg-amber-500" />
        <KPICard title="Material Value" value="₹4.2Cr" change="+12%" changeType="up" icon="boxes" color="bg-emerald-500" />
        <KPICard title="Budget Utilization" value="67%" change="+5%" changeType="up" icon="pie-chart" color="bg-purple-500" />
      </div>

      {/* Launchpad Tiles */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <LaunchpadTile label="Projects" icon="building" count={12} color="bg-blue-500" route="/projects" onClick={() => navigate('/projects')} />
          <LaunchpadTile label="Purchase Orders" icon="clipboard" count={23} color="bg-indigo-500" route="/procurement/orders" onClick={() => navigate('/procurement/orders')} />
          <LaunchpadTile label="Purchase Requests" icon="file-text" count={5} color="bg-violet-500" route="/procurement/requests" onClick={() => navigate('/procurement/requests')} />
          <LaunchpadTile label="Goods Receipt" icon="package" count={8} color="bg-teal-500" route="/inventory/grn" onClick={() => navigate('/inventory/grn')} />
          <LaunchpadTile label="Sub. Bills" icon="receipt" count={4} color="bg-orange-500" route="/finance/bills" onClick={() => navigate('/finance/bills')} />
          <LaunchpadTile label="Attendance" icon="clock" count={156} color="bg-cyan-500" route="/hr/attendance" onClick={() => navigate('/hr/attendance')} />
          <LaunchpadTile label="Stock Register" icon="boxes" count={342} color="bg-emerald-500" route="/inventory/stock" onClick={() => navigate('/inventory/stock')} />
          <LaunchpadTile label="Safety" icon="alert-triangle" count={2} color="bg-red-500" route="/quality/safety" onClick={() => navigate('/quality/safety')} />
          <LaunchpadTile label="Dashboards" icon="layout-dashboard" color="bg-pink-500" route="/reports/dashboards" onClick={() => navigate('/reports/dashboards')} />
          <LaunchpadTile label="Reports" icon="file-bar-chart" color="bg-slate-500" route="/reports/catalog" onClick={() => navigate('/reports/catalog')} />
          <LaunchpadTile label="Contracts" icon="file-check" count={7} color="bg-amber-600" route="/procurement/contracts" onClick={() => navigate('/procurement/contracts')} />
          <LaunchpadTile label="Schedule" icon="calendar" color="bg-sky-500" route="/projects/schedule" onClick={() => navigate('/projects/schedule')} />
          <button
            onClick={() => navigate('/preview')}
            className="group flex flex-col items-start p-5 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 hover:border-amber-400 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br from-amber-400 to-orange-600 group-hover:scale-110 transition-transform">
              <Eye size={24} className="text-white" />
            </div>
            <p className="font-medium text-sm text-amber-900">Preview Environment</p>
            <p className="text-xs text-amber-700 mt-1">Stakeholder dashboards</p>
          </button>
        </div>
      </div>

      {/* Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-semibold text-[var(--text-primary)]">Recent Activity</h3>
            <button className="text-sm text-[var(--brand-primary)] hover:underline">View all</button>
          </div>
          <div className="divide-y divide-[var(--divider)]">
            {[
              { action: 'PO-2024-0892 created', user: 'Amit Sharma', time: '5 min ago', type: 'procurement' },
              { action: 'GRN-2024-1205 received', user: 'Suresh Patel', time: '1 hour ago', type: 'inventory' },
              { action: 'Bill #B-445 approved', user: 'Rajesh Kumar', time: '2 hours ago', type: 'finance' },
              { action: 'Safety incident reported at Site C', user: 'Vikram Singh', time: '3 hours ago', type: 'safety' },
              { action: 'Attendance marked for 156 workers', user: 'System', time: '5 hours ago', type: 'hr' },
            ].map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-hover)]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  item.type === 'procurement' ? 'bg-indigo-100 text-indigo-600' :
                  item.type === 'inventory' ? 'bg-teal-100 text-teal-600' :
                  item.type === 'finance' ? 'bg-orange-100 text-orange-600' :
                  item.type === 'safety' ? 'bg-red-100 text-red-600' :
                  'bg-cyan-100 text-cyan-600'
                }`}>
                  <Icon name={item.type === 'procurement' ? 'clipboard' : item.type === 'inventory' ? 'package' : item.type === 'finance' ? 'receipt' : item.type === 'safety' ? 'alert-triangle' : 'clock'} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">{item.action}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.user} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text-primary)]">Pending Actions</h3>
          </div>
          <div className="p-3 space-y-2">
            {[
              { title: 'Approve PR-2024-0234', priority: 'high', due: 'Today' },
              { title: 'Review PO-2024-0891', priority: 'medium', due: 'Tomorrow' },
              { title: 'Verify GRN-2024-1203', priority: 'low', due: 'In 3 days' },
              { title: 'Sign Bill #B-446', priority: 'high', due: 'Today' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--brand-primary)] cursor-pointer transition-colors">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  <StatusChip status={item.priority} variant={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'neutral'} />
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Due: {item.due}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== LIST REPORT PAGE TEMPLATE (DS-26) =====
function ListReportPage({ title, subtitle, data, columns, onRowClick }: {
  title: string; subtitle: string; data: any[]; columns: { key: string; label: string; type?: string }[];
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
            + New
          </button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)]">
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">{col.label}</th>
                ))}
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--divider)]">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--surface-hover)] cursor-pointer transition-colors" onClick={() => onRowClick?.(row)}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-[var(--text-primary)]">
                      {col.type === 'status' ? (
                        <StatusChip status={row[col.key]} variant={row[col.key + '_variant'] || 'neutral'} />
                      ) : col.type === 'amount' ? (
                        <span className="font-tabular">{row[col.key]}</span>
                      ) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-[var(--surface-active)]">
                      <MoreHorizontal size={16} className="text-[var(--text-tertiary)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <span>Showing {data.length} records</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-[var(--border)] hover:bg-[var(--surface-hover)]">Previous</button>
            <span className="px-3 py-1 rounded bg-[var(--brand-primary)] text-white">1</span>
            <button className="px-3 py-1 rounded border border-[var(--border)] hover:bg-[var(--surface-hover)]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== GATE STATUS PANEL =====
function GateStatusPanel() {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <Shield size={16} className="text-[var(--brand-primary)]" />
        Protocol Gate Status
      </h4>
      <div className="space-y-2">
        {[
          { stage: 'PLAN', status: 'PASS', color: 'text-emerald-500' },
          { stage: 'AUTHORIZE', status: 'PASS', color: 'text-emerald-500' },
          { stage: 'EXECUTE', status: 'PENDING', color: 'text-amber-500' },
          { stage: 'RECORD', status: 'WAITING', color: 'text-[var(--text-tertiary)]' },
          { stage: 'VERIFY', status: 'WAITING', color: 'text-[var(--text-tertiary)]' },
          { stage: 'CLOSE', status: 'WAITING', color: 'text-[var(--text-tertiary)]' },
        ].map((gate, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-xs font-medium text-[var(--text-secondary)]">{gate.stage}</span>
            <span className={`text-xs font-medium ${gate.color}`}>{gate.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== WORKLIST PAGE TEMPLATE (DS-20 My Inbox) =====
function WorklistPage() {
  const items = [
    { id: 'PR-2024-0234', type: 'Purchase Request', requester: 'Amit Sharma', amount: '₹3,50,000', due: 'Today', priority: 'high' as const, project: 'Metro Tower' },
    { id: 'PO-2024-0892', type: 'Purchase Order', requester: 'Suresh Patel', amount: '₹12,50,000', due: 'Today', priority: 'high' as const, project: 'Metro Tower' },
    { id: 'GRN-2024-1205', type: 'Goods Receipt', requester: 'Vikram Singh', amount: '₹8,75,000', due: 'Tomorrow', priority: 'medium' as const, project: 'Highway Bridge' },
    { id: 'B-446', type: 'Sub. Bill', requester: 'Mahesh Patel', amount: '₹22,00,000', due: 'Today', priority: 'high' as const, project: 'Industrial Park' },
    { id: 'PR-2024-0233', type: 'Purchase Request', requester: 'Dinesh Kumar', amount: '₹1,20,000', due: 'In 2 days', priority: 'low' as const, project: 'School Building' },
    { id: 'WO-2024-0089', type: 'Work Order', requester: 'Ramesh Yadav', amount: '₹5,60,000', due: 'In 3 days', priority: 'medium' as const, project: 'Metro Tower' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Inbox</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{items.length} items pending your approval</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusChip status={`${items.filter(i => i.priority === 'high').length} urgent`} variant="error" />
          <StatusChip status={`${items.length} total`} variant="info" />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4 hover:border-[var(--brand-primary)] hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                item.priority === 'high' ? 'bg-red-100 text-red-600' :
                item.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Icon name={item.type.includes('Purchase') ? 'file-text' : item.type.includes('Goods') ? 'package' : item.type.includes('Bill') ? 'receipt' : 'clipboard'} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-[var(--text-primary)]">{item.id}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">{item.type}</span>
                  <StatusChip status={item.priority} variant={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'neutral'} />
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {item.requester} · {item.project} · <span className="font-tabular">{item.amount}</span>
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Due: {item.due}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3 py-1.5 text-sm bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                  Approve
                </button>
                <button className="px-3 py-1.5 text-sm border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--surface-hover)]">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== OBJECT PAGE TEMPLATE (DS-27) =====
function ObjectPageTemplate() {
  const [activeTab, setActiveTab] = useState('details');
  return (
    <div className="max-w-6xl mx-auto">
      {/* Object Page Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">PO-2024-0892</h1>
              <StatusChip status="Pending Approval" variant="warning" />
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Steel India Ltd. · Metro Tower Phase II</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-[var(--text-tertiary)]">Created: <span className="text-[var(--text-primary)]">Jan 15, 2024</span></span>
              <span className="text-[var(--text-tertiary)]">By: <span className="text-[var(--text-primary)]">Amit Sharma</span></span>
              <span className="text-[var(--text-tertiary)]">Amount: <span className="text-[var(--text-primary)] font-tabular font-semibold">₹12,50,000</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
              <CheckCircle2 size={16} /> Approve
            </button>
            <button className="px-4 py-2 text-sm border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
              <XCircle size={16} /> Reject
            </button>
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] px-6 bg-[var(--surface)]">
        <div className="flex gap-0 overflow-x-auto">
          {['details', 'lines', 'attachments', 'approvals', 'timeline', 'audit'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'details' && (
              <>
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Order Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Supplier', value: 'Steel India Ltd.' },
                      { label: 'Delivery Site', value: 'Metro Tower — Site A' },
                      { label: 'Expected Date', value: 'Jan 22, 2024' },
                      { label: 'Payment Terms', value: 'Net 30' },
                      { label: 'GST', value: '18%' },
                      { label: 'Total (incl. GST)', value: '₹14,75,000' },
                    ].map((field, i) => (
                      <div key={i}>
                        <p className="text-xs text-[var(--text-tertiary)]">{field.label}</p>
                        <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="p-4 border-b border-[var(--border)]">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)]">Line Items</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                        <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Material</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Rate</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--divider)]">
                      {[
                        { material: 'TMT Bar Fe500D (16mm)', qty: '5.0 MT', rate: '₹62,000', amount: '₹3,10,000' },
                        { material: 'TMT Bar Fe500D (12mm)', qty: '8.0 MT', rate: '₹62,000', amount: '₹4,96,000' },
                        { material: 'TMT Bar Fe500D (20mm)', qty: '3.5 MT', rate: '₹62,000', amount: '₹2,17,000' },
                        { material: 'Binding Wire', qty: '200 KG', rate: '₹1,135', amount: '₹2,27,000' },
                      ].map((line, i) => (
                        <tr key={i} className="hover:bg-[var(--surface-hover)]">
                          <td className="px-4 py-3 text-[var(--text-primary)]">{line.material}</td>
                          <td className="px-4 py-3 text-right font-tabular text-[var(--text-primary)]">{line.qty}</td>
                          <td className="px-4 py-3 text-right font-tabular text-[var(--text-primary)]">{line.rate}</td>
                          <td className="px-4 py-3 text-right font-tabular font-medium text-[var(--text-primary)]">{line.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[var(--surface-hover)] font-medium">
                        <td colSpan={3} className="px-4 py-3 text-right text-[var(--text-primary)]">Total</td>
                        <td className="px-4 py-3 text-right font-tabular text-[var(--text-primary)]">₹12,50,000</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'timeline' && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Timeline</h3>
                <div className="space-y-4">
                  {[
                    { time: 'Jan 15, 2024 10:30 AM', event: 'Purchase Order created', user: 'Amit Sharma', type: 'create' },
                    { time: 'Jan 15, 2024 10:32 AM', event: 'Sent for approval to Project Manager', user: 'System', type: 'workflow' },
                    { time: 'Jan 15, 2024 02:15 PM', event: 'Approved by Finance Head', user: 'Priya Mehta', type: 'approval' },
                    { time: 'Pending', event: 'Awaiting Project Manager approval', user: '—', type: 'pending' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        item.type === 'create' ? 'bg-blue-500' :
                        item.type === 'approval' ? 'bg-emerald-500' :
                        item.type === 'pending' ? 'bg-amber-500' :
                        'bg-[var(--border-strong)]'
                      }`} />
                      <div>
                        <p className="text-sm text-[var(--text-primary)]">{item.event}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{item.time} · {item.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Approval Chain</h3>
                <div className="space-y-3">
                  {[
                    { approver: 'Finance Head', name: 'Priya Mehta', status: 'Approved', date: 'Jan 15, 2:15 PM', variant: 'success' as const },
                    { approver: 'Project Manager', name: 'Rajesh Kumar', status: 'Pending', date: '—', variant: 'warning' as const },
                    { approver: 'Director', name: 'Suresh Agarwal', status: 'Waiting', date: '—', variant: 'neutral' as const },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                      <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                        {a.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{a.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{a.approver}</p>
                      </div>
                      <div className="text-right">
                        <StatusChip status={a.status} variant={a.variant} />
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">{a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'lines' || activeTab === 'attachments' || activeTab === 'audit') && (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mx-auto mb-3">
                  <Info size={24} className="text-[var(--text-tertiary)]" />
                </div>
                <p className="text-sm text-[var(--text-secondary)] capitalize">{activeTab} tab content</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Data will be populated by subsequent program parts</p>
              </div>
            )}
          </div>

          {/* Right Sidebar — Gate Status */}
          <div className="space-y-4">
            <GateStatusPanel />
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Related Documents</h4>
              <div className="space-y-2">
                {[
                  { name: 'PR-2024-0234.pdf', type: 'Purchase Request' },
                  { name: 'Quotation_SteelIndia.pdf', type: 'Supplier Quote' },
                  { name: 'Comparison_Sheet.xlsx', type: 'Price Comparison' },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-hover)] cursor-pointer">
                    <FileText size={16} className="text-[var(--text-tertiary)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">{doc.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{doc.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== ANALYTICS DASHBOARD =====
function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Project Analytics</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Metro Tower Project — Overview Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--input-bg,var(--surface))] text-[var(--text-primary)]">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Budget" value="₹45.0Cr" change="+0%" changeType="neutral" icon="target" color="bg-blue-500" />
        <KPICard title="Spent to Date" value="₹30.1Cr" change="+12%" changeType="up" icon="dollar" color="bg-emerald-500" />
        <KPICard title="Variance" value="-₹1.2Cr" change="-3%" changeType="down" icon="alert-triangle" color="bg-amber-500" />
        <KPICard title="Completion" value="67%" change="+5%" changeType="up" icon="activity" color="bg-purple-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Budget vs Actual (Monthly)</h3>
          <div className="h-56 flex items-end gap-2 px-2">
            {[
              { month: 'Aug', budget: 65, actual: 58 },
              { month: 'Sep', budget: 70, actual: 72 },
              { month: 'Oct', budget: 75, actual: 68 },
              { month: 'Nov', budget: 80, actual: 85 },
              { month: 'Dec', budget: 85, actual: 78 },
              { month: 'Jan', budget: 90, actual: 82 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end h-40">
                  <div className="flex-1 bg-blue-200 dark:bg-blue-900 rounded-t" style={{ height: `${d.budget}%` }} title={`Budget: ${d.budget}%`} />
                  <div className="flex-1 bg-blue-500 rounded-t" style={{ height: `${d.actual}%` }} title={`Actual: ${d.actual}%`} />
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-900" />
              <span className="text-xs text-[var(--text-secondary)]">Budget</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-xs text-[var(--text-secondary)]">Actual</span>
            </div>
          </div>
        </div>

        {/* Material Consumption */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Material Consumption</h3>
          <div className="space-y-3">
            {[
              { name: 'Cement', consumed: 78, total: 100, unit: 'MT' },
              { name: 'Steel (TMT)', consumed: 62, total: 100, unit: 'MT' },
              { name: 'Sand', consumed: 85, total: 100, unit: 'CU.M' },
              { name: 'Aggregate', consumed: 71, total: 100, unit: 'CU.M' },
              { name: 'Bricks', consumed: 45, total: 100, unit: 'Lakhs' },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[var(--text-primary)]">{m.name}</span>
                  <span className="text-xs font-tabular text-[var(--text-secondary)]">{m.consumed}% of {m.total} {m.unit}</span>
                </div>
                <div className="h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${m.consumed > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${m.consumed}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Milestones */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
        <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Key Milestones</h3>
        <div className="space-y-3">
          {[
            { name: 'Foundation Complete', date: '2024-01-10', status: 'Completed' as const, variant: 'success' as const },
            { name: 'Structure — Ground Floor', date: '2024-02-15', status: 'In Progress' as const, variant: 'info' as const },
            { name: 'Structure — 1st Floor', date: '2024-03-20', status: 'Upcoming' as const, variant: 'neutral' as const },
            { name: 'MEF Installation', date: '2024-05-01', status: 'Upcoming' as const, variant: 'neutral' as const },
            { name: 'Finishing Works', date: '2024-07-15', status: 'Upcoming' as const, variant: 'neutral' as const },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <div className={`w-3 h-3 rounded-full shrink-0 ${m.variant === 'success' ? 'bg-emerald-500' : m.variant === 'info' ? 'bg-blue-500' : 'bg-[var(--border-strong)]'}`} />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-primary)]">{m.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{m.date}</p>
              </div>
              <StatusChip status={m.status} variant={m.variant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== MODULE PAGES =====
function ProjectsPage() {
  const navigate = useNavigate();
  const data = [
    { id: 'PRJ-001', name: 'Metro Tower Phase II', location: 'Mumbai', status: 'Active', status_variant: 'success', budget: '₹45.0Cr', progress: '67%' },
    { id: 'PRJ-002', name: 'Highway Bridge NH-48', location: 'Jaipur', status: 'Active', status_variant: 'success', budget: '₹28.5Cr', progress: '42%' },
    { id: 'PRJ-003', name: 'Residential Complex B7', location: 'Pune', status: 'On Hold', status_variant: 'warning', budget: '₹12.0Cr', progress: '23%' },
    { id: 'PRJ-004', name: 'Industrial Park Unit 3', location: 'Chennai', status: 'Active', status_variant: 'success', budget: '₹67.0Cr', progress: '81%' },
    { id: 'PRJ-005', name: 'Water Treatment Plant', location: 'Bangalore', status: 'Planning', status_variant: 'info', budget: '₹8.5Cr', progress: '5%' },
    { id: 'PRJ-006', name: 'School Building Project', location: 'Delhi', status: 'Active', status_variant: 'success', budget: '₹3.2Cr', progress: '90%' },
  ];
  return (
    <ListReportPage
      title="Projects"
      subtitle="12 active projects across 5 sites"
      columns={[
        { key: 'id', label: 'Project ID' },
        { key: 'name', label: 'Project Name' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'budget', label: 'Budget', type: 'amount' },
        { key: 'progress', label: 'Progress' },
      ]}
      data={data}
      onRowClick={() => navigate('/projects/detail')}
    />
  );
}

// ===== PROJECT OBJECT PAGE =====
function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div className="max-w-6xl mx-auto">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 px-6 py-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Metro Tower Phase II</h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20">Active</span>
            </div>
            <p className="text-sm text-blue-100 mt-1">PRJ-001 · Mumbai, Maharashtra</p>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div>
                <p className="text-blue-200 text-xs">Budget</p>
                <p className="font-semibold font-tabular">₹45.0 Cr</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">Spent</p>
                <p className="font-semibold font-tabular">₹30.1 Cr</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">Progress</p>
                <p className="font-semibold font-tabular">67%</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">Team</p>
                <p className="font-semibold">42 members</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50">
              Edit Project
            </button>
            <button className="px-4 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/20">
              More Actions
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '67%' }} />
          </div>
          <div className="flex justify-between mt-1 text-xs text-blue-200">
            <span>Start: Mar 2023</span>
            <span>67% Complete</span>
            <span>End: Dec 2024</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] px-6 bg-[var(--surface)]">
        <div className="flex gap-0 overflow-x-auto">
          {['overview', 'wbs', 'boq', 'schedule', 'procurement', 'finance', 'documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Open POs', value: '8', color: 'bg-blue-500' },
                  { label: 'Pending GRNs', value: '3', color: 'bg-teal-500' },
                  { label: 'Open Bills', value: '4', color: 'bg-orange-500' },
                  { label: 'Issues', value: '2', color: 'bg-red-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                      <span className="text-white text-xs font-bold">{stat.value}</span>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Recent Project Activity</h3>
                <div className="space-y-3">
                  {[
                    { event: 'PO-2024-0892 created for steel supply', time: '2 hours ago', icon: 'clipboard' },
                    { event: 'GRN-2024-1205 received — cement 500 bags', time: '5 hours ago', icon: 'package' },
                    { event: 'Attendance marked — 42 workers present', time: '8 hours ago', icon: 'clock' },
                    { event: 'Safety inspection completed — all clear', time: '1 day ago', icon: 'shield' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] flex items-center justify-center shrink-0">
                        <Icon name={a.icon} size={14} className="text-[var(--text-tertiary)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[var(--text-primary)]">{a.event}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              <GateStatusPanel />
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Project Team</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Rajesh Kumar', role: 'Project Manager' },
                    { name: 'Amit Sharma', role: 'Procurement Lead' },
                    { name: 'Priya Mehta', role: 'Finance Head' },
                    { name: 'Vikram Singh', role: 'Site Engineer' },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--surface-hover)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-primary)]">{p.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{p.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab !== 'overview') && (
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mx-auto mb-3">
              <Icon name={activeTab === 'wbs' ? 'sitemap' : activeTab === 'boq' ? 'calculator' : activeTab === 'schedule' ? 'calendar' : 'folder'} size={24} className="text-[var(--text-tertiary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{activeTab} Module</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Detailed data will be populated by subsequent program parts</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const data = [
    { id: 'PO-2024-0892', supplier: 'Steel India Ltd.', amount: '₹12,50,000', status: 'Pending Approval', status_variant: 'warning', date: '2024-01-15' },
    { id: 'PO-2024-0891', supplier: 'Cement Corp.', amount: '₹8,75,000', status: 'Approved', status_variant: 'success', date: '2024-01-14' },
    { id: 'PO-2024-0890', supplier: 'Timbers Plus', amount: '₹3,20,000', status: 'Approved', status_variant: 'success', date: '2024-01-13' },
    { id: 'PO-2024-0889', supplier: 'ElectroWorks', amount: '₹5,60,000', status: 'Delivered', status_variant: 'info', date: '2024-01-12' },
    { id: 'PO-2024-0888', supplier: 'Pipe Solutions', amount: '₹2,10,000', status: 'Cancelled', status_variant: 'error', date: '2024-01-11' },
  ];
  return (
    <ListReportPage
      title="Purchase Orders"
      subtitle="23 orders this month · ₹42.5L total value"
      columns={[
        { key: 'id', label: 'PO Number' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'amount', label: 'Amount', type: 'amount' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'date', label: 'Date' },
      ]}
      data={data}
      onRowClick={() => navigate('/procurement/orders/detail')}
    />
  );
}

function AttendancePage() {
  const data = [
    { id: 'EMP-001', name: 'Ramesh Yadav', site: 'Site A', shift: 'Morning', status: 'Present', status_variant: 'success', hours: '8.0' },
    { id: 'EMP-002', name: 'Suresh Kumar', site: 'Site A', shift: 'Morning', status: 'Present', status_variant: 'success', hours: '8.0' },
    { id: 'EMP-003', name: 'Mahesh Patel', site: 'Site B', shift: 'Afternoon', status: 'Absent', status_variant: 'error', hours: '0.0' },
    { id: 'EMP-004', name: 'Dinesh Singh', site: 'Site B', shift: 'Morning', status: 'Half Day', status_variant: 'warning', hours: '4.0' },
    { id: 'EMP-005', name: 'Vijay Sharma', site: 'Site C', shift: 'Night', status: 'Present', status_variant: 'success', hours: '8.0' },
  ];
  return (
    <ListReportPage
      title="Attendance"
      subtitle="156 workers · Today's attendance: 92%"
      columns={[
        { key: 'id', label: 'Employee ID' },
        { key: 'name', label: 'Name' },
        { key: 'site', label: 'Site' },
        { key: 'shift', label: 'Shift' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'hours', label: 'Hours' },
      ]}
      data={data}
    />
  );
}

function GenericModulePage({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
            <Icon name={icon} size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center">
                <Hash size={16} className="text-[var(--text-tertiary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)]">Record #{1000 + i}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Created: Jan {10 + i}, 2024</p>
            <div className="mt-3">
              <StatusChip status={i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'In Progress' : 'Pending'} variant={i % 3 === 0 ? 'success' : i % 3 === 1 ? 'info' : 'warning'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== TECHNICAL CONSOLE (DS-32) =====
function TechConsoleBaseline() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Technical Console</h1>
            <p className="text-xs text-[var(--text-tertiary)]">/_tech · Read-only · TECH_ADMIN access · ff.tech_console</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/_tech/program/baseline')}
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--brand-primary)] text-white font-medium"
          >
            Baseline
          </button>
          <button
            onClick={() => navigate('/_tech/audit')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            System Audit
          </button>
          <button
            onClick={() => navigate('/_tech/cicd')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            CI/CD & Releases
          </button>
          <button
            onClick={() => navigate('/_tech/core')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Core Services
          </button>
          <button
            onClick={() => navigate('/_tech/secbase')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Security Baseline
          </button>
          <button
            onClick={() => navigate('/_tech/obs')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Observability
          </button>
          <button
            onClick={() => navigate('/_tech/evbus')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Event Bus
          </button>
          <button
            onClick={() => navigate('/admin/org')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Organization
          </button>
          <button
            onClick={() => navigate('/admin/iam')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Users & Roles
          </button>
          <button
            onClick={() => navigate('/admin/audit_sec')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Audit & Security
          </button>
          <button
            onClick={() => navigate('/admin/idsod')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Identity & SoD
          </button>
          <button
            onClick={() => navigate('/admin/rules')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Workflow Rules
          </button>
          <button
            onClick={() => navigate('/admin/protocol')}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Protocol Engine
          </button>
          <button
            onClick={() => navigate('/preview')}
            className="px-3 py-1.5 text-sm rounded-lg border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 font-medium"
          >
            Preview Env →
          </button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-hover)]">
          <h2 className="font-semibold text-sm text-[var(--text-primary)]">Baseline Summary</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Git Tag', value: 'erp-baseline-v0' },
              { label: 'Commit', value: 'a3f8c21' },
              { label: 'Captured', value: '2024-01-15' },
              { label: 'Status', value: 'Verified' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--surface-hover)]">
                <p className="text-xs text-[var(--text-tertiary)]">{item.label}</p>
                <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--divider)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Protocol Control Points</h3>
            <div className="space-y-2">
              {[
                { id: 'CP-PGM-01', stage: 'PLAN', control: 'Regression gate evidence exists', enforcement: 'BLOCK', mode: 'OBSERVE' },
                { id: 'CP-PGM-02', stage: 'VERIFY', control: 'Integrity check before/after migrations', enforcement: 'BLOCK', mode: 'OBSERVE' },
                { id: 'CP-PGM-03', stage: 'CLOSE', control: 'Definition of Done checklist signed', enforcement: 'BLOCK', mode: 'OBSERVE' },
              ].map((cp, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                  <span className="text-xs font-mono font-medium text-[var(--brand-primary)]">{cp.id}</span>
                  <StatusChip status={cp.stage} variant="info" />
                  <span className="text-sm text-[var(--text-primary)] flex-1">{cp.control}</span>
                  <StatusChip status={cp.mode} variant="warning" />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--divider)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Design Gate Status (DS-33)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { gate: 'Token Lint', status: 'PASS' },
                { gate: 'Icon Registry', status: 'PASS' },
                { gate: 'Nav Registry', status: 'PASS' },
                { gate: 'Contrast (WCAG AA)', status: 'PASS' },
                { gate: 'Axe Accessibility', status: 'PASS' },
                { gate: 'Visual Regression', status: 'BASELINE' },
              ].map((g, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-hover)]">
                  <span className="text-xs text-[var(--text-secondary)]">{g.gate}</span>
                  <StatusChip status={g.status} variant={g.status === 'PASS' ? 'success' : 'info'} />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--divider)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Feature Flags</h3>
            <div className="space-y-2">
              {Object.entries(featureFlags).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-hover)]">
                  <span className="text-sm font-mono text-[var(--text-primary)]">{key}</span>
                  <StatusChip status={value ? 'ENABLED' : 'DISABLED'} variant={value ? 'success' : 'neutral'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Terminal({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

// ===== PREFERENCES PAGE =====
function PreferencesPage() {
  const { theme, setTheme, density, setDensity } = useTheme();
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Preferences</h1>
      
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {(['light', 'dark', 'high-contrast'] as ThemeMode[]).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-4 rounded-xl border-2 transition-all ${theme === t ? 'border-[var(--brand-primary)] bg-[var(--surface-hover)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`}
              >
                <div className={`w-full h-16 rounded-lg mb-2 ${t === 'light' ? 'bg-gray-100' : t === 'dark' ? 'bg-gray-800' : 'bg-white border-2 border-black'}`} />
                <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{t.replace('-', ' ')}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Density</h3>
          <div className="grid grid-cols-3 gap-3">
            {(['compact', 'cozy', 'touch'] as DensityMode[]).map(d => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${density === d ? 'border-[var(--brand-primary)] bg-[var(--surface-hover)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`}
              >
                <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{d}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  {d === 'compact' ? 'More content, less space' : d === 'touch' ? 'Larger targets for touch' : 'Balanced spacing'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== PREVIEW ENVIRONMENT (Part 02 — Live Dashboard Preview) =====
function PreviewWidget({ widget, onFeedback }: { widget: WidgetDef; onFeedback: (code: string) => void }) {
  const { tokens } = useTheme();
  
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow relative">
      {/* PREVIEW Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
          {widget.dataMode === 'fixture' ? 'Preview Data' : 'Live'}
        </span>
      </div>
      
      {/* Widget Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">{widget.kpiCodes[0]}</p>
        <h4 className="text-sm font-medium text-[var(--text-primary)] mt-0.5">{widget.title}</h4>
      </div>

      {/* Widget Content */}
      <div className="px-4 pb-4">
        {widget.type === 'kpi' && (
          <div>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-tabular">{widget.payload.value}</p>
            {widget.payload.previous && (
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Previous: {widget.payload.previous}</p>
            )}
            {widget.payload.trend && (
              <div className="flex items-end gap-0.5 mt-3 h-8">
                {widget.payload.trend.map((v, i) => (
                  <div key={i} className="flex-1 bg-[var(--brand-primary)] rounded-t opacity-60" style={{ height: `${(v / Math.max(...widget.payload.trend!)) * 100}%` }} />
                ))}
              </div>
            )}
          </div>
        )}

        {widget.type === 'gauge' && (
          <div className="flex items-center justify-center py-2">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="var(--surface-hover)" strokeWidth="8" fill="none" />
                <circle cx="48" cy="48" r="40" stroke="var(--brand-primary)" strokeWidth="8" fill="none"
                  strokeDasharray={`${parseInt(widget.payload.value) * 2.51} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--text-primary)] font-tabular">{widget.payload.value}</span>
              </div>
            </div>
          </div>
        )}

        {widget.type === 'chart' && widget.chartData && (
          <div className="flex items-end gap-1 h-24 mt-2">
            {widget.chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t" style={{ height: `${(d.value / Math.max(...widget.chartData!.map(x => x.value))) * 100}%`, backgroundColor: d.color || 'var(--brand-primary)' }} />
                <span className="text-[9px] text-[var(--text-tertiary)] truncate w-full text-center">{d.label}</span>
              </div>
            ))}
          </div>
        )}

        {widget.type === 'list' && widget.listData && (
          <div className="space-y-2 mt-2">
            {widget.listData.map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--surface-hover)]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">{item.label}</p>
                  {item.sub && <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{item.sub}</p>}
                </div>
                {item.badge && (
                  <StatusChip status={item.badge} variant={item.variant || 'neutral'} />
                )}
              </div>
            ))}
          </div>
        )}

        {widget.type === 'status' && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-semibold text-[var(--text-primary)]">{widget.payload.value}</span>
          </div>
        )}
      </div>

      {/* Widget Footer */}
      <div className="px-4 py-2 border-t border-[var(--divider)] flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
        <span>Source: {widget.futureSourcePrompt}</span>
        <button onClick={() => onFeedback(widget.code)} className="text-[var(--brand-primary)] hover:underline font-medium">
          Give Feedback
        </button>
      </div>
    </div>
  );
}

function PreviewDashboard({ persona, onFeedback }: { persona: Persona; onFeedback: (code: string) => void }) {
  const widgets = getWidgetsForPersona(persona.key);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{persona.label} Dashboard</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{persona.role} · {widgets.length} widgets · Synthetic fixture data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {widgets.map(widget => (
          <div key={widget.code} className={widget.size === 'lg' ? 'sm:col-span-2' : widget.size === 'xl' ? 'sm:col-span-2 lg:col-span-2' : ''}>
            <PreviewWidget widget={widget} onFeedback={onFeedback} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackDrawer({ widgetCode, feedback, onClose, onSubmit }: {
  widgetCode: string;
  feedback: FeedbackEntry[];
  onClose: () => void;
  onSubmit: (comment: string, decision: 'accepted' | 'change_requested' | 'noted') => void;
}) {
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState<'accepted' | 'change_requested' | 'noted'>('noted');
  const widgetFeedback = feedback.filter(f => f.widgetCode === widgetCode);
  const widget = widgetRegistry.find(w => w.code === widgetCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[var(--surface)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Widget Feedback</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{widget?.title} · {widgetCode}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--surface-hover)]">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Widget Info */}
          <div className="p-4 rounded-lg bg-[var(--surface-hover)]">
            <p className="text-xs text-[var(--text-tertiary)]">Future Data Source</p>
            <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{widget?.futureSourcePrompt} · {widget?.futureApi}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">KPI Codes: {widget?.kpiCodes.join(', ')}</p>
          </div>

          {/* Existing Feedback */}
          {widgetFeedback.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Previous Feedback</h4>
              <div className="space-y-2">
                {widgetFeedback.map(fb => (
                  <div key={fb.id} className="p-3 rounded-lg border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[var(--text-primary)]">{fb.reviewer}</span>
                      <StatusChip status={fb.decision.replace('_', ' ')} variant={fb.decision === 'accepted' ? 'success' : fb.decision === 'change_requested' ? 'warning' : 'neutral'} />
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{fb.comment}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">{new Date(fb.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Feedback Form */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Add Your Feedback</h4>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Your comments, suggestions, or concerns..."
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--input-bg,var(--surface))] text-[var(--text-primary)] resize-none"
              rows={4}
            />
            <div className="flex items-center gap-2 mt-3">
              <select
                value={decision}
                onChange={e => setDecision(e.target.value as any)}
                className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
              >
                <option value="accepted">Accept Layout</option>
                <option value="change_requested">Request Changes</option>
                <option value="noted">Note for Later</option>
              </select>
              <button
                onClick={() => { if (comment.trim()) { onSubmit(comment, decision); setComment(''); } }}
                disabled={!comment.trim()}
                className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WidgetStatusBoard() {
  const statusCounts = {
    PREVIEW: widgetRegistry.filter(w => w.status === 'PREVIEW').length,
    LIVE: widgetRegistry.filter(w => w.status === 'LIVE').length,
    PROMOTED: widgetRegistry.filter(w => w.status === 'PROMOTED').length,
    RETIRED: widgetRegistry.filter(w => w.status === 'RETIRED').length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Widget Status Board</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Technical Console · Widget lifecycle tracking (PREVIEW → LIVE → PROMOTED → RETIRED)</p>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase">{status}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{count}</p>
          </div>
        ))}
      </div>

      {/* Widget List */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Widget</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Personas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Source Part</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Future API</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Data Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--divider)]">
              {widgetRegistry.map(w => (
                <tr key={w.code} className="hover:bg-[var(--surface-hover)]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text-primary)]">{w.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{w.code}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{w.personas.length}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)]">{w.futureSourcePrompt}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[var(--text-tertiary)] truncate max-w-[200px]">{w.futureApi}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusChip status={w.status} variant={w.status === 'PREVIEW' ? 'warning' : w.status === 'LIVE' ? 'info' : w.status === 'PROMOTED' ? 'success' : 'neutral'} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${w.dataMode === 'fixture' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {w.dataMode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PreviewLayout() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('cfo');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [feedbackWidget, setFeedbackWidget] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(initialFeedback);
  const [showStatusBoard, setShowStatusBoard] = useState(false);
  const navigate = useNavigate();

  const currentPersona = personas.find(p => p.key === selectedPersona)!;

  const handleSubmitFeedback = (comment: string, decision: 'accepted' | 'change_requested' | 'noted') => {
    if (!feedbackWidget) return;
    const newFeedback: FeedbackEntry = {
      id: `FB-${Date.now()}`,
      widgetCode: feedbackWidget,
      reviewer: 'Stakeholder',
      comment,
      decision,
      createdAt: new Date().toISOString(),
    };
    setFeedback([...feedback, newFeedback]);
    setFeedbackWidget(null);
  };

  return (
    <div className="min-h-screen bg-[var(--surface-bg)] flex flex-col">
      {/* PREVIEW Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm font-semibold shadow-md">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          PREVIEW ENVIRONMENT · Synthetic Data Only · Not Production
        </span>
      </div>

      {/* Preview Shell Bar */}
      <header className="h-14 flex items-center px-4 gap-3 bg-[var(--shell-bg)] text-[var(--shell-text)] shadow-md shrink-0">
        <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Back to main">
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
            <Eye size={18} className="text-white" />
          </div>
          <span className="font-semibold text-sm">ERP Preview</span>
        </div>

        <div className="flex-1" />

        {/* Device Frame Toggle */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setDeviceFrame('mobile')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${deviceFrame === 'mobile' ? 'bg-white text-[var(--shell-bg)]' : 'hover:bg-white/10'}`}
          >
            Mobile
          </button>
          <button
            onClick={() => setDeviceFrame('tablet')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${deviceFrame === 'tablet' ? 'bg-white text-[var(--shell-bg)]' : 'hover:bg-white/10'}`}
          >
            Tablet
          </button>
          <button
            onClick={() => setDeviceFrame('desktop')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${deviceFrame === 'desktop' ? 'bg-white text-[var(--shell-bg)]' : 'hover:bg-white/10'}`}
          >
            Desktop
          </button>
        </div>

        {/* Widget Status Board */}
        <button
          onClick={() => setShowStatusBoard(!showStatusBoard)}
          className="px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Activity size={16} />
          <span className="hidden sm:inline">Status Board</span>
        </button>
      </header>

      {/* Persona Switcher */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mr-2">Persona:</span>
          {personas.map(p => (
            <button
              key={p.key}
              onClick={() => setSelectedPersona(p.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                selectedPersona === p.key
                  ? 'bg-[var(--brand-primary)] text-white font-medium shadow-md'
                  : 'bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-active)]'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-xs font-bold`}>
                {p.avatar}
              </div>
              <span className="whitespace-nowrap">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center overflow-auto py-6 px-4">
        <div
          className={`transition-all duration-300 ${
            deviceFrame === 'mobile' ? 'w-[360px]' : deviceFrame === 'tablet' ? 'w-[820px]' : 'w-full max-w-7xl'
          }`}
          style={deviceFrame !== 'desktop' ? {
            border: '8px solid var(--border-strong)',
            borderRadius: '24px',
            backgroundColor: 'var(--surface-bg)',
            minHeight: deviceFrame === 'mobile' ? '640px' : '1024px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          } : {}}
        >
          {showStatusBoard ? (
            <WidgetStatusBoard />
          ) : (
            <PreviewDashboard persona={currentPersona} onFeedback={setFeedbackWidget} />
          )}
        </div>
      </div>

      {/* Feedback Drawer */}
      {feedbackWidget && (
        <FeedbackDrawer
          widgetCode={feedbackWidget}
          feedback={feedback}
          onClose={() => setFeedbackWidget(null)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  );
}

// ===== CI/CD DASHBOARD (Part 03 — Quality Gates & Release Engineering) =====
function CICDDashboard() {
  const [activeTab, setActiveTab] = useState<'releases' | 'pipeline' | 'flags' | 'gates' | 'evidence' | 'quarantine'>('releases');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const navigate = useNavigate();

  const tabs = [
    { id: 'releases', label: 'Releases', icon: 'package' },
    { id: 'pipeline', label: 'Pipeline', icon: 'activity' },
    { id: 'flags', label: 'Feature Flags', icon: 'flag' },
    { id: 'gates', label: 'Gate Thresholds', icon: 'shield' },
    { id: 'evidence', label: 'Evidence Bundles', icon: 'file-text' },
    { id: 'quarantine', label: 'Quarantine', icon: 'alert-triangle' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': case 'LIVE': case 'approved': case 'complete': case 'unchanged': case 'no-breaking': case 'empty': case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'fail': case 'ROLLED_BACK': case 'destructive': case 'changed-unapproved': case 'breaking': return 'bg-red-100 text-red-700 border-red-200';
      case 'running': case 'DEPLOYING': case 'in-progress': case 'additive': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': case 'DRAFT': case 'missing': case 'planned': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'warn': case 'CANDIDATE': case 'STAGING_VERIFIED': case 'changed-approved': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">CI/CD & Releases</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 03 · ff.cicd</p>
        </div>
        <nav className="space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id as any); setSelectedRelease(null); }}
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

        {/* RELEASES TAB */}
        {activeTab === 'releases' && !selectedRelease && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Release Board</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Release lifecycle: DRAFT → CANDIDATE → STAGING_VERIFIED → APPROVED → DEPLOYING → LIVE | ROLLED_BACK</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Releases', value: releases.length, color: 'text-[var(--text-primary)]' },
                { label: 'Live', value: releases.filter(r => r.status === 'LIVE').length, color: 'text-emerald-600' },
                { label: 'In Pipeline', value: releases.filter(r => ['CANDIDATE', 'STAGING_VERIFIED', 'DEPLOYING'].includes(r.status)).length, color: 'text-blue-600' },
                { label: 'Failed/Rolled Back', value: releases.filter(r => r.status === 'ROLLED_BACK').length, color: 'text-red-600' },
              ].map((s, i) => (
                <div key={i} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs text-[var(--text-tertiary)]">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Release List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Release</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Version</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Parts</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Risk</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Author</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Gates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {releases.map(r => {
                      const passGates = r.gates.filter(g => g.status === 'pass').length;
                      const totalGates = r.gates.length;
                      return (
                        <tr key={r.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedRelease(r)}>
                          <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{r.id}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">v{r.version}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap">
                              {r.parts.map(p => (
                                <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{p}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getRiskColor(r.risk)}`}>{r.risk}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${getStatusColor(r.status)}`}>{r.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{r.author}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(passGates / Math.max(totalGates, 1)) * 100}%` }} />
                              </div>
                              <span className="text-xs text-[var(--text-tertiary)]">{passGates}/{totalGates}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RELEASE DETAIL */}
        {activeTab === 'releases' && selectedRelease && (
          <div className="space-y-6">
            <button onClick={() => setSelectedRelease(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <ChevronLeft size={16} /> Back to releases
            </button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">{selectedRelease.id}</h1>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium border ${getStatusColor(selectedRelease.status)}`}>{selectedRelease.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getRiskColor(selectedRelease.risk)}`}>{selectedRelease.risk} risk</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">v{selectedRelease.version} · commit {selectedRelease.commitSha} · {selectedRelease.parts.join(', ')}</p>
              </div>
              {selectedRelease.status === 'STAGING_VERIFIED' && (
                <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                  Approve Release
                </button>
              )}
            </div>

            {/* Release Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Release Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Author</span><span className="text-[var(--text-primary)]">{selectedRelease.author}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Created</span><span className="text-[var(--text-primary)]">{new Date(selectedRelease.createdAt).toLocaleString()}</span></div>
                  {selectedRelease.approvedBy && <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Approved by</span><span className="text-[var(--text-primary)]">{selectedRelease.approvedBy}</span></div>}
                  {selectedRelease.deployedAt && <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Deployed</span><span className="text-[var(--text-primary)]">{new Date(selectedRelease.deployedAt).toLocaleString()}</span></div>}
                </div>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Rollback Plan</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedRelease.rollbackPlan}</p>
              </div>
            </div>

            {/* Gate Matrix */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Pipeline Gate Results</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {pipelineStages.map(stage => {
                    const result = selectedRelease.gates.find(g => g.gateId === stage.id);
                    return (
                      <div key={stage.id} className={`px-3 py-2 rounded-lg border text-xs font-medium ${result ? getStatusColor(result.status) : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                        <div className="font-semibold">{stage.name}</div>
                        <div className="text-[10px] mt-0.5">{result ? result.status.toUpperCase() : 'NOT RUN'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-[var(--divider)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Gate</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Duration</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Metrics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {selectedRelease.gates.map(g => {
                      const stage = pipelineStages.find(s => s.id === g.gateId);
                      return (
                        <tr key={g.gateId} className="hover:bg-[var(--surface-hover)]">
                          <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{stage?.name || g.gateId}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${getStatusColor(g.status)}`}>{g.status}</span>
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-[var(--text-secondary)] font-tabular">{g.duration}</td>
                          <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                            {g.metrics && Object.entries(g.metrics).map(([k, v]) => (
                              <span key={k} className="mr-3"><span className="text-[var(--text-secondary)]">{k}:</span> {String(v)}</span>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pipeline Stages</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{pipelineStages.length} ordered stages · All mandatory · CP-CICD-01/02 enforced</p>
            </div>

            <div className="space-y-2">
              {pipelineStages.map((stage, i) => (
                <div key={stage.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {stage.order}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">{stage.name}</h4>
                      {stage.mandatory && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">MANDATORY</span>}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stage.description}</p>
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)] font-tabular shrink-0">avg {stage.avgDuration}</div>
                  {i < pipelineStages.length - 1 && (
                    <ChevronRight size={16} className="text-[var(--text-tertiary)] shrink-0 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>

            {/* Control Points */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[var(--brand-primary)]" />
                Protocol Control Points (CP-CICD)
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'CP-CICD-01', stage: 'VERIFY', control: 'All mandatory gates green for the commit being released', enforcement: 'BLOCK(release)' },
                  { id: 'CP-CICD-02', stage: 'VERIFY', control: 'No destructive change to pre-existing schema objects', enforcement: 'BLOCK' },
                  { id: 'CP-CICD-03', stage: 'APPROVE', control: 'Production release approved by someone other than the author', enforcement: 'BLOCK' },
                  { id: 'CP-CICD-04', stage: 'MONITOR', control: 'Post-deploy health and error-rate within SLO for 30 min', enforcement: 'MONITOR' },
                ].map(cp => (
                  <div key={cp.id} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-mono font-medium text-[var(--brand-primary)] shrink-0">{cp.id}</span>
                    <StatusChip status={cp.stage} variant="info" />
                    <span className="text-sm text-[var(--text-primary)] flex-1">{cp.control}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium shrink-0">{cp.enforcement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEATURE FLAGS TAB */}
        {activeTab === 'flags' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Feature Flag Console</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{cicdFlags.length} flags · Per-environment defaults · Kill switch · Audit trail</p>
            </div>

            <div className="space-y-3">
              {cicdFlags.map(flag => (
                <div key={flag.key} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="p-4 flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-[var(--brand-primary)]">{flag.key}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{flag.partNo}</span>
                        {flag.killSwitch && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">KILL SWITCH</span>}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{flag.description}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">Owner: {flag.owner} · Last changed: {flag.lastChanged}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      {(['dev', 'staging', 'production'] as const).map(env => (
                        <div key={env} className="p-2 rounded-lg bg-[var(--surface-hover)] text-center">
                          <p className="text-[10px] text-[var(--text-tertiary)] uppercase">{env}</p>
                          <span className={`text-xs font-bold ${flag.defaults[env] ? 'text-emerald-600' : 'text-[var(--text-disabled)]'}`}>
                            {flag.defaults[env] ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      ))}
                    </div>
                    {flag.changeHistory.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--divider)]">
                        <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Change History</p>
                        <div className="space-y-1">
                          {flag.changeHistory.slice(-3).map((ch, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="text-[var(--text-tertiary)]">{ch.date}</span>
                              <span className="px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{ch.env}</span>
                              <span className={ch.oldVal ? 'text-emerald-600' : 'text-red-500'}>{ch.oldVal ? 'ON' : 'OFF'}</span>
                              <span>→</span>
                              <span className={ch.newVal ? 'text-emerald-600' : 'text-red-500'}>{ch.newVal ? 'ON' : 'OFF'}</span>
                              <span className="text-[var(--text-tertiary)]">by {ch.by}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GATE THRESHOLDS TAB */}
        {activeTab === 'gates' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gate Thresholds</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Quality gate configuration · Maker-checker required for changes · CP-CICD-01 enforced</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Gate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Metric</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Threshold</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Current</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {gateThresholds.map(gt => (
                    <tr key={gt.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{gt.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{gt.metric}</td>
                      <td className="px-4 py-3 text-center font-tabular text-[var(--text-secondary)]">{gt.threshold}</td>
                      <td className="px-4 py-3 text-center font-tabular font-medium text-[var(--text-primary)]">{gt.currentValue}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium border ${getStatusColor(gt.status)}`}>{gt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Regression Suites */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Named Regression Suites</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {regressionSuites.map(suite => (
                  <div key={suite.id} className="px-4 py-3 flex items-center gap-4">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${suite.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-[var(--text-primary)] flex-1">{suite.name}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">Owner: {suite.partOwner}</span>
                    <span className="text-xs font-tabular text-[var(--text-secondary)]">{suite.testsCount} tests</span>
                    <StatusChip status={suite.status} variant={suite.status === 'active' ? 'success' : 'neutral'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EVIDENCE BUNDLES TAB */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Part Evidence Bundles</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Per-Part evidence required for completion · SA-47 traceability</p>
            </div>

            <div className="space-y-3">
              {evidenceBundles.map(bundle => (
                <div key={bundle.partNo} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="p-4 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[var(--brand-primary)]">{bundle.partNo}</span>
                      <span className="text-sm text-[var(--text-primary)]">{bundle.partName}</span>
                    </div>
                    <StatusChip status={bundle.status} variant={bundle.status === 'complete' ? 'success' : bundle.status === 'in-progress' ? 'info' : 'neutral'} />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {[
                        { label: 'Tests', value: `${bundle.testsPassed}✓ ${bundle.testsFailed}✗`, ok: bundle.testsFailed === 0 },
                        { label: 'Coverage', value: `${bundle.coverage}%`, ok: bundle.coverage >= 80 },
                        { label: 'Schema Diff', value: bundle.schemaDiff, ok: bundle.schemaDiff === 'empty' || bundle.schemaDiff === 'additive' },
                        { label: 'Golden Outputs', value: bundle.goldenOutputs === 'unchanged' ? 'Unchanged' : bundle.goldenOutputs, ok: bundle.goldenOutputs !== 'changed-unapproved' },
                        { label: 'OpenAPI', value: bundle.openApiDiff === 'no-breaking' ? 'No Breaking' : 'Breaking', ok: bundle.openApiDiff === 'no-breaking' },
                        { label: 'Audit', value: bundle.auditRecord, ok: bundle.auditRecord === 'approved' },
                      ].map((item, i) => (
                        <div key={i} className={`p-2 rounded-lg text-center ${item.ok ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                          <p className="text-[10px] text-[var(--text-tertiary)] uppercase">{item.label}</p>
                          <p className={`text-xs font-medium mt-0.5 ${item.ok ? 'text-emerald-700' : 'text-red-700'}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    {/* Screenshots */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--divider)]">
                      <span className="text-xs text-[var(--text-tertiary)]">Screenshots:</span>
                      {[
                        { label: '360px', ok: bundle.screenshots.mobile },
                        { label: '820px', ok: bundle.screenshots.tablet },
                        { label: '1440px', ok: bundle.screenshots.desktop },
                      ].map((s, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded ${s.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.label} {s.ok ? '✓' : '—'}
                        </span>
                      ))}
                    </div>
                    {/* Artifacts */}
                    {bundle.artifacts.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs text-[var(--text-tertiary)]">Artifacts:</span>
                        {bundle.artifacts.map((a, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] font-mono">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUARANTINE TAB */}
        {activeTab === 'quarantine' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Flaky Test Quarantine</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{quarantinedTests.filter(q => q.status === 'quarantined').length} active quarantines · Quarantined tests never count as passed</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Test</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Suite</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Owner</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Expires</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {quarantinedTests.map(qt => (
                    <tr key={qt.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-[var(--text-primary)]">{qt.testName}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)]">{qt.id}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{qt.suite}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs">{qt.reason}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{qt.owner}</td>
                      <td className="px-4 py-3 text-center text-xs font-tabular text-[var(--text-secondary)]">{qt.expiresAt}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={qt.status} variant={qt.status === 'quarantined' ? 'warning' : qt.status === 'resolved' ? 'success' : 'neutral'} />
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

// ===== CORE SERVICES DASHBOARD (Part 04 — DS-32 Technical Console) =====
function CoreServicesDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'hooks' | 'outbox' | 'jobs' | 'numbering' | 'errors' | 'protocol' | 'sample'>('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { id: 'hooks', label: 'Service Hooks', icon: 'zap' },
    { id: 'outbox', label: 'Event Outbox', icon: 'activity' },
    { id: 'jobs', label: 'Job Framework', icon: 'clock' },
    { id: 'numbering', label: 'Number Series', icon: 'hash' },
    { id: 'errors', label: 'Error Codes', icon: 'alert-circle' },
    { id: 'protocol', label: 'Protocol Controls', icon: 'shield' },
    { id: 'sample', label: 'Sample Module', icon: 'file-text' },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Core Services</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 04 · ff.core</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Core Enterprise Services</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Shared service layer — authentication, authorization, validation, audit, events, notifications, numbering, utilities</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Service Hooks</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{serviceHooks.length}</p>
                <p className="text-xs text-emerald-600 mt-1">{serviceHooks.filter(h => h.status === 'active').length} active</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Outbox (24h)</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{outboxMetrics.reduce((sum, m) => sum + m.published, 0)}</p>
                <p className="text-xs text-emerald-600 mt-1">published</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Background Jobs</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{jobMetrics.length}</p>
                <p className="text-xs text-emerald-600 mt-1">{jobMetrics.filter(j => j.status === 'idle').length} idle</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Number Series</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{numberSeriesStatus.length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">active</p>
              </div>
            </div>

            {/* Health Status */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                System Health
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Database', status: 'up', latency: '5ms' },
                  { name: 'Cache (Redis)', status: 'up', latency: '2ms' },
                  { name: 'Queue (BullMQ)', status: 'up', latency: '10ms' },
                  { name: 'Storage (S3)', status: 'up', latency: '50ms' },
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{check.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{check.status} · {check.latency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Hooks Overview */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Service Hooks Status</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {serviceHooks.slice(0, 6).map(hook => (
                  <div key={hook.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      hook.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                      hook.status === 'stub' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name={hook.category === 'auth' ? 'shield' : hook.category === 'validation' ? 'file-text' : hook.category === 'audit' ? 'clipboard' : hook.category === 'event' ? 'activity' : 'zap'} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] font-mono">{hook.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{hook.description}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-tabular text-[var(--text-secondary)]">{hook.usageCount.toLocaleString()} calls</p>
                      <StatusChip status={hook.status} variant={hook.status === 'active' ? 'success' : hook.status === 'stub' ? 'warning' : 'neutral'} />
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

        {/* SERVICE HOOKS TAB */}
        {activeTab === 'hooks' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Service Hooks</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Shared hooks available to all modules · authorize, validate, audit, emit, notify, attach, nextNumber</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Hook</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Category</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Owner</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {serviceHooks.map(hook => (
                    <tr key={hook.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{hook.name}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs">{hook.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{hook.category}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={hook.status} variant={hook.status === 'active' ? 'success' : hook.status === 'stub' ? 'warning' : 'neutral'} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{hook.partOwner}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{hook.usageCount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OUTBOX TAB */}
        {activeTab === 'outbox' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event Outbox</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Transactional outbox pattern · At-least-once delivery · Dead-letter queue after N retries</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{outboxMetrics[0]?.pending || 0}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Published (24h)</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{outboxMetrics.reduce((sum, m) => sum + m.published, 0)}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Failed (24h)</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{outboxMetrics.reduce((sum, m) => sum + m.failed, 0)}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Avg Latency</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{Math.round(outboxMetrics.reduce((sum, m) => sum + m.avgLatencyMs, 0) / outboxMetrics.length)}ms</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Outbox Activity (Last 5 Hours)</h3>
              <div className="space-y-2">
                {outboxMetrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 p-2 rounded-lg bg-[var(--surface-hover)]">
                    <span className="text-xs text-[var(--text-tertiary)] w-20">{new Date(m.timestamp).toLocaleTimeString()}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="h-2 bg-emerald-500 rounded" style={{ width: `${(m.published / 20) * 100}%` }} title={`Published: ${m.published}`} />
                      {m.failed > 0 && <div className="h-2 bg-red-500 rounded w-4" title={`Failed: ${m.failed}`} />}
                    </div>
                    <span className="text-xs font-tabular text-[var(--text-secondary)]">{m.published} pub / {m.failed} fail</span>
                    <span className="text-xs text-[var(--text-tertiary)]">{m.avgLatencyMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Job Framework</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Scheduled and on-demand jobs · Idempotency keys · Visibility in Part 146</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Job</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Schedule</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Success Rate</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Avg Duration</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Total Runs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {jobMetrics.map(job => (
                    <tr key={job.jobId} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--text-primary)]">{job.jobName}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">Last: {job.lastRun ? new Date(job.lastRun).toLocaleString() : 'Never'}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{job.type}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{job.schedule || 'On-demand'}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={job.status} variant={job.status === 'idle' ? 'success' : job.status === 'running' ? 'info' : 'error'} />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{job.successRate}%</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{job.avgDurationMs}ms</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-secondary)]">{job.totalRuns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NUMBERING TAB */}
        {activeTab === 'numbering' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Number Series</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Concurrency-safe document numbering (SA-12) · Financial year aware · Gapless option</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Doc Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">FY</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Prefix</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Current Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Generated</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {numberSeriesStatus.map(ns => (
                    <tr key={ns.key} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{ns.docType}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{ns.fy}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{ns.prefix}</td>
                      <td className="px-4 py-3 text-right font-tabular font-bold text-[var(--text-primary)]">{ns.currentValue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{ns.lastGenerated ? new Date(ns.lastGenerated).toLocaleString() : '—'}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{ns.generatedBy || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ERRORS TAB */}
        {activeTab === 'errors' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Error Code Catalogue</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Standardized error envelope (SA-17) · Error-code catalogue for all modules</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Message</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Count (7d)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Occurrence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {errorCodes.map(err => (
                    <tr key={err.code} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{err.code}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{err.message}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={err.severity} variant={err.severity === 'critical' ? 'error' : err.severity === 'error' ? 'error' : err.severity === 'warning' ? 'warning' : 'info'} />
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{err.count}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{err.lastOccurrence ? new Date(err.lastOccurrence).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROTOCOL TAB */}
        {activeTab === 'protocol' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Protocol Controls</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">CP-CORE-01, CP-CORE-02 · OBSERVE mode · Will enforce when Part 14 is live</p>
            </div>

            <div className="space-y-3">
              {protocolControlPoints.map(cp => (
                <div key={cp.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono font-bold text-[var(--brand-primary)]">{cp.id}</span>
                    <StatusChip status={cp.stage} variant="info" />
                    <StatusChip status={cp.status} variant="warning" />
                  </div>
                  <p className="text-sm text-[var(--text-primary)] mb-2">{cp.control}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Enforcement: {cp.enforcement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAMPLE MODULE TAB */}
        {activeTab === 'sample' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sample Module — Reference Implementation</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Demonstrates all hooks in action · Behind ff.core · Not visible to users</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-hover)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Controllable Actions</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Action</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Stage</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Controllable</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Hooks Invoked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {sampleModuleActions.map((action, i) => (
                    <tr key={i} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{action.action}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={action.stage} variant="info" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {action.controllable ? (
                          <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle size={16} className="text-[var(--text-disabled)] mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {action.hooks.map((hook, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] font-mono">{hook}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Code Example */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Reference Implementation</h3>
              <pre className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-hover)] p-4 rounded-lg overflow-x-auto">
{`// Sample service using all hooks
async function createSample(ctx: RequestContext, input: SampleInput) {
  return withTransaction(ctx, async () => {
    // 1. Authorize
    await authorize(ctx, 'sample.create', { type: 'Sample' });
    
    // 2. Validate
    const result = validate(sampleSchema, input);
    if (!result.success) throw new AppError('VALIDATION_ERROR', 'Invalid input', 400, result.errors);
    
    // 3. Generate number
    const number = await nextNumber(ctx, 'SAMPLE');
    
    // 4. Business logic (DB write)
    const entity = await db.sample.create({ ...result.data, number });
    
    // 5. Audit
    await audit(ctx, 'Sample', entity.id, 'create', undefined, entity);
    
    // 6. Emit event (outbox)
    await emit(ctx, 'sample.created', 'Sample', entity.id, { number, ...entity });
    
    // 7. Notify (optional)
    await notify(ctx, { roles: ['PM'] }, 'sample-created', { number }, 'info');
    
    return entity;
  });
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ORGANIZATION MODULE (Part 05 — Enterprise Hierarchy) =====
function OrganizationModule() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'projects' | 'sites' | 'allocations' | 'geofences'>('explorer');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showSiteDetail, setShowSiteDetail] = useState(false);

  const tabs = [
    { id: 'explorer', label: 'Org Explorer', icon: 'sitemap' },
    { id: 'projects', label: 'Projects', icon: 'building' },
    { id: 'sites', label: 'Sites', icon: 'map-pin' },
    { id: 'allocations', label: 'Allocations', icon: 'users' },
    { id: 'geofences', label: 'Geofences', icon: 'map' },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Administration</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Organization · ff.org</p>
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

        {/* ORG EXPLORER TAB */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Organization Explorer</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Enterprise hierarchy: Company → Group → Legal Entity → Branch → Department → Project → Site</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Companies</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{companies.length}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Projects</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{projects.length}</p>
                <p className="text-xs text-emerald-600 mt-1">{projects.filter(p => p.lifecycleStatus === 'Active').length} active</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Sites</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{sites.length}</p>
                <p className="text-xs text-emerald-600 mt-1">{sites.filter(s => s.status === 'Active').length} active</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Allocations</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{allocations.length}</p>
              </div>
            </div>

            {/* Hierarchy Tree */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Enterprise Hierarchy</h3>
              <div className="space-y-2 text-sm">
                {companies.map(company => (
                  <div key={company.id}>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-hover)] font-medium">
                      <Icon name="building" size={16} className="text-[var(--brand-primary)]" />
                      <span>{company.name}</span>
                      <span className="text-xs text-[var(--text-tertiary)] ml-auto">{company.code}</span>
                    </div>
                    <div className="ml-6 mt-2 space-y-2">
                      {groups.filter(g => g.companyId === company.id).map(group => (
                        <div key={group.id}>
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                            <Icon name="folder" size={14} className="text-[var(--text-tertiary)]" />
                            <span className="text-[var(--text-secondary)]">{group.name}</span>
                          </div>
                          <div className="ml-6 mt-1 space-y-1">
                            {businessUnits.filter(bu => bu.companyId === company.id).map(bu => (
                              <div key={bu.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                                <Icon name="briefcase" size={14} className="text-[var(--text-tertiary)]" />
                                <span className="text-[var(--text-secondary)]">{bu.name}</span>
                                <span className="text-xs text-[var(--text-tertiary)] ml-auto">Head: {bu.headUserName}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
                {orgProtocolControlPoints.map(cp => (
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

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && !showProjectDetail && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Project lifecycle: Proposed → Tendering → Awarded → Mobilisation → Active → On Hold → Substantially Complete → DLP → Closed → Archived</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Project
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project Manager</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Dates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {projects.map(project => (
                    <tr key={project.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => { setSelectedProject(project); setShowProjectDetail(true); }}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{project.code}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{project.name}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{project.clientName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] capitalize">{project.projectType}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={project.lifecycleStatus} variant={getProjectStatusVariant(project.lifecycleStatus)} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{project.projectManagerName}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">
                        {(project.contractValue / 10000000).toFixed(2)} Cr
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {new Date(project.startDate).toLocaleDateString()} → {new Date(project.plannedFinish).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROJECT DETAIL */}
        {activeTab === 'projects' && showProjectDetail && selectedProject && (
          <div className="space-y-6">
            <button onClick={() => setShowProjectDetail(false)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <ChevronLeft size={16} /> Back to projects
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedProject.name}</h2>
                    <StatusChip status={selectedProject.lifecycleStatus} variant={getProjectStatusVariant(selectedProject.lifecycleStatus)} />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedProject.code} · {selectedProject.clientName}</p>
                </div>
                <div className="flex gap-2">
                  {getNextProjectStatuses(selectedProject.lifecycleStatus).map(nextStatus => (
                    <button key={nextStatus} className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                      Move to {nextStatus}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Project Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] capitalize mt-1">{selectedProject.projectType}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Contract Mode</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedProject.contractMode}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Contract Value</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] font-tabular mt-1">
                    {(selectedProject.contractValue / 10000000).toFixed(2)} Cr
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Location</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedProject.district}, {selectedProject.stateCode}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Start Date</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedProject.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Planned Finish</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedProject.plannedFinish).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Project Manager</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedProject.projectManagerName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Business Unit</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedProject.businessUnitName}</p>
                </div>
              </div>

              {/* Sites for this project */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Sites</h3>
                <div className="space-y-2">
                  {sites.filter(s => s.projectId === selectedProject.id).map(site => (
                    <div key={site.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                      <Icon name="map-pin" size={16} className="text-[var(--text-tertiary)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{site.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{site.siteCode} · {site.siteManagerName}</p>
                      </div>
                      <StatusChip status={site.status} variant={getSiteStatusVariant(site.status)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Allocations for this project */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Team Allocations</h3>
                <div className="space-y-2">
                  {allocations.filter(a => a.projectId === selectedProject.id).map(alloc => (
                    <div key={alloc.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-xs font-bold">
                        {alloc.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{alloc.userName}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{alloc.roleOnProject} · {alloc.allocationPercent}%</p>
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        From {new Date(alloc.fromDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SITES TAB */}
        {activeTab === 'sites' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sites</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Site lifecycle: Planned → Mobilising → Active → Suspended → Demobilising → Closed</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Site Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Site Manager</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Location</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Geofence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {sites.map(site => (
                    <tr key={site.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{site.siteCode}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{site.name}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{site.projectName}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={site.status} variant={getSiteStatusVariant(site.status)} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{site.siteManagerName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{site.address}</td>
                      <td className="px-4 py-3 text-center">
                        {site.geofenceId ? (
                          <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle size={16} className="text-[var(--text-disabled)] mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ALLOCATIONS TAB */}
        {activeTab === 'allocations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Project Allocations</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">User assignments to projects and sites with role and allocation percentage</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Site</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Role</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Allocation %</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">From Date</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {allocations.map(alloc => (
                    <tr key={alloc.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-xs font-bold">
                            {alloc.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-[var(--text-primary)]">{alloc.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{alloc.projectName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{alloc.siteName || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{alloc.roleOnProject}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-tabular font-medium text-[var(--text-primary)]">{alloc.allocationPercent}%</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(alloc.fromDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={alloc.isActive ? 'Active' : 'Inactive'} variant={alloc.isActive ? 'success' : 'neutral'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GEOFENCES TAB */}
        {activeTab === 'geofences' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Site Geofences</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Geofence definitions for attendance validation · Circle or polygon · Versioned and audited</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Site</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Location</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Radius</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Tolerance</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Version</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Valid From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {geofences.map(geo => {
                    const site = sites.find(s => s.id === geo.siteId);
                    return (
                      <tr key={geo.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{site?.name || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{geo.type}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)] font-tabular">
                          {geo.type === 'circle' ? `${geo.centerLat?.toFixed(4)}, ${geo.centerLng?.toFixed(4)}` : 'Polygon'}
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-tabular text-[var(--text-secondary)]">
                          {geo.radiusM ? `${geo.radiusM}m` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-tabular text-[var(--text-secondary)]">
                          ±{geo.accuracyToleranceM}m
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-[var(--brand-primary)]">v{geo.version}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(geo.validFrom).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{geo.approvedByName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Geofence Change History</h3>
              <div className="space-y-2">
                {geofences.map(geo => {
                  const site = sites.find(s => s.id === geo.siteId);
                  return (
                    <div key={geo.id} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white shrink-0">
                        <Icon name="map-pin" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{site?.name} — v{geo.version}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">{geo.reason}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          Approved by {geo.approvedByName} on {new Date(geo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== IAM MODULE (Part 06 — User, Role & Permission Architecture) =====
function IAMModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'roles' | 'assignments' | 'sod' | 'policies' | 'effective'>('overview');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showRoleDetail, setShowRoleDetail] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { id: 'permissions', label: 'Permissions', icon: 'shield' },
    { id: 'roles', label: 'Roles', icon: 'users' },
    { id: 'assignments', label: 'Assignments', icon: 'user-check' },
    { id: 'sod', label: 'SoD Rules', icon: 'alert-triangle' },
    { id: 'policies', label: 'Field Policies', icon: 'eye-off' },
    { id: 'effective', label: 'Effective Access', icon: 'search' },
  ];

  const permissionsByModule = getPermissionsByModule();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Administration</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">IAM · ff.iam</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Identity & Access Management</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Enterprise RBAC with scoped grants: User → Role → Department → Project → Site → Module → Feature → Action</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Permissions</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{permissions.length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">across {Object.keys(permissionsByModule).length} modules</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Roles</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{roles.length}</p>
                <p className="text-xs text-emerald-600 mt-1">{roles.filter(r => r.isSystem).length} system</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Assignments</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{userRoleAssignments.length}</p>
                <p className="text-xs text-emerald-600 mt-1">{userRoleAssignments.filter(a => a.isActive).length} active</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">SoD Rules</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{sodRules.length}</p>
                <p className="text-xs text-red-600 mt-1">{sodRules.filter(r => r.severity === 'block').length} blocking</p>
              </div>
            </div>

            {/* Roles Overview */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">System Roles</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {roles.slice(0, 8).map(role => (
                  <div key={role.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      role.isSystem ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name="users" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{role.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{role.description}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-tabular text-[var(--text-secondary)]">{role.userCount} users</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{role.permissionCount} perms</p>
                    </div>
                    {role.isSystem && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">System</span>
                    )}
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
                {iamProtocolControlPoints.map(cp => (
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

        {/* PERMISSIONS TAB */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Permission Registry</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{permissions.length} permissions across {Object.keys(permissionsByModule).length} modules</p>
            </div>

            {Object.entries(permissionsByModule).map(([module, perms]) => (
              <div key={module} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-hover)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] capitalize">{module} Module</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Permission Key</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Feature</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Action</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Sensitive</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">PC Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {perms.map(perm => (
                      <tr key={perm.key} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{perm.key}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{perm.feature}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{perm.action}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{perm.description}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{perm.defaultScope}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {perm.isSensitive ? (
                            <AlertCircle size={14} className="text-amber-500 mx-auto" />
                          ) : (
                            <span className="text-[var(--text-disabled)]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {perm.pcStage ? (
                            <StatusChip status={perm.pcStage} variant="info" />
                          ) : (
                            <span className="text-[var(--text-disabled)]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ROLES TAB */}
        {activeTab === 'roles' && !showRoleDetail && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Roles</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{roles.length} roles · {roles.filter(r => r.isSystem).length} system roles</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Role
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Role Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Max Scope</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Users</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Permissions</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {roles.map(role => (
                    <tr key={role.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => { setSelectedRole(role); setShowRoleDetail(true); }}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{role.code}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{role.name}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{role.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{role.maxScope}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{role.userCount}</td>
                      <td className="px-4 py-3 text-right font-tabular text-xs text-[var(--text-primary)]">{role.permissionCount}</td>
                      <td className="px-4 py-3 text-center">
                        {role.isSystem ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">System</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">Custom</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROLE DETAIL */}
        {activeTab === 'roles' && showRoleDetail && selectedRole && (
          <div className="space-y-6">
            <button onClick={() => setShowRoleDetail(false)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <ChevronLeft size={16} /> Back to roles
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedRole.name}</h2>
                    {selectedRole.isSystem && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">System Role</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedRole.code} · {selectedRole.description}</p>
                </div>
                <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                  Edit Permissions
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Max Scope</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedRole.maxScope}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Users Assigned</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRole.userCount}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Permissions</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRole.permissionCount}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Status</p>
                  <p className="text-sm font-medium text-emerald-600 mt-1">Active</p>
                </div>
              </div>

              {/* Role Permissions */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Permission Matrix</h3>
                <div className="space-y-2">
                  {getRolePermissions(selectedRole.id).slice(0, 20).map(rp => {
                    const perm = permissions.find(p => p.key === rp.permissionKey);
                    return (
                      <div key={rp.permissionKey} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                        <div className={`w-2 h-2 rounded-full ${rp.effect === 'allow' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-mono text-[var(--text-primary)] flex-1">{rp.permissionKey}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">{perm?.description}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-secondary)]">{rp.scopeType}</span>
                      </div>
                    );
                  })}
                  {getRolePermissions(selectedRole.id).length > 20 && (
                    <p className="text-xs text-[var(--text-tertiary)] text-center py-2">
                      + {getRolePermissions(selectedRole.id).length - 20} more permissions
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Role Assignments</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{userRoleAssignments.length} assignments · Scoped by company/project/site</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Valid From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Assigned By</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {userRoleAssignments.map(assign => (
                    <tr key={assign.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-xs font-bold">
                            {assign.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-[var(--text-primary)]">{assign.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{assign.roleName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{assign.scopeType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{assign.scopeName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(assign.validFrom).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{assign.assignedByName}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={assign.isActive ? 'Active' : 'Inactive'} variant={assign.isActive ? 'success' : 'neutral'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SOD RULES TAB */}
        {activeTab === 'sod' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Segregation of Duties Rules</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{sodRules.length} SoD rules · Prevents conflicts of interest</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Permission A</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Permission B</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {sodRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{rule.code}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rule.description}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">{rule.permissionA}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">{rule.permissionB}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{rule.scope}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip status={rule.severity} variant={rule.severity === 'block' ? 'error' : 'warning'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FIELD POLICIES TAB */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Field-Level Policies</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{fieldPolicies.length} field masking policies · Protects sensitive data</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Entity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Field</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">View Permission</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Edit Permission</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Mask Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {fieldPolicies.map(policy => (
                    <tr key={policy.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{policy.entity}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{policy.field}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">{policy.permissionKeyToView}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">{policy.permissionKeyToEdit}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          policy.maskType === 'full' ? 'bg-red-100 text-red-700' :
                          policy.maskType === 'partial' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{policy.maskType}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Record Rules */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Record-Level Rules</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {recordRules.map(rule => (
                  <div key={rule.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--text-primary)]">{rule.entity}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{rule.ruleType}</span>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">{rule.description}</p>
                    <p className="text-xs font-mono text-[var(--text-tertiary)] mt-1 bg-[var(--surface-hover)] p-2 rounded">{rule.expression}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EFFECTIVE ACCESS TAB */}
        {activeTab === 'effective' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Effective Permission Explorer</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">View effective permissions for any user · Shows source role and scope</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Select User</h3>
              <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]">
                <option value="">Choose a user...</option>
                {userRoleAssignments.map(a => (
                  <option key={a.userId} value={a.userId}>{a.userName}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">Select a user to view their effective permissions across all roles and scopes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== AUDIT DASHBOARD (Part 01 — DS-32 Technical Console) =====
function AuditDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { id: 'stack', label: 'Stack & Modules', icon: 'layers' },
    { id: 'database', label: 'DB Entities', icon: 'database' },
    { id: 'api', label: 'API Inventory', icon: 'file-text' },
    { id: 'calculations', label: 'Calculations', icon: 'calculator' },
    { id: 'risks', label: 'Risk Register', icon: 'alert-triangle' },
    { id: 'conflicts', label: 'Conflicts', icon: 'alert-circle' },
    { id: 'gaps', label: 'Gap Matrix', icon: 'target' },
    { id: 'controls', label: 'Control Inventory', icon: 'shield' },
    { id: 'dependencies', label: 'Dependencies', icon: 'git-branch' },
  ];

  const severityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    working: 'success',
    partial: 'warning',
    broken: 'error',
    absent: 'neutral',
  };

  return (
    <div className="flex h-full">
      {/* Audit Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">System Audit</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 01 · Read-only</p>
        </div>
        <nav className="space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                activeSection === s.id
                  ? 'bg-[var(--brand-primary)] text-white font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <Icon name={s.icon} size={16} />
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Mobile section selector */}
        <div className="lg:hidden mb-4">
          <select
            value={activeSection}
            onChange={e => setActiveSection(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
          >
            {sections.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Existing System Audit</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Part 01 — Architecture Discovery & Gap Analysis · Read-only inventory</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Modules</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">10</p>
                <p className="text-xs text-emerald-600 mt-1">6 working, 4 partial</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Tables</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">20</p>
                <p className="text-xs text-amber-600 mt-1">8 need EXTEND</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">API Endpoints</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">30</p>
                <p className="text-xs text-emerald-600 mt-1">All auth-protected</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Open Risks</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">10</p>
                <p className="text-xs text-red-600 mt-1">1 critical, 4 high</p>
              </div>
            </div>

            {/* Module Status Overview */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Module Status Overview</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {modulesInventory.map(m => (
                  <div key={m.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center">
                      <Icon name={m.id === 'pm' ? 'building' : m.id === 'proc' ? 'clipboard' : m.id === 'inv' ? 'boxes' : m.id === 'fin' ? 'receipt' : m.id === 'hr' ? 'users' : m.id === 'qa' ? 'shield' : m.id === 'rpt' ? 'bar-chart' : m.id === 'auth' ? 'user' : m.id === 'doc' ? 'file-text' : 'bell'} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{m.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{m.notes}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                      <span>{m.routes.length} routes</span>
                      <span>{m.tables.length} tables</span>
                      <span>{m.apis} APIs</span>
                    </div>
                    <StatusChip status={m.status} variant={statusColors[m.status]} />
                  </div>
                ))}
              </div>
            </div>

            {/* Key Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" /> Critical Findings
                </h3>
                <div className="space-y-2">
                  {riskRegister.filter(r => r.severity === 'critical' || r.severity === 'high').slice(0, 4).map(r => (
                    <div key={r.id} className="flex items-start gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${severityColors[r.severity]}`}>{r.severity}</span>
                      <p className="text-sm text-[var(--text-primary)]">{r.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" /> Duplicate / Conflict Detection
                </h3>
                <div className="space-y-2">
                  {conflicts.map(c => (
                    <div key={c.id} className="flex items-start gap-2">
                      <span className="text-xs font-mono text-[var(--brand-primary)] shrink-0">{c.id}</span>
                      <p className="text-sm text-[var(--text-primary)]">{c.concept}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coverage Summary */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Gap Coverage by Part</h3>
              <div className="space-y-3">
                {gapMatrix.map(g => (
                  <div key={g.part}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--text-primary)]">{g.part} — {g.name}</span>
                      <span className="text-xs font-tabular text-[var(--text-secondary)]">{g.coverage}%</span>
                    </div>
                    <div className="h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${g.coverage >= 50 ? 'bg-emerald-500' : g.coverage >= 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${g.coverage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'stack' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Stack & Modules</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Technology stack versions and module inventory</p>
            </div>

            {/* Stack Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(stackInfo).map(([category, details]) => (
                <div key={category} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h3>
                  <div className="space-y-2">
                    {Object.entries(details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-tertiary)] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-xs font-mono text-[var(--text-primary)]">{typeof value === 'string' ? value : (value as string[]).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Full Module List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Module Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Module</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Routes</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Tables</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">APIs</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Screens</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {modulesInventory.map(m => (
                      <tr key={m.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{m.name}</td>
                        <td className="px-4 py-3"><StatusChip status={m.status} variant={statusColors[m.status]} /></td>
                        <td className="px-4 py-3 text-right font-tabular">{m.routes.length}</td>
                        <td className="px-4 py-3 text-right font-tabular">{m.tables.length}</td>
                        <td className="px-4 py-3 text-right font-tabular">{m.apis}</td>
                        <td className="px-4 py-3 text-right font-tabular">{m.screens}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{m.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'database' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Database Entities</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">20 tables inventoried · REUSE / EXTEND / NEW mapping for Parts 3–130</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Table</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Cols</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Rows</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">FK</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Idx</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Audit</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Decision</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {dbEntities.map(t => (
                      <tr key={t.name} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{t.name}</td>
                        <td className="px-4 py-3 text-right font-tabular">{t.columns}</td>
                        <td className="px-4 py-3 text-right font-tabular">{t.rows.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">{t.hasFK ? <CheckCircle2 size={14} className="text-emerald-500 mx-auto" /> : <XCircle size={14} className="text-red-400 mx-auto" />}</td>
                        <td className="px-4 py-3 text-center">{t.hasIndex ? <CheckCircle2 size={14} className="text-emerald-500 mx-auto" /> : <XCircle size={14} className="text-red-400 mx-auto" />}</td>
                        <td className="px-4 py-3 text-center">{t.hasAudit ? <CheckCircle2 size={14} className="text-emerald-500 mx-auto" /> : <XCircle size={14} className="text-red-400 mx-auto" />}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            t.decision === 'REUSE' ? 'bg-emerald-100 text-emerald-700' :
                            t.decision === 'EXTEND' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{t.decision}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{t.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">API Inventory</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{apiInventory.length} endpoints · All auth-protected · Permission coverage analysis</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Method</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Path</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Handler</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Auth</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Perm</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Consumers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {apiInventory.map((api, i) => (
                      <tr key={i} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            api.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                            api.method === 'POST' ? 'bg-emerald-100 text-emerald-700' :
                            api.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>{api.method}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{api.path}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{api.handler}</td>
                        <td className="px-4 py-3 text-center">{api.authRequired ? <CheckCircle2 size={14} className="text-emerald-500 mx-auto" /> : <XCircle size={14} className="text-red-400 mx-auto" />}</td>
                        <td className="px-4 py-3 text-center">{api.permissionChecked ? <CheckCircle2 size={14} className="text-emerald-500 mx-auto" /> : <XCircle size={14} className="text-amber-400 mx-auto" />}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{api.consumers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'calculations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calculation Inventory</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{calculationsInventory.length} formulas identified · Input to Part 35 (Calculation Engine)</p>
            </div>

            <div className="space-y-3">
              {calculationsInventory.map(calc => (
                <div key={calc.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{calc.id}</span>
                        <h4 className="text-sm font-medium text-[var(--text-primary)]">{calc.name}</h4>
                        {!calc.hasTest && <StatusChip status="No test" variant="warning" />}
                      </div>
                      <div className="mt-2 p-2 rounded-lg bg-[var(--surface-hover)] font-mono text-xs text-[var(--text-primary)]">
                        {calc.formula}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1"><FileText size={12} /> {calc.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[var(--text-tertiary)]">Used by:</span>
                        {calc.usedBy.map((u, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{u}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'risks' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Risk Register</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{riskRegister.length} risks identified · {riskRegister.filter(r => r.severity === 'critical').length} critical, {riskRegister.filter(r => r.severity === 'high').length} high</p>
            </div>

            <div className="space-y-3">
              {riskRegister.map(risk => (
                <div key={risk.id} className={`bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden ${expandedRisk === risk.id ? 'ring-2 ring-[var(--brand-primary)]' : ''}`}>
                  <button
                    onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[var(--surface-hover)]"
                  >
                    <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${severityColors[risk.severity]}`}>
                      {risk.severity.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-tertiary)] shrink-0">{risk.id}</span>
                    <span className="text-sm text-[var(--text-primary)] flex-1">{risk.title}</span>
                    <StatusChip status={risk.category} variant={risk.category === 'security' ? 'error' : risk.category === 'data-quality' ? 'warning' : risk.category === 'performance' ? 'info' : 'neutral'} />
                    <ChevronRight size={16} className={`text-[var(--text-tertiary)] transition-transform ${expandedRisk === risk.id ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedRisk === risk.id && (
                    <div className="px-4 pb-4 border-t border-[var(--divider)] pt-3 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-[var(--text-tertiary)]">Description</p>
                        <p className="text-sm text-[var(--text-primary)]">{risk.description}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-tertiary)]">Evidence</p>
                        <p className="text-sm font-mono text-[var(--text-secondary)] bg-[var(--surface-hover)] p-2 rounded">{risk.evidence}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-tertiary)]">Mitigation</p>
                        <p className="text-sm text-[var(--text-primary)]">{risk.mitigation}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'conflicts' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Duplicate / Conflict Detection</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{conflicts.length} conflicts found — two implementations of the same concept</p>
            </div>

            <div className="space-y-3">
              {conflicts.map(c => (
                <div key={c.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{c.id}</span>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">{c.concept}</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Implementations found:</p>
                      <div className="flex flex-wrap gap-2">
                        {c.implementations.map((impl, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">{impl}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--divider)]">
                      <ArrowRight size={14} className="text-[var(--brand-primary)]" />
                      <p className="text-sm text-[var(--text-primary)]">{c.resolution}</p>
                      <span className="text-xs text-[var(--text-tertiary)] ml-auto">→ {c.targetPart}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'gaps' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gap Matrix</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Coverage analysis for Parts 3–130 · REUSE/EXTEND/NEW guidance</p>
            </div>

            <div className="space-y-3">
              {gapMatrix.map(g => (
                <div key={g.part} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[var(--brand-primary)]">{g.part}</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">{g.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${g.coverage >= 50 ? 'bg-emerald-500' : g.coverage >= 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${g.coverage}%` }}
                        />
                      </div>
                      <span className="text-sm font-tabular font-bold text-[var(--text-primary)]">{g.coverage}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs font-medium text-emerald-600 mb-1">Reusable</p>
                      {g.reusable.length > 0 ? g.reusable.map((r, i) => (
                        <p key={i} className="text-xs text-[var(--text-secondary)]">• {r}</p>
                      )) : <p className="text-xs text-[var(--text-tertiary)] italic">Nothing reusable</p>}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-amber-600 mb-1">Missing</p>
                      {g.missing.map((m, i) => (
                        <p key={i} className="text-xs text-[var(--text-secondary)]">• {m}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-600 mb-1">Risks</p>
                      {g.risks.map((r, i) => (
                        <p key={i} className="text-xs text-[var(--text-secondary)]">• {r}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'controls' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Control Inventory</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">PC-1 stage coverage per module · Input to Part 14 OBSERVE seeding</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-3 py-2 text-left font-medium text-[var(--text-secondary)]">Module</th>
                      {['PLAN', 'AUTH', 'EXEC', 'RECORD', 'VERIFY', 'ANALYZE', 'CONTROL', 'CLOSE'].map(s => (
                        <th key={s} className="px-2 py-2 text-center font-medium text-[var(--text-secondary)]">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {controlInventory.map((c, i) => (
                      <tr key={i} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-3 py-2 font-medium text-[var(--text-primary)]">{c.module}</td>
                        {[c.plan, c.authorize, c.execute, c.record, c.verify, c.analyze, c.control, c.close].map((stage, j) => (
                          <td key={j} className="px-2 py-2 text-center">
                            {stage.exists ? (
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                stage.enforcement === 'hard' ? 'bg-emerald-100 text-emerald-700' :
                                stage.enforcement === 'soft' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {stage.enforcement === 'hard' ? 'HARD' : stage.enforcement === 'soft' ? 'SOFT' : '—'}
                              </span>
                            ) : (
                              <span className="text-[var(--text-disabled)]">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-[var(--border)] flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /> Hard enforcement</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-200" /> Soft enforcement</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-200" /> None / Missing</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'dependencies' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dependency Map</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Cross-module dependencies · Data, API, and event couplings</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="divide-y divide-[var(--divider)]">
                {dependencyMap.map((d, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <span className="text-sm font-medium text-[var(--text-primary)] min-w-[120px]">{d.from}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="h-px flex-1 bg-[var(--border-strong)]" />
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        d.type === 'data' ? 'bg-blue-100 text-blue-700' :
                        d.type === 'direct-access' ? 'bg-red-100 text-red-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>{d.type}</span>
                      <div className="h-px flex-1 bg-[var(--border-strong)]" />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)] min-w-[120px] text-right">{d.to}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Socket Events */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Socket.IO Events</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {socketEvents.map((e, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-4">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{e.event}</span>
                    <span className="text-xs text-[var(--text-secondary)] flex-1">{e.description}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-tertiary)]">{e.room}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${e.auth ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {e.auth ? 'Auth' : 'Open'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Jobs */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Background Jobs</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {backgroundJobs.map((j, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-4">
                    <span className="text-sm font-mono text-[var(--text-primary)] flex-1">{j.name}</span>
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">{j.schedule}</span>
                    <span className="text-xs text-[var(--text-secondary)] flex-1">{j.description}</span>
                    <StatusChip status={j.status} variant="success" />
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

// ===== MAIN APP LAYOUT =====
function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-collapse on mobile
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 768) setSidebarCollapsed(true);
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isTechConsole = location.pathname.startsWith('/_tech');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--surface-bg)]">
      <ShellBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} sidebarCollapsed={sidebarCollapsed} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {!sidebarCollapsed && (
          <div className="md:hidden fixed inset-0 top-14 z-30 bg-black/40" onClick={() => setSidebarCollapsed(true)} />
        )}
        {!isTechConsole && (
          <div className={`${!sidebarCollapsed ? 'fixed inset-y-0 left-0 top-14 z-40 md:relative md:inset-auto md:top-auto' : ''}`}>
            <Sidebar collapsed={sidebarCollapsed} onNavigate={(route) => { navigate(route); if (window.innerWidth < 768) setSidebarCollapsed(true); }} />
          </div>
        )}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/detail" element={<ProjectDetailPage />} />
            <Route path="/projects/wbs" element={<GenericModulePage title="WBS Structure" subtitle="Work Breakdown Structure for active projects" icon="sitemap" />} />
            <Route path="/projects/boq" element={<GenericModulePage title="Bill of Quantities" subtitle="BOQ items and estimates" icon="calculator" />} />
            <Route path="/projects/schedule" element={<GenericModulePage title="Schedule" subtitle="Project timeline and milestones" icon="calendar" />} />
            <Route path="/procurement/requests" element={<WorklistPage />} />
            <Route path="/procurement/orders/detail" element={<ObjectPageTemplate />} />
            <Route path="/procurement/orders" element={<PurchaseOrdersPage />} />
            <Route path="/procurement/suppliers" element={<GenericModulePage title="Suppliers" subtitle="Registered vendor directory" icon="truck" />} />
            <Route path="/procurement/contracts" element={<GenericModulePage title="Contracts" subtitle="Active contracts and agreements" icon="file-check" />} />
            <Route path="/inventory/grn" element={<GenericModulePage title="Goods Receipt Notes" subtitle="Material receiving records" icon="package" />} />
            <Route path="/inventory/stock" element={<GenericModulePage title="Stock Register" subtitle="Current inventory levels" icon="boxes" />} />
            <Route path="/inventory/issue" element={<GenericModulePage title="Material Issue" subtitle="Material consumption records" icon="arrow-up-right" />} />
            <Route path="/finance/bills" element={<GenericModulePage title="Subcontractor Bills" subtitle="Bills for verification and payment" icon="receipt" />} />
            <Route path="/finance/payroll" element={<GenericModulePage title="Payroll" subtitle="Salary processing and disbursement" icon="users" />} />
            <Route path="/finance/cost-centers" element={<GenericModulePage title="Cost Centers" subtitle="Budget allocation and tracking" icon="pie-chart" />} />
            <Route path="/hr/attendance" element={<AttendancePage />} />
            <Route path="/hr/employees" element={<GenericModulePage title="Employees" subtitle="Worker and staff directory" icon="user" />} />
            <Route path="/quality/inspections" element={<GenericModulePage title="Inspections" subtitle="Quality inspection records" icon="search" />} />
            <Route path="/quality/safety" element={<GenericModulePage title="Safety Incidents" subtitle="Incident reports and tracking" icon="alert-triangle" />} />
            <Route path="/reports/dashboards" element={<DashboardPage />} />
            <Route path="/reports/catalog" element={<GenericModulePage title="Report Catalog" subtitle="Available reports and exports" icon="file-bar-chart" />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/_tech/program/baseline" element={<TechConsoleBaseline />} />
            <Route path="/_tech/audit" element={<AuditDashboard />} />
            <Route path="/_tech/cicd" element={<CICDDashboard />} />
            <Route path="/_tech/core" element={<CoreServicesDashboard />} />
            <Route path="/_tech/secbase" element={<SecBaseModule />} />
            <Route path="/_tech/obs" element={<ObsModule />} />
            <Route path="/_tech/evbus" element={<EvBusModule />} />
            <Route path="/admin/org" element={<OrganizationModule />} />
            <Route path="/admin/iam" element={<IAMModule />} />
            <Route path="/admin/audit_sec" element={<AuditSecModule />} />
            <Route path="/admin/idsod" element={<IdSodModule />} />
            <Route path="/admin/rules" element={<RulesModule />} />
            <Route path="/admin/protocol" element={<ProtocolModule />} />
            <Route path="/workflow" element={<WfModule />} />
            <Route path="/preview" element={<PreviewLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-around py-2 px-2 z-40 no-print">
        {[
          { icon: 'home', label: 'Home', route: '/' },
          { icon: 'clipboard', label: 'Inbox', route: '/procurement/requests' },
          { icon: 'package', label: 'Capture', route: '/inventory/grn' },
          { icon: 'clock', label: 'Tasks', route: '/hr/attendance' },
          { icon: 'grid', label: 'More', route: '/' },
        ].map((item, i) => {
          const isActive = location.pathname === item.route;
          return (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg min-w-[56px] ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Toolbar */}
      <footer className="h-8 hidden md:flex items-center px-4 border-t border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-tertiary)] shrink-0">
        <span>Construction ERP v0.1.0</span>
        <span className="mx-2">·</span>
        <span>Part 00 Baseline</span>
        <span className="mx-2">·</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online
        </span>
        <div className="flex-1" />
        <span>ff.pgm: {isEnabled('ff.pgm') ? 'ON' : 'OFF'}</span>
        <span className="mx-2">·</span>
        <button onClick={() => navigate('/_tech/audit')} className="hover:text-[var(--text-secondary)] transition-colors">
          Tech Console
        </button>
      </footer>
    </div>
  );
}

// ===== APP WITH PROVIDERS =====
export default function App() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp-theme');
      if (saved === 'dark' || saved === 'light' || saved === 'high-contrast') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [density, setDensityState] = useState<DensityMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp-density');
      if (saved === 'compact' || saved === 'cozy' || saved === 'touch') return saved;
    }
    return 'cozy';
  });

  const tokens = getTokensForTheme(theme);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('erp-theme', t);
  }, []);

  const setDensity = useCallback((d: DensityMode) => {
    setDensityState(d);
    localStorage.setItem('erp-density', d);
  }, []);

  // Apply CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--shell-bg', tokens.shell.background);
    root.style.setProperty('--shell-text', tokens.shell.text);
    root.style.setProperty('--surface-bg', tokens.surface.background);
    root.style.setProperty('--surface', tokens.surface.surface);
    root.style.setProperty('--surface-hover', tokens.surface.surfaceHover);
    root.style.setProperty('--surface-active', tokens.surface.surfaceActive);
    root.style.setProperty('--sidebar-bg', tokens.surface.sidebar);
    root.style.setProperty('--card-bg', tokens.surface.card);
    root.style.setProperty('--border', tokens.surface.border);
    root.style.setProperty('--border-strong', tokens.surface.borderStrong);
    root.style.setProperty('--divider', tokens.surface.divider);
    root.style.setProperty('--text-primary', tokens.text.primary);
    root.style.setProperty('--text-secondary', tokens.text.secondary);
    root.style.setProperty('--text-tertiary', tokens.text.tertiary);
    root.style.setProperty('--text-disabled', tokens.text.disabled);
    root.style.setProperty('--brand-primary', tokens.brand.primary);
    root.style.setProperty('--brand-primary-hover', tokens.brand.primaryHover);
    root.style.setProperty('--brand-primary-active', tokens.brand.primaryActive);
    root.style.setProperty('--semantic-success', tokens.semantic.success);
    root.style.setProperty('--semantic-success-bg', tokens.semantic.successBg);
    root.style.setProperty('--semantic-warning', tokens.semantic.warning);
    root.style.setProperty('--semantic-warning-bg', tokens.semantic.warningBg);
    root.style.setProperty('--semantic-error', tokens.semantic.error);
    root.style.setProperty('--semantic-error-bg', tokens.semantic.errorBg);
    root.style.setProperty('--semantic-info', tokens.semantic.info);
    root.style.setProperty('--semantic-info-bg', tokens.semantic.infoBg);
    root.style.setProperty('--semantic-critical', tokens.semantic.critical);
    root.style.setProperty('--semantic-critical-bg', tokens.semantic.criticalBg);
    root.style.setProperty('--overlay', tokens.surface.overlay);

    // Density
    const densityScale = density === 'compact' ? 0.85 : density === 'touch' ? 1.15 : 1;
    root.style.setProperty('--density-scale', String(densityScale));
  }, [tokens, density]);

  return (
    <ThemeContext.Provider value={{ theme, density, tokens, setTheme, setDensity }}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
