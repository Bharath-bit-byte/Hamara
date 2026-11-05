import React, { useState } from 'react';
import { Calendar, Clock, ArrowUpRight, Loader2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Card3D from './Card3D';
import { getBookingUrl, hasBookingUrl, navigateToBooking } from '../../services/bookingService';

/**
 * ScheduleConsultationSection Component
 * 
 * Provides a professional consultation booking card with redirect navigation to Easy!Appointments.
 * Complies with HamaraShops.ai design language, full responsiveness, and accessibility guidelines.
 * 
 * @param {Object} props
 * @param {Function} [props.onFallbackModal] - Optional callback to open the fallback modal when VITE_BOOKING_URL is unset.
 * @param {string} [props.className] - Optional container classes.
 * @param {boolean} [props.compact] - If true, renders a compact sidebar card; otherwise, renders full section.
 */
export default function ScheduleConsultationSection({ onFallbackModal, className = '', compact = false }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleScheduleClick = () => {
    setErrorMessage(null);

    if (hasBookingUrl()) {
      setIsRedirecting(true);
      // Brief feedback delay before browser navigates away
      setTimeout(() => {
        navigateToBooking();
      }, 350);
    } else {
      setErrorMessage(
        'Online consultation booking is currently being initialized. Please use our direct inquiry form below or email us directly at info@hamarashops.ai.'
      );
    }
  };

  return (
    <Card3D
      glowColor="#ff6b6b"
      className={`border border-[#ff6b6b]/40 bg-gradient-to-br from-[#1a1c20] via-[#0a1628] to-[#0c0e12] shadow-2xl relative overflow-hidden ${
        compact ? 'p-6 sm:p-8 space-y-5' : 'p-8 sm:p-12 space-y-6'
      } ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6b6b]/10 blur-[80px] pointer-events-none rounded-full" />

      {/* Header Badge & Title */}
      <div className="space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-[#ff6b6b]" />
          <span>Executive Advisory</span>
        </div>

        <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          Schedule a Business Consultation
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
          Book a consultation with our team to discuss your business requirements, explore our solutions, and discover how HamaraShops.ai can help your business.
        </p>
      </div>

      {/* Supporting Text */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#4cd6ff] relative z-10">
        <Clock className="w-3.5 h-3.5 shrink-0" />
        <span>Choose a convenient date and time for your consultation.</span>
      </div>

      {/* Key Consultation Highlights */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-300 relative z-10">
          <div className="p-3 rounded-xl bg-[#0c0e12]/80 border border-[#3c475a]/50 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>30-Min Strategy Session</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0c0e12]/80 border border-[#3c475a]/50 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4cd6ff] shrink-0" />
            <span>Principal AI Architects</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0c0e12]/80 border border-[#3c475a]/50 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ff6b6b] shrink-0" />
            <span>Confidential & Tailored</span>
          </div>
        </div>
      )}

      {/* Action Area */}
      <div className="pt-2 relative z-10 space-y-3">
        <button
          type="button"
          onClick={handleScheduleClick}
          disabled={isRedirecting}
          aria-label="Schedule an Appointment"
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-sm sm:text-base hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#0c0e12] disabled:opacity-75 disabled:cursor-wait active:scale-[0.99]"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#68000f]" />
              <span>Redirecting to Consultation Calendar...</span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 text-[#68000f]" />
              <span>Schedule an Appointment</span>
              <ArrowUpRight className="w-4 h-4 text-[#68000f]" />
            </>
          )}
        </button>

        {/* User-friendly Missing Booking URL Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5 animate-fadeIn"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-300">Notice</p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>

            {onFallbackModal && (
              <button
                type="button"
                onClick={onFallbackModal}
                className="w-full mt-2 py-2.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Direct Meeting Request Form</span>
              </button>
            )}
          </div>
        )}
      </div>
    </Card3D>
  );
}
