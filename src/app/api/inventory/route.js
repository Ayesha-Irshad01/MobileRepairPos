import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const item = await Inventory.create(body);

    return Response.json(item, { status: 201 });

  } catch (error) {
    console.error("CREATE INVENTORY ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectDB();

    const items = await Inventory.find();

    return Response.json(items);

  } catch (error) {
    console.error("GET INVENTORY ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}