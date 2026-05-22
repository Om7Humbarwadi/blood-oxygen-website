import { Router } from "express";
import authRouter from "./authRoutes.js";
import bloodRouter from "./bloodRoutes.js";
import oxygenRouter from "./oxygenRoutes.js";
import emergencyRequestRouter from "./emergencyRequestRoutes.js";
import { successResponse } from "../utils/response.js";

const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  return successResponse(res, 200, "Service is healthy", {
    service: "healthcare-emergency-backend",
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/blood", bloodRouter);
apiRouter.use("/oxygen", oxygenRouter);
apiRouter.use("/emergency-requests", emergencyRequestRouter);

export default apiRouter;
