import { createUser } from "@/services/userService";

export async function POST(request) {
  try {
    const body = await request.json();

    const user = await createUser(body);

    return Response.json(user, { status: 201 });

  } catch (error) {
    console.error("CREATE USER ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}