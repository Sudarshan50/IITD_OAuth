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
      `/api/oauth/authorize?client_id=${req.cookies.client_id}&redirect_uri=${req.cookies.redirect_uri}`
    );
  }
);

oAuthRouter.get("/authorize", auth.authorize);
oAuthRouter.get("/callback", auth.callback);
oAuthRouter.get("/logout", auth.logout);

export default oAuthRouter;
