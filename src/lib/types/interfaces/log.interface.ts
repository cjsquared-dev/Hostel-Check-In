import { Document } from "mongoose"

export interface ILog extends Document {
	field: string
	oldValue: unknown | { method?: string } | string | null; // Adjust based on your data
	newValue: unknown | { method?: string }| string | null; // Allow populated PaymentMethod
}
