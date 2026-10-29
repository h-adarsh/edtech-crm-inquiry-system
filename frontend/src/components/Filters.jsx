import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  userType,
  setUserType,
  status,
  setStatus,
  onReset,
  totalResults,
}) {
  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    userType !== 'All' ||
    status !== 'All';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 sm:p-5 mb-6 w-full">
      <div className="flex flex-col gap-3.5">
        {/* Top Row: Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns Row: Responsive Grid on Mobile, Flex on Desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-0.5">
          {/* Controls Container */}
          <div className="w-full sm:w-auto">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-2.5">
              {/* Category Dropdown */}
              <div className="col-span-1 sm:w-auto">
                <select
                  id="filter-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full sm:w-auto text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="All">All Categories</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Concert">Concert</option>
                  <option value="Admission">Admission</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              {/* User Type Dropdown */}
              <div className="col-span-1 sm:w-auto">
                <select
                  id="filter-usertype"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full sm:w-auto text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="All">All User Types</option>
                  <option value="Parent">Parent</option>
                  <option value="Student">Student</option>
                  <option value="School">School</option>
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="col-span-1 sm:w-auto">
                <select
                  id="filter-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full sm:w-auto text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="All">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <div className="col-span-1 sm:w-auto">
                  <button
                    onClick={onReset}
                    className="w-full sm:w-auto flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Clear all filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Counter */}
          <div className="text-xs font-medium text-slate-500 sm:text-right pt-1 sm:pt-0">
            Found <span className="font-bold text-slate-800">{totalResults}</span> inquiries
          </div>
        </div>
      </div>
    </div>
  );
}
