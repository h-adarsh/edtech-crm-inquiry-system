import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, LogOut, Send, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('edtech_token');
  const adminRaw = localStorage.getItem('edtech_admin');
  const admin = adminRaw ? JSON.parse(adminRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem('edtech_token');
    localStorage.removeItem('edtech_admin');
    navigate('/login');
  };

  const isFormActive = location.pathname === '/';
  const isDashboardActive = location.pathname === '/dashboard';
  const isLoginActive = location.pathname === '/login';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Edu<span className="text-sky-600">Connect</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full border border-sky-200">
                CRM Portal
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isFormActive
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Submit Inquiry</span>
              <span className="sm:hidden">Inquire</span>
            </Link>

            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDashboardActive
                      ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-600" />
                  <span>Dashboard</span>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {admin?.name || 'Administrator'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {admin?.email || 'admin@edtech.com'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Log out of Admin Dashboard"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLoginActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

