import AppError from "../utils/AppError.js";
import { PRIORITY_LEVELS, REQUEST_STATUS } from "../models/EmergencyRequest.js";

const VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const validateCreateEmergencyPayload = (req, res, next) => {
  const { patientName, bloodGroup, hospital, priority } = req.body;

  if (!patientName || !bloodGroup || !hospital || !priority) {
    return next(new AppError("patientName, bloodGroup, hospital and priority are required", 400));
  }

  if (!VALID_BLOOD_GROUPS.includes(bloodGroup)) {
    return next(new AppError("Invalid blood group", 400));
  }

  if (!PRIORITY_LEVELS.includes(priority)) {
    return next(new AppError("Invalid priority", 400));
  }

  return next();
};

export const validateUpdateEmergencyPayload = (req, res, next) => {
  const { patientName, bloodGroup, hospital, priority, status, assignedDonor } = req.body;

  if (bloodGroup && !VALID_BLOOD_GROUPS.includes(bloodGroup)) {
    return next(new AppError("Invalid blood group", 400));
  }

  if (priority && !PRIORITY_LEVELS.includes(priority)) {
    return next(new AppError("Invalid priority", 400));
  }

  if (status && !REQUEST_STATUS.includes(status)) {
    return next(new AppError("Invalid status", 400));
  }

  if (patientName !== undefined && !String(patientName).trim()) {
    return next(new AppError("patientName cannot be empty", 400));
  }

  if (hospital !== undefined && !String(hospital).trim()) {
    return next(new AppError("hospital cannot be empty", 400));
  }

  if (assignedDonor !== undefined && typeof assignedDonor !== "string") {
    return next(new AppError("assignedDonor must be a string", 400));
  }

  return next();
};

export const validateAssignDonorPayload = (req, res, next) => {
  const { assignedDonor } = req.body;

  if (!assignedDonor || !String(assignedDonor).trim()) {
    return next(new AppError("assignedDonor is required", 400));
  }

  return next();
};
