import React from "react"
import "@/styles/global.css"
import { Pencil, Plus, Ellipsis, UserRoundPlus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-separator"
import Image from "next/image"
import { Button } from "react-day-picker"
import { DayPickerProvider, DayPicker } from "react-day-picker"
import { getTenantById } from "@/actions/tenant.actions"
import { mock } from "node:test"
import { IBooking, IChangeLog, ILog, INote } from "@/lib/types/interfaces"
import Link from "next/link"

// TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// TODO: how can we have the edit and view pages be the same but the URL change upon state change?

export const dynamic = "force-dynamic" // force the page to reload data upon navigation

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params
	const tenant = await getTenantById(id)

	const notes: INote[] = tenant.notes.map((note: INote) => note)
	const history: IChangeLog[] = await tenant.history.map(
		(log: IChangeLog) => log
	)

	return (
		<>
			{tenant ? (
				// if tenant exists show the tenant details
				<div className="text-[var(--text)] p-[30px]">
					<div className="rounded-md border bg-card text-card-foreground shadow p-6">
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-[var(--dark-button)] font-bold">
									{tenant.fullname}
								</h1>
								<p>{tenant.email}</p>
								<p>
									{
										tenant.phoneNumbers.find((phone: any) => phone.isPrimary)
											.number
									}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
							<Card className="bg-[var(--highlight)] rounded-md border p-4">
								<CardTitle className="flex flex-row items-center justify-between">
									<div className="flex justify-between items-center pb-3 w-full">
										<p className="font-bold text-[var(--text)]">DETAILS</p>
										<Pencil className="text-[var(--text)]" />
									</div>
								</CardTitle>
								<ScrollArea className="h-[200px] bg-[var(--light)] rounded-md border p-4">
									<CardContent>
										<div className="p-1">
											<div className="flex flex-row pb-4 ">
												<h2 className="text-[var(--text)] font-bold pr-12">
													Name:
												</h2>
												<div>
													<p className="pl-[50px] text-[var(--dark-button)]">
														{tenant.fullname}
													</p>
												</div>
											</div>
											<div className="flex flex-row pb-4">
												<h2 className="font-bold pr-14 text-[var(--text)]">
													DOB:
												</h2>
												<div>
													<p className="pl-[50px] text-[var(--dark-button)]">
														{tenant.birthdate || "N/A"}
													</p>
												</div>
											</div>
											<div className="flex flex-row pb-4">
												<h2 className="font-bold text-[var(--text)] pr-8">
													Address:
												</h2>
												<div>
													<p className="pl-[50px] text-[var(--dark-button)]">
														{tenant.billingAddress.addressLineOne}
													</p>
													<p className="pl-[50px] text-[var(--dark-button)]">
														{tenant.billingAddress.addressLineTwo}
													</p>
													<div>
														<p className="pl-[50px] text-[var(--dark-button)]">
															{`${tenant.billingAddress.city}, ${tenant.billingAddress.state}`}
														</p>
														<p className="pl-[50px] text-[var(--dark-button)]">
															{tenant.billingAddress.postalCode}
														</p>
													</div>
												</div>
												<Separator className="my-2" />
											</div>
										</div>
									</CardContent>
								</ScrollArea>
							</Card>

							<Card className="bg-[var(--dark-button)] rounded-md border p-4">
								<CardTitle className="flex flex-row items-center justify-between">
									<div className="flex justify-between items-center pb-3 w-full">
										<p className="font-bold text-[var(--light)]">NOTES</p>
										<Link href={`/dashboard/tenants/${tenant.id}/notes`}>
											<Plus className="text-[var(--light)] cursor-pointer" />
										</Link>
									</div>
								</CardTitle>
								<ScrollArea className="h-[200px] bg-[var(--light)] rounded-md border p-4">
									<CardContent>
										{notes && notes.length > 0 ? (
											notes.map((notes: any, index: number) => {
												return (
													<div className="p-4 w-full mx-20" key={index}>
														<div className="-ml-[100px] text-[var(--text)] mr-[100px]">
															{` "${notes.content}" `}
															<div>
																<p className="text-wrap text-[var(--dark-button)] text-end text-sm">{`${notes.createdBy.firstName} ${notes.createdBy.lastName}- ${notes.createdAt}`}</p>
															</div>
														</div>
														<Separator className="my-2" />
													</div>
												)
											})
										) : (
											<div>
												<p>No notes found</p>
											</div>
										)}
									</CardContent>
								</ScrollArea>
							</Card>
						</div>{" "}
						<div className="grid grid-cols-1 gap-6 mt-6">
							<Card className="bg-[var(--dark-button)] rounded-md border p-4">
								<CardTitle className="flex flex-row items-center justify-between">
									<div className="flex justify-between items-center pb-3 w-full">
										<p className="font-bold text-[var(--light)]">
											RESERVATION HISTORY
										</p>
									</div>
								</CardTitle>
								<ScrollArea className="h-[200px] bg-[var(--light)] text-[var(--text)] rounded-md border p-4">
									<CardContent>
										{tenant.bookings && tenant.bookings.length > 0 ? (
											tenant.bookings.map((booking: any, index: number) => {
												return (
													<div className="p-1" key={index}>
														<div>
															<div className="border rounded-md p-2 -ml-4 -mr-4 text-start text-wrap">
																{`${tenant.fullname} stayed in Room #${booking.roomId.roomNumber} 
                                from ${booking.checkIn} to ${booking.checkOut}`}
															</div>
														</div>
														<Separator className="my-2" />
													</div>
												)
											})
										) : (
											<div>
												<p>No reservations found</p>
											</div>
										)}
									</CardContent>
								</ScrollArea>
							</Card>

							<Card className="min-w-3xs bg-[var(--highlight)] rounded-md border p-4">
								<CardTitle className="flex flex-wrap flex-row items-center justify-between">
									<div className="flex justify-between items-center pb-3 w-full">
										<p className="font-bold">TRANSACTION HISTORY</p>
									</div>
								</CardTitle>
								<ScrollArea className="h-[200px] bg-[var(--light)] rounded-md border p-4">
									<CardContent>
										{history && history.length > 0 ? (
											history.map((logs: any, index: number) => {
												return (
													<div key={index}>
														<div className="flex flex-wrap items-center border rounded-md space-x-4">
															<Skeleton className="h-12 w-12 dark-circle rounded-full" />
															<div className="-mt-5 pr-5 mb-2">
																<Skeleton className="h-4 w-[250px]" />
																<Skeleton className="h-4 w-[200px]" />
																{`${logs.updatedBy.fullname} updated the following data on ${logs.updatedAt}`}
																<ul>
																	{logs.updates.map(
																		(log: ILog, index: number) => {
																			return (
																				<li
																					key={index}
																					className={`ms-9 list-disc`}
																				>
																					<p>
																						<b>{String(log.field)}</b> was
																						updated from{" "}
																						<i>{String(log.oldValue)}</i> to{" "}
																						<i>{String(log.newValue)}</i>
																					</p>
																				</li>
																			)
																		}
																	)}
																</ul>
															</div>
															<div className="flex flex-wrap absolute right-20">
																<Ellipsis />
															</div>
														</div>
														<Separator className="my-2" />
													</div>
												)
											})
										) : (
											<div>
												<p>No Transactions Found</p>
											</div>
										)}
									</CardContent>
								</ScrollArea>
							</Card>
						</div>
					</div>
				</div>
			) : (
				// if tenant does not exist show a not found message
				<div>
					<h1>Not Found</h1>
					<p>Could not find tenant with id: {id}</p>
				</div>
			)}
		</>
	)
}
