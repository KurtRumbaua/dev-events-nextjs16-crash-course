import { Schema, model, models, Document, Types } from "mongoose";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      set: (email: string) => email.toLowerCase().trim(),
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook: Verify that the referenced Event exists
// Note: This check is not atomic—Event could be deleted between verification and insert.
// For strict transactional integrity, implement multi-document transactions at the application level.
BookingSchema.pre("save", async function (next) {
  // Only check if eventId is new or modified
  if (this.isNew || this.isModified("eventId")) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = models.Event || (await import("./event.model")).default;

      // Check if the event exists
      const eventExists = await Event.exists({ _id: this.eventId });

      if (!eventExists) {
        return next(
          new Error(
            `Event with ID ${this.eventId} does not exist. Cannot create booking.`
          )
        );
      }
    } catch (error) {
      return next(
        new Error(
          `Failed to validate event: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
    }
  }

  next();
});

// Create index on eventId for faster queries (e.g., finding all bookings for an event)
BookingSchema.index({ eventId: 1 });

// Enforce one booking per event per email (prevent duplicate bookings)
// This is a domain rule: each user can only book an event once
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "uniq_event_email" }
);

// Export model (use existing model if it exists to prevent recompilation errors)
const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
