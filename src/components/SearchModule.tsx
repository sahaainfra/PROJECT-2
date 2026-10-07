import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Star, Clock, ArrowRight, Filter, Command, Keyboard, Zap, AlertCircle, CheckCircle, FileText, Package, Users, Building2, Truck, Briefcase, Wrench, HardHat, Plus } from 'lucide-react';
import {
  searchDocuments_query, getSearchSuggestions, getRecentItems, getFavourites,
  getContextActions, getZeroResultQueries, getSearchStats,
  type SearchDocument, type SearchSuggestion, type RecentItem, type Favourite, type CommandAction, type EntityType
} from '../data/search';

// Icon component
function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    'search': SearchIcon, 'x': X, 'star': Star, 'clock': Clock, 'arrow-right': ArrowRight,
    'filter': Filter, 'command': Command, 'keyboard': Keyboard, 'zap': Zap,
    'alert': AlertCircle, 'check': CheckCircle, 'file': FileText, 'package': Package,
    'users': Users, 'building': Building2, 'truck': Truck, 'briefcase': Briefcase,
    'wrench': Wrench, 'hard-hat': HardHat, 'plus': Plus,
  };
  const IconComponent = icons[name] || SearchIcon;
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

// Entity Icon component
function EntityIcon({ entityType, size = 20 }: { entityType: EntityType; size?: number }) {
  const iconMap: Record<EntityType, string> = {
    project: 'building',
    site: 'hard-hat',
    purchase_order: 'truck',
    purchase_request: 'file',
    vendor: 'briefcase',
    employee: 'users',
    material: 'package',
    boq_item: 'file',
    bill: 'file',
    grn: 'package',
    document: 'file',
    task: 'check',
    report: 'file',
    contract: 'file',
    work_order: 'wrench',
    drawing: 'file',
    rfi: 'file',
    ncr: 'alert',
    claim: 'file',
    equipment: 'wrench',
    tool: 'wrench',
    inspection: 'check',
  };
  return <Icon name={iconMap[entityType] || 'file'} size={size} />;
}

