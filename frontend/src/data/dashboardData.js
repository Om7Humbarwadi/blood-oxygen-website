export const statsData = [
  { id: "bloodUnits", label: "Total Blood Units", value: "12,480", change: "+8.2%", tone: "rose" },
  { id: "donors", label: "Active Donors", value: "3,214", change: "+4.6%", tone: "red" },
  { id: "oxygen", label: "Oxygen Availability", value: "89%", change: "-1.2%", tone: "amber" },
  { id: "requests", label: "Emergency Requests", value: "67", change: "+12.1%", tone: "rose" },
  { id: "approvals", label: "Pending Approvals", value: "23", change: "+2.4%", tone: "red" },
  { id: "alerts", label: "Inventory Alerts", value: "9", change: "-3.8%", tone: "amber" },
];

export const bloodUsageTrend = [
  { name: "Mon", usage: 320 },
  { name: "Tue", usage: 280 },
  { name: "Wed", usage: 360 },
  { name: "Thu", usage: 340 },
  { name: "Fri", usage: 390 },
  { name: "Sat", usage: 410 },
  { name: "Sun", usage: 370 },
];

export const donationTrend = [
  { name: "Week 1", donors: 410 },
  { name: "Week 2", donors: 460 },
  { name: "Week 3", donors: 430 },
  { name: "Week 4", donors: 520 },
];

export const oxygenDemand = [
  { name: "ICU", demand: 70 },
  { name: "Emergency", demand: 90 },
  { name: "Surgery", demand: 55 },
  { name: "General", demand: 45 },
];

export const emergencyStats = [
  { name: "Critical", value: 21 },
  { name: "High", value: 34 },
  { name: "Moderate", value: 28 },
  { name: "Low", value: 17 },
];

export const recentActivities = [
  { id: 1, title: "Emergency blood request escalated", detail: "O+ units dispatched to City Trauma Center", time: "2 minutes ago", priority: "critical" },
  { id: 2, title: "New donor batch verified", detail: "48 donors approved for this week", time: "16 minutes ago", priority: "normal" },
  { id: 3, title: "Oxygen reserve threshold warning", detail: "Warehouse 3 reserve dropped below 30%", time: "31 minutes ago", priority: "warning" },
  { id: 4, title: "Hospital onboarding completed", detail: "St. Mary Advanced Care connected successfully", time: "1 hour ago", priority: "normal" },
];

export const sidebarItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { id: "inventory", label: "Blood Inventory", path: "/admin/inventory" },
  { id: "oxygen", label: "Oxygen Inventory", path: "/admin/oxygen" },
  { id: "requests", label: "Emergency Requests", path: "/admin/requests" },
  { id: "reports", label: "Reports & Analytics", path: "/admin/reports" },
  { id: "donors", label: "Donors", path: "/admin/dashboard" },
  { id: "approvals", label: "Approvals", path: "/admin/dashboard" },
];
