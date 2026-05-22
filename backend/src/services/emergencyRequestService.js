import EmergencyRequest from "../models/EmergencyRequest.js";
import AppError from "../utils/AppError.js";

const sanitize = (doc) => (doc.toObject ? doc.toObject() : doc);

export const createEmergencyRequest = async (payload) => {
  const requestType = payload.requestType || "BLOOD";
  const created = await EmergencyRequest.create({
    ...payload,
    requestType,
    bloodGroup: requestType === "BLOOD" ? payload.bloodGroup : null,
    oxygenUnits: requestType === "OXYGEN" ? Number(payload.oxygenUnits) : null,
    status: "PENDING",
    assignedDonor: "",
    resolvedAt: null,
    forwardedAt: null,
  });
  return sanitize(created);
};

export const listEmergencyRequests = async ({ page = 1, limit = 10, search = "", status = "", priority = "" }) => {
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: "i" } },
      { hospital: { $regex: search, $options: "i" } },
      { assignedDonor: { $regex: search, $options: "i" } },
      { bloodGroup: { $regex: search, $options: "i" } },
      { requestType: { $regex: search, $options: "i" } },
    ];
  }

  const numericPage = Math.max(Number(page) || 1, 1);
  const numericLimit = Math.max(Number(limit) || 10, 1);

  const [items, total] = await Promise.all([
    EmergencyRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit),
    EmergencyRequest.countDocuments(query),
  ]);

  return {
    items: items.map(sanitize),
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages: Math.ceil(total / numericLimit),
    },
  };
};

export const updateEmergencyRequest = async (id, payload) => {
  const existing = await EmergencyRequest.findById(id);
  if (!existing) {
    throw new AppError("Emergency request not found", 404);
  }

  Object.assign(existing, payload);
  if (payload.requestType === "BLOOD") {
    existing.oxygenUnits = null;
  }
  if (payload.requestType === "OXYGEN") {
    existing.bloodGroup = null;
  }
  if (payload.status !== "RESOLVED") {
    existing.resolvedAt = null;
  }
  if (payload.status !== "FORWARDED_TO_APP") {
    existing.forwardedAt = null;
  }

  await existing.save();
  return sanitize(existing);
};

export const deleteEmergencyRequest = async (id) => {
  const deleted = await EmergencyRequest.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError("Emergency request not found", 404);
  }
};

const getRequestOrThrow = async (id) => {
  const record = await EmergencyRequest.findById(id);
  if (!record) {
    throw new AppError("Emergency request not found", 404);
  }
  return record;
};

export const approveRequest = async (id) => {
  const record = await getRequestOrThrow(id);
  record.status = "APPROVED";
  await record.save();
  return sanitize(record);
};

export const rejectRequest = async (id, notes = "") => {
  const record = await getRequestOrThrow(id);
  record.status = "REJECTED";
  if (notes) record.notes = notes;
  await record.save();
  return sanitize(record);
};

export const forwardRequestToApp = async (id, notes = "") => {
  const record = await getRequestOrThrow(id);
  record.status = "FORWARDED_TO_APP";
  record.forwardedAt = new Date();
  if (notes) record.notes = notes;
  await record.save();
  return sanitize(record);
};

export const assignRequestDonor = async (id, assignedDonor) => {
  const record = await getRequestOrThrow(id);
  record.assignedDonor = assignedDonor;
  record.status = "ASSIGNED";
  await record.save();
  return sanitize(record);
};

export const resolveRequest = async (id) => {
  const record = await getRequestOrThrow(id);
  record.status = "RESOLVED";
  record.resolvedAt = new Date();
  await record.save();
  return sanitize(record);
};
