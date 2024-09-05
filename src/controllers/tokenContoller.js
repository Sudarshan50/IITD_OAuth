import { verifyToken } from "../utils/tokenUtils.js";

let token = {};

token.verify = async (req, res) => {
  const { token, publicKey } = req.body;
  const verifiedToken = verifyToken(token, publicKey);
  if (!verifiedToken) {
    return res.status(401).json({ message: "Invalid token" });
  }
  res.json(verifiedToken);
};
export default token;
