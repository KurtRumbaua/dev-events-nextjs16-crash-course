// Central export point for all database models
// This allows importing models from a single location throughout the app

export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Export TypeScript interfaces for type safety
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";
