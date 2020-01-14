import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  name: string;
  password: string;
}

const userSchema = new Schema(
  {
    email: String,
    name: String,
    password: String,
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>("User", userSchema, "User");
