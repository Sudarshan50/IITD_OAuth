import e from "express";
import admin from "../controllers/adminController.js";
import { adminMiddleWare } from "../middleware/adminMiddleWare.js";

const adminRouter = e.Router();

adminRouter.post("/signin", admin.signIn);
adminRouter.post("/signup", admin.signUp);
adminRouter.post("/register", adminMiddleWare, admin.register);
adminRouter.get("/clients", adminMiddleWare, admin.getAllClients);
adminRouter.get("/client/:client_id", adminMiddleWare, admin.getClientById);
adminRouter.delete("/client/:client_id", adminMiddleWare, admin.deleteClient);
adminRouter.put("/client", adminMiddleWare, admin.updateClient);
adminRouter.get("/users", admin.getAllUsers);
adminRouter.get("/logs", admin.getAllLogs);

export default adminRouter;
