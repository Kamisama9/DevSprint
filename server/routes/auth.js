import { Router } from "express";
import LoginController from "../controllers/loginController.js";
const router=Router();

router.post('/getaccesstoken',LoginController);

export default router;
