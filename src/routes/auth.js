import e from "express";
import admin from "../controllers/adminController.js";

const adminRouter = e.Router();

adminRouter.post("/register", admin.register);
adminRouter.get("/clients", admin.getAllClients);
adminRouter.get("/client/:client_id", admin.getClientById);
adminRouter.delete("/client/:client_id", admin.deleteClient);
adminRouter.put("/client", admin.updateClient);
adminRouter.get("/users", admin.getAllUsers);
adminRouter.get("/logs", admin.getAllLogs);


export default adminRouter;
