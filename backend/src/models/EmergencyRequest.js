import mongoose from "mongoose";

const PRIORITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const REQUEST_STATUS = ["PENDING", "APPROVED", "REJECTED", "ASSIGNED", "RESOLVED"];

const emergencyRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      index: true,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    priority: {
      type: String,
      enum: PRIORITY_LEVELS,
      default: "MEDIUM",
      index: true,
    },
    status: {
      type: String,
      enum: REQUEST_STATUS,
      default: "PENDING",
      index: true,
    },
    assignedDonor: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const EmergencyRequest = mongoose.model("EmergencyRequest", emergencyRequestSchema);

export { PRIORITY_LEVELS, REQUEST_STATUS };
export default EmergencyRequest;
