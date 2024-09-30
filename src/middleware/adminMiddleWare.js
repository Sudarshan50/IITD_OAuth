import jwt from "jsonwebtoken";
export const adminMiddleWare = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ADMIN_KEY);
    req.admin = decoded.id;
    req.permission_code = decoded.permission_code;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
