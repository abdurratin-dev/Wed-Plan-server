import { createRemoteJWKSet, jwtVerify } from "jose";
import { sessions, users } from "../config/db.js";
import { env } from "../config/env.js";
import { ObjectId } from "mongodb";

export const checkAuthenticatedUser = async (req, res, next) => {
  const hedars = req.headers.authorization;
  if (!hedars) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const jwtToken = hedars.split(" ")[1];
  if (!jwtToken) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }

  const JWKS = createRemoteJWKSet(
    new URL("http://localhost:3000/api/auth/jwks"),
  );
  const { payload } = await jwtVerify(jwtToken, JWKS);
  const query = { _id: new ObjectId(payload.id) };
  const user = await users.findOne(query);
  if (!user) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  next();
};

export const chackAdmin = async (req, res, next) => {
  const hedars = req.headers.authorization;
  if (!hedars) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const jwtToken = hedars.split(" ")[1];
  if (!jwtToken) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }

  const JWKS = createRemoteJWKSet(
    new URL("http://localhost:3000/api/auth/jwks"),
  );
  const { payload } = await jwtVerify(jwtToken, JWKS);
  const query = { _id: new ObjectId(payload.id) };
  const user = await users.findOne(query);
  if (!user) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  if (user.role !== "admin") {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  next();
};

export const chackVendorAndAdmin = async (req, res, next) => {
  const hedars = req.headers.authorization;
  if (!hedars) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const jwtToken = hedars.split(" ")[1];
  if (!jwtToken) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }

  const JWKS = createRemoteJWKSet(
    new URL("http://localhost:3000/api/auth/jwks"),
  );
  const { payload } = await jwtVerify(jwtToken, JWKS);
  const query = { _id: new ObjectId(payload.id) };
  const user = await users.findOne(query);
  if (!user) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  if (user.role !== "admin" && user.role !== "vendor") {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  next();
};
