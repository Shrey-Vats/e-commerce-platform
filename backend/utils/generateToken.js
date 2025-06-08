import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Makes the cookie inaccessible to client-side scripts
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Protects against cross-site request forgery attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;
