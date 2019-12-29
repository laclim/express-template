import Router from "express";
import { registerSchema } from "../validation";
import { User } from "../models";
import { login, isLoggedIn } from "../auth";
import { BadRequest } from "../errors";
import { runInNewContext } from "vm";

const router = Router();

router.post("/register", isLoggedIn, async (req, res, next) => {
  try {
    try {
      await registerSchema.validate(req.body, {
        abortEarly: false
      });
    } catch (error) {
      throw new BadRequest(error);
    }

    const { email, name, password } = req.body;

    const isExist = await User.exists({ email });
    if (isExist) {
      throw new BadRequest("Invalid email");
    }

    const user = await User.create({ email, name, password });
    login(req, user.id);
    res.json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

router.get("/login", async (req, res) => {});

export default router;
