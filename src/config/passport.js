import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();
//serialize and deserialize user
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_GRAPH_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_GRAPH_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/oauth/auth/microsoft/callback",
      scope: ["user.read"],
      tenant: process.env.MICROSOFT_GRAPH_TENANT_ID,
    },
    function async(accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        try {
          const user = await User.findOne({ msId: profile.id });
          if (!user) {
            const newUser = new User({
              username: profile.displayName,
              msId: profile.id,
              email: profile.emails[0].value,
              kerberosId: profile.emails[0].value.split("@")[0],
            });
            await newUser.save();
            return done(null, newUser);
          }
          return done(null, user);
        } catch (err) {
          console.log(err);
          throw new Error("Error in passport strategy");
        }
      });
    },
  ),
);
export default passport;
