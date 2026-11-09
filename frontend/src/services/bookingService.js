/**
 * HamaraShops.ai - Booking Service Adapter
 * 
 * Bridges booking triggers directly to the official Cal.com integration.
 */

import { getBaseCalcomLink, isCalcomConfigured, openCalcomModal, getCalcomOrigin } from './calcomService';

/**
 * Returns the Cal.com booking link or full URL.
 */
export const getBookingUrl = () => {
  const link = getBaseCalcomLink();
  if (!link) return '';
  const origin = getCalcomOrigin();
  return `${origin}/${link}`;
};

export const hasBookingUrl = () => {
  return isCalcomConfigured();
};

/**
 * Opens the modern Cal.com popup modal calendar.
 * Falls back to direct URL navigation if modal popup fails.
 */
export const navigateToBooking = (eventSlug = null) => {
  try {
    openCalcomModal(eventSlug);
    return true;
  } catch (error) {
    console.warn('[BookingService] Failed to open Cal.com modal, navigating directly:', error);
    const url = getBookingUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
    return false;
  }
};

export default {
  getBookingUrl,
  hasBookingUrl,
  navigateToBooking,
  openCalcomModal,
};
