import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/client';
import Filters from '../components/Filters';
import InquiryTable from '../components/InquiryTable';
import Pagination from '../components/Pagination';
import { RefreshCw, Inbox, Clock, CheckCircle, Flame, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [userType, setUserType] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Debounce search input by 300ms per architectural specification
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search term
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when any filter dropdown changes
  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleUserTypeChange = (val) => {
    setUserType(val);
    setPage(1);
  };

  const handleStatusChangeFilter = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('All');
    setUserType('All');
    setStatus('All');
    setPage(1);
  };

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getInquiries({
        category,
        user_type: userType,
        status,
        search: debouncedSearch,
        page,
        limit,
      });

      setInquiries(response.data || []);
      setPagination(
        response.pagination || {
          total: response.data?.length || 0,
          page,
          limit,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(err.message || 'Failed to fetch inquiries. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [category, userType, status, debouncedSearch, page, limit]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Handle single inquiry status update
  const handleUpdateStatus = async (inquiryId, newStatus) => {
    setUpdatingStatusId(inquiryId);
    try {
      const response = await api.updateInquiryStatus(inquiryId, newStatus);
      // Optimistically update table data
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === inquiryId ? { ...item, status: response.data.status } : item
        )
      );
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inquiries Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time feed of candidate submissions, contact details & application reviews.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Failed to communicate with API server</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Filters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={handleCategoryChange}
        userType={userType}
        setUserType={handleUserTypeChange}
        status={status}
        setStatus={handleStatusChangeFilter}
        onReset={handleResetFilters}
        totalResults={pagination.total}
      />

      {/* Inquiries Table */}
      <InquiryTable
        inquiries={inquiries}
        loading={loading}
        onStatusChange={handleUpdateStatus}
        updatingStatusId={updatingStatusId}
      />

      {/* Pagination Controls */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

