import jwt from "jsonwebtoken";

export function authenticate(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Authentication required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Authentication token missing");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
export function authorize(...allowedRoles) {
  return function (user) {
    if (!allowedRoles.includes(user.role)) {
      throw new Error("Access denied");
    }

    return true;
  };
}
export function requireRole(request, ...allowedRoles) {
  const user = authenticate(request);

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Access denied");
  }

  return user;
}