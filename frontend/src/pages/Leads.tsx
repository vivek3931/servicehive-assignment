import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Download, Edit2, Trash2 } from 'lucide-react';
import LeadModal, { type LeadFormData } from '../components/LeadModal';
import { useAuth } from '../context/AuthContext';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOption, setSortOption] = useState('latest');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: sortOption,
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);

      const response = await api.get(`/leads?${params.toString()}`);
      setLeads(response.data.leads);
      setTotal(response.data.pagination.total);
      setPages(response.data.pagination.pages);
    } catch (error: any) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, debouncedSearch, statusFilter, sourceFilter, sortOption]);

  const handleCreateOrUpdate = async (formData: LeadFormData) => {
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, formData);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', formData);
        toast.success('Lead created successfully');
      }
      fetchLeads();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted');
        fetchLeads();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete lead');
      }
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) {
      toast.error('No leads to export');
      return;
    }

    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...leads.map((lead) =>
        [
          `"${lead.name}"`,
          `"${lead.email}"`,
          `"${lead.status}"`,
          `"${lead.source}"`,
          `"${new Date(lead.createdAt).toLocaleDateString()}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors = {
    New: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700',
    Contacted: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
    Qualified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
    Lost: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50',
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-[24px] md:space-y-[32px]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <h1 className="text-[32px] md:text-[40px] font-semibold text-ink dark:text-white tracking-[0px] leading-none">Leads</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={exportCSV} className="apple-btn-secondary flex items-center justify-center flex-1 md:flex-none whitespace-nowrap">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </button>
          <button onClick={() => { setEditingLead(null); setIsModalOpen(true); }} className="apple-btn-primary flex items-center justify-center flex-1 md:flex-none whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="apple-card p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex w-full lg:flex-1 min-w-[240px] gap-2 items-center bg-canvas-parchment dark:bg-surface-tile-3 rounded-pill px-4 h-[44px]">
          <Search className="h-4 w-4 text-ink-muted-48 dark:text-body-muted-dark shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-transparent border-none focus:outline-none w-full text-[15px] md:text-[17px] text-ink dark:text-white placeholder-ink-muted-48 dark:placeholder-body-muted-dark min-w-0"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="grid grid-cols-2 md:flex flex-wrap gap-3 w-full lg:w-auto">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="apple-input-box w-full md:w-auto min-w-[140px] text-[14px]">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }} className="apple-input-box w-full md:w-auto min-w-[140px] text-[14px]">
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <select value={sortOption} onChange={(e) => { setSortOption(e.target.value); setPage(1); }} className="apple-input-box w-full md:w-auto col-span-2 md:col-span-1 min-w-[140px] text-[14px]">
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="apple-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-canvas-parchment dark:bg-surface-tile-3">
              <tr>
                <th className="apple-table-th">Name</th>
                <th className="apple-table-th">Contact</th>
                <th className="apple-table-th">Status</th>
                <th className="apple-table-th">Source</th>
                <th className="apple-table-th">Date</th>
                <th className="apple-table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-canvas dark:bg-surface-tile-2">
              {loading ? (
                <tr>
                  <td colSpan={6} className="apple-table-td text-center text-ink-muted-48 dark:text-body-muted-dark py-10">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="apple-table-td text-center py-[48px]">
                    <div className="flex flex-col items-center text-ink-muted-48 dark:text-body-muted-dark">
                      <Filter className="h-10 w-10 mb-4 opacity-50" />
                      <p>No leads found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-canvas-parchment dark:hover:bg-surface-tile-3 transition-colors">
                    <td className="apple-table-td font-semibold text-ink dark:text-white">{lead.name}</td>
                    <td className="apple-table-td text-ink-muted-80 dark:text-body-muted-dark">{lead.email}</td>
                    <td className="apple-table-td">
                      <span className={`px-[12px] py-[4px] inline-flex text-[12px] font-semibold rounded-pill ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="apple-table-td text-ink-muted-80 dark:text-body-muted-dark">{lead.source}</td>
                    <td className="apple-table-td text-ink-muted-80 dark:text-body-muted-dark">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="apple-table-td text-right">
                      <button onClick={() => { setEditingLead(lead); setIsModalOpen(true); }} className="text-zinc-600 dark:text-zinc-400 hover:text-ink dark:hover:text-white mr-4 apple-active inline-block transition-colors">
                        <Edit2 className="h-[18px] w-[18px]" />
                      </button>
                      {user?.role === 'Admin' && (
                        <button onClick={() => handleDelete(lead._id)} className="text-red-600 dark:text-red-400 hover:opacity-80 apple-active inline-block">
                          <Trash2 className="h-[18px] w-[18px]" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && leads.length > 0 && (
          <div className="bg-canvas dark:bg-surface-tile-2 px-6 py-4 flex items-center justify-between border-t border-divider-hairline dark:border-surface-tile-3">
            <div>
              <p className="text-[14px] text-ink-muted-80 dark:text-body-muted-dark">
                Showing <span className="font-semibold text-ink dark:text-white">{(page - 1) * 10 + 1}</span> to <span className="font-semibold text-ink dark:text-white">{Math.min(page * 10, total)}</span> of <span className="font-semibold text-ink dark:text-white">{total}</span> results
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="apple-btn-utility">Previous</button>
              <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="apple-btn-utility">Next</button>
            </div>
          </div>
        )}
      </div>

      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateOrUpdate} initialData={editingLead} title={editingLead ? 'Edit Lead' : 'Add New Lead'} />
    </div>
  );
}