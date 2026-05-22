import { Router } from "express";
import { login, profile, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateLoginPayload, validateRegisterPayload } from "../validators/authValidator.js";
import { ROLES } from "../utils/roles.js";

const authRouter = Router();

authRouter.post("/register", validateRegisterPayload, register);
authRouter.post("/login", validateLoginPayload, login);
authRouter.get(
  "/profile",
  authenticate,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.HOSPITAL, ROLES.BLOOD_BANK, ROLES.OXYGEN_SUPPLIER),
  profile
);

export default authRouter;
