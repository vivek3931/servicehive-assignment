import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get('/leads?limit=1000'); // Fetch a large batch to calculate stats
        setLeads(response.data.leads);
      } catch (error) {
        console.error('Error fetching leads for dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Calculate stats for Status
  const statusCounts = leads.reduce((acc: any, lead: any) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  // Calculate stats for Source
  const sourceCounts = leads.reduce((acc: any, lead: any) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const sourceData = Object.keys(sourceCounts).map(key => ({
    name: key,
    value: sourceCounts[key]
  }));

  // Apple-inspired colorful palette
  const COLORS = {
    New: '#0071e3', // Action Blue
    Contacted: '#f56300', // Apple Orange
    Qualified: '#34c759', // Apple Green
    Lost: '#ff3b30', // Apple Red
    Website: '#af52de', // Apple Purple
    Instagram: '#ff2d55', // Apple Pink
    Referral: '#ffcc00' // Apple Yellow
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <h1 className="text-[40px] font-semibold text-ink dark:text-white mb-[32px] tracking-[0px]">Dashboard Overview</h1>
      
      <div className="apple-card mb-8">
        <p className="text-[17px] text-ink dark:text-white">
          Welcome back, <span className="font-semibold">{user?.name}</span>! Here's a colorful overview of your lead acquisition pipeline.
        </p>
      </div>

      {loading ? (
        <div className="apple-card text-center py-10 text-ink-muted-48 dark:text-body-muted-dark">
          Loading analytics...
        </div>
      ) : leads.length === 0 ? (
        <div className="apple-card text-center py-10 text-ink-muted-48 dark:text-body-muted-dark">
          No leads available to visualize. Head over to the Leads module to add some!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          
          {/* Status Chart */}
          <div className="apple-card flex flex-col items-center lg:col-span-2">
            <h3 className="text-[21px] font-semibold tracking-[0.231px] text-ink dark:text-white mb-6 w-full text-left">Leads by Status</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7a7a7a', fontSize: 14 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a7a7a', fontSize: 14 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '11px', border: '1px solid #e0e0e0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#0066cc'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Chart */}
          <div className="apple-card flex flex-col items-center">
            <h3 className="text-[21px] font-semibold tracking-[0.231px] text-ink dark:text-white mb-6 w-full text-left">Leads by Source</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#0066cc'} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '11px', border: '1px solid #e0e0e0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Leads Preview */}
          <div className="apple-card flex flex-col">
            <h3 className="text-[21px] font-semibold tracking-[0.231px] text-ink dark:text-white mb-6 w-full text-left">Recent Leads</h3>
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead._id} className="flex justify-between items-center pb-4 border-b border-divider-hairline dark:border-surface-tile-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-[17px] text-ink dark:text-white">{lead.name}</p>
                      <p className="text-[14px] text-ink-muted-80 dark:text-body-muted-dark">{lead.email}</p>
                    </div>
                    <span className={`px-[12px] py-[4px] inline-flex text-[12px] font-semibold rounded-pill ${
                        lead.status === 'New' ? 'bg-[#0066cc]/10 text-[#0066cc] dark:bg-[#2997ff]/20 dark:text-[#2997ff]' :
                        lead.status === 'Contacted' ? 'bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                        lead.status === 'Qualified' ? 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
