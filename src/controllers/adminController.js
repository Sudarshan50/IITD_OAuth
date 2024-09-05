import OAuthClient from "../models/oauth_client.js";
import { publicKey,privateKey } from "../config/key.js";
import crypto from "crypto";

let admin = {};

admin.register = async (req, res) => {
  try {
    const { client_name } = req.body;
    const redirect_uris = req.body.redirect_uris;
    const client_id = crypto.randomBytes(20).toString("hex");
    const client_secret = crypto.randomBytes(20).toString("hex");
    const client = new OAuthClient({
      clientId: client_id,
      clientName: client_name,
      clientSecretHash: client_secret,
      public_key: publicKey,
      encryptedprivateKey: privateKey,
      redirectUri: redirect_uris,
    });
    await client.save();
    res.status(201).json({
      client_id,
      client_name,
      client_secret,
      redirect_uris,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export default admin;
