import oauth_client from "../models/oauth_client.js";
import { generateAuthorizationCode } from "../utils/authCodeUtils.js";
import { generateTokens } from "../utils/tokenUtils.js";
import User from "../models/user.js";
import {
  signData,
  verifySignature,
  decryptPrivateKey,
} from "../utils/cryptoUtils.js";
import crypto from "crypto";

let auth = {};

auth.authorize = async (req, res) => {
  console.log(req.query);
  const { client_id, redirect_uri } = req.query;
  const check = await oauth_client.findOne({
    clientId: client_id,
    // redirectUri: redirect_uri[0],
  });
  console.log(check);
  if (!check) {
    console.log(check);
    return res.status(400).send("Invalid client or redirect uri");
  }
  const code = await generateAuthorizationCode(client_id, req.cookies.uId);
  const authCode = signData(code, check.encryptedprivateKey);
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
  const authCode = verifySignature(code, signature, client.public_key);
  if (!client || !authCode) {
    return res.status(400).send("Invalid client");
  }
  if (state !== req.session.oauthState) {
    return res.status(400).send("Invalid state");
  }
  //client verification done...
  const user = await User.findOne({ instiId: req.cookies.uId });
  if (!user) {
    return res.status(400).send("User not found");
  }
  //user verification done...
  const token = generateTokens(user, client);
  //cache the public key of the client...
  res.json({
    token,
    client,
  });

  //if all checks are true then issue the token and redirect to their site with the token...
  // const token = await generateTokens(, client);
  // res.json(token);
  // res.cookie(
  //   { acess_token: token.acess_token },
  //   { refresh_token: token.refresh_token }
  // );
  // res.redirect(client.redirectUri[0]);
};

export default auth;
