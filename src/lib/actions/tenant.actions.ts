"use server";

import { headers } from "next/headers";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/index";
import { IUser } from "@/interfaces/index";
import { IState } from "@/mytypes/index";
import { redirect } from "next/navigation";
import { IPaymentMethod } from "@/interfaces/index";

// GET DATA

export async function getTenants() {
  await dbConnect();

  const tenants = await User.find({ role: "tenant" })
    .select(
      "_id firstName lastName fullName email phoneNumbers bookings history paymentMethods tags notes createdBy"
    )
    .populate({
      path: "bookings",
      populate: {
        path: "roomId",
        select: "roomNumber",
      },
    })
    .populate("fullname");

  const tenantsAsObj = tenants.map((tenant: IUser) => tenant.toObject());

  // Ensure final data is fully JSON-serializable
  return tenantsAsObj;
}

export async function getTenantById(id: string) {
  await dbConnect();
  // FIXME: Identify why the booking history for 'Alice Smith' is populating with the 'tenant' history on the tenant/{id} page
  const tenant = await User.findOne({ _id: id, role: "tenant" })
    .populate("fullname")
    .populate("billingAddress")
    .populate("birthdate")
    .populate("phoneNumbers")
    .populate({
      path: "notes",
      populate: {
        path: "createdBy",
        select: "firstName lastName",
      },
      select: "content createdBy createdAt",
    })
    .populate({
      path: "bookings",
      populate: [
        {
          path: "roomId",
          select: "roomNumber",
        },
      ],
    })
    .populate({
      path: "history",
      populate: {
        path: "updatedBy",
        select: "fullname",
      },
    })
    .populate({
      path: "history",
      populate: {
        path: "updates",
        select: "field oldValue newValue",
      },
    })
    .populate({
      path: "paymentMethods",
      populate: {
        path: "method",
        select: "methodName",
      },
    })
    .select(
      "_id firstName lastName fullName email phoneNumbers bookings paymentMethods tags history notes createdBy"
    );

  if (!tenant) {
    console.log(id)
    console.log("Tenant not found, redirecting to /tenants");
    redirect("/tenants");
  }

  const tenantObj = JSON.parse(JSON.stringify(tenant.toObject()));
  return tenantObj;
}

// SET DATA

// Save tenant as a user

interface ITenantPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: Date;
  phone: string;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  state: IState;
  zip: string;
  tenantId?: string;
}

export async function saveTenant(payload: ITenantPayload) {
  await dbConnect();
  const reqHeaders = await headers();
  const userId = reqHeaders.get("x-user-id");

  const firstName = payload.firstName;
  const lastName = payload.lastName;
  const email = payload.email;
  const password = payload.password;
  const birthdate = payload.birthdate;
  const phoneNumbers = payload.phone;
  const addressLineOne = payload.addressLineOne;
  const addressLineTwo = payload.addressLineTwo;
  const city = payload.city;
  const state = payload.state;
  const postalCode = payload.zip;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !birthdate ||
    !phoneNumbers ||
    !addressLineOne ||
    !addressLineTwo ||
    !city ||
    !state ||
    !postalCode
  ) {
    return { error: true, message: "Please fill in all fields" };
  }

  try {
    // Check if a user with the same email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return { error: true, message: "Email already in use" };
    }

    // Check if a user with the same first and last name already exists
    const existingUserByName = await User.findOne({ firstName, lastName });
    if (existingUserByName) {
      return {
        error: true,
        message: "User with the same first and last name already exists",
      };
    }

    const billingAddress = {
      addressLineOne,
      addressLineTwo,
      city,
      state,
      postalCode,
    };

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      birthdate,
      phoneNumbers: [{ number: phoneNumbers, isPrimary: true }],
      billingAddress,
      role: "tenant",
      createdBy: userId,
    });

    await newUser.save();

    return { error: false, message: "Tenant created successfully" };
  } catch (error) {
    console.error("Error saving user:", error);
    return { error: true, message: (error as Error).message };
  }
}

export async function updateTenant(payload: ITenantPayload) {
  await dbConnect();
  const reqHeaders = await headers();
  const employeeId = reqHeaders.get("x-user-id");

  const firstName = payload.firstName;
  const lastName = payload.lastName;
  const email = payload.email;
  const password = payload.password;
  const birthdate = payload.birthdate;
  const phone = payload.phone;
  const addressLineOne = payload.addressLineOne;
  const addressLineTwo = payload.addressLineTwo;
  const city = payload.city;
  const state = payload.state;
  const zip = payload.zip;
  const tenantId = payload.tenantId;

  if (
    !firstName &&
    !lastName &&
    !email &&
    !password &&
    !birthdate &&
    !phone &&
    !addressLineOne &&
    !addressLineTwo &&
    !city &&
    !state &&
    !zip
  ) {
    return { error: true, message: "Please provide at least one update." };
  }

  try {
    const tenant = await User.findById(tenantId);

    if (!tenant) {
      return { error: true, message: "Tenant not found" };
    }

    if (firstName) tenant.firstName = firstName;
    if (lastName) tenant.lastName = lastName;
    if (email) tenant.email = email;
    if (birthdate) tenant.birthdate = birthdate;
    if (phone) tenant.phoneNumbers = [{ number: phone, isPrimary: true }];
    if (addressLineOne || addressLineTwo || state || zip) {
      tenant.billingAddress = {
        addressLineOne: addressLineOne
          ? addressLineOne
          : tenant.billingAddress.addressLineOne,
        addressLineTwo: addressLineTwo
          ? addressLineTwo
          : tenant.billingAddress.addressLineTwo,
        city: city ? city : tenant.billingAddress.city,
        state: state ? state : tenant.billingAddress.state,
        postalCode: zip ? zip : tenant.billingAddress.postalCode,
      };
    }
    tenant.updatedBy = employeeId;

    await tenant.save();

    return { error: false, message: "Tenant updated successfully" };
  } catch (error) {
    console.error("Error updating tenant:", error);
    return { error: true, message: (error as Error).message };
  }
}

export async function deleteTenant(id: string) {
  await dbConnect();

  const tenant = await User.findById(id);

  if (!tenant) {
    return { error: true, message: "Tenant not found" };
  }
  console.log(tenant);
  try {
    await tenant.deleteOne();
    return { error: false, message: "Tenant deleted successfully" };
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return { error: true, message: (error as Error).message };
  }
}
