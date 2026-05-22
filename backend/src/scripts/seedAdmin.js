import bcrypt from "bcrypt";
import connectDatabase from "../config/database.js";
import User from "../models/User.js";
import { ROLES } from "../utils/roles.js";

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@healthcare.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const adminName = process.env.ADMIN_NAME || "System Admin";

  await connectDatabase();

  const existingAdmin = await User.findOne({ email: adminEmail }).select("+password");
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (existingAdmin) {
    existingAdmin.name = adminName;
    existingAdmin.password = hashedPassword;
    existingAdmin.role = ROLES.SUPER_ADMIN;
    await existingAdmin.save();
    console.log(`Admin user updated: ${adminEmail}`);
  } else {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: ROLES.SUPER_ADMIN,
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  console.log("Use these credentials to login:");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("Failed to seed admin user", error);
  process.exit(1);
});
