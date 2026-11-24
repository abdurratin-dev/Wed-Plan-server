import { sessions, users } from "../config/db.js";

export const checkAuthenticatedUser = async (req, res, next) => {
  const hedars = req.headers.authorization;
  if (!hedars) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const token = hedars.split(" ")[1];
  if (!token) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const session = await sessions.findOne({ token });
  const user = await users.findOne({ _id: session.userId });
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
  const token = hedars.split(" ")[1];
  if (!token) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const session = await sessions.findOne({ token });
  const user = await users.findOne({ _id: session.userId });
  if (!user) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  if(user.role !== 'admin'){
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  next()
};

export const chackVendorAndAdmin = async (req, res, next) => {
  const hedars = req.headers.authorization;
  if (!hedars) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const token = hedars.split(" ")[1];
  if (!token) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  const session = await sessions.findOne({ token });
  const user = await users.findOne({ _id: session.userId });
  if (!user) {
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  if(user.role !== 'admin' && user.role !== 'vendor'){
    res.send({ status: 401, massage: "User Unauthorizatied" });
    return;
  }
  next()
};