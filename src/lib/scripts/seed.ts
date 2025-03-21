"use server"

// Used to access environment variables
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

// import mongoose, models, and interfaces
import mongoose from "mongoose"
import { dbConnect } from "@/lib/db"
import { Booking } from "@/models/Booking.model"
import { Payment } from "@/models/Payment.model"
import { Room } from "@/models/Room.model"
import { User } from "@/models/User.model"
import { IRoom } from "@/interfaces/room.interface"
import { IUser } from "@/interfaces/user.interface"
import { IPaymentMethod } from "@/interfaces/payment-method.interface"

// Import test data
import {
	usersData,
	roomsData,
	bookingsData,
	notesData,
	paymentMethodsData,
} from "@/server-utils/test-data"
import { PaymentMethod } from "../models/PaymentMethod.model"

async function dropAllCollections() {
	await dbConnect() // Ensure connection is established

	const db = mongoose.connection.db
	if (!db) {
		console.error("Database connection is not established.")
		process.exit(1)
	}

	const collections = await db.listCollections().toArray()

	for (const collection of collections) {
		try {
			await mongoose.connection.collection(collection.name).deleteMany({})
			console.log(`Cleared collection: ${collection.name}`)
		} catch (error) {
			console.error(`Error clearing collection ${collection.name}:`, error)
		}
	}
}

async function addAdminUser() {
	const adminUser = await new User(usersData[0]).save()
	const newAdminUser = await User.findOne({ _id: adminUser._id }).select(
		"fullname email role tags createdAt"
	)
	const finalAdminUser = newAdminUser.toObject()
	console.table(
		[finalAdminUser],
		["fullname", "email", "role", "tags", "createdAt"]
	)
	return finalAdminUser
}

async function seedUsers(admin: IUser) {
	const insertedUsers = await Promise.all(
		// Add all users except the first one who was created in the previous function step (addAdminUser)
		usersData.slice(1).map(async (user) => {
			// build new user
			const userObj = {
				...user,
				createdBy: admin.id,
			}
			const newUser = await new User(userObj).save()
			return newUser
		})
	)
	const formatedUsers = await Promise.all(
		insertedUsers.map(async (user) => {
			const populatedUser = await User.findOne({ _id: user.id })
				.populate(
					"createdBy",
					"fullname" // Populate createdBy field with fullname and email
				)
				.select("fullname email createdAt tags role") // Select only these fields
			return populatedUser.toObject()
		})
	)
	console.table(formatedUsers, [
		"fullname",
		"email",
		"role",
		"tags",
		"createdAt",
	])
	return formatedUsers
}

async function seedPaymentMethods(admin: IUser, users: IUser[]) {
	try {
		const newPayments = []

		for (let i = 0; i < users.length; i++) {
			// Step 1: Get a user
			const user = await User.findOne({ _id: users[i].id })

			// Step 2: Create Payment Method and reference the User
			const paymentMethod = await new PaymentMethod({
				...paymentMethodsData[i],
				userId: user.id,
				createdBy: user.id,
				updatedBy: admin.id,
			})

			await paymentMethod.save()

			// Step 3: Update User with the Payment Method reference
			user.paymentMethods.push(paymentMethod._id)
			user.updatedBy = admin.id
			await user.save()

			// Step 4: Store the created documents for logging
			newPayments.push(paymentMethod.toObject())
		}
		console.table(newPayments, [
			"id",
			"userId",
			"isPrimary",
			"method",
			"cardNumberLastFour",
			"expirationDate",
		])
		return newPayments
	} catch (error) {
		console.error("Failed to seed Payment methods:", error)
		throw error
	}
}

async function seedRooms(users: IUser[]) {
	const insertedRooms = await Promise.all(
		roomsData.map(async (room, i) => {
		  const newRoom = new Room(room);
		  if (users[i]) {
			newRoom.occupants.push(users[i].id);
		  }
		  return newRoom.save();
		})
	  );
	  
	const formatedRooms = await Promise.all(
		insertedRooms.map(async (room) => {
			const populatedRoom = await Room.findOne({ _id: room._id })
				.populate("occupants", "fullname email") // Populate bookedBy field with fullname and email
				.select("type roomNumber status deposit occupants") // Select only these fields
			return populatedRoom.toObject()
		})
	)

	console.table(formatedRooms, [
		"roomNumber",
		"status",
		"occupants",
		"deposit",
		"type",
	])
	return formatedRooms
}

