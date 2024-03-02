import { Router } from "express";
import { signup } from "../controllers/auth";

const authRoutes = Router();

authRoutes.post("/signup", signup);

export default authRoutes;
