import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { getUserProfile, loginUser, registerUser } from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return successResponse(res, 201, "User registered successfully", result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return successResponse(res, 200, "Login successful", result);
});

export const profile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);
  return successResponse(res, 200, "Profile fetched successfully", user);
});
