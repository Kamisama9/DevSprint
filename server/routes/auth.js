import { Router } from "express";
import LoginController from "../controllers/loginController.js";
const router=Router();

router.post('/access_token',LoginController);

export default router;
