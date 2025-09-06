import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGeolocationFromStorage(): GeolocationPosition | null {
  const geolocationData = localStorage.getItem("geolocation");
  return geolocationData ? JSON.parse(geolocationData) : null;
}

export function setGeolocationToStorage(lat: number, lon: number) {
  localStorage.setItem("geolocation", JSON.stringify({ lat, lon }));
}

export function formatTimeSlot(timeSlot) {
  const startTime = String(timeSlot).padStart(2, "0") + "00"; // Assuming each slot is 1 hour
  const endTime = String(timeSlot + 1).padStart(2, "0") + "00"; // Assuming each slot is 1 hour
  return `${startTime}-${endTime}`;
}

export const DEFAULT_LOGIN_REDIRECT = "/search/clinic";
