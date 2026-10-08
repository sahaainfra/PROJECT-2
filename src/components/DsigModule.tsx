import React, { useState } from 'react';
import {
  FileSignature, CheckCircle, Clock, XCircle, AlertCircle, Eye, Download,
  QrCode, Shield, User, Users, Calendar, Hash, FileText, PenTool,
  ChevronRight, Filter, Search, Plus, ArrowLeft, ExternalLink, Lock, Unlock
} from 'lucide-react';
import {
  signatureRequests, signatures, verifications, signatureHistory, protocolControlPoints,
  getSignatureRequestStats, getMyPendingSignatures, getSignatureMethodLabel,
  getRequestStatusLabel, getRequestStatusVariant, verifyDocumentHash, getSignatureProgress,
  type SignatureRequest, type Verification
} from '../data/dsig';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'signature': FileSignature, 'check': CheckCircle, 'clock': Clock, 'x-circle': XCircle,
    'alert': AlertCircle, 'eye': Eye, 'download': Download, 'qr': QrCode, 'shield': Shield,
    'user': User, 'users': Users, 'calendar': Calendar, 'hash': Hash, 'file': FileText,
    'pen': PenTool, 'chevron-right': ChevronRight, 'filter': Filter, 'search': Search,
    'plus': Plus, 'arrow-left': ArrowLeft, 'external-link': ExternalLink,
    'lock': Lock, 'unlock': Unlock,
  };
  const IconComponent = icons[name] || FileSignature;
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

