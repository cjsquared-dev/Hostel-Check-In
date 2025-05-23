import { CallbackError, Schema, model, models } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { IUser, IBillingAddress } from "@/interfaces/index"
import { BillingAddressSchema } from "@/models/BillingAddress.schema" // require invidual import to avoid circular dependency
import { ChangeLogSchema } from "@/models/ChangeLog.schema" // require invidual import to avoid circular dependency
import { PhoneNumberSchema } from "@/models/PhoneNumber.schema" // require invidual import to avoid circular dependency
import { formatDate, logChanges } from "@/server-utils/helpers"
import { NoteSchema } from "@/models/Note.schema"
import { Booking } from "@/models/Booking.model"
import { PaymentMethod } from "./PaymentMethod.model"

// User Schema
const UserSchema = new Schema<IUser>(
	{
		_id: {
			type: String,
			default: uuidv4,
		},
		firstName: {
			type: String,
			required: [true, "First name is required"],
			minlength: [2, "First name must be at least 2 characters long"],
			maxlength: [50, "First name must be at most 50 characters long"],
			trim: true,
			set: (v: string) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // Capitalize firstName
			match: [
				/^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,50}$/,
				"First name contains invalid characters",
			],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			minlength: [2, "Last name must be at least 2 characters long"],
			maxlength: [50, "Last name must be at most 50 characters long"],
			trim: true,
			set: (v: string) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // Capitalize lastName
			match: [
				/^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,50}$/,
				"Last name contains invalid characters",
			],
		},
		fullname: {
			type: String,
			default: function (this: IUser): string {
				return `${this.firstName} ${this.lastName}`
			},
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				"Email is invalid",
			],
		},
		password: {
			type: String,
			required: false, // TODO: Create validation to require when role=employee not when role=tenant.
			select: false,
		},
		birthdate: {
			type: String,
		},
		phoneNumbers: [PhoneNumberSchema],
		role: {
			type: String,
			required: [true, "Role is required"],
			enum: {
				values: ["admin", "employee", "tenant"],
				message: "{VALUE} is not a valid role",
			},
		},
		bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
		paymentMethods: [{ type: Schema.Types.ObjectId, ref: "PaymentMethod" }],
		billingAddress: {
			type: BillingAddressSchema,
			validate: {
				validator: function (this: IUser, billingAddress: IBillingAddress) {
					if (this.role === "tenant") {
						return !!billingAddress // if the role is tenant, billing address is required
					}
					return this.role === "admin" || this.role === "employee"
				},
				message: "Billing address is required for tenants",
			},
		},
		tags: [
			{
				type: String,
				lowercase: true,
				min_length: [2, "Tag must be at least 2 characters long"],
				max_length: [20, "Tag must be at most 20 characters"],
				set: (v: string) => v.split(" ").join("-"), // Replace spaces with hyphens
				trim: true,
				validate: {
					// Checks the input for only letters, hyphens, and underscores
					validator: function (value) {
						return /^[A-Za-z\-_]+$/.test(value)
					},
					message: (props) =>
						`${props.value} contains invalid characters. Only letters, hyphens, and underscores are allowed.`,
				},
			},
		],
		notes: [NoteSchema],
		history: {
			type: [ChangeLogSchema],
			default: [],
			immutable: false, // Allow updates to the history array
		},
		createdBy: {
			type: String,
			ref: "User",
			// get: function (createdBy: IUser) { // Return only the fullname of the createdBy user
			// 	// Here, you return the fullName instead of the entire user object
			// 	return createdBy ? createdBy.fullname : null
			// },
		},
		updatedBy: {
			type: String, // Reference to the user (employee/admin) who updated the user
			ref: "User",
		},
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
	}
)

// TODO: Create a solution for capturing updates using the 'save' pre and post hooks to create a history of changes to User and Booking documents.
// NOTE: Only use the findOne(), new Model(), and save() methods to update documents to trigger the pre and post hooks

// MIDDLWARE

// Record document updates in the history array
// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
UserSchema.pre("save", logChanges)

// Delete all related bookings, payment methods, and notes before deleting the user
UserSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function (next) {
		try {
			// Populate related references before deletion
			await this.populate(["bookings", "paymentMethods", "notes"])

			// Delete all related bookings
			if (this.bookings.length > 0) {
				await Booking.deleteMany({ _id: { $in: this.bookings } })
			}

			// Delete all related payment methods
			if (this.paymentMethods.length > 0) {
				await PaymentMethod.deleteMany({ _id: { $in: this.paymentMethods } })
			}

			next()
		} catch (error) {
			next(error as CallbackError)
		}
	}
)

// Pre-save hook to hash password
UserSchema.pre<IUser>("save", async function (next) {
	if (!this.password) return next()
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10
		this.password = await bcrypt.hash(this.password, saltRounds)
	}
	return next()
})

// METHODS
// Check if the password is correct
UserSchema.methods.isCorrectPassword = async function (
	password: string
): Promise<boolean> {
	return bcrypt.compare(password, this.password)
}

// GETTERS
// Convert the 'createdAt' field to MMM DD, YYYY format e.g. Jan 30, 2025
UserSchema.path("createdAt").get(formatDate)
UserSchema.path("updatedAt").get(formatDate)
UserSchema.path("birthdate").get(formatDate)

// SETTERS

// Set the 'fullname" field to the concatenation of the updated 'firstName' field and the current 'lastName' field
UserSchema.path("firstName").set(function (this: IUser, firstName: string) {
	if (!this.fullname) return firstName
	const [_, lastName] = this.fullname.split(" ")
	this.fullname = firstName + " " + lastName
	return firstName
})

// Set the 'fullname" field to the concatenation of the updated 'lastName' field and the current 'firstName' field
UserSchema.path("lastName").set(function (this: IUser, lastName: string) {
	if (!this.fullname) return lastName
	const [firstName, _] = this.fullname.split(" ")
	this.fullname = firstName + " " + lastName
	return lastName
})

// Set toObject options to exclude _id and password fields automatically
UserSchema.set("toObject", {
	getters: true,
	virtuals: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
		delete ret.__v // Exclude __v (version) field
		delete ret.password // Exclude password field
	},
})

// Set toJSON options to exclude _id and password fields automatically
UserSchema.set("toJSON", {
	virtuals: true,
	getters: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
		delete ret.__v // Exclude __v (version) field
		delete ret.password // Exclude password field
	},
})

// VIRTUALS
// None

// Compile and export User model

export const User = models.User || model<IUser>("User", UserSchema)
