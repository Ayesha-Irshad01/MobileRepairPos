import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const device = await Device.create(body);

    return Response.json(device, { status: 201 });

  } catch (error) {
    console.error("CREATE DEVICE ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectDB();

    const devices = await Device.find();

    return Response.json(devices);

  } catch (error) {
    console.error("GET DEVICES ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}