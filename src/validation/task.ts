import Joi from "@hapi/joi";

// {
//     title: String,
//     content: String,
//     comments: {
//       userId: String,
//       content: String,
//       likes: Number,
//       commentAt: Date
//     }
//   },
//   {
//     timestamps: true
//   }

const title = Joi.string()
  .max(256)
  .required();
const content = Joi.string()
  .max(1024)
  .required();

export const postTaskSchema = Joi.object({
  title,
  content
});
