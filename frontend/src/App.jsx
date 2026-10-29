import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import InquiryForm from './pages/InquiryForm';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 w-full overflow-x-hidden">
        <Navbar />
        
        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            {/* Public Inquiry Form */}
            <Route path="/" element={<InquiryForm />} />

            {/* Admin Login */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Protected Admin Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-700">EduConnect</span> CRM & Inquiry System
            </div>
            <div>
              &copy; {new Date().getFullYear()} EduConnect. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

