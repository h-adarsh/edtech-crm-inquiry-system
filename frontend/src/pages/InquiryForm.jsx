import React, { useState } from 'react';
import { api } from '../api/client';
import { Send, CheckCircle2, AlertCircle, Sparkles, Building2, UserCircle2, HelpCircle } from 'lucide-react';

const USER_TYPES = ['Parent', 'Student', 'School'];
const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    user_type: 'Parent',
    category: 'Admission',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide a valid full name (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    const phoneRegex = /^[+0-9\s()-]{7,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid phone number (at least 7 digits)';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = 'Please enter a message (at least 5 characters)';
    } else if (formData.message.length > 2000) {
      errs.message = 'Message cannot exceed 2000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      await api.submitInquiry(formData);
      setSubmitted(true);
      setFormData({
        user_type: 'Parent',
        category: 'Admission',
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      setServerError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>EduConnect Admission & Inquiry Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Can We Help You Today?
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
          Whether you are a parent exploring admissions, a student applying for scholarships, or a school partnering with us, our counselors are here for you.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {submitted ? (
          <div className="p-8 sm:p-12 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Inquiry Received!</h2>
            <p className="text-slate-600 max-w-md mx-auto mb-6 text-sm leading-relaxed">
              Thank you for reaching out to us. Your inquiry has been directly recorded in our system. An educational counselor will review your request and get back to you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              <span>Submit Another Inquiry</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            {serverError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Dropdowns Row: User Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* User Type */}
              <div>
                <label
                  htmlFor="user_type"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  I am a <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="user_type"
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    {USER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Select your profile category</p>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Inquiry Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">What is this inquiry regarding?</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                Personal Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Full Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:ring-brand-500 focus:border-transparent'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="sm:col-span-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:ring-brand-500 focus:border-transparent'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-1">
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:ring-brand-500 focus:border-transparent'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="message"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Message / Query Details <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.message.length} / 2000
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your question or requirements in detail..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-y ${
                  errors.message
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-brand-500 focus:border-transparent'
                }`}
              />
              {errors.message && (
                <p className="text-xs text-rose-600 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Data is securely stored in compliance with privacy guidelines.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

