import OAuthClient from "../models/oauth_client.js";
import log from "../models/log.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import { logAdminAction } from "../utils/superAdminLogger.js";
import AdminLogs from "../models/admin_logs.js";
import { validationResult, query, check } from "express-validator";

let admin = {};

admin.registerClient = [
  check("client_name").isString().notEmpty(),
  check("redirect_uris")
    .isArray()
    .custom((array) =>
      array.every((uri) =>
        check(uri).isURL({
          protocols: ["http", "https"],
          tsld: false,
        })
      )
    ),
  async (req, res) => {
    try {
      const currAdmin = await Admin.findById(req.admin);
      if (!currAdmin) {
        return res.status(401).json("Unauthorized");
      }
      const { client_name } = req.body;
      const redirect_uris = req.body.redirect_uris;
      const client_id = crypto.randomBytes(20).toString("base64url");
      const client_secret = crypto.randomBytes(20).toString("base64url");
      const client = new OAuthClient({
        clientId: client_id,
        clientName: client_name,
        clientSecretHash: client_secret,
        redirectUri: redirect_uris,
        owner: req.admin,
      });
      await client.save();
      currAdmin.ownedClients.push(client_id);
      await currAdmin.save();
      logAdminAction(
        req.admin,
        "Client created successfully",
        `Client ID: ${client_id}`
      );
      res.status(201).json({
        client_id,
        client_name,
        client_secret,
        redirect_uris,
      });
    } catch (error) {
      logAdminAction(req.admin, "Client creation failed", error.message);
      res.status(500).json(error.message);
    }
  },
];

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
    const payload = {
      id: findAdmin._id,
      permission_code: findAdmin.permission_code,
    };
    const token = jwt.sign(payload, process.env.ADMIN_KEY, {
      expiresIn: "1h",
    });
    res.cookie("admin_token", token, {
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
    const permission_code = req.permission_code;
    if (permission_code === "superadmin") {
      const clients = await OAuthClient.find();
      return res.status(200).json(clients);
    } else if (permission_code === "admin") {
      const clients = await OAuthClient.find({ owner: req.admin });
      return res.status(200).json(clients);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.getClientById = async (req, res) => {
  try {
    const permission_code = req.permission_code;
    if (permission_code === "superadmin") {
      const client = await OAuthClient.findOne({
        clientId: req.params.client_id,
      });
      if (!client) {
        return res.status(404).json("Client not found");
      }
      return res.status(200).json({
        client_name: client.clientName,
        redirect_uris: client.redirectUri,
      });
    } else if (permission_code === "admin") {
      const client = await OAuthClient.findOne({
        clientId: req.params.client_id,
        owner: req.admin,
      });
      if (!client) {
        return res.status(404).json("Client not found");
      }
      res.status(200).json({
        client_name: client.clientName,
        redirect_uris: client.redirectUri,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.updateClient = async (req, res) => {
  try {
    const { client_id, client_name, redirect_uris } = req.body;
    const permission_code = req.permission_code;
    if (permission_code === "superadmin") {
      const client = await OAuthClient.findOne({ clientId: client_id });
      if (!client) {
        return res.status(404).json("Client not found");
      }
      if (client_name && redirect_uris) {
        client.clientName = client_name;
        client.redirectUri = redirect_uris;
      }
      await client.save();
      logAdminAction(
        req.admin,
        "Client updated successfully",
        `Client ID: ${client_id}`
      );
      return res.status(200).json(client);
    } else if (permission_code === "admin") {
      const client = await OAuthClient.findOne({
        clientId: client_id,
        owner: req.admin,
      });
      if (!client) {
        return res.status(404).json("Client not found");
      }
      if (client_name && redirect_uris) {
        client.clientName = client_name;
        client.redirectUri = redirect_uris;
      }
      await client.save();
      logAdminAction(
        req.admin,
        "Client updated successfully",
        `Client ID: ${client_id}`
      );
      res.status(200).json(client);
    }
  } catch (error) {
    console.log(error);
    logAdminAction(req.admin, "Client update failed", error.message);
    res.status(500).json("Internal Server Error");
  }
};

admin.deleteClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const permission_code = req.permission_code;
    if (permission_code === "superadmin") {
      const client = await OAuthClient.findOne({ clientId: client_id });
      if (!client) {
        return res.status(404).json("Client not found");
      }
      await client.deleteOne();
      logAdminAction(
        req.admin,
        "Client deleted successfully",
        `Client ID: ${client_id}`
      );
      return res.status(200).json("Client deleted successfully");
    } else if (permission_code === "admin") {
      const client = await OAuthClient.findOne({
        clientId: client_id,
        owner: req.admin,
      });
      if (!client) {
        return res.status(404).json("Client not found");
      }
      await client.deleteOne();
      logAdminAction(
        req.admin,
        "Client deleted successfully",
        `Client ID: ${client_id}`
      );
      return res.status(200).json("Client deleted successfully");
    }
  } catch (error) {
    console.log(error);
    logAdminAction(req.admin, "Client deletion failed", error.message);
    res.status(500).json("Internal Server Error");
  }
};

admin.getAllLogs = async (req, res) => {
  try {
    if (req.permission_code !== "superadmin") {
      return res.status(401).json("Unauthorized");
    }
    const logs = await log.find();
    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

admin.getAllUsers = async (req, res) => {
  try {
    if (req.permission_code !== "superadmin") {
      return res.status(401).json("Unauthorized");
    }
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export default admin;

admin.verify = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: "Admin verified", data: req.permission_code });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
admin.logout = async (req, res) => {
  try {
    res.cookie("admin_token", "", { maxAge: 0, sameSite: "none" });
    res.clearCookie("admin_token");
    res.status(200).json({ message: "Admin logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

admin.getAllAdminLogs = async (req, res) => {
  try {
    if (req.permission_code !== "superadmin") {
      return res.status(401).json("Unauthorized");
    }
    const logs = await AdminLogs.find()
      .populate("adminId")
      .sort({ createdAt: -1 });
    res.status(200).json({
      logs: logs.map((log) => {
        return {
          adminId: log.adminId.userName,
          action: log.action,
          message: log.message,
          createdAt: log.createdAt,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
