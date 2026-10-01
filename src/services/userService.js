import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function createUser(data) {
  await connectDB();

  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
  });

  const { passwordHash: _, ...safeUser } = user.toObject();

  return safeUser;
}
export async function loginUser(email, password) {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const { passwordHash: _, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    token,
  };
}
