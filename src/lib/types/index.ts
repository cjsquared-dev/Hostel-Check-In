// Custom types for interfaces and schemas
export type IRoomType = "shared" | "single" | "double" | "suite" | "private"

export type IRoomStatus = "available" | "occupied" | "maintenance" | "cleaning"

export type IRole = "admin" | "employee" | "tenant"

export type IBookingStatus = "paid" | "pending" | "booked" | "due"

export type IPaymentType =
	| "cash"
	| "credit"
	| "debit"
	| "bank"
	| "money order"
	| "check"

export type ICardBrand = "Visa" | "Mastercard" | "Amex" | "Discover"

export type IMethod = "cash" | "credit" | "debit" | "bank" | "check"

export type IState =
	| "AL"
	| "AK"
	| "AZ"
	| "AR"
	| "CA"
	| "CO"
	| "CT"
	| "DE"
	| "FL"
	| "GA"
	| "HI"
	| "ID"
	| "IL"
	| "IN"
	| "IA"
	| "KS"
	| "KY"
	| "LA"
	| "ME"
	| "MD"
	| "MA"
	| "MI"
	| "MN"
	| "MS"
	| "MO"
	| "MT"
	| "NE"
	| "NV"
	| "NH"
	| "NJ"
	| "NM"
	| "NY"
	| "NC"
	| "ND"
	| "OH"
	| "OK"
	| "OR"
	| "PA"
	| "RI"
	| "SC"
	| "SD"
	| "TN"
	| "TX"
	| "UT"
	| "VT"
	| "VA"
	| "WA"
	| "WV"
	| "WI"
	| "WY"
