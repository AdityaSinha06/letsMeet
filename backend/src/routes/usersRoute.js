import {Router} from "express";
import {login , register , getUserHistory , addToHistory , getUsername} from "../controllers/userController.js";

const UserRouter = Router();

UserRouter.route("/login")
    .post(login);
UserRouter.route("/register")
    .post(register);
UserRouter.route("/add_to_activity")
    .post(addToHistory);
UserRouter.route("/get_all_activity")
    .get(getUserHistory);
UserRouter.route("/findUsername")
    .get(getUsername);

export default UserRouter;