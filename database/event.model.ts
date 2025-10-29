import { Schema, model, models, Document } from "mongoose";

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Event overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Event image is required"],
      match: [
        /^(https?:\/\/.+|\/images\/.+)$/,
        "Event image must be a valid URL or path (e.g., /images/event.png)",
      ],
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    mode: {
      type: String,
      required: [true, "Event mode is required"],
      enum: ["online", "offline", "hybrid"],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, "Target audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Event agenda is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Agenda must contain at least one item",
      },
      set: (v: string[]) => v.map((item) => item.trim()),
    },
    organizer: {
      type: String,
      required: [true, "Event organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Event tags are required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "At least one tag is required",
      },
      set: (v: string[]) => v.map((tag) => tag.trim()),
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook: Generate slug from title and normalize date/time
EventSchema.pre("save", function (next) {
  // Only regenerate slug if title has changed
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

    // Fallback: if slug is empty (e.g., title was all special chars), use safe default
    if (!this.slug || this.slug.trim() === "") {
      const timestamp = Date.now().toString(36); // Base36 short timestamp
      this.slug = `untitled-${timestamp}`;
    }
  }

  // Normalize date to ISO format if modified
  if (this.isModified("date")) {
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = this.date.match(ymd);
    if (!match) {
      return next(new Error('Date must be "YYYY-MM-DD"'));
    }

    // Validate calendar date to prevent invalid dates like 2025-13-45 or 2025-02-30
    const [, year, month, day] = match;
    const dateObj = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    const isValid =
      dateObj.getUTCFullYear() === parseInt(year) &&
      dateObj.getUTCMonth() + 1 === parseInt(month) &&
      dateObj.getUTCDate() === parseInt(day);

    if (!isValid) {
      return next(new Error("Date must be a valid calendar date"));
    }
  }

  // Normalize time format (HH:MM AM/PM) if modified
  if (this.isModified("time")) {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!timeRegex.test(this.time.trim())) {
      return next(
        new Error('Time must be in format "HH:MM AM/PM" (e.g., "09:00 AM")')
      );
    }
    // Normalize to consistent format
    this.time = this.time.trim().toUpperCase();
  }

  next();
});

// Export model (use existing model if it exists to prevent recompilation errors)
const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