// Progress Bar component
function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const percentage = Math.round((value / max) * 100);
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
          <span className="text-xs font-medium text-[var(--text-primary)]">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-[var(--surface-hover)] rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[var(--brand-primary)] rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function DsigModule() {
  const [activeTab, setActiveTab] = useState<'requests' | 'my-signatures' | 'verification' | 'history'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; message: string } | null>(null);

  const currentUser = 'user-010'; // Simulated current user
  const stats = getSignatureRequestStats();
  const myPending = getMyPendingSignatures(currentUser);

  const tabs = [
    { id: 'requests', label: 'Signature Requests', icon: 'file' },
    { id: 'my-signatures', label: 'My Signatures', icon: 'pen', badge: myPending.length },
    { id: 'verification', label: 'Verify Document', icon: 'shield' },
    { id: 'history', label: 'Signature History', icon: 'clock' },
  ];

  const handleVerify = () => {
    if (verificationCode.trim()) {
      const verification = verifications.find(v => v.verificationCode === verificationCode.trim());
      if (verification) {
        setSelectedVerification(verification);
        setVerificationResult({ valid: true, message: 'Document found and verified successfully' });
      } else {
        setVerificationResult({ valid: false, message: 'Invalid verification code. Please check and try again.' });
      }
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Digital Signatures</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 25 · ff.dsig</p>
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
              {t.badge && t.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{t.badge}</span>
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

        {/* SIGNATURE REQUESTS TAB */}
        {activeTab === 'requests' && !selectedRequest && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Signature Requests</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{stats.total} requests · {stats.completed} completed · {stats.pending} pending</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New Signature Request
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Completed</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Declined</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.declined}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Expired</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.expired}</p>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Request No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Progress</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Requested By</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {signatureRequests.map(req => {
                    const progress = getSignatureProgress(req);
                    return (
                      <tr key={req.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedRequest(req)}>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{req.requestNo}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-[var(--text-primary)]">{req.documentTitle}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{req.documentNumber}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{req.entityType}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[var(--surface-hover)] rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-[var(--brand-primary)] rounded-full"
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-[var(--text-tertiary)]">{progress.signed}/{progress.total}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip
                            status={getRequestStatusLabel(req.status)}
                            variant={getRequestStatusVariant(req.status)}
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{req.requestedByName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(req.expiresAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
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

        {/* REQUEST DETAIL */}
        {activeTab === 'requests' && selectedRequest && (
          <div className="space-y-6">
            <button onClick={() => setSelectedRequest(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <Icon name="arrow-left" size={16} /> Back to signature requests
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedRequest.requestNo}</span>
                    <StatusChip
                      status={getRequestStatusLabel(selectedRequest.status)}
                      variant={getRequestStatusVariant(selectedRequest.status)}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedRequest.documentTitle}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedRequest.documentNumber} · {selectedRequest.entityType}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                    <Icon name="eye" size={14} /> View Document
                  </button>
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                    <Icon name="download" size={14} /> Download
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Workflow Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedRequest.workflowType}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Requested By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRequest.requestedByName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Requested At</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedRequest.requestedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Expires At</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedRequest.expiresAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Signers */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Signers ({selectedRequest.signers.length})</h3>
                <div className="space-y-3">
                  {selectedRequest.signers.map((signer, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-[var(--border)]">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        signer.status === 'signed' ? 'bg-emerald-100 text-emerald-600' :
                        signer.status === 'pending' ? 'bg-blue-100 text-blue-600' :
                        signer.status === 'declined' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon name={signer.status === 'signed' ? 'check' : signer.status === 'pending' ? 'clock' : 'x-circle'} size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{signer.userName}</p>
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">{signer.role}</span>
                          <span className="text-xs text-[var(--text-tertiary)]">Order: {signer.order}</span>
                        </div>
                        <p className="text-xs text-[var(--text-tertiary)]">Method: {getSignatureMethodLabel(signer.method)}</p>
                        {signer.signedAt && (
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">
                            Signed on {new Date(signer.signedAt).toLocaleString()}
                          </p>
                        )}
                        <StatusChip
                          status={signer.status.charAt(0).toUpperCase() + signer.status.slice(1)}
                          variant={
                            signer.status === 'signed' ? 'success' :
                            signer.status === 'pending' ? 'info' :
                            signer.status === 'declined' ? 'error' :
                            'neutral'
                          }
                        />
                      </div>
                      {signer.status === 'pending' && signer.userId === currentUser && (
                        <button className="px-4 py-2 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                          Sign Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <ProgressBar
                  value={getSignatureProgress(selectedRequest).signed}
                  max={getSignatureProgress(selectedRequest).total}
                  label="Signature Progress"
                />
              </div>

              {/* Verification Info */}
              {selectedRequest.status === 'COMPLETED' && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Verification</h3>
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="shield" size={20} className="text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-900">Document Verified</p>
                    </div>
                    <p className="text-xs text-emerald-700">
                      This document has been digitally signed by all required signers and is verified as authentic.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Icon name="qr" size={16} className="text-emerald-600" />
                      <span className="text-xs font-mono text-emerald-700">QR Code: VERIFY-{selectedRequest.documentNumber}-2024</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY SIGNATURES TAB */}
        {activeTab === 'my-signatures' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Signatures</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{myPending.length} pending signatures requiring your attention</p>
            </div>

            {myPending.length === 0 ? (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-12 text-center">
                <Icon name="check" size={48} className="text-emerald-500 mx-auto mb-4" />
                <p className="text-sm text-[var(--text-secondary)]">All caught up! No pending signatures.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPending.map(req => {
                  const mySigner = req.signers.find(s => s.userId === currentUser && s.status === 'pending');
                  const progress = getSignatureProgress(req);
                  
                  return (
                    <div key={req.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-[var(--brand-primary)]">{req.requestNo}</span>
                            <StatusChip
                              status={getRequestStatusLabel(req.status)}
                              variant={getRequestStatusVariant(req.status)}
                            />
                          </div>
                          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{req.documentTitle}</h3>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">{req.documentNumber} · {req.entityType}</p>
                        </div>
                        <button className="px-4 py-2 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]">
                          Sign Now
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-[var(--text-tertiary)]">Requested By</p>
                          <p className="font-medium text-[var(--text-primary)] mt-1">{req.requestedByName}</p>
                        </div>
                        <div>
                          <p className="text-[var(--text-tertiary)]">Expires</p>
                          <p className="font-medium text-[var(--text-primary)] mt-1">{new Date(req.expiresAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[var(--text-tertiary)]">Progress</p>
                          <p className="font-medium text-[var(--text-primary)] mt-1">{progress.signed}/{progress.total} signed</p>
                        </div>
                      </div>

                      {mySigner && (
                        <div className="mt-4 pt-4 border-t border-[var(--divider)]">
                          <p className="text-xs text-[var(--text-tertiary)] mb-2">Your Signing Method</p>
                          <p className="text-sm text-[var(--text-primary)]">{getSignatureMethodLabel(mySigner.method)}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VERIFICATION TAB */}
        {activeTab === 'verification' && !selectedVerification && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Verify Document</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Verify document authenticity using verification code or QR code</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Enter Verification Code</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Verification Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      placeholder="e.g., VERIFY-MT-CON-001-2024"
                      className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                    />
                    <button
                      onClick={handleVerify}
                      className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {verificationResult && (
                  <div className={`p-4 rounded-lg border ${
                    verificationResult.valid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={verificationResult.valid ? 'check' : 'x-circle'} size={20} className={verificationResult.valid ? 'text-emerald-600' : 'text-red-600'} />
                      <p className={`text-sm font-medium ${verificationResult.valid ? 'text-emerald-900' : 'text-red-900'}`}>
                        {verificationResult.valid ? 'Verification Successful' : 'Verification Failed'}
                      </p>
                    </div>
                    <p className={`text-xs ${verificationResult.valid ? 'text-emerald-700' : 'text-red-700'}`}>
                      {verificationResult.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Or Scan QR Code</h3>
              <div className="flex items-center justify-center p-12 border-2 border-dashed border-[var(--border)] rounded-lg">
                <div className="text-center">
                  <Icon name="qr" size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
                  <p className="text-sm text-[var(--text-secondary)]">QR code scanning will be available on mobile devices</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">Use your device camera to scan the QR code on the document</p>
                </div>
              </div>
            </div>

            {/* Recent Verifications */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Recent Verifications</h3>
              <div className="space-y-3">
                {verifications.slice(0, 5).map(ver => (
                  <div key={ver.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                    <Icon name="shield" size={20} className="text-emerald-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{ver.documentNumber}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{ver.documentTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-tertiary)]">{ver.verificationCount} verifications</p>
                      {ver.lastVerifiedAt && (
                        <p className="text-xs text-[var(--text-tertiary)]">Last: {new Date(ver.lastVerifiedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION DETAIL */}
        {activeTab === 'verification' && selectedVerification && (
          <div className="space-y-6">
            <button onClick={() => { setSelectedVerification(null); setVerificationCode(''); setVerificationResult(null); }} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              <Icon name="arrow-left" size={16} /> Back to verification
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="shield" size={24} className="text-emerald-500" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Document Verified</h2>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedVerification.documentNumber}</p>
                </div>
                <StatusChip status="Authentic" variant="success" />
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Document Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Document Title</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedVerification.documentTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Verification Code</p>
                    <p className="text-sm font-mono text-[var(--text-primary)] mt-1">{selectedVerification.verificationCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Created At</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedVerification.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Public Access</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1 flex items-center gap-2">
                      <Icon name={selectedVerification.publicEnabled ? 'unlock' : 'lock'} size={14} />
                      {selectedVerification.publicEnabled ? 'Enabled' : 'Internal Only'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Hash Verification</h3>
                <div className="p-4 rounded-lg bg-[var(--surface-hover)]">
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">Document Hash (SHA-256)</p>
                  <p className="text-xs font-mono text-[var(--text-primary)] break-all">{selectedVerification.hash}</p>
                </div>
                <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-700">
                    ✓ Document hash verified - Document is authentic and has not been tampered with
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Verification Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[var(--surface-hover)]">
                    <p className="text-xs text-[var(--text-tertiary)]">Total Verifications</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{selectedVerification.verificationCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--surface-hover)]">
                    <p className="text-xs text-[var(--text-tertiary)]">Last Verified</p>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">
                      {selectedVerification.lastVerifiedAt ? new Date(selectedVerification.lastVerifiedAt).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedVerification.expiresAt && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Verification valid until: {new Date(selectedVerification.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Signature History</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{signatureHistory.length} signature events logged</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Action</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Actor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Details</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {signatureHistory.map(hist => (
                    <tr key={hist.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(hist.at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-mono text-[var(--brand-primary)]">{hist.documentNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={hist.action}
                          variant={
                            hist.action === 'signed' ? 'success' :
                            hist.action === 'verified' ? 'info' :
                            hist.action === 'declined' ? 'error' :
                            hist.action === 'tampered' ? 'error' :
                            'neutral'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{hist.actorName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)] max-w-xs truncate">{hist.details}</td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--text-tertiary)]">{hist.ipAddress || '—'}</td>
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
