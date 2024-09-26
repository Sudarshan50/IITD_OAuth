import OAuthClient from "../models/oauth_client.js";
import log from "../models/log.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";

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

admin.signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const findAdmin = await Admin.findOne({ userName: userName });
    if (!findAdmin) {
      return res.status(404).json("Admin not found");
    }
    const checkPassword = await bcrypt.compare(password, findAdmin.password);
    if (!checkPassword) {
      return res.status(400).json("Invalid Credentials");
    }
    const token = jwt.sign({ id: findAdmin._id }, process.env.ADMIN_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      maxAge: 3600000,
      sameSite: "none",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};
admin.signUp = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const findAdmin = await Admin.findOne({ userName: userName });
    if (findAdmin) {
      return res.status(400).json("Admin already exists");
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      userName: userName,
      password: hashPass,
    });
    await newAdmin.save();
    res.status(201).json("Admin created successfully");
  } catch (err) {
    console.log(err);
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
    res.status(200).json({
      client_name: client.clientName,
      redirect_uris: client.redirectUri,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.updateClient = async (req, res) => {
  try {
    const { client_id, client_name, redirect_uris } = req.body;
    const client = await OAuthClient.findOne({ clientId: client_id });
    if (!client) {
      return res.status(404).json("Client not found");
    }
    if (client_name && redirect_uris) {
      client.clientName = client_name;
      client.redirectUri = redirect_uris;
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
    const { client_id } = req.params;
    const client = await OAuthClient.findOne({ clientId: client_id });
    if (!client) {
      return res.status(404).json("Client not found");
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
