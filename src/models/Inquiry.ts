import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  eventType: "Marriage" | "Haldi" | "Birthday" | "Pre-Wedding" | "Portraits" | "Other";
  eventDate?: string;
  location?: string;
  message?: string;
  status: "new" | "contacted" | "booked" | "archived";
  createdAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone/WhatsApp number"],
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, "Please select an event type"],
      enum: ["Marriage", "Haldi", "Birthday", "Pre-Wedding", "Portraits", "Other"],
      default: "Marriage",
    },
    eventDate: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "booked", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Inquiry ||
  mongoose.model<IInquiry>("Inquiry", InquirySchema);
