import jwt from "jsonwebtoken";
import { Refresh } from "../models/Refresh";
import { BadRequest } from "../errors";
export const generateGuid = () => {
  let result = "";
  for (let j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
    const i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
};

export const generateToken = (userId: string, exp?: number) => {
  if (!exp) {
    exp = Math.floor(Date.now() / 1000) + parseInt(process.env.JWT_EXP!);
  }

  const token = jwt.sign({ userId, exp }, process.env.JWT_SECRET!);
  return token;
};

export const generateRefreshToken = async (token: string, userId: string) => {
  try {
    const refreshToken = generateGuid();
    // let dateNow = new Date();
    // const expiredAt = dateNow.setDate(dateNow.getDate() + 1);

    await Refresh.create({
      refreshToken,
      token,
      isValid: true,
      userId
    });
    return refreshToken;
  } catch (error) {
    throw new BadRequest("Cannot generate refresh token");
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: string
) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
};
