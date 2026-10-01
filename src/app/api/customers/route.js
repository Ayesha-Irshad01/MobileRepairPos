import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function POST(request) {
  console.log("POST /api/customers reached");

  try {
    console.log("Before connectDB");

    await connectDB();

    console.log("After connectDB");

    const body = await request.json();

    console.log("Request body:", body);

    const customer = await Customer.create(body);

    console.log("Customer created:", customer);

    return Response.json(customer, { status: 201 });

  } catch (error) {

    console.error("API ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find();

    return Response.json(customers);

  } catch (error) {

    console.error("GET CUSTOMERS ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}