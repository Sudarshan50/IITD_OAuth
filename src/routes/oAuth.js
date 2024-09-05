import e from "express";
import oAuth from "../controllers/oAuthController.js";
import auth from "../controllers/authContoller.js";
import passport from "passport";

const oAuthRouter = e.Router();

oAuthRouter.get("/login", oAuth.login);

oAuthRouter.get(
  "/auth/microsoft",
  passport.authenticate("microsoft", {}),
  async (req, res) => {}
);
oAuthRouter.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/login" }),
  (req, res) => {
    res.cookie("uId", req.user.id);
    res.redirect(
      `/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3001`
    );
  }
);

oAuthRouter.get("/authorize", auth.authorize);
oAuthRouter.get("/callback", auth.callback);

export default oAuthRouter;
