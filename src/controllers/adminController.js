import OAuthClient from "../models/oauth_client.js";
import log from "../models/log.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

let admin = {};

const base64UrlEncode = (hexString) =>
  Buffer.from(hexString, "hex")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

admin.register = async (req, res) => {
  try {
    const { client_name } = req.body;
    const redirect_uris = req.body.redirect_uris;
    const client_id_generate = crypto.randomBytes(20).toString("hex");
    const client_id = base64UrlEncode(client_id_generate);
    const client_secret_generate = crypto.randomBytes(20).toString("hex");
    const client_secret = base64UrlEncode(client_secret_generate);
    const client = new OAuthClient({
      clientId: client_id,
      clientName: client_name,
      clientSecretHash: client_secret,
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
    res.status(500).json("Internal Server Error");
  }
};

admin.getAllClients = async (req, res) => {
  try {
    const clients = await OAuthClient.find();
    res.status(200).json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.getClientById = async (req, res) => {
  try {
    const client = await OAuthClient.findOne({
      clientId: req.params.client_id,
    });
    if (!client) {
      return res.status(404).json("Client not found");
    }
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.updateClient = async (req, res) => {
  try {
    const { clientId, client_Secret, newClientName, newRedirectUri } = req.body;
    const client = await OAuthClient.findOne({ clientId: clientId });
    if (!client) {
      return res.status(404).json("Client not found");
    }
    const checkSecret = await bcrypt.compare(
      client_Secret,
      client.clientSecretHash
    );
    if (!checkSecret) {
      return res.status(400).json("Invalid Credentials");
    }
    if (newClientName && newRedirectUri) {
      client.clientName = newClientName;
      client.redirectUri = newRedirectUri;
    } else if (newClientName) {
      client.clientName = newClientName;
    } else if (newRedirectUri) {
      client.redirectUri = newRedirectUri;
    }
    await client.save();
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.deleteClient = async (req, res) => {
  try {
    const { clientId, client_Secret } = req.body;
    const client = await OAuthClient.findOne({ clientId: clientId });
    if (!client) {
      return res.status(404).json("Client not found");
    }
    const checkSecret = await bcrypt.compare(
      client_Secret,
      client.clientSecretHash
    );
    if (!checkSecret) {
      return res.status(400).json("Invalid Credentials");
    }
    await client.deleteOne();
    res.status(200).json("Client deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.getAllLogs = async (req, res) => {
  try {
    const logs = await log.find();
    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export default admin;