export function SearchModule() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchDocument[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [contextActions, setContextActions] = useState<CommandAction[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<{ type: EntityType; id: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentUser = 'user-010'; // Simulated current user
  const searchStats = getSearchStats();
  const zeroResultQueries = getZeroResultQueries();

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search on query change
  useEffect(() => {
    if (query.length >= 2) {
      const result = searchDocuments_query(query, currentUser);
      setSearchResults(result.documents);
      const suggs = getSearchSuggestions(query, currentUser);
      setSuggestions(suggs);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Load recent and favourites
  useEffect(() => {
    setRecentItems(getRecentItems(currentUser));
    setFavourites(getFavourites(currentUser));
  }, []);

  // Load context actions when entity selected
  useEffect(() => {
    if (selectedEntity) {
      setContextActions(getContextActions(selectedEntity.type, selectedEntity.id, currentUser));
    } else {
      setContextActions([]);
    }
  }, [selectedEntity]);

  const handleResultClick = (doc: SearchDocument) => {
    setSelectedEntity({ type: doc.entityType, id: doc.entityId });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'record' && suggestion.entityType && suggestion.entityId) {
      setSelectedEntity({ type: suggestion.entityType, id: suggestion.entityId });
    } else if (suggestion.route) {
      // Navigate to route
      window.location.href = suggestion.route;
    }
    setShowSuggestions(false);
  };

  const handleFacetChange = (field: string, value: string) => {
    setSelectedFacets(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Global Search & Command Center</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Search across all modules · Press <kbd className="px-2 py-0.5 text-xs bg-[var(--surface-hover)] rounded">⌘K</kbd> for command palette</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <span>{searchStats.totalDocuments} indexed documents</span>
            <span>·</span>
            <span>{searchStats.totalQueries} queries today</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            <SearchIcon size={20} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search projects, POs, vendors, materials, documents... (try: po:, vendor:, emp:, boq:)"
            className="w-full pl-12 pr-12 py-3 text-sm border border-[var(--border)] rounded-xl bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-6 right-6 mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-hover)] text-left border-b border-[var(--divider)] last:border-b-0"
              >
                {suggestion.type === 'record' && suggestion.entityType && (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <EntityIcon entityType={suggestion.entityType} size={16} />
                  </div>
                )}
                {suggestion.type === 'action' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Zap size={16} />
                  </div>
                )}
                {suggestion.type === 'navigation' && (
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <ArrowRight size={16} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-primary)]">{suggestion.text}</p>
                  <p className="text-xs text-[var(--text-tertiary)] capitalize">{suggestion.type}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {query.length < 2 ? (
          // Show recent and favourites when no query
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Items */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-[var(--text-tertiary)]" />
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Recent Items</h3>
              </div>
              <div className="space-y-2">
                {recentItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEntity({ type: item.entityType, id: item.entityId })}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <EntityIcon entityType={item.entityType} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{item.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] capitalize">{item.entityType.replace('_', ' ')}</p>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">{new Date(item.viewedAt).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Favourites */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-amber-500" />
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Favourites</h3>
              </div>
              <div className="space-y-2">
                {favourites.map(fav => (
                  <button
                    key={fav.id}
                    onClick={() => setSelectedEntity({ type: fav.entityType, id: fav.entityId })}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <EntityIcon entityType={fav.entityType} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{fav.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] capitalize">{fav.entityType.replace('_', ' ')}</p>
                    </div>
                    {fav.pinnedModuleCode && (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">Pinned</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Show search results
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Facets Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={16} className="text-[var(--text-tertiary)]" />
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">Filters</h3>
                </div>
                <div className="space-y-4">
                  {searchResults.length > 0 && (
                    <>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Type</p>
                        <div className="space-y-1">
                          {Array.from(new Set(searchResults.map(r => r.entityType))).map(type => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFacets.entityType?.includes(type) || false}
                                onChange={() => handleFacetChange('entityType', type)}
                                className="rounded"
                              />
                              <span className="text-xs text-[var(--text-secondary)] capitalize flex-1">{type.replace('_', ' ')}</span>
                              <span className="text-xs text-[var(--text-tertiary)]">
                                {searchResults.filter(r => r.entityType === type).length}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Status</p>
                        <div className="space-y-1">
                          {Array.from(new Set(searchResults.map(r => r.status))).map(status => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFacets.status?.includes(status) || false}
                                onChange={() => handleFacetChange('status', status)}
                                className="rounded"
                              />
                              <span className="text-xs text-[var(--text-secondary)] flex-1">{status}</span>
                              <span className="text-xs text-[var(--text-tertiary)]">
                                {searchResults.filter(r => r.status === status).length}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "<span className="font-medium">{query}</span>"
                </p>
              </div>

              {/* Results List */}
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleResultClick(doc)}
                      className="w-full bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--brand-primary)] text-left transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <EntityIcon entityType={doc.entityType} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{doc.title}</h3>
                            <StatusChip status={doc.status} variant={
                              doc.status === 'Active' || doc.status === 'Approved' || doc.status === 'Completed' ? 'success' :
                              doc.status === 'Pending' || doc.status === 'In Progress' ? 'info' :
                              'neutral'
                            } />
                          </div>
                          {doc.subtitle && (
                            <p className="text-xs text-[var(--text-secondary)] mb-2">{doc.subtitle}</p>
                          )}
                          <p className="text-xs text-[var(--text-tertiary)] line-clamp-2">{doc.bodyText}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-tertiary)]">
                            {doc.projectName && <span>Project: {doc.projectName}</span>}
                            {doc.siteName && <span>Site: {doc.siteName}</span>}
                            <span>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-12 text-center">
                  <SearchIcon size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
                  <p className="text-sm text-[var(--text-secondary)]">No results found for "{query}"</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">Try different keywords or check your filters</p>
                </div>
              )}

              {/* Context Actions */}
              {selectedEntity && contextActions.length > 0 && (
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-[var(--brand-primary)]" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contextActions.map(action => (
                      <button
                        key={action.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--brand-primary)] hover:bg-[var(--surface-hover)] text-left transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Icon name={action.icon || 'arrow-right'} size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{action.label}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{action.module}</p>
                        </div>
                        {action.shortcut && (
                          <kbd className="text-xs px-2 py-1 bg-[var(--surface-hover)] rounded text-[var(--text-tertiary)]">
                            {action.shortcut}
                          </kbd>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Analytics (Admin) */}
        {zeroResultQueries.length > 0 && (
          <div className="mt-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              Zero-Result Queries (Admin)
            </h3>
            <div className="space-y-2">
              {zeroResultQueries.slice(0, 5).map(analytics => (
                <div key={analytics.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-hover)]">
                  <span className="text-sm text-[var(--text-primary)]">"{analytics.query}"</span>
                  <span className="text-xs text-[var(--text-tertiary)]">{new Date(analytics.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-3">Consider adding synonyms for these terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
