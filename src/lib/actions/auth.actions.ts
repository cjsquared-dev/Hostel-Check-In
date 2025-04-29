"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function authenticate(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		await signIn("credentials", formData)
	} catch (error) {
		if (error instanceof AuthError) {
			const errorMessage = (error as any).message || "An error occurred";
			if (errorMessage.includes("CredentialsSignin")) {
				return "Invalid credentials";
			}
			return errorMessage;
		}
		throw error
	}
}
