import oauth_client from "../models/oauth_client.js";
import bcrypt from "bcryptjs";
import {
  generateAuthorizationCode,
  useAuthorizationCode,
} from "../utils/authCodeUtils.js";
import User from "../models/user.js";
import {
  generateStateParameter,
  validateStateParameter,
} from "../utils/stateManager.js";
import { logUserAction } from "../utils/logFunction.js";
import { validationResult, query, check } from "express-validator";
import { rateLimitByUserId } from "../middleware/rateLimitter.js";

const windowMs = 15 * 60 * 1000;
const maxRequests = 100;

let auth = {};

auth.verify = [
  query("client_id").isString().notEmpty(),
  query("redirect_uri")
    .isURL({
      protocols: ["http", "https"],
      require_tld: false,
    })
    .notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { client_id, redirect_uri } = req.query;

      const check = await oauth_client.findOne({
        clientId: client_id,
        redirectUri: { $in: [redirect_uri] },
      });

      if (!check) {
        return res.status(400).json("Invalid client or redirect URI");
      }

      res.cookie("client_id", client_id, {
        // httpOnly: true,
        // secure: true,
        // sameSite: "Strict",
      });
      res.cookie("redirect_uri", redirect_uri, {
        // httpOnly: true,
        // secure: true,
        // sameSite: "Strict",
      });

      const redirectUrl = `http://localhost:5173/signin?client_name=${check.clientName}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  },
];

auth.authorize = [
  query("client_id").isString().notEmpty(),
  query("redirect_uri")
    .isURL({
      protocols: ["http", "https"],
      require_tld: false,
    })
    .notEmpty(),
  rateLimitByUserId(windowMs, maxRequests),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { client_id, redirect_uri } = req.query;
      const clientCheck = await oauth_client.findOne({
        clientId: client_id,
        redirectUri: { $in: [redirect_uri] },
      });
      if (!clientCheck || !clientCheck.grants.includes("authorization_code")) {
        return res.status(400).json("Invalid grant type");
      }

      const user = await User.findOne({ msId: req.user.id });

      if (!user.onboarding) {
        return res.redirect("http://localhost:5173/onboarding");
      }

      const state = await generateStateParameter();
      const auth_code = await generateAuthorizationCode(client_id, req.user.id);

      await logUserAction(req.user.id, client_id, "Login Initiated");

      const redirectUrl = `${redirect_uri}/callback?grant_type=auth_code&code=${auth_code}&state=${state}`;
      res.redirect(redirectUrl);
    } catch (error) {
      await logUserAction(req.user.id, req.cookies.client_id, error.message);
      console.error(error);
      res.status(500).json("An error occurred");
    }
  },
];

auth.client_auth_verify = [
  check("client_id").isString().notEmpty(),
  check("auth_code").isString().notEmpty(),
  check("client_secret").isString().notEmpty(),
  check("state").isString().notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { client_id, auth_code, client_secret, state } = req.body;
      const client = await oauth_client.findOne({ clientId: client_id });
      const checkSecret = await bcrypt.compare(
        client_secret,
        client.clientSecretHash
      );
      const checkState = await validateStateParameter(state);

      if (!client || !checkSecret || !checkState) {
        return res.status(400).json("Invalid Credentials");
      }

      const authCodeData = await useAuthorizationCode(auth_code);
      const userId = authCodeData.userId;
      const user = await User.findOne({ msId: userId });

      if (!user) {
        return res.status(400).json("User not found");
      }

      if (!user.authorizedClients.includes(client_id)) {
        user.authorizedClients.push(client_id);
        await user.save();
      }

      if (client.scope.includes("read")) {
        await logUserAction(userId, client_id, "Read Access Granted");
        return res.status(200).json({
          user: {
            name: user.username,
            email: user.email,
            hostel: user.hostel,
            dateOfBirth: user.dateOfBirth,
            instagramId: user.instagramId,
            mobileNo: user.mobileNo,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
];

auth.onboarding = [
  check("hostel").isString().notEmpty(),
  check("msId").isString().notEmpty(),
  check("dateOfBirth").isString().notEmpty(),
  check("instagramId").isString().optional(),
  check("mobileNo").isMobilePhone().notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { hostel, msId, dateOfBirth, instagramId, mobileNo } = req.body;
      const user = await User.findOne({ msId: msId });
      if (!user) {
        return res.status(404).json("User not found");
      }

      user.hostel = hostel;
      user.dateOfBirth = dateOfBirth;
      user.instagramId = instagramId;
      user.mobileNo = mobileNo;
      user.onboarding = true;
      await user.save();

      req.user = {
        id: msId,
      };

      res.status(200).json("Onboarding Successful");
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
  },
];

export default auth;
