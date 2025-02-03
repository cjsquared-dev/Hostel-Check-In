function setDate(days: number): Date {
	return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

// Users data
const usersData = [
	// 1 admin, 5 tenants, 6 total
	{
		// admin
		firstName: "John",
		lastName: "Doe",
		phoneNumbers: [
			{
				countryCode: "+1",
				number: "555-555-5555",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "john@test.com",
		password: "password123",
		role: "admin",
		bookings: [],
		tags: ["boss"],
		history: [],
		createdBy: "",
	},
	{
		// tenant #1
		firstName: "Jane",
		lastName: "Doe",
		phoneNumbers: [
			{
				countryCode: "+1",
				number: "222-222-2222",
				isMobile: true,
				isPrimary: true,
			},
			{
				countryCode: "+1",
				number: "888-888-8888",
				isMobile: false,
				isPrimary: false,
			},
		],
		email: "jane@test.com",
		password: "password123",
		role: "tenant",
		paymentMethods: [],
		bookings: [],
		tags: ["delinquent"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #2
		firstName: "Alice",
		lastName: "Smith",
		phoneNumbers: [
			{
				countryCode: "+1",
				number: "444-444-4444",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "alice@test.com",
		password: "password123",
		role: "tenant",
		paymentMethods: [],
		bookings: [],
		tags: ["regular"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #3
		firstName: "Sam",
		lastName: "Jones",
		phoneNumbers: [
			{
				countryCode: "+1",
				number: "777-777-7777",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "sam@test.com",
		password: "password123",
		role: "tenant",
		paymentMethods: [],
		bookings: [],
		tags: ["regular"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #4
		firstName: "Katie",
		lastName: "Ames",
		phoneNumbers: [
			{
				countryCode: "+1",
				number: "800-222-3333",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "katie@test.com",
		password: "password123",
		role: "tenant",
		paymentMethods: [],
		bookings: [],
		tags: ["regular"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #5
		firstName: "Jason",
		lastName: "Borne",
		phoneNumbers: [
			{
				countryCode: "+1",
				number: "999-999-9999",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "jason@test.com",
		password: "password123",
		role: "tenant",
		paymentMethods: [],
		bookings: [],
		tags: ["secret-agent"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
]

const paymentMethodsData = [
	// 8 payment methods, only 2 tenants get 2 payment methods each
	{
		isPrimary: true,
		method: "cash",
	},
	{
		isPrimary: true,
		method: "bank",
		routingNumber: "123456789",
		accountNumber: "987654321",
		bankName: "US Bank",
	},
	{
		isPrimary: true,
		method: "credit",
		cardBrand: "Visa",
		cardNumberlastFour: "3456",
		expirationDate: new Date(new Date(new Date().getFullYear() + 2, 5, 31)),
	},
	{
		isPrimary: true,
		method: "credit",
		cardBrand: "Mastercard",
		cardNumberlastFour: "1122",
		expirationDate: new Date(new Date(new Date().getFullYear() + 2, 11, 31)),
	},
	{
		isPrimary: true,
		method: "credit",
		cardBrand: "Amex",
		cardNumberlastFour: "1233",
		expirationDate: new Date(new Date(new Date().getFullYear() + 5, 2, 31)),
	},
	{
		isPrimary: false,
		method: "credit",
		cardBrand: "Discover",
		cardNumberlastFour: "6677",
		expirationDate: new Date(new Date(new Date().getFullYear() + 4, 5, 31)),
	},
	{
		isPrimary: true,
		method: "check",
		routingNumber: "123456789",
		accountNumber: "987654321",
		bankName: "US Bank",
		checkNumber: "10021",
	},
	{
		isPrimary: false,
		method: "credit",
		cardBrand: "Visa",
		cardNumberlastFour: "4561",
		expirationDate: new Date(new Date(new Date().getFullYear() + 2, 11, 31)),
	},
]

// Rooms data for Bookings
const roomsData = [
	// 5 rooms, one for each tenant
	{
		roomType: "shared",
		roomNumber: "101A",
		status: "occupied",
		costPerDay: 50.0,
		deposit: 100.0,
		name: "Room 101A",
		size: 4,
		occupants: [],
	},
	{
		roomType: "shared",
		roomNumber: "101B",
		status: "occupied",
		costPerDay: 50.0,
		deposit: 100.0,
		name: "Room 101B",
		size: 4,
		occupants: [],
	},
	{
		roomType: "single",
		roomNumber: "102",
		status: "occupied",
		costPerDay: 85.0,
		deposit: 300.0,
		name: "Room 102",
		size: 1,
		occupants: [],
	},
	{
		roomType: "double",
		roomNumber: "103",
		status: "occupied",
		costPerDay: 115.0,
		deposit: 500.0,
		name: "Room 103",
		size: 2,
		occupants: [],
	},
	{
		roomType: "suite",
		roomNumber: "104",
		status: "occupied",
		costPerDay: 150.0,
		deposit: 800.0,
		name: "Room 104",
		size: 2,
		occupants: [],
	},
]

// Bookings data
const bookingsData = [
	// 5 bookings, one for each tenant
	{
		roomId: "",
		checkIn: setDate(-4),
		checkOut: setDate(3),
		status: "paid",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(-1),
		checkOut: setDate(5),
		status: "pending",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(-2),
		checkOut: setDate(30),
		status: "paid",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(0),
		checkOut: setDate(7),
		status: "pending",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(3),
		checkOut: setDate(10),
		status: "booked",
		DepositAmount: null,
		depositReturned: false,
	},
]

// Notes data for Bookings
const notesData = [
	// 5 notes, one for each booking
	{
		content: "Tenant is delinquent",
		createdBy: "",
	},
	{
		content: "Tenant is regular",
		createdBy: "",
	},
	{
		content: "Needs fresh sheets",
		createdBy: "",
	},
	{
		content: "Tenant is regular",
		createdBy: "",
	},
	{
		content: "North window is broken. Needs repair",
		createdBy: "",
	},
]

export { usersData, paymentMethodsData, roomsData, bookingsData, notesData }
