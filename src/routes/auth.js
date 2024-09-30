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
adminRouter.get("/users", adminMiddleWare, admin.getAllUsers);
adminRouter.get("/logs", adminMiddleWare, admin.getAllLogs);
adminRouter.get("/verify", adminMiddleWare, admin.verify);
adminRouter.get("/logout", adminMiddleWare, admin.logout);
adminRouter.get('/adminLogs',adminMiddleWare,admin.getAllAdminLogs)

export default adminRouter;
