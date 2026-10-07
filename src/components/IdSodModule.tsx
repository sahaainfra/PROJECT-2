// Part 09 — Security, Identity & Segregation of Duties
// Enterprise identity, ABAC, SoD rules, and privileged access management

import React, { useState } from 'react';
import {
  Shield, Users, Monitor, AlertTriangle, CheckCircle, Clock, Lock, Eye, Key,
  Fingerprint, Smartphone, Laptop, UserCheck, UserX, AlertCircle, FileText, Settings, XCircle
} from 'lucide-react';
import {
  identityExtensions, devices, sessions, abacPolicies, sodRules, sodExceptions,
  sodFindings, accessReviewCampaigns, accessReviewItems, privilegedSessions,
  protocolControlPoints, getSodRulesBySeverity, getSodRulesByMode, getFindingsByStatus,
  getMfaCoverage, getAccessReviewProgress,
  type SoDRule, type SoDException, type SoDFinding, type AccessReviewCampaign
} from '../data/idsod';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, any> = {
    'shield': Shield,
    'users': Users,
    'monitor': Monitor,
    'alert-triangle': AlertTriangle,
    'check-circle': CheckCircle,
    'clock': Clock,
    'lock': Lock,
    'eye': Eye,
    'key': Key,
    'fingerprint': Fingerprint,
    'smartphone': Smartphone,
    'laptop': Laptop,
    'user-check': UserCheck,
    'user-x': UserX,
    'alert-circle': AlertCircle,
    'file-text': FileText,
    'settings': Settings,
    'x-circle': XCircle,
  };
  const IconComponent = icons[name] || Shield;
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

