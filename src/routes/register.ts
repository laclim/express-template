import Router from "express";
import { registerSchema, loginSchema, refreshSchema } from "../validation";
import { User } from "../models";
import { login, isLoggedIn } from "../auth";
import { BadRequest, Unauthorized } from "../errors";
import { trycatch } from "./trycatch";
import { extractToken } from "./headers";
import { generateGuid, generateToken, generateRefreshToken } from "../utility";
import { Refresh } from "../models/Refresh";
import { transporter } from "../config/transporter";

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
    if (user) {
      const token = generateToken(user.id, 3600);
      const url = `http://localhost:8001/confirmation/${token}`;
      // send confirmation email
      transporter.sendMail({
        from: '"Project C " <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Confirmation email", // Subject line

        html: `Please click this link to verify your email address <a href="${url}">${url}</a>` // html body
      });
    }

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

    const token = generateToken(refresh.userId);
    const newRefreshToken = await generateRefreshToken(token, refresh.userId);

    res.json({ message: "ok", token, refreshToken: newRefreshToken });
  })
);

export default router;
