import oauth_client from "../models/oauth_client.js";
import { verifyToken } from "../utils/tokenUtils.js";
import { generateAccessToken } from "../utils/tokenUtils.js";

let token = {};

token.verify = async (req, res) => {
  const { token, publicKey } = req.body;
  const verifiedToken = verifyToken(token, publicKey);
  if (!verifiedToken) {
    return res.status(401).json({ message: "Invalid token" });
  }
  res.status(200).json({ message: "Token is valid", verifiedToken });
};

token.generateAccessToken = async (req, res) => {
  const { refreshToken, publicKey } = req.body;
  const verifyRefToken = verifyToken(refreshToken, publicKey);
  if (!verifyRefToken) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  // console.log(req.cookies.client_id);
  const client = await oauth_client.findOne({
    clientId: "eea00f3408e61ed4d8ff7975caabe91ffdcdc83a",
  });
  // console.log(client);
  const accessToken = generateAccessToken(refreshToken, client);

  res.status(200).json({ accessToken });
};
export default token;
