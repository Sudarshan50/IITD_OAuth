import e from "express";
import token from "../controllers/tokenContoller.js";

const tokenRouter = e.Router();

tokenRouter.get("/verify", token.verify);

export default tokenRouter;

