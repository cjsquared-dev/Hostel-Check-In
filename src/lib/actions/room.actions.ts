import { dbConnect } from "@/lib/db"
import { Room } from "@/models/Room.model"
import { IRoom } from "@/interfaces/index"

//GET DATA

export async function getRooms() {
	await dbConnect()

	const rooms = await Room.find().populate("occupants", "fullname")

	const roomsAsObj = rooms.map((room: IRoom) => room.toObject())

	// Ensure final data is fully JSON-serializable
	return roomsAsObj
}

export async function getRoomById(roomId: string) {
	await dbConnect()

	const room = await Room.findById(roomId)
		.populate("occupants", "fullname")
		.select("roomType roomNumber status costPerDay deposit name size occupants")

	const roomObj = room.toObject()
	return roomObj
}

// Function to get the number of occupied rooms
export async function getOccupiedRoomsCount() {
	await dbConnect();
  
	const occupiedRoomsCount = await Room.countDocuments({ status: "occupied" });
  
	return occupiedRoomsCount;
  }

// Function to get the number of vacant rooms
export async function getVacantRoomsCount() {
	await dbConnect();
	const vacantRoomsCount = await Room.countDocuments({ status: "available" });
	return vacantRoomsCount;
}

//SET DATA

export async function createRoom(payload: IRoom) {
	await dbConnect()

	const roomObj = {
		roomType: payload.roomType,
		roomNumber: payload.roomNumber,
		status: payload.status,
		costPerDay: payload.costPerDay,
		deposit: payload.deposit,
		name: payload.name, // TODO: update to roomName on interface, model, and in use on the front-end.
		size: payload.size,
		occupants: payload.occupants,
	}

	const newRoom = new Room(roomObj)
	const room = await newRoom.save()
	return room.toObject()
}

export async function updateRoom(roomId: string, payload: IRoom) {
	await dbConnect()

	// TODO: replace 'findByIdAndUpdate' with 'find() and save()'
	// to use the 'pre' and 'post' hooks for history logging

	if (!roomId) {
		throw new Error("Room ID is required")
	}

	const {
		roomType,
		roomNumber,
		status,
		costPerDay,
		deposit,
		name,
		size,
		occupants,
	} = payload

	if (
		!roomType &&
		!roomNumber &&
		!status &&
		!costPerDay &&
		!deposit &&
		!name &&
		!size &&
		!occupants
	) {
		throw new Error("No data provided to update room")
	}

	const room = await Room.findById(roomId)
	if (!room) {
		throw new Error("Room not found")
	}

	room.roomType = roomType ? roomType : room.roomType
	room.roomNumber = roomNumber ? roomNumber : room.roomNumber
	room.status = status ? status : room.status
	room.costPerDay = costPerDay ? costPerDay : room.costPerDay
	room.deposit = deposit ? deposit : room.deposit
	room.name = name ? name : room.name // TODO: update to roomName on interface, model, and in use on the front-endname ? name : room.name
	room.size = size ? size : room.size
	room.occupants = occupants ? occupants : room.occupants

	await room.save()

	// room.set() // TODO: Test this funcitonality effeciently updating the room object.
	// Object.assign(room, data) // TODO: Test this funcitonality effeciently updating the room object.
	return room.toObject()
}


