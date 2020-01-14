import Router from "express";
import { trycatch } from "./trycatch";
import { extractToken } from "./headers";
import { Task, User } from "../models";
import { postTaskSchema } from "../validation";
import { BadRequest } from "../errors";

const router = Router();
router.get("/user", extractToken, async (req, res, next) => {
  res.json({ message: "ok" });
});

router.post(
  "/task",
  extractToken,
  trycatch(async (req, res, next) => {
    try {
      await postTaskSchema.validate(req.body);
    } catch (error) {
      throw new BadRequest(error);
    }

    const { title, content } = req.body;
    await Task.create({ title, content, createdBy: req.headers.userId });
    res.json({ message: "ok" });
  })
);

router.get(
  "/tasks",
  extractToken,
  trycatch(async (req, res, next) => {
    const data = await Task.find().populate("createdBy ", "name");

    res.json({ message: "ok", data });
  })
);
router.get(
  "/task/:id",
  extractToken,
  trycatch(async (req, res, next) => {
    const data = await Task.findById(req.params.id);
    if (!data) throw new BadRequest("id not found");

    res.json({ message: "ok", data });
  })
);

router.delete(
  "/task/:id",
  extractToken,
  trycatch(async (req, res, next) => {
    const data = await Task.findOneAndDelete({ _id: req.params.id });
    if (!data) throw new BadRequest("id not found");
    res.json({ message: "ok" });
  })
);

export default router;
