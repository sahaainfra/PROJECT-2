import React, { useState } from 'react';
import {
  FileText, Upload, Download, Eye, Edit, CheckCircle, Clock, AlertCircle,
  Filter, Search, Plus, ArrowRight, Link2, Send, MessageSquare, Calendar,
  User, Users, Building2, HardHat, FileCheck, FileWarning, Archive,
  ChevronRight, X, Star, Paperclip, Image as ImageIcon, Video, File
} from 'lucide-react';
import {
  documents, revisions, files, reviews, transmittals, rfis, correspondence,
  documentLinks, numberingSchemes, documentACL, protocolControlPoints,
  getDocumentsByProject, getDocumentsByType, getRevisionsByDocument,
  getCurrentRevision, getRFIsByProject, getOpenRFIs, getDocumentStats, getRFIStats,
  type Document, type DocumentRevision, type RFI
} from '../data/doc';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'file': FileText, 'upload': Upload, 'download': Download, 'eye': Eye,
    'edit': Edit, 'check': CheckCircle, 'clock': Clock, 'alert': AlertCircle,
    'filter': Filter, 'search': Search, 'plus': Plus, 'arrow-right': ArrowRight,
    'link': Link2, 'send': Send, 'message': MessageSquare, 'calendar': Calendar,
    'user': User, 'users': Users, 'building': Building2, 'hard-hat': HardHat,
    'file-check': FileCheck, 'file-warning': FileWarning, 'archive': Archive,
    'chevron-right': ChevronRight, 'x': X, 'star': Star, 'paperclip': Paperclip,
    'image': ImageIcon, 'video': Video, 'file-doc': File,
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
      {status.replace(/_/g, ' ')}
    </span>
  );
}

// Document Type Icon
function DocTypeIcon({ type }: { type: string }) {
  const iconMap: Record<string, string> = {
    drawing: 'file',
    spec: 'file-check',
    method_statement: 'file-doc',
    contract: 'file-check',
    boq: 'file',
    letter: 'file',
    rfi: 'message',
    si: 'file',
    report: 'file',
    certificate: 'file-check',
    photo: 'image',
    other: 'file-doc',
  };
  return <Icon name={iconMap[type] || 'file'} size={20} className="text-[var(--brand-primary)]" />;
}

