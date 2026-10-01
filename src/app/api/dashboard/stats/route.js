import { getDashboardStats } from "@/services/dashboardService";
import { requireRole } from "@/middleware/auth";

export async function GET(request) {
  try {
    requireRole(
      request,
      "Admin",
      "Receptionist",
      "Technician"
    );

    const stats = await getDashboardStats();

    return Response.json(stats);

  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    const isAuthError =
      error.message.includes("Authentication") ||
      error.message.includes("token") ||
      error.message.includes("Access denied");

    return Response.json(
      { error: error.message },
      { status: isAuthError ? 401 : 500 }
    );
  }
}