async function seedBookingsWithPayments(
	admin: IUser,
	users: IUser[],
	paymentMethods: IPaymentMethod[],
	rooms: IRoom[]
) {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const newBookings = []
		const newPayments = []

		for (let i = 0; i < bookingsData.length; i++) {
			// Step 1: Create Booking (initially without a payment reference)
			const booking = new Booking({
				...bookingsData[i],
				bookedBy: users[i].id,
				createdBy: admin.id,
				roomId: rooms[i].id,
				depositAmount: rooms[i].deposit,
				updatedBy: admin.id, // TODO: remove updated by on new documents - add valditor to only throw an error if the document is updated and no udpatedBy is provided.
			})
			await booking.save({ session })

			// Step 2a: Find the Payment Method for the User
			const paymentMethod = paymentMethods.find(
				(method) => method.userId === users[i].id
			)

			if (!paymentMethod) {
				throw new Error("Payment method not found")
			}

			// Step 2b: Create Payment and reference the Booking
			const payment = new Payment({
				bookingId: booking._id,
				amount: rooms[i].deposit + 85.23,
				paidBy: users[i].id,
				createdBy: admin.id,
				paymentMethod: paymentMethod?.id,
			})
			await payment.save({ session })

			// Step 3: Update Booking with the Payment reference
			booking.payments.push(payment._id)
			booking.updatedBy = admin.id
			await booking.save({ session })

			// Step 4: Update User with the Booking reference
			const user = await User.findOne({ _id: users[i].id })
			user.bookings.push(booking._id)
			await user.save({ session })

			// Step 5: Store the created documents for logging
			newBookings.push(booking)
			newPayments.push(payment)
		}

		// Step 6: Commit transaction
		await session.commitTransaction()
		session.endSession()

		const formatedBookings = await Promise.all(
			newBookings.map(async (booking) => {
				const populatedBooking = await Booking.findOne({ _id: booking._id })
					.populate("bookedBy", "fullname email") // Populate bookedBy field with fullname and email
					.populate("createdBy", "fullname email") // Populate createdBy field with fullname and email
					.populate({
						// Populate payments field with paidBy field
						path: "payments",
						select: "amount paidBy",
						populate: {
							path: "paidBy",
							select: "fullname email",
						},
					})
					.select("roomId checkIn checkOut status depositAmount") // Select only these fields
				return populatedBooking.toObject()
			})
		)

		console.table(formatedBookings, [
			"bookedBy",
			"checkIn",
			"checkOut",
			"status",
			"depositAmount",
			"payments",
		])
		// return formatedBookings
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		console.error("Seeding failed:", error)
		throw error
	}
}

async function seedNotes(admin: IUser, users: IUser[]) {
	// Add all notes and link to the bookings
	const formatedNotes = await Promise.all(
		notesData.map(async (note, i) => {
			const user = await User.findOne({ _id: users[i].id })
			user.notes.push({
				...note,
				createdBy: admin.id,
			})
			await user.save()
			const userObject = await User.findOne({
				_id: user._id,
			}).populate({
				path: "notes",
				populate: {
					path: "createdBy",
					select: "fullname email",
				},
			})
			return userObject.notes[0].toObject()
		})
	)
	console.table(formatedNotes, ["content", "createdBy", "createdAt"])
}

async function updateBookingStatus(
	admin: IUser,
	oldStatus: string,
	newStatus: string
) {
	const selectedBooking = await Booking.findOne({ status: oldStatus })
	selectedBooking.status = newStatus
	selectedBooking.updatedBy = admin.id
	await selectedBooking.save()
	console.log(
		`Old Status: ${oldStatus}, New Status: ${selectedBooking.toObject().status}`
	) // Log the status change
}

async function updateUserSave(admin: IUser, id: string) {
	// Update User to create a history log (using pre-save method)
	const selectedUser = await User.findOne({ _id: id })
	selectedUser.lastName = "johnsoon"
	selectedUser.email = "the.johnson@test.com"
	selectedUser.updatedBy = admin.id
	const newPaymentMethod = new PaymentMethod({
		userId: selectedUser.id,
		isPrimary: false,
		method: "credit",
		cardNumberLastFour: "9999",
		expirationDate: new Date("2029-08-1"),
		cardBrand: "Discover",
		createdBy: admin.id,
		updatedBy: admin.id,
	})
	await newPaymentMethod.save()
	selectedUser.paymentMethods.push(newPaymentMethod._id)
	selectedUser.paymentMethods[0].cardNumber = "4321"
	selectedUser.paymentMethods[0].cardBrand = "Discover"
	selectedUser.updatedBy = admin.id
	await selectedUser.save()
	console.log("User fullname: ", selectedUser.toObject().fullname)
}

async function seedDatabase() {
	try {
		await dbConnect() // Connect to the database

		// Drop all collections
		await dropAllCollections() // Drop all collections
		console.log("Collections dropped\n")

		// Add the admin user
		const admin = await addAdminUser() // Add the admin user
		console.log("Admin user added successfully!\n")

		// Add all tenants
		const tenants = await seedUsers(admin) // Add all tenents
		console.log("Tenants added successfully!\n")

		// Add all payment methods
		const paymentMethods = await seedPaymentMethods(admin, tenants) // Add all payment methods
		console.log("Payment methods added successfully!\n")

		// Add all rooms
		const rooms = await seedRooms(tenants) // Add all rooms
		console.log("Rooms added successfully!\n")

		// Add all bookings and link to the tenants
		await seedBookingsWithPayments(admin, tenants, paymentMethods, rooms) // Add all bookings
		console.log("Bookings and Payments added successfully!\n")

		// Add all notes and link to the bookings
		await seedNotes(admin, tenants) // Add all notes
		console.log("Notes added to Bookings successfully!\n")

		// Update Booking status to create a history log
		await updateBookingStatus(admin, "pending", "paid") // Update Booking status
		console.log("Booking status updated successfully!\n")

		// Update User to create a history log (using pre-save method)
		await updateUserSave(admin, tenants[2].id)
		console.log("User updated successfully!\n")

		console.log("Database seeded successfully!")
		console.log("WOOT WOOT!")

		process.exit(0)
	} catch (error) {
		console.error("Error seeding database:", error)
		process.exit(1)
	}
}

// Run the seedDatabase function
seedDatabase()
