import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <p className="text-gray-500 dark:text-gray-400">Welcome to Smart Leads! Use the sidebar to navigate to the Leads management module.</p>
      </div>
    </div>
  );
}
