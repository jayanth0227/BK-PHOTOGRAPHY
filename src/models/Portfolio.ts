import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolioItem extends Document {
  title: string;
  category: "Marriage" | "Haldi" | "Birthday" | "Pre-Wedding" | "Portraits";
  imageUrl: string;
  cloudinaryPublicId?: string;
  location?: string;
  featured: boolean;
  eventDate?: string;
  createdAt: Date;
}

const PortfolioSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: ["Marriage", "Haldi", "Birthday", "Pre-Wedding", "Portraits"],
      default: "Marriage",
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    eventDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Portfolio ||
  mongoose.model<IPortfolioItem>("Portfolio", PortfolioSchema);
