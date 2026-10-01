import { loginUser } from "@/services/userService";

export async function POST(request) {
  try {
    const body = await request.json();

    const result = await loginUser(
      body.email,
      body.password
    );

    return Response.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });

  } catch (error) {
    console.error("LOGIN ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 401 }
    );
  }
}