import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const user = await User.findOne({
      resetPasswordToken: body.resetToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(
      body.newPassword,
      10
    );

    user.passwordHash = passwordHash;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return Response.json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}