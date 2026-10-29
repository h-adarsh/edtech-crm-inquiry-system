import React, { useState } from 'react';
import { Mail, Phone, Calendar, User, School, BookOpen, MessageSquare, AlertCircle, ChevronDown, Check } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function InquiryTable({
  inquiries,
  loading,
  onStatusChange,
  updatingStatusId,
}) {
  const [selectedMessage, setSelectedMessage] = useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs w-full">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-brand-600 mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading inquiries from database...</p>
        </div>
      </div>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs w-full">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">No inquiries found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          No records match your active search and filter criteria. Try adjusting your filters or clear search.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getUserTypeBadge = (userType) => {
    switch (userType) {
      case 'Parent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Student':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'School':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Scholarship':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Admission':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Concert':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'General Query':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <>
      {/* 1. Mobile Card View (Visible only on screens < md) */}
      <div className="md:hidden space-y-3.5 w-full">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3"
          >
            {/* Header: Name, Date & User Type */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-base leading-snug">
                  {inquiry.name}
                </h4>
                <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{formatDate(inquiry.created_at)}</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getUserTypeBadge(
                  inquiry.user_type
                )}`}
              >
                {inquiry.user_type}
              </span>
            </div>

            {/* Category Badge */}
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getCategoryBadge(
                  inquiry.category
                )}`}
              >
                {inquiry.category}
              </span>
            </div>

            {/* Contact details */}
            <div className="bg-slate-50/80 rounded-lg p-2.5 space-y-1.5 text-xs text-slate-600 border border-slate-100">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${inquiry.email}`}
                  className="text-brand-600 truncate hover:underline"
                >
                  {inquiry.email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={`tel:${inquiry.phone}`}
                  className="font-mono text-slate-700 hover:text-brand-600"
                >
                  {inquiry.phone}
                </a>
              </div>
            </div>

            {/* Message preview */}
            <div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {inquiry.message}
              </p>
              <button
                onClick={() => setSelectedMessage(inquiry)}
                className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold mt-1 inline-flex items-center space-x-0.5 cursor-pointer"
              >
                <span>Read full message &rarr;</span>
              </button>
            </div>

            {/* Status action row */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                value={inquiry.status}
                disabled={updatingStatusId === inquiry.id}
                onChange={(e) => onStatusChange(inquiry.id, e.target.value)}
                className="text-xs font-semibold rounded-lg px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer disabled:opacity-50"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Desktop Table View (Visible only on screens >= md) */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th scope="col" className="px-5 py-3.5">Candidate / Contact</th>
                <th scope="col" className="px-4 py-3.5">User Type</th>
                <th scope="col" className="px-4 py-3.5">Category</th>
                <th scope="col" className="px-5 py-3.5">Message Query</th>
                <th scope="col" className="px-4 py-3.5">Date</th>
                <th scope="col" className="px-5 py-3.5 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Name, Email, Phone */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 leading-snug">
                      {inquiry.name}
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="hover:text-brand-600 transition-colors truncate max-w-[200px]"
                      >
                        {inquiry.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="hover:text-brand-600 font-mono transition-colors"
                      >
                        {inquiry.phone}
                      </a>
                    </div>
                  </td>

                  {/* User Type */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getUserTypeBadge(
                        inquiry.user_type
                      )}`}
                    >
                      {inquiry.user_type}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getCategoryBadge(
                        inquiry.category
                      )}`}
                    >
                      {inquiry.category}
                    </span>
                  </td>

                  {/* Message Preview */}
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {inquiry.message}
                    </p>
                    <button
                      onClick={() => setSelectedMessage(inquiry)}
                      className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold mt-1 inline-flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span>View details</span>
                    </button>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(inquiry.created_at)}</span>
                    </div>
                  </td>

                  {/* Status & Update Action Dropdown */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center space-x-2">
                      <select
                        value={inquiry.status}
                        disabled={updatingStatusId === inquiry.id}
                        onChange={(e) => onStatusChange(inquiry.id, e.target.value)}
                        className="text-xs font-semibold rounded-lg pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer disabled:opacity-50 transition-all"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal Preview (Responsive for Mobile & Desktop) */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Inquiry from {selectedMessage.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedMessage.user_type} • {selectedMessage.category}
                </p>
              </div>
              <StatusBadge status={selectedMessage.status} />
            </div>

            <div className="py-4 space-y-3 overflow-y-auto">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Email:</span>{' '}
                  <a href={`mailto:${selectedMessage.email}`} className="text-brand-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Phone:</span>{' '}
                  <a href={`tel:${selectedMessage.phone}`} className="font-mono text-slate-800">
                    {selectedMessage.phone}
                  </a>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Submitted:</span>{' '}
                  {formatDate(selectedMessage.created_at)}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Message Content
                </label>
                <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
