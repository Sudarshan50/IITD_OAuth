import oauth_client from "../models/oauth_client.js";
import { validationResult, check } from "express-validator";

const VerifyClientMiddleware = [
  check("client_id").isString().notEmpty(),
  check("redirect_uri").isString().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
      }

      const { client_id, redirect_uri } = req.body;
      const check = await oauth_client.findOne({
        clientId: client_id,
        redirectUri: { $in: [redirect_uri] },
      });

      if (!check) {
        console.log("Client not found");
        return res.status(400).json("Error verifying client");
      }
      req.client = check;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json("Error verifying client");
    }
  },
];

export default VerifyClientMiddleware;
