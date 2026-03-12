/**
 * Format a number using Indian numbering system (lakhs, crores)
 * Examples: ₹1,000 | ₹10,000 | ₹1,00,000 | ₹10,00,000 | ₹1,00,00,000
 */
export function formatINR(value: number, decimals = 0): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const formatted = abs.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${sign}₹${formatted}`;
}
/**
 * Compact Indian format: ₹1.5L, ₹2.3Cr etc.
 */
export function formatINRCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(1)}L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
}
/**
 * Check if Indian stock market (NSE/BSE) is currently open
 * Market hours: 9:15 AM – 3:30 PM IST, Mon–Fri
 */
export function isIndianMarketOpen(): boolean {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 3600000);
  
  const day = ist.getDay();
  if (day === 0 || day === 6) return false; // Weekend
  
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeInMinutes = hours * 60 + minutes;
  
  // 9:15 AM = 555 min, 3:30 PM = 930 min
  return timeInMinutes >= 555 && timeInMinutes <= 930;
}
/**
 * Get current IST time string
 */
export function getISTTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}