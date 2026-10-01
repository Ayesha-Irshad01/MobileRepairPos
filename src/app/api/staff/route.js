import { connectDB } from "@/lib/mongodb";
import Staff from "@/models/Staff";
import { requireRole } from "@/middleware/auth";
export async function POST(request) {
  try {
    await connectDB();
     requireRole(request, "Admin");
    const body = await request.json();

    const staff = await Staff.create(body);

    return Response.json(staff, { status: 201 });

  } catch (error) {
    console.error("CREATE STAFF ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    requireRole(request, "Admin");
    await connectDB();

    const staff = await Staff.find();

    return Response.json(staff);

  } catch (error) {
    console.error("GET STAFF ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}