import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowUpRight, Loader2, Sparkles, CheckCircle2, ChevronRight, Video } from 'lucide-react';
import Card3D from './Card3D';
import {
  CALCOM_EVENT_TYPES,
  openCalcomModal,
  getCalInstance,
  resolveCalcomLink,
} from '../../services/calcomService';

/**
 * ScheduleConsultationSection Component
 * 
 * Provides an enterprise consultation booking card integrated with Cal.com.
 * Supports modal popup scheduling, consultation type switching, and
 * adheres to HamaraShops.ai branding and accessibility guidelines.
 * 
 * @param {Object} props
 * @param {Function} [props.onFallbackModal] - Fallback callback if modal cannot be initialized.
 * @param {string} [props.className] - Container CSS classes.
 * @param {boolean} [props.compact] - Renders compact card when true; full section when false.
 * @param {Function} [props.onToggleInline] - Optional callback to switch to inline calendar view.
 */
export default function ScheduleConsultationSection({
  onFallbackModal,
  className = '',
  compact = false,
  onToggleInline,
}) {
  const [selectedSlug, setSelectedSlug] = useState('business-consultation');
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Pre-initialize Cal.com instance in the background for instant modal popup
    getCalInstance().catch((e) => console.warn('[Cal.com Preload]', e));
  }, []);

  const handleScheduleClick = async () => {
    setIsOpening(true);
    try {
      await openCalcomModal(selectedSlug);
    } catch (err) {
      console.error('[Cal.com Modal Error]', err);
      if (onFallbackModal) {
        onFallbackModal();
      }
    } finally {
      setTimeout(() => setIsOpening(false), 500);
    }
  };

  const activeEvent = CALCOM_EVENT_TYPES.find((e) => e.slug === selectedSlug) || CALCOM_EVENT_TYPES[0];

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
          <span>{activeEvent.badge || 'Executive Advisory'}</span>
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

      {/* Consultation Type Selector Pills */}
      {!compact && (
        <div className="space-y-2 pt-1 relative z-10">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Select Consultation Track:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {CALCOM_EVENT_TYPES.slice(0, 3).map((type) => {
              const isSelected = type.slug === selectedSlug;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedSlug(type.slug)}
                  className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#ff6b6b] bg-[#ff6b6b]/15 text-white shadow-md shadow-[#ff6b6b]/15'
                      : 'border-[#3c475a]/60 bg-[#0c0e12]/80 text-slate-300 hover:border-[#ff6b6b]/40 hover:text-white'
                  }`}
                >
                  <div>
                    <p className="font-bold">{type.title}</p>
                    <p className="text-[10px] text-slate-400">{type.duration} • {type.location}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#ff6b6b] shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Highlights Bar */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono text-slate-300 relative z-10">
          <div className="p-3 rounded-xl bg-[#0c0e12]/80 border border-[#3c475a]/50 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant Confirmation</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0c0e12]/80 border border-[#3c475a]/50 flex items-center gap-2">
            <Video className="w-4 h-4 text-[#4cd6ff] shrink-0" />
            <span>Google Meet Included</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0c0e12]/80 border border-[#3c475a]/50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff6b6b] shrink-0" />
            <span>Asia/Kolkata (IST)</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 relative z-10 space-y-3">
        <button
          type="button"
          onClick={handleScheduleClick}
          disabled={isOpening}
          data-cal-link={resolveCalcomLink(selectedSlug)}
          data-cal-config='{"layout":"month_view","theme":"dark"}'
          aria-label="Schedule an Appointment"
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-sm sm:text-base hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#0c0e12] disabled:opacity-75 disabled:cursor-wait active:scale-[0.99]"
        >
          {isOpening ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#68000f]" />
              <span>Opening Live Calendar...</span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 text-[#68000f]" />
              <span>Schedule an Appointment</span>
              <ArrowUpRight className="w-4 h-4 text-[#68000f]" />
            </>
          )}
        </button>

        {onToggleInline && (
          <button
            type="button"
            onClick={onToggleInline}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1a1c20] hover:bg-[#282a2e] border border-[#3c475a] text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Embedded Inline Calendar Below</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#ff6b6b]" />
          </button>
        )}
      </div>
    </Card3D>
  );
}
