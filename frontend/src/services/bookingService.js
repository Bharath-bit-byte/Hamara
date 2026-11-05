/**
 * HamaraShops.ai - Easy!Appointments Redirect Service
 * 
 * Manages redirect navigation to the deployed Easy!Appointments booking portal.
 * Reads the destination URL from the Vite environment variable VITE_BOOKING_URL.
 */

/**
 * Retrieves the configured Easy!Appointments booking URL.
 * @returns {string} The booking URL, or an empty string if not configured.
 */
export const getBookingUrl = () => {
  return import.meta.env.VITE_BOOKING_URL ? String(import.meta.env.VITE_BOOKING_URL).trim() : '';
};

/**
 * Checks whether a valid booking URL has been configured.
 * @returns {boolean} True if a non-empty booking URL is configured.
 */
export const hasBookingUrl = () => {
  const url = getBookingUrl();
  return Boolean(url && url.length > 0);
};

/**
 * Navigates the customer to the Easy!Appointments booking page using window.location.assign.
 * Performs validation before redirecting.
 * 
 * @returns {boolean} True if redirect was initiated; false if URL was not configured.
 */
export const navigateToBooking = () => {
  const url = getBookingUrl();
  if (url && url.length > 0) {
    window.location.assign(url);
    return true;
  }
  return false;
};

export default {
  getBookingUrl,
  hasBookingUrl,
  navigateToBooking,
};
