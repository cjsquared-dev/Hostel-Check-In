"use server";

import { dbConnect } from "@/lib/db";
import { User } from "@/models/User.model";

// ----- GET DATA ----- //

// Get all tenants
export async function getTenants() {
  try {
    await dbConnect();

    const tenants = await User.find({ role: "tenant" })
      .populate("paymentMethods")
      .populate("bookings");

    if (!tenants)
      return {
        error: null,
        message: "No tenants found",
      };

    const plainTenants = tenants.map((t) => JSON.parse(JSON.stringify(t)));

    return plainTenants;
  } catch (error) {
    console.error("Unable to get Tenants:", error);
    return { error: error, message: "Unable to get Tenants" };
  }
}

// ----- SET DATA ----- //

// Register a new user
export async function registerUser(
  state: string | undefined,
  payload: FormData
) {
  await dbConnect();

  const firstName = payload.get("firstName") as string;
  const lastName = payload.get("lastName") as string;
  const email = payload.get("email") as string;
  const password = payload.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    return { error: true, message: "Please fill in all fields" };
  }

  // Password complexity requirements
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return {
      error: true,
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    };
  }

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: true, message: "Email already in use" };
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: "admin",
    });

    await newUser.save();

    return { error: false, message: "User created successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      error: true,
      message: "An error occurred while registering the user",
    };
  }
}