export function DocModule() {
  const [activeTab, setActiveTab] = useState<'register' | 'upload' | 'rfi' | 'correspondence' | 'transmittals'>('register');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedRFI, setSelectedRFI] = useState<RFI | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'register', label: 'Document Register', icon: 'file' },
    { id: 'upload', label: 'Upload', icon: 'upload' },
    { id: 'rfi', label: 'RFI Register', icon: 'message' },
    { id: 'correspondence', label: 'Correspondence', icon: 'send' },
    { id: 'transmittals', label: 'Transmittals', icon: 'arrow-right' },
  ];

  const docStats = getDocumentStats();
  const rfiStats = getRFIStats();

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    if (filterType !== 'all' && doc.type !== filterType) return false;
    if (filterProject !== 'all' && doc.projectId !== filterProject) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doc.docNo.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.originator.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 overflow-y-auto shrink-0 hidden lg:block">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Documents</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Part 24 · ff.doc</p>
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

        {/* DOCUMENT REGISTER TAB */}
        {activeTab === 'register' && !selectedDoc && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Document Register</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{docStats.total} documents · {docStats.approved} approved · {docStats.underReview} under review</p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2"
              >
                <Upload size={16} /> Upload Document
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total Documents</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{docStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Approved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{docStats.approved}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Under Review</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{docStats.underReview}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Open RFIs</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{rfiStats.open}</p>
              </div>
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
                      placeholder="Search documents..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Type</label>
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Types</option>
                    <option value="drawing">Drawings</option>
                    <option value="spec">Specifications</option>
                    <option value="method_statement">Method Statements</option>
                    <option value="contract">Contracts</option>
                    <option value="rfi">RFIs</option>
                    <option value="report">Reports</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Project</label>
                  <select
                    value={filterProject}
                    onChange={e => setFilterProject(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                  >
                    <option value="all">All Projects</option>
                    <option value="prj-001">Metro Tower Phase II</option>
                    <option value="prj-002">Highway Bridge NH-48</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Document No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Discipline</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Revision</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {filteredDocs.map(doc => {
                    const currentRev = getCurrentRevision(doc.id);
                    return (
                      <tr key={doc.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <DocTypeIcon type={doc.type} />
                            <span className="font-mono text-xs text-[var(--brand-primary)]">{doc.docNo}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-[var(--text-primary)]">{doc.title}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{doc.originator}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)] capitalize">{doc.type.replace('_', ' ')}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] capitalize">{doc.discipline}</td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{doc.projectName}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-mono font-bold text-[var(--brand-primary)]">{currentRev?.revisionCode || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusChip
                            status={doc.status}
                            variant={
                              doc.status === 'APPROVED' ? 'success' :
                              doc.status === 'UNDER_REVIEW' ? 'info' :
                              doc.status === 'REJECTED' ? 'error' :
                              'neutral'
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(doc.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

        {/* DOCUMENT DETAIL */}
        {activeTab === 'register' && selectedDoc && (
          <div className="space-y-6">
            <button onClick={() => setSelectedDoc(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to document register
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <DocTypeIcon type={selectedDoc.type} />
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedDoc.docNo}</span>
                    <StatusChip
                      status={selectedDoc.status}
                      variant={
                        selectedDoc.status === 'APPROVED' ? 'success' :
                        selectedDoc.status === 'UNDER_REVIEW' ? 'info' :
                        'neutral'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedDoc.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedDoc.projectName} · {selectedDoc.originator}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] flex items-center gap-2">
                    <Download size={14} /> Download
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                    <Eye size={14} /> View
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedDoc.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Discipline</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedDoc.discipline}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Confidentiality</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 capitalize">{selectedDoc.confidentiality}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Created</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedDoc.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Revisions Timeline */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Revision History</h3>
                <div className="space-y-3">
                  {getRevisionsByDocument(selectedDoc.id).map(rev => (
                    <div key={rev.id} className="flex items-start gap-4 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        rev.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                        rev.status === 'FOR_REVIEW' ? 'bg-blue-100 text-blue-600' :
                        rev.status === 'SUPERSEDED' ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono font-bold text-[var(--brand-primary)]">{rev.revisionCode}</span>
                          <StatusChip
                            status={rev.status}
                            variant={
                              rev.status === 'APPROVED' ? 'success' :
                              rev.status === 'FOR_REVIEW' ? 'info' :
                              rev.status === 'SUPERSEDED' ? 'neutral' :
                              'warning'
                            }
                          />
                          {rev.reviewCode && (
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">Code: {rev.reviewCode}</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Uploaded by {rev.uploadedByName} on {new Date(rev.uploadedAt).toLocaleString()}
                        </p>
                        {rev.commentsSummary && (
                          <p className="text-xs text-[var(--text-tertiary)] mt-1 italic">{rev.commentsSummary}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-tertiary)]">
                          <span>{(rev.size / 1000000).toFixed(2)} MB</span>
                          <span>{rev.mime}</span>
                          <button className="text-[var(--brand-primary)] hover:underline flex items-center gap-1">
                            <Download size={12} /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Links */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Linked Records</h3>
                <div className="space-y-2">
                  {documentLinks.filter(l => l.documentId === selectedDoc.id).map(link => (
                    <div key={link.id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                      <Link2 size={16} className="text-[var(--text-tertiary)]" />
                      <span className="text-xs text-[var(--text-primary)]">{link.entityType}</span>
                      <span className="text-xs font-mono text-[var(--brand-primary)]">#{link.entityId}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-secondary)] capitalize">{link.relation}</span>
                      <span className="text-xs text-[var(--text-tertiary)] ml-auto">{new Date(link.linkedAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Control */}
              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Access Control</h3>
                <div className="space-y-2">
                  {documentACL.filter(acl => acl.documentId === selectedDoc.id).map(acl => (
                    <div key={acl.id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                      <Icon name={acl.principalType === 'user' ? 'user' : 'users'} size={16} className="text-[var(--text-tertiary)]" />
                      <span className="text-xs text-[var(--text-primary)]">{acl.principalName}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-secondary)] capitalize">{acl.principalType}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 capitalize">{acl.permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Upload Document</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Upload and register new documents with metadata</p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="space-y-6">
                {/* Step 1: Document Info */}
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Step 1: Document Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Project *</label>
                      <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]">
                        <option>Metro Tower Phase II</option>
                        <option>Highway Bridge NH-48</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Document Type *</label>
                      <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]">
                        <option>Drawing</option>
                        <option>Specification</option>
                        <option>Method Statement</option>
                        <option>Contract</option>
                        <option>Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Discipline *</label>
                      <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]">
                        <option>Civil</option>
                        <option>Structural</option>
                        <option>MEP</option>
                        <option>Architectural</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Document Number *</label>
                      <input
                        type="text"
                        placeholder="Auto-generated"
                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Title *</label>
                      <input
                        type="text"
                        placeholder="Enter document title"
                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Originator *</label>
                      <input
                        type="text"
                        placeholder="Enter originator"
                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Confidentiality *</label>
                      <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]">
                        <option>Internal</option>
                        <option>Public</option>
                        <option>Restricted</option>
                        <option>Confidential</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2: File Upload */}
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Step 2: Upload File</h3>
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-12 text-center hover:border-[var(--brand-primary)] cursor-pointer transition-colors">
                    <Upload size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-primary)] mb-2">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Supported formats: PDF, DWG, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 50MB)</p>
                    <input type="file" className="hidden" />
                  </div>
                </div>

                {/* Step 3: Revision Info */}
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Step 3: Revision Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Revision Code *</label>
                      <input
                        type="text"
                        placeholder="e.g., P01, C01, A"
                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Revision Description</label>
                      <input
                        type="text"
                        placeholder="Enter revision description"
                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-[var(--divider)]">
                  <button className="flex-1 px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)]">
                    Upload & Register
                  </button>
                  <button className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)]">
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RFI REGISTER TAB */}
        {activeTab === 'rfi' && !selectedRFI && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">RFI Register</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{rfiStats.total} RFIs · {rfiStats.open} open · {rfiStats.closed} closed</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New RFI
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Total RFIs</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{rfiStats.total}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Open</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{rfiStats.open}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Responded</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{rfiStats.responded}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--text-tertiary)]">Closed</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{rfiStats.closed}</p>
              </div>
            </div>

            {/* RFI List */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">RFI No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Raised By</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">To Party</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Required By</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {rfis.map(rfi => (
                    <tr key={rfi.id} className="hover:bg-[var(--surface-hover)] cursor-pointer" onClick={() => setSelectedRFI(rfi)}>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{rfi.rfiNo}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--text-primary)]">{rfi.subject}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-1">{rfi.question}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rfi.projectName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rfi.raisedByName}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{rfi.toParty}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(rfi.requiredBy).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={rfi.status}
                          variant={
                            rfi.status === 'CLOSED' ? 'success' :
                            rfi.status === 'RESPONDED' ? 'info' :
                            rfi.status === 'SENT' ? 'warning' :
                            'neutral'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {rfi.costImpact && (
                          <p className="text-xs text-[var(--text-primary)]">₹{(rfi.costImpact / 100000).toFixed(1)}L</p>
                        )}
                        {rfi.timeImpactDays && (
                          <p className="text-xs text-[var(--text-tertiary)]">{rfi.timeImpactDays} days</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RFI DETAIL */}
        {activeTab === 'rfi' && selectedRFI && (
          <div className="space-y-6">
            <button onClick={() => setSelectedRFI(null)} className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline">
              ← Back to RFI register
            </button>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[var(--brand-primary)]">{selectedRFI.rfiNo}</span>
                    <StatusChip
                      status={selectedRFI.status}
                      variant={
                        selectedRFI.status === 'CLOSED' ? 'success' :
                        selectedRFI.status === 'RESPONDED' ? 'info' :
                        'warning'
                      }
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedRFI.subject}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedRFI.projectName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Raised By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRFI.raisedByName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">To Party</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRFI.toParty}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Required By</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedRFI.requiredBy).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Created</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{new Date(selectedRFI.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Question</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedRFI.question}</p>
              </div>

              {selectedRFI.response && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Response</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedRFI.response}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Responded By</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRFI.respondedByName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Responded At</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{selectedRFI.respondedAt ? new Date(selectedRFI.respondedAt).toLocaleString() : '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {(selectedRFI.costImpact || selectedRFI.timeImpactDays) && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Impact Assessment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedRFI.costImpact && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-xs text-amber-700 mb-1">Cost Impact</p>
                        <p className="text-lg font-bold text-amber-900">₹{(selectedRFI.costImpact / 100000).toFixed(2)}L</p>
                      </div>
                    )}
                    {selectedRFI.timeImpactDays && (
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Time Impact</p>
                        <p className="text-lg font-bold text-blue-900">{selectedRFI.timeImpactDays} days</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedRFI.documentIds.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--divider)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Related Documents</h3>
                  <div className="space-y-2">
                    {selectedRFI.documentIds.map(docId => {
                      const doc = documents.find(d => d.id === docId);
                      if (!doc) return null;
                      return (
                        <div key={docId} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                          <DocTypeIcon type={doc.type} />
                          <span className="text-xs font-mono text-[var(--brand-primary)]">{doc.docNo}</span>
                          <span className="text-xs text-[var(--text-secondary)] flex-1">{doc.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CORRESPONDENCE TAB */}
        {activeTab === 'correspondence' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Correspondence Register</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{correspondence.length} letters · Track inward and outward correspondence</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New Correspondence
              </button>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Ref No</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Direction</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">To</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">Project</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)]">
                  {correspondence.map(corr => (
                    <tr key={corr.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-primary)]">{corr.refNo}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          corr.direction === 'inward' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {corr.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(corr.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{corr.from}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{corr.to}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-primary)] max-w-xs truncate">{corr.subject}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{corr.projectName}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusChip
                          status={corr.status}
                          variant={
                            corr.status === 'CLOSED' ? 'success' :
                            corr.status === 'ACTION_PENDING' ? 'warning' :
                            'info'
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

        {/* TRANSMITTALS TAB */}
        {activeTab === 'transmittals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transmittals</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{transmittals.length} transmittals · Controlled document distribution</p>
              </div>
              <button className="px-4 py-2 text-sm bg-[var(--brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] flex items-center gap-2">
                <Plus size={16} /> New Transmittal
              </button>
            </div>

            <div className="space-y-4">
              {transmittals.map(trans => (
                <div key={trans.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-[var(--brand-primary)]">{trans.transmittalNo}</span>
                        <StatusChip
                          status={trans.status}
                          variant={trans.status === 'acknowledged' ? 'success' : 'info'}
                        />
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 capitalize">
                          {trans.purpose.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{trans.projectName}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">To: {trans.toParty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-tertiary)]">Sent</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{new Date(trans.sentAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--divider)]">
                    <p className="text-xs text-[var(--text-tertiary)] mb-2">Documents ({trans.items.length})</p>
                    <div className="space-y-2">
                      {trans.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-hover)]">
                          <FileText size={16} className="text-[var(--text-tertiary)]" />
                          <span className="text-xs font-mono text-[var(--brand-primary)]">{item.documentNo}</span>
                          <span className="text-xs font-mono text-[var(--text-secondary)]">Rev {item.revisionCode}</span>
                          <span className="text-xs text-[var(--text-secondary)] flex-1">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {trans.acknowledgedAt && (
                    <div className="mt-4 pt-4 border-t border-[var(--divider)]">
                      <p className="text-xs text-emerald-600">
                        ✓ Acknowledged on {new Date(trans.acknowledgedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
