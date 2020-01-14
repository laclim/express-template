import Router from "express";
import { registerSchema, loginSchema, refreshSchema } from "../validation";
import { User } from "../models";
import { login, isLoggedIn } from "../auth";
import { BadRequest, Unauthorized } from "../errors";
import { trycatch } from "./trycatch";
import { extractToken } from "./headers";
import { generateGuid, generateToken, generateRefreshToken } from "../utility";
import { Refresh } from "../models/Refresh";

const router = Router();

router.post("/register", async (req, res, next) => {
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

    res.json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/login",
  trycatch(async (req, res) => {
    try {
      await loginSchema.validate(req.body, { abortEarly: false });
    } catch (error) {
      throw new BadRequest(error);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      throw new BadRequest("Invalid user");
    }
    const token = generateToken(user.id);
    const refreshToken = await generateRefreshToken(token, user.id);

    res.json({ message: "ok", token, refreshToken, userId: user.id });
  })
);

router.post(
  "/refresh",
  trycatch(async (req, res) => {
    try {
      await refreshSchema.validate(req.body);
    } catch (error) {
      throw new BadRequest(error);
    }
    const refreshToken = req.body.refreshToken;
    const refresh = await Refresh.findOne({ refreshToken, isValid: true });
    if (!refresh) {
      throw new BadRequest("Invalid refresh Token");
    }

    const newToken = generateToken(refresh.userId);
    const newRefreshToken = await generateRefreshToken(
      newToken,
      refresh.userId
    );

    res.json({ message: "ok", newToken, newRefreshToken });
  })
);

export default router;
