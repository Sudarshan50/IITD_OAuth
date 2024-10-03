import e from "express";
import auth from "../controllers/authContoller.js";
import verifyClientMiddleware from "../middleware/verifyClientMiddleware.js";

const oAuthRouter = e.Router();


oAuthRouter.post(
  "/callback/microsoft",
  verifyClientMiddleware,
  auth.authorize
);
oAuthRouter.post("/verify", verifyClientMiddleware, auth.verify);
oAuthRouter.post("/resource", auth.client_auth_verify);
oAuthRouter.post("/onboarding", auth.onboarding);

export default oAuthRouter;
