import e from "express";
import auth from "../controllers/authContoller.js";
import passport from "passport";
import verifyClientMiddleware from "../middleware/verifyClientMiddleware.js";

const oAuthRouter = e.Router();

oAuthRouter.get(
  "/auth/microsoft",
  passport.authenticate("microsoft", {}),
  async (req, res) => {}
);
oAuthRouter.post(
  "/callback/microsoft",
  verifyClientMiddleware,
  // passport.authenticate("microsoft", { failureRedirect: "/login" }),
  auth.authorize
);
oAuthRouter.post("/verify", verifyClientMiddleware, auth.verify);
oAuthRouter.post("/resoruce", auth.client_auth_verify);
oAuthRouter.post("/onboarding", auth.onboarding);

export default oAuthRouter;
