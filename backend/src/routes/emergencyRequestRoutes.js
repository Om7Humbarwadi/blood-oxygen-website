import { Router } from "express";
import {
  approveEmergencyRequest,
  assignEmergencyDonor,
  createRequest,
  editRequest,
  getEmergencyRequests,
  rejectEmergencyRequest,
  removeRequest,
  resolveEmergencyRequest,
} from "../controllers/emergencyRequestController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import {
  validateAssignDonorPayload,
  validateCreateEmergencyPayload,
  validateUpdateEmergencyPayload,
} from "../validators/emergencyRequestValidator.js";

const emergencyRequestRouter = Router();
const allowedRoles = [ROLES.SUPER_ADMIN, ROLES.HOSPITAL, ROLES.BLOOD_BANK];

emergencyRequestRouter.get("/", authenticate, authorizeRoles(...allowedRoles), getEmergencyRequests);
emergencyRequestRouter.post("/add", authenticate, authorizeRoles(...allowedRoles), validateCreateEmergencyPayload, createRequest);
emergencyRequestRouter.put("/update/:id", authenticate, authorizeRoles(...allowedRoles), validateUpdateEmergencyPayload, editRequest);
emergencyRequestRouter.delete("/:id", authenticate, authorizeRoles(...allowedRoles), removeRequest);

emergencyRequestRouter.patch("/:id/approve", authenticate, authorizeRoles(...allowedRoles), approveEmergencyRequest);
emergencyRequestRouter.patch("/:id/reject", authenticate, authorizeRoles(...allowedRoles), rejectEmergencyRequest);
emergencyRequestRouter.patch("/:id/assign", authenticate, authorizeRoles(...allowedRoles), validateAssignDonorPayload, assignEmergencyDonor);
emergencyRequestRouter.patch("/:id/resolve", authenticate, authorizeRoles(...allowedRoles), resolveEmergencyRequest);

export default emergencyRequestRouter;
