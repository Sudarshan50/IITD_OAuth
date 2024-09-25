import oauth_client from "../models/oauth_client.js";
import bcrpyt from "bcryptjs";
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

let auth = {};
auth.verify = async (req, res) => {
  try {
    const { client_id, redirect_uri } = req.query;
    const check = await oauth_client.findOne({
      clientId: client_id,
      redirectUri: { $in: [redirect_uri] },
    });
    if (!check) {
      return res.status(400).json("Invalid client or redirect uri");
    }
    res.cookie("client_id", client_id).cookie("redirect_uri", redirect_uri);
    res.redirect(
      `http://localhost:5173/signin?client_name=${check.clientName}&client_id=${client_id}&redirect_uri=${redirect_uri}`
    );
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error", error);
  }
};

auth.authorize = async (req, res) => {
  try {
    const { client_id, redirect_uri } = req.query;
    const clientCheck = await oauth_client.findOne({
      clientId: client_id,
      redirectUri: { $in: [redirect_uri] },
    });
    if (!clientCheck || !clientCheck.grants.includes("authorization_code")) {
      return res.status(400).json("Invalid grant type");
    }
    const user = await User.findOne({ msId: req.user.id });
    if (user.onboarding === false) {
      res.redirect("http://localhost:5173/onboarding");
      return;
    }
    const state = await generateStateParameter();
    const auth_code = await generateAuthorizationCode(client_id, req.user.id);
    await logUserAction(req.user.id, client_id, "Login Initiated");
    res.redirect(
      `${redirect_uri}/authorise?grant_type=auth_code&code=${auth_code}&state=${state}`
    );
  } catch (error) {
    await logUserAction(req.user.id, req.cookies.client_id, error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
};

auth.client_auth_verify = async (req, res) => {
  try {
    const { client_id, auth_code, client_secret, state } = req.body;
    const client = await oauth_client.findOne({ clientId: client_id });
    const checkSecret = await bcrpyt.compare(
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
      console.log(req.isAuthenticated());
      return res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

auth.onboarding = async (req, res) => {
  try {
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
};

export default auth;
