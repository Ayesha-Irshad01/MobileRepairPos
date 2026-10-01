import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const user = await User.findOne({
      email: body.email,
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    return Response.json({
      message: "Password reset token generated",
      resetToken,
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}