import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  location: { type: string; coordinates: Array<number> };
}

const userSchema = new Schema(
  {
    email: String,
    name: String,
    password: { type: String, required: true },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"] // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number]
      }
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>("User", userSchema, "User");
