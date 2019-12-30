import { Schema, model, Document } from "mongoose";

interface IRefresh extends Document {
  refreshToken: string;
  token: string;
  expiredAt: Date;
  isValid: boolean;
  userId: string;
}

const refreshSchema = new Schema(
  {
    refreshToken: String,
    token: String,
    isValid: Boolean,
    userId: String
  },
  {
    timestamps: true
  }
);

export const Refresh = model<IRefresh>("Refresh", refreshSchema);
