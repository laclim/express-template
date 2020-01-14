import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  title: String;
  content: String;
  userId: String;
  comments: IComment;
  likes: Number;
}

interface IComment extends Document {
  userId: String;
  content: String;
  likes: Number;
  commentAt: Date;
}

const taskSchema = new Schema(
  {
    title: String,
    content: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: {
      userId: String,
      content: String,
      likes: Number,
      commentAt: Date
    }
  },
  {
    timestamps: true
  }
);

export const Task = model<ITask>("Task", taskSchema, "Task");
