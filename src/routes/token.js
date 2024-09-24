import e from "express";
import token from "../controllers/tokenContoller.js";

const tokenRouter = e.Router();

tokenRouter.post("/verify", token.verify);
tokenRouter.post("/generateAccessToken", token.generateAccessToken);
export default tokenRouter;

