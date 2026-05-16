import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Moon, Sun, Menu, User } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-canvas-parchment dark:bg-surface-tile-1 transition-colors">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-[80px]'} bg-canvas dark:bg-surface-tile-2 border-r border-divider-hairline dark:border-surface-tile-3 flex flex-col transition-all duration-300 ease-in-out z-20`}>
        <div className="h-[64px] flex items-center px-6 border-b border-divider-hairline dark:border-surface-tile-3 overflow-hidden">
          {isSidebarOpen ? (
            <h1 className="text-[21px] font-semibold tracking-[0.231px] text-ink dark:text-white whitespace-nowrap transition-opacity duration-300">
              Smart Leads
            </h1>
          ) : (
            <div className="w-8 h-8 bg-primary text-white dark:bg-primary-on-dark dark:text-ink rounded-lg flex items-center justify-center font-bold text-lg shrink-0 -ml-2">
              SL
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-x-hidden">
          <Link
            to="/"
            className={`flex items-center px-3 py-2.5 text-[14px] leading-[1.29] tracking-[-0.224px] rounded-md transition-colors whitespace-nowrap ${
              location.pathname === '/'
                ? 'bg-canvas-parchment text-ink dark:bg-surface-tile-3 dark:text-white font-semibold'
                : 'text-ink-muted-80 dark:text-body-muted-dark hover:bg-canvas-parchment dark:hover:bg-surface-tile-3 hover:text-ink dark:hover:text-white'
            }`}
            title={!isSidebarOpen ? "Dashboard" : undefined}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0 mr-3" />
            <span className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Dashboard
            </span>
          </Link>
          <Link
            to="/leads"
            className={`flex items-center px-3 py-2.5 text-[14px] leading-[1.29] tracking-[-0.224px] rounded-md transition-colors whitespace-nowrap ${
              location.pathname.startsWith('/leads')
                ? 'bg-canvas-parchment text-ink dark:bg-surface-tile-3 dark:text-white font-semibold'
                : 'text-ink-muted-80 dark:text-body-muted-dark hover:bg-canvas-parchment dark:hover:bg-surface-tile-3 hover:text-ink dark:hover:text-white'
            }`}
            title={!isSidebarOpen ? "Leads" : undefined}
          >
            <Users className="h-5 w-5 shrink-0 mr-3" />
            <span className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Leads
            </span>
          </Link>
        </nav>

        <div className="p-3 border-t border-divider-hairline dark:border-surface-tile-3">
          <div className={`flex items-center ${!isSidebarOpen ? 'flex-col gap-3 justify-center' : ''}`}>
            {isSidebarOpen ? (
              <div className="flex-1 overflow-hidden px-1">
                <p className="text-[14px] font-semibold text-ink dark:text-white truncate">{user.name}</p>
                <p className="text-[12px] text-ink-muted-48 dark:text-body-muted-dark truncate">{user.role}</p>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-canvas-parchment dark:bg-surface-tile-3 flex items-center justify-center shrink-0" title={user.name}>
                <User className="h-4 w-4 text-ink dark:text-white" />
              </div>
            )}
            <button
              onClick={logout}
              className="p-2 text-ink-muted-80 hover:text-ink dark:text-body-muted-dark dark:hover:text-white rounded-md hover:bg-canvas-parchment dark:hover:bg-surface-tile-3 transition-colors apple-active shrink-0"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-300 ease-in-out">
        <header className="h-[64px] apple-nav-frosted flex items-center justify-between px-8 transition-colors sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-md text-ink-muted-80 dark:text-body-muted-dark hover:bg-canvas dark:hover:bg-surface-tile-2 transition-colors apple-active"
              title="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-[21px] font-semibold tracking-[0.231px] text-ink dark:text-white capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1]}
            </h2>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-ink-muted-80 dark:text-body-muted-dark hover:bg-canvas dark:hover:bg-surface-tile-2 transition-colors apple-active"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>
        <div className="flex-1 overflow-auto p-8 lg:px-[80px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}