import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, LogOut, Send, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('edtech_token');
  const adminRaw = localStorage.getItem('edtech_admin');
  const admin = adminRaw ? JSON.parse(adminRaw) : null;

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('edtech_token');
    localStorage.removeItem('edtech_admin');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isFormActive = location.pathname === '/';
  const isDashboardActive = location.pathname === '/dashboard';
  const isLoginActive = location.pathname === '/login';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Edu<span className="text-sky-600">Connect</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full border border-sky-200">
                CRM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Items (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isFormActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>Submit Inquiry</span>
            </Link>

            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDashboardActive
                      ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-600" />
                  <span>Dashboard</span>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                <div className="flex items-center space-x-3">
                  <div className="flex flex-col text-right">
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
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger Toggle (Visible only on Mobile) */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-150 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
              isFormActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Send className="w-4 h-4 text-sky-600" />
            <span>Submit Inquiry</span>
          </Link>

          {token ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isDashboardActive
                    ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-600" />
                <span>Admin Dashboard</span>
              </Link>

              <div className="pt-2 pb-1 border-t border-slate-100">
                <div className="px-3 py-2 bg-slate-50 rounded-xl mb-2 text-xs">
                  <div className="font-semibold text-slate-800">{admin?.name || 'Administrator'}</div>
                  <div className="text-slate-500 font-mono text-[11px] truncate">{admin?.email || 'admin@edtech.com'}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from Admin</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                isLoginActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
