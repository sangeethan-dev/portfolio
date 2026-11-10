"use client";

import { createContext, useContext } from "react";

/* open({ type, practitioner, reason, returning }) opens the booking drawer */
export const BookingContext = createContext({ open: () => {}, isOpen: false });

export function useBooking() {
  return useContext(BookingContext);
}
