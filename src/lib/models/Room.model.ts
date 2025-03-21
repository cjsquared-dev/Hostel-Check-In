import { Schema, model, models } from "mongoose"
import { IRoom } from "@/interfaces/index"

// Room Schema
export const roomSchema = new Schema<IRoom>(
	{
		roomType: {
			type: String,
			enum: ["shared", "single", "double", "suite", "private"],
			required: [true, "Room type is required"],
		},
		roomNumber: {
			type: Schema.Types.Mixed,
			required: [true, "Room number is required"],
			unique: [true, "Room number must be unique"],
			validate: {
				validator: (v: number | string) => {
					return /^(?:[1-9][0-9]{0,2}|[1-9][0-9]{0,2}[a-zA-Z])$/.test(
						v.toString()
					)
				},
				message: "{VALUE} is not a valid room number!",
			},
		},
		status: {
			type: String,
			enum: ["available", "occupied", "maintenance", "cleaning"],
			default: "available",
		},
		costPerDay: {
			type: Number,
			required: [true, "Cost per night is required"],
			get: (v: number) => v / 100, // Convert cost per night to cents
			set: (v: number) => v * 100, // Convert cost per night to dollars
		},
		deposit: {
			type: Number,
			required: [true, "Deposit amount is required"],
			get: (v: number) => v / 100, // Convert deposit amount to cents
			set: (v: number) => v * 100, // Convert deposit amount to dollars
		},
		name: {
			// TODO: update to roomName on interface, model, and in use on the front-end.
			type: String,
			required: false,
		},
		size: {
			type: Number,
			required: [true, "Room size is required"],
		},
		occupants: {
			type: [String], // Array of User IDs (uuid v4)
			ref: "User",
			// required: true, "Commenting out required to allow for empty array"
			default: [],
			validate: {
				validator: function (this: IRoom) {
					const count = this.occupants?.length || 0
					// Check if occupants array is less than room size
					return count <= this.size
				},
				message: "Room is full. Cannot add more occupants",
			},
		},
	},
	{ timestamps: true }
)

// SETTERS
// Convert `_id` to string automatically when calling `.toJSON()`
roomSchema.set("toJSON", {
	virtuals: true,
	getters: true,
	transform: (doc, ret) => {
		delete ret._id
		delete ret.__v
		return ret
	},
})
// Convert `_id` to string automatically when calling `.toObject()`
roomSchema.set("toObject", {
	virtuals: true,
	getters: true,
	transform: (doc, ret) => {
		delete ret._id
		delete ret.__v
		return ret
	},
})

export const Room = models.Room || model<IRoom>("Room", roomSchema)
