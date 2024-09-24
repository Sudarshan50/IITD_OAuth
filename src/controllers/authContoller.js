import oauth_client from "../models/oauth_client.js";
import { generateAuthorizationCode } from "../utils/authCodeUtils.js";
import { generateTokens } from "../utils/tokenUtils.js";
import { decryption } from "../config/key.js";
import User from "../models/user.js";
import {
  signData,
  verifySignature,
  decryptPrivateKey,
} from "../utils/cryptoUtils.js";
import crypto from "crypto";

let auth = {};

auth.authorize = async (req, res) => {
  const { client_id, redirect_uri } = req.query;
  const check = await oauth_client.findOne({
    clientId: client_id,
    redirectUri: { $in: [redirect_uri] },
  });
  if (!check) {
    return res.status(400).json("Invalid client or redirect uri");
  }
  const code = await generateAuthorizationCode(client_id, req.cookies.uId);
  const privateKeyNew = decryption(
    check.encryptedprivateKey,
    check.clientSecretHash
  );
  console.log(privateKeyNew);
  const authCode = signData(code, privateKeyNew);
  const state = crypto.randomBytes(5).toString("hex");
  req.session.oauthState = state;
  req.session.signature = authCode;
  const authorization_url = `callback?code=${code}&client_id=${client_id}&state=${state}`;
  res.redirect(authorization_url);
};

auth.callback = async (req, res) => {
  const { code, state, client_id } = req.query;
  const signature = req.session.signature;
  const client = await oauth_client.findOne({ clientId: client_id });
  const extractPubKey = process.env.CLIENT_PUBLIC_KEY;
  const authCode = verifySignature(code, signature, extractPubKey);
  console.log(authCode);
  if (!client || !authCode) {
    return res.status(400).send("Invalid client");
  }
  if (state !== req.session.oauthState) {
    return res.status(400).send("Invalid state");
  }
  const user = await User.findOne({ instiId: req.cookies.uId });
  if (!user) {
    return res.status(400).send("User not found");
  }
  const token = generateTokens(user, client);
  res
    .cookie("access_token", token.accessToken)
    .cookie("refresh_token", token.refreshToken);
  res.redirect(client.redirectUri[0]);
};
auth.logout = async (req, res) => {
  req.logout(function (err) {
    if (!err) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.status(200).json("Logged out successfully");
      return;
    }
  });
};

export default auth;
