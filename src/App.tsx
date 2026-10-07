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
  Download, RefreshCw, ChevronLeft, Hash, Activity, Target, Briefcase, HardHat
} from 'lucide-react';
import { lightTokens, darkTokens, highContrastTokens, type DesignTokens, type ThemeMode, type DensityMode } from './design/tokens';
import { navigationRegistry, type NavGroup, type NavEntry } from './data/navigation';

// ===== FEATURE FLAGS (ff.pgm) =====
const featureFlags: Record<string, boolean> = {
  'ff.pgm': true,
  'ff.pgm.theme': true,
  'ff.tech_console': true,
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
  calculator: Calculator, calendar: CalendarDays, 'file-text': FileText, clipboard: ClipboardList,
  truck: Truck, 'file-check': FileCheck, cart: ShoppingCart, warehouse: Warehouse,
  package: Package, boxes: Boxes, 'arrow-up-right': ArrowUpRight, dollar: DollarSign,
  receipt: Receipt, users: Users, 'pie-chart': PieChart, 'user-check': Shield,
  clock: Clock, user: User, search: Search, 'alert-triangle': AlertTriangle,
  'layout-dashboard': LayoutDashboard, 'file-bar-chart': FileBarChart, shield: Shield,
  'bar-chart': BarChart3,
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
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
          <Terminal size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Technical Console — Program Baseline</h1>
          <p className="text-xs text-[var(--text-tertiary)]">/_tech/program/baseline · Read-only · TECH_ADMIN access</p>
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
