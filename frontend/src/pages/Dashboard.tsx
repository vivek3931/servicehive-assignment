import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-ink dark:text-white mb-2 tracking-tight">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="text-[15px] text-ink-muted-80 dark:text-body-muted-dark">
          Here's what's happening with your leads today.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="apple-card flex flex-col justify-between h-32">
          <h3 className="text-[14px] font-medium text-ink-muted-80 dark:text-body-muted-dark">Total Leads</h3>
          <p className="text-3xl font-semibold text-ink dark:text-white tracking-tight">--</p>
        </div>
        <div className="apple-card flex flex-col justify-between h-32">
          <h3 className="text-[14px] font-medium text-ink-muted-80 dark:text-body-muted-dark">Active Leads</h3>
          <p className="text-3xl font-semibold text-ink dark:text-white tracking-tight">--</p>
        </div>
        <div className="apple-card flex flex-col justify-between h-32">
          <h3 className="text-[14px] font-medium text-ink-muted-80 dark:text-body-muted-dark">Conversion Rate</h3>
          <p className="text-3xl font-semibold text-ink dark:text-white tracking-tight">--%</p>
        </div>
      </div>

      <div className="apple-card">
        <h2 className="text-[18px] font-semibold text-ink dark:text-white mb-4 tracking-tight">Recent Activity</h2>
        <div className="py-8 text-center border-2 border-dashed border-divider-hairline dark:border-surface-tile-3 rounded-lg">
          <p className="text-[15px] text-ink-muted-80 dark:text-body-muted-dark">Activity feed will appear here.</p>
        </div>
      </div>
    </div>
  );
}