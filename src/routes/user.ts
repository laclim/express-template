import Router from "express";
import { trycatch } from "./trycatch";

import { Task, User } from "../models";
import { postTaskSchema } from "../validation";
import { BadRequest } from "../errors";
import { Client } from "@googlemaps/google-maps-services-js";
import { calculateDistance } from "../utility";
import nodemailer from "nodemailer";
const router = Router();
router.get("/user", async (req, res, next) => {
  res.json({ message: "ok" });
});

router.post(
  "/task",
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
  trycatch(async (req, res, next) => {
    const data = await Task.find().populate("createdBy ", "name");

    res.json({ message: "ok", data });
  })
);
router.get(
  "/task/:id",
  trycatch(async (req, res, next) => {
    const data = await Task.findById(req.params.id);
    if (!data) throw new BadRequest("id not found");

    res.json({ message: "ok", data });
  })
);

router.delete(
  "/task/:id",
  trycatch(async (req, res, next) => {
    const data = await Task.findOneAndDelete({ _id: req.params.id });
    if (!data) throw new BadRequest("id not found");
    res.json({ message: "ok" });
  })
);

router.put(
  "/user/location",
  extractToken,
  trycatch(async (req, res, next) => {
    const data = await User.update(
      { _id: req.headers.userId },
      {
        location: { type: "Point", coordinates: [12.33424, 21.1313] }
      },
      { runValidators: true }
    );
    console.log(data);
    if (!data) throw new BadRequest("id not found");
    res.json({ message: "ok" });
  })
);

router.get(
  "/user/nearby/:distance",
  extractToken,
  trycatch(async (req, res, next) => {
    const user = await User.findOne({ _id: req.headers.userId });
    const nearby = await User.find({
      _id: { $nin: [req.headers.userId] }
    });
    const distance: number = parseInt(req.params.distance);
    let listNearBy = [];
    if (user) {
      const userCoordinate = user.location.coordinates;
      for (const people of nearby) {
        let nearByCoordinates = people.location.coordinates;
        const distanceNearby = calculateDistance(
          userCoordinate[0],
          userCoordinate[1],
          nearByCoordinates[0],
          nearByCoordinates[1],
          "K"
        );
        if (distanceNearby < distance) {
          listNearBy.push({ people, distanceNearby });
        }
      }
    }

    res.json({ message: "ok", listNearBy });
  })
);

router.get(
  "/user/location",
  extractToken,
  trycatch(async (req, res, next) => {
    const client = new Client({});
    const latlng = req.query.latlng;
    console.log(latlng);
    if (process.env.NODE_ENV === "production") {
      const r = await client.geocode({
        params: {
          latlng,
          key: "AIzaSyBEtlNWA1b2N2VEmleAz-0mLzoaF4Y6xew"
        },
        timeout: 1000 // milliseconds
      });
      console.log(r.data);
      res.json(r.data.results);
    } else {
      const address_components = [
        {
          long_name: "Abdullah Hukum",
          short_name: "Abdullah Hukum",
          types: ["establishment", "point_of_interest", "transit_station"]
        },
        {
          long_name: "Kuala Lumpur",
          short_name: "Kuala Lumpur",
          types: ["locality", "political"]
        },
        {
          long_name: "Federal Territory of Kuala Lumpur",
          short_name: "Federal Territory of Kuala Lumpur",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "Malaysia",
          short_name: "MY",
          types: ["country", "political"]
        },
        {
          long_name: "59200",
          short_name: "59200",
          types: ["postal_code"]
        }
      ];
      res.json({ address_components });
    }
  })
);
export default router;
