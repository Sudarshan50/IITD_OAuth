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
import { validationResult, check } from "express-validator";
import {
  generateOnboardingToken,
  verifyOnboardingToken,
} from "../utils/tokenUtils.js";
import axios from "axios";

let auth = {};

auth.verify = async (req, res) => {
  return res.status(200).json({
    message: req.client.clientName,
  });
};

auth.authorize = async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    const msUser = await axios
      .get("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!msUser) {
      return res.status(500).json("Error fetching user data");
    }

    let user = await User.findOne({ msId: msUser.id });
    if (!user) {
      user = new User({
        username: msUser.displayName,
        msId: msUser.id,
        email: msUser.mail,
        kerberosId: msUser.mail.split("@")[0],
      });
      await user.save();
      await logUserAction(user._id, req.body.client_id, "User Created");
    }
    if (!user.completedOnboarding) {
      const token = generateOnboardingToken(
        user,
        req.body.client_id,
        req.body.redirect_uri
      );
      await logUserAction(
        user._id,
        req.body.client_id,
        "Onboarding Incomplete"
      );
      return res.status(206).json({
        message: "Onboarding Incomplete",
        token: token,
      });
    }
    const state = await generateStateParameter();
    const auth_code = await generateAuthorizationCode(
      req.body.client_id,
      user._id
    );

    await logUserAction(user._id, req.body.client_id, "Login Initiated");

    res.status(200).json({
      auth_code,
      state,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred");
  }
};
auth.client_auth_verify = [
  check("client_id").isString().notEmpty(),
  check("auth_code").isString().notEmpty(),
  check("client_secret").isString().notEmpty(),
  check("state").isString().notEmpty(),
  check("grant_type").isString().isIn(["authorization_code"]), // TODO: Add support for other grant types.
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { client_id, auth_code, client_secret, state, grant_type } =
        req.body;
      const client = await oauth_client.findOne({ clientId: client_id });
      const checkSecret = await bcrypt.compare(
        client_secret,
        client.clientSecretHash
      );
      const checkState = await validateStateParameter(state);

      if (!client || !checkSecret || !checkState) {
        return res.status(400).json("Invalid Client credentials or state");
      }

      if (!client.grants.includes(grant_type)) {
        return res.status(400).json("Invalid Grant Type");
      }

      const authCodeData = await useAuthorizationCode(auth_code);
      const userId = authCodeData.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json("User not found");
      }

      if (!user.authorizedClients.includes(client_id)) {
        user.authorizedClients.push(client_id);
        await user.save();
      }

      if (client.scope.includes("read")) {
        // TODO: Change the use of scope to send only the required data.
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
      await logUserAction(userId, client_id, "Read Access Denied");
      return res.status(403).json({
        message: "Forbidden",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err.message);
    }
  },
];

auth.onboarding = [
  check("hostel")
    .isString()
    .isIn([
      "aravali",
      "girnar",
      "jwalamukhi",
      "karakoram",
      "kumaon",
      "nilgiri",
      "shivalik",
      "satpura",
      "udaigiri",
      "vindhyachal",
      "zanskar",
      "dronagiri",
      "saptagiri",
      "kailash",
      "sahyadri",
      "himadri",
      "nalanda",
      "saptagiri",
    ])
    .notEmpty(),
  check("dateOfBirth").isDate().notEmpty(),
  check("instagramId").isString().optional(),
  check("mobileNo").isMobilePhone().notEmpty(),
  check("token")
    .isString()
    .notEmpty()
    .matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const tokendata = verifyOnboardingToken(req.body.token);
      if (!tokendata) {
        return res.status(400).json("Invalid Token");
      }
      const user = await User.findById(tokendata.sub);
      if (user.completedOnboarding) {
        return res.status(400).json("User already onboarded");
      }
      const { hostel, dateOfBirth, instagramId, mobileNo } = req.body;

      user.hostel = hostel;
      user.dateOfBirth = dateOfBirth;
      user.instagramId = instagramId;
      user.mobileNo = mobileNo;
      user.completedOnboarding = true;
      await user.save();

      const state = await generateStateParameter();
      const auth_code = await generateAuthorizationCode(
        tokendata.client_id,
        user._id
      );
      await logUserAction(
        user._id,
        tokendata.client_id,
        "Onboarding Complete and Login Initiated"
      );

      res.status(200).json({
        redirect_uri: tokendata.redirect_uri,
        client_id: tokendata.client_id,
        auth_code,
        state,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
  },
];

export default auth;
