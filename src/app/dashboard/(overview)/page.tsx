import React from "react"
import "@/styles/global.css"
import { getTenants } from "@/actions/tenant.actions"
import { getVacantRoomsCount, getOccupiedRoomsCount } from "@/actions/room.actions"
import { BedDouble, CircleSlash2, CalendarCheck2 } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

export default async function Page() {
	const tenants = await getTenants()
	const occupiedRoomsCount = await getOccupiedRoomsCount();
	const vacantRoomsCount = await getVacantRoomsCount();

	function convertTenantIntoTableData(tenants: any) {
		return tenants.map((tenant: any) => {
			const primaryPhone =
				tenant.phoneNumbers.find((phone: any) => phone.isPrimary)?.number ||
				"N/A"
			const booking = tenant.bookings[0] // Assuming you want to display the first booking

			return {
				name: tenant.fullname,
				phone: primaryPhone,
				email: tenant.email,
				balance: tenant.balance,
				room: booking?.roomId?.roomNumber || "N/A",
				duration: booking ? `${booking.checkIn} - ${booking.checkOut}` : "N/A",
				checkInDate: booking?.checkIn || "N/A",
				checkOutDate: booking?.checkOut || "N/A",
				notes:
					booking?.notes.map((note: any) => note.content).join(", ") || "N/A",
			}
		})
	}

	return (
		<div>
			<h1 className="pt-[10px] pl-[30px] pb-[40px] font-bold">DASHBOARD</h1>
			<div className="card-container">
				<Card className="card">
					<CardTitle>
						<div className="card-decoration-dark flex items-center justify-center">
							<BedDouble className="icon-light" />
						</div>
					</CardTitle>
					<CardContent>
						<div>
							<div>
								<h3>Occupied Rooms</h3>
								<h1 className="text-[42px]">{occupiedRoomsCount}</h1>
							</div>
							<div className="progress"></div>
						</div>
					</CardContent>
				</Card>

				<Card className="card">
					<CardTitle>
						<div className="card-decoration-light flex items-center justify-center">
							<CircleSlash2 className="icon-dark" />
						</div>
					</CardTitle>
					<CardContent>
						<div>
							<div>
								<h3>Vacant Rooms</h3>
								<h1 className="text-[42px]">{vacantRoomsCount}</h1>
							</div>
							<div className="progress"></div>
						</div>
					</CardContent>
				</Card>

				<Card className="card">
					<CardTitle>
						<div className="card-decoration-dark flex items-center justify-center">
							<CalendarCheck2 className="icon-light" />
						</div>
					</CardTitle>
					<CardContent>
						<div>
							<div>
								<h3>Rooms to Check-Out</h3>
								<h1 className="text-[42px]">5</h1>
							</div>
							<div className="progress"></div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="rounded-xl table-container border bg-card text-card-foreground shadow">
				<h1 className="pt-[10px] pb-[40px]">Tenants</h1>
				<Table>
					<TableHeader className="table-row-header">
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Room</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Check-In Date</TableHead>
							<TableHead>Check-Out Date</TableHead>
							<TableHead>Notes</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{convertTenantIntoTableData(tenants).map(
							(rowData: any, index: number) => {
								return (
									<TableRow key={index} className="table-data-row">
										<TableCell>{rowData.name}</TableCell>
										<TableCell>{rowData.room}</TableCell>
										<TableCell>{rowData.duration}</TableCell>
										<TableCell>{rowData.checkInDate}</TableCell>
										<TableCell>{rowData.checkOutDate}</TableCell>
										<TableCell>{rowData.notes}</TableCell>
										<TableCell>. . .</TableCell>
									</TableRow>
								)
							}
						)}
					</TableBody>
					<TableCaption>A list of your recent customers.</TableCaption>
				</Table>
			</div>
		</div>
	)
}
