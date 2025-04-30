// These styles apply to every route in the application
import React from "react"
import type { Metadata } from "next"
import "@/styles/global.css"

export const metadata: Metadata = {
	title: "Hostel Check-In",
	description: "Manage Hostel Check-In Operations",
  };

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>{children}</body>
		</html>
	)
}
