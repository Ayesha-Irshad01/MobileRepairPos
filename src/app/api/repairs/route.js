import { connectDB } from "@/lib/mongodb";
import Repair from "@/models/Repair";
import { requireRole } from "@/middleware/auth";
import Customer from "@/models/Customer";
import Device from "@/models/Device";
import Staff from "@/models/Staff";
export async function POST(request) {
  try {
    requireRole(request, "Admin", "Receptionist", "Technician");

    await connectDB();

    const body = await request.json();

    // Current year
    const year = new Date().getFullYear();

    // Find the latest repair number for this year
    const lastRepair = await Repair.findOne({
      repairNo: new RegExp(`^REP-${year}-`),
    }).sort({ repairNo: -1 });

    let nextNumber = 1;

    if (lastRepair) {
      const lastNumber = parseInt(
        lastRepair.repairNo.split("-")[2],
        10
      );

      nextNumber = lastNumber + 1;
    }

    // Create human-friendly repair number
    const repairNo = `REP-${year}-${String(nextNumber).padStart(4, "0")}`;

    const repair = await Repair.create({
      ...body,
      repairNo,
    });

    return Response.json(repair, { status: 201 });

  } catch (error) {
    console.error("CREATE REPAIR ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const user = requireRole(
      request,
      "Admin",
      "Receptionist",
      "Technician"
    );
    await connectDB();

    const repairs = await Repair.find()
      .populate("customer")
      .populate("technician")
      .populate("device");
      console.log("REPAIRS FOUND:", repairs);

    return Response.json(repairs);

  } catch (error) {
    console.error("GET REPAIRS ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}