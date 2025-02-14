import { Router } from "express";
import LoginController from "../controllers/loginController.js";
import getUserData from "../controllers/userController.js";
const router=Router();

router.get('/access_token',LoginController);
router.get('/user_data',getUserData)

export default router;
