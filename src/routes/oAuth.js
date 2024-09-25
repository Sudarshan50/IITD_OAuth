import e from "express";
import auth from "../controllers/authContoller.js";
import passport from "passport";

const oAuthRouter = e.Router();


oAuthRouter.get(
  "/auth/microsoft",
  passport.authenticate("microsoft", {}),
  async (req, res) => {}
);
oAuthRouter.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/login" }),
  (req, res) => {
    res.cookie("msId", req.user.id);
    res.redirect(
      `/api/oauth/authorize?client_id=${req.cookies.client_id}&redirect_uri=${req.cookies.redirect_uri}`
    );
  }
);
oAuthRouter.get("/verify", auth.verify);
oAuthRouter.get("/authorize", auth.authorize);
oAuthRouter.post("/auth_verify", auth.client_auth_verify);
oAuthRouter.post('/onboarding', auth.onboarding);
// oAuthRouter.get("/callback", auth.callback);
// oAuthRouter.get("/logout", auth.logout);

export default oAuthRouter;