export function IdSodModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'identity' | 'sessions' | 'sod-rules' | 'sod-exceptions' | 'sod-findings' | 'access-reviews' | 'privileged'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'shield' },
    { id: 'identity', label: 'Identity & MFA', icon: 'fingerprint' },
    { id: 'sessions', label: 'Sessions & Devices', icon: 'monitor' },
    { id: 'sod-rules', label: 'SoD Rules', icon: 'alert-triangle' },
    { id: 'sod-exceptions', label: 'SoD Exceptions', icon: 'file-text' },
    { id: 'sod-findings', label: 'SoD Findings', icon: 'alert-circle' },
    { id: 'access-reviews', label: 'Access Reviews', icon: 'user-check' },
    { id: 'privileged', label: 'Privileged Access', icon: 'key' },
  ];

  const sodBySeverity = getSodRulesBySeverity();
  const sodByMode = getSodRulesByMode();
  const findingsByStatus = getFindingsByStatus();
  const mfaCoverage = getMfaCoverage();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Administration</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Identity & SoD · ff.idsod</p>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Identity, Access Reviews & SoD</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Enterprise identity management · ABAC policies · Segregation of duties · Privileged access</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">MFA Coverage</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{mfaCoverage.percentage}%</p>
                <p className="text-xs text-emerald-600 mt-1">{mfaCoverage.enforced}/{mfaCoverage.total} enforced</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">SoD Rules</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{sodRules.length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{sodByMode.enforce || 0} enforced</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">SoD Findings</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{sodFindings.length}</p>
                <p className="text-xs text-amber-600 mt-1">{findingsByStatus.detected || 0} open</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Access Reviews</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{accessReviewCampaigns.filter(c => c.status === 'in_review').length}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">in progress</p>
              </div>
            </div>

            {/* SoD Rules Summary */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">SoD Rules by Severity</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700">Critical</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{sodBySeverity.critical || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-xs text-orange-700">High</p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">{sodBySeverity.high || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700">Medium</p>
                  <p className="text-2xl font-bold text-amber-900 mt-1">{sodBySeverity.medium || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-700">Low</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{sodBySeverity.low || 0}</p>
                </div>
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

            {/* Recent SoD Findings */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent SoD Findings</h3>
              </div>
              <div className="divide-y divide-[var(--divider)]">
                {sodFindings.slice(0, 5).map(finding => (
                  <div key={finding.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[var(--surface-hover)]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      finding.status === 'detected' ? 'bg-red-100 text-red-600' :
                      finding.status === 'acknowledged' ? 'bg-amber-100 text-amber-600' :
                      finding.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name="alert-triangle" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{finding.ruleCode}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">
                        {finding.recordType}: {finding.recordName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusChip 
                        status={finding.status} 
                        variant={
                          finding.status === 'detected' ? 'error' :
                          finding.status === 'acknowledged' ? 'warning' :
                          finding.status === 'resolved' ? 'success' :
                          'neutral'
                        } 
                      />
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">{new Date(finding.detectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* IDENTITY & MFA TAB */}
        {activeTab === 'identity' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Identity & MFA Management</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">User identity extensions · MFA enrollment · Device trust levels</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Identity Provider</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">MFA Methods</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Passkeys</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Risk Level</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">MFA Enforced</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last MFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {identityExtensions.map(identity => (
                    <tr key={identity.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-xs font-bold">
                            {identity.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-[var(--text-primary)]">{identity.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] uppercase">{identity.idp}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {identity.mfaMethods.map(method => (
                            <span key={method} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">{method}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-tabular text-sm text-[var(--text-primary)]">{identity.passkeysCount}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={identity.riskLevel} 
                          variant={identity.riskLevel === 'high' ? 'error' : identity.riskLevel === 'medium' ? 'warning' : 'success'} 
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {identity.mfaEnforced ? (
                          <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle size={16} className="text-[var(--text-disabled)] mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                        {identity.lastMfaAt ? new Date(identity.lastMfaAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SESSIONS & DEVICES TAB */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sessions & Devices</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Active sessions · Device registry · Trust levels · Session revocation</p>
            </div>

            {/* Active Sessions */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Active Sessions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Device</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">IP Address</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Location</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Issued</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Expires</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {sessions.filter(s => s.status === 'active').map(session => (
                      <tr key={session.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{session.userName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{session.deviceName}</td>
                        <td className="px-4 py-3 text-xs font-mono text-[var(--text-tertiary)]">{session.ipAddress}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{session.geoLocation || '—'}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(session.issuedAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(session.expiresAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip status={session.status} variant="success" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Device Registry */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Device Registry</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Device Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Platform</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Browser</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Trust Level</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Registered</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {devices.map(device => (
                      <tr key={device.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{device.userName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{device.deviceName}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{device.platform}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{device.browser}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip 
                            status={device.trustLevel} 
                            variant={
                              device.trustLevel === 'trusted' ? 'success' :
                              device.trustLevel === 'managed' ? 'info' :
                              device.trustLevel === 'personal' ? 'warning' :
                              'neutral'
                            } 
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(device.registeredAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(device.lastSeenAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SOD RULES TAB */}
        {activeTab === 'sod-rules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">SoD Rule Library</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{sodRules.length} segregation of duties rules · Preventive and detective controls</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Rule
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Rule Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Action A</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Action B</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Severity</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Mode</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {sodRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{rule.code}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{rule.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{rule.description}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{rule.actionA}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{rule.actionB}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{rule.scope.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={rule.severity} 
                          variant={
                            rule.severity === 'critical' ? 'error' :
                            rule.severity === 'high' ? 'error' :
                            rule.severity === 'medium' ? 'warning' :
                            'info'
                          } 
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={rule.mode} 
                          variant={rule.mode === 'enforce' ? 'error' : 'warning'} 
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={rule.status} 
                          variant={rule.status === 'active' ? 'success' : rule.status === 'approved' ? 'info' : 'neutral'} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SOD EXCEPTIONS TAB */}
        {activeTab === 'sod-exceptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">SoD Exception Register</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{sodExceptions.length} time-boxed exceptions · Compensating controls tracked</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + Request Exception
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Rule</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Compensating Control</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Valid From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Valid To</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {sodExceptions.map(exception => (
                    <tr key={exception.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{exception.ruleCode}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{exception.userName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{exception.reason}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)] max-w-xs truncate">{exception.compensatingControl}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(exception.validFrom).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(exception.validTo).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{exception.approvedBy ? 'Approved' : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={exception.status} 
                          variant={
                            exception.status === 'approved' ? 'success' :
                            exception.status === 'requested' ? 'warning' :
                            exception.status === 'expired' ? 'error' :
                            'neutral'
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

        {/* SOD FINDINGS TAB */}
        {activeTab === 'sod-findings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">SoD Findings</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{sodFindings.length} detective scan findings · Nightly violation detection</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Rule</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Record</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Actor A</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Actor B</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Detected</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Owner</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {sodFindings.map(finding => (
                    <tr key={finding.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-[var(--brand-primary)]">{finding.ruleCode}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--text-primary)]">{finding.recordType}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{finding.recordName}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{finding.actorAName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{finding.actorBName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(finding.detectedAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{finding.ownerName}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={finding.status} 
                          variant={
                            finding.status === 'detected' ? 'error' :
                            finding.status === 'acknowledged' ? 'warning' :
                            finding.status === 'resolved' ? 'success' :
                            'neutral'
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

        {/* ACCESS REVIEWS TAB */}
        {activeTab === 'access-reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Access Review Campaigns</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{accessReviewCampaigns.length} campaigns · Quarterly access certification</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                + New Campaign
              </button>
            </div>

            {/* Campaign List */}
            <div className="space-y-4">
              {accessReviewCampaigns.map(campaign => {
                const progress = getAccessReviewProgress(campaign.id);
                return (
                  <div key={campaign.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)]">{campaign.name}</h3>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">{campaign.scope}</p>
                      </div>
                      <StatusChip 
                        status={campaign.status.replace('_', ' ')} 
                        variant={
                          campaign.status === 'closed' ? 'success' :
                          campaign.status === 'in_review' ? 'info' :
                          'warning'
                        } 
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Total Grants</p>
                        <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{campaign.totalGrants}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Reviewed</p>
                        <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{campaign.reviewedGrants}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Kept</p>
                        <p className="text-lg font-bold text-emerald-600 mt-1">{campaign.keptGrants}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Revoked</p>
                        <p className="text-lg font-bold text-red-600 mt-1">{campaign.revokedGrants}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                        <p className="text-lg font-bold text-amber-600 mt-1">{campaign.pendingGrants}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[var(--text-tertiary)]">Progress</span>
                        <span className="text-xs font-medium text-[var(--text-primary)]">{progress.percentage}%</span>
                      </div>
                      <div className="h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--brand-primary)] rounded-full transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                      <span>Start: {new Date(campaign.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(campaign.endDate).toLocaleDateString()}</span>
                      <span>Created by: {campaign.createdBy}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Review Items */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Review Items (Pending)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Scope</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Granted</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reviewer</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)]">
                    {accessReviewItems.filter(item => item.decision === 'pending').map(item => (
                      <tr key={item.id} className="hover:bg-[var(--surface-hover)]">
                        <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{item.userName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{item.roleName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{item.scopeName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(item.grantedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{item.reviewerName || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip status="pending" variant="warning" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRIVILEGED ACCESS TAB */}
        {activeTab === 'privileged' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Privileged Access Console</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Break-glass access · Dual approval · Session recording · Just-in-time elevation</p>
              </div>
              <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                Request Elevation
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Administrator</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Approved By</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Started</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Expires</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Ended</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Actions</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {privilegedSessions.map(session => (
                    <tr key={session.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{session.adminName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">{session.reason}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{session.approverName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(session.startedAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(session.expiresAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{session.endedAt ? new Date(session.endedAt).toLocaleString() : '—'}</td>
                      <td className="px-4 py-3 text-center font-tabular text-sm text-[var(--text-primary)]">{session.actionsCount}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip 
                          status={session.status} 
                          variant={
                            session.status === 'active' ? 'success' :
                            session.status === 'ended' ? 'neutral' :
                            'warning'
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
      </div>
    </div>
  );
}
