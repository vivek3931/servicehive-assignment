import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Users, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Lead {
  _id: string;
  name: string;
  status: string;
  source: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, conversion: 0 });
  const [sources, setSources] = useState({ website: 0, instagram: 0, referral: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/leads?limit=100'); // Fetch up to 100 for stats
        const leads = response.data.leads;
        
        const total = response.data.pagination.total || leads.length;
        const active = leads.filter((l: Lead) => l.status === 'New' || l.status === 'Contacted').length;
        const qualified = leads.filter((l: Lead) => l.status === 'Qualified').length;
        const conversion = total > 0 ? Math.round((qualified / total) * 100) : 0;

        const website = leads.filter((l: Lead) => l.source === 'Website').length;
        const instagram = leads.filter((l: Lead) => l.source === 'Instagram').length;
        const referral = leads.filter((l: Lead) => l.source === 'Referral').length;

        // Generate Last 7 Days Chart Data
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }).reverse();

        const groupedData = last7Days.map(dateStr => {
          const count = leads.filter((l: Lead) => {
            return new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateStr;
          }).length;
          return { date: dateStr, leads: count };
        });

        setStats({ total, active, conversion });
        setSources({ website, instagram, referral });
        setRecentLeads(leads.slice(0, 5));
        setChartData(groupedData);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statusColors: Record<string, string> = {
    New: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700',
    Contacted: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
    Qualified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
    Lost: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50',
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const pieData = [
    { name: 'Website', value: sources.website },
    { name: 'Instagram', value: sources.instagram },
    { name: 'Referral', value: sources.referral },
  ].filter(d => d.value > 0);

  const PIE_COLORS = ['#111111', '#555555', '#a1a1aa'];

  return (
    <div className="max-w-[1440px] mx-auto animate-in fade-in duration-500 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink dark:text-white mb-2 tracking-tight">
            Welcome back, {user?.name || 'User'} 👋
          </h1>
          <p className="text-[15px] text-ink-muted-80 dark:text-body-muted-dark">
            Here's a beautiful overview of your lead generation performance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-ink-muted-80 dark:text-body-muted-dark bg-canvas dark:bg-surface-tile-2 px-4 py-2 rounded-full border border-divider-hairline dark:border-surface-tile-3 shadow-sm">
          <Clock className="w-4 h-4" />
          <span>Last updated: just now</span>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="apple-card relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-ink dark:text-white">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-[13px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
            </span>
          </div>
          <h3 className="text-[15px] font-medium text-ink-muted-80 dark:text-body-muted-dark mb-1">Total Leads</h3>
          <p className="text-4xl font-bold text-ink dark:text-white tracking-tight">
            {loading ? '...' : stats.total}
          </p>
        </div>

        <div className="apple-card relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-ink dark:text-white">
              <Activity className="w-6 h-6" />
            </div>
            <span className="flex items-center text-[13px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 8%
            </span>
          </div>
          <h3 className="text-[15px] font-medium text-ink-muted-80 dark:text-body-muted-dark mb-1">Active Leads</h3>
          <p className="text-4xl font-bold text-ink dark:text-white tracking-tight">
            {loading ? '...' : stats.active}
          </p>
        </div>

        <div className="apple-card relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-ink dark:text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="flex items-center text-[13px] font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3 mr-1" /> 2%
            </span>
          </div>
          <h3 className="text-[15px] font-medium text-ink-muted-80 dark:text-body-muted-dark mb-1">Conversion Rate</h3>
          <p className="text-4xl font-bold text-ink dark:text-white tracking-tight">
            {loading ? '...' : `${stats.conversion}%`}
          </p>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="apple-card mb-8">
        <h2 className="text-[18px] font-bold text-ink dark:text-white tracking-tight mb-6">Lead Growth (Last 7 Days)</h2>
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-ink dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider-hairline)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--color-ink-muted-80)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--color-ink-muted-80)' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-divider-hairline)', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-canvas)' }}
                  itemStyle={{ color: 'var(--color-ink)', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="leads" stroke="#111111" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="apple-card p-0 overflow-hidden lg:col-span-2 flex flex-col h-full">
              <div className="px-6 py-5 border-b border-divider-hairline dark:border-surface-tile-3 flex justify-between items-center">
                <h2 className="text-[18px] font-bold text-ink dark:text-white tracking-tight">Recent Leads</h2>
              </div>
              <div className="divide-y divide-divider-hairline dark:divide-surface-tile-3 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-10 flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-ink dark:border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : recentLeads.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 bg-canvas-parchment dark:bg-surface-tile-3 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Users className="w-8 h-8 text-ink-muted-48 dark:text-body-muted-dark" />
                    </div>
                    <p className="text-[15px] text-ink-muted-80 dark:text-body-muted-dark">No recent activity to show.</p>
                  </div>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead._id} className="p-5 flex items-center justify-between hover:bg-canvas-parchment dark:hover:bg-surface-tile-3 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-ink dark:bg-white text-white dark:text-ink flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-ink dark:text-white">{lead.name}</p>
                          <p className="text-[13px] text-ink-muted-80 dark:text-body-muted-dark mt-0.5">
                            Added on {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-[12px] py-[4px] inline-flex text-[12px] font-semibold rounded-full shadow-sm ${statusColors[lead.status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
    
            {/* Lead Sources Pie Chart */}
            <div className="apple-card p-0 overflow-hidden flex flex-col h-full">
              <div className="px-6 py-5 border-b border-divider-hairline dark:border-surface-tile-3">
                <h2 className="text-[18px] font-bold text-ink dark:text-white tracking-tight">Top Sources</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col items-center justify-center">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-ink dark:border-white border-t-transparent rounded-full animate-spin"></div>
                ) : pieData.length === 0 ? (
                  <p className="text-[15px] text-ink-muted-80 dark:text-body-muted-dark">No data available.</p>
                ) : (
                  <>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                        itemStyle={{ color: '#111', fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-6 space-y-3">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                        <span className="text-[14px] font-medium text-ink dark:text-white">{entry.name}</span>
                      </div>
                      <span className="text-[14px] font-semibold text-ink dark:text-white">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}