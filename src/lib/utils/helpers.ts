// For Mongoose Model Pre and Post Hook Functions
import { Query } from "mongoose"
import { ObjectId } from "mongodb"

// Functions to help with logging changes to documents

// Middleware to get the old document before updating
export async function getOldDoc(
	this: Query<any, any>,
	next: (err?: any) => void
	// Callback to move to the next middleware
) {
	// Fetch the document manually before updating
	const oldDoc = await this.model.findOne(this.getQuery())
	// Save the old document to the options object
	this.setOptions({ _oldDoc: oldDoc })

	next()
}

// Middleware to log changes to the document history
export async function logChanges(
	this: Query<any, any>,
	doc: any,
	next: (err?: any) => void
) {
	// If the document was updated, log the changes
	if (this.getOptions()._oldDoc && doc) {
		const oldDoc = this.getOptions()._oldDoc.toObject()
		const newDoc = doc.toObject()
		const changes = []

		// Fields to ignore when logging changes
		const blockedFields = new Set(["history", "payments", "notes"])

		// Compare the current document with the old document
		for (const key in newDoc) {
			// Skip the history field
			if (blockedFields.has(key)) continue

			// If the field is an Array, loop through and compare the objects in the array
			if (newDoc[key] instanceof Array) {
				console.log(
					`Array: key: ${key}, value: ${newDoc[key]}, typeOf: ${typeof newDoc[
						key
					]}`
				)
				// const newDocArray = doc[key].toString()
				// const oldDocArray = oldDoc[key].toString()
				// for (const index in newDocArray) {
				//   if (oldDocArray[index] !== newDocArray[index]) {
				//     changes.push({
				//       field: `${key}.${index}`,
				//       oldValue: oldDocArray[index],
				//       newValue: newDocArray[index],
				//     })
				//   }
				// }
				continue
			} else if (newDoc[key] instanceof ObjectId) {
				console.log(
					`MongoDB ObjectId: key: ${key}, value: ${
						newDoc[key]
					}, typeOf: ${typeof newDoc[key]}`
				)
				if (oldDoc[key].toString() !== newDoc[key].toString()) {
					changes.push({
						field: key,
						oldValue: oldDoc[key],
						newValue: doc[key],
					})
				}
				continue
			} else if (typeof newDoc[key] === "object") {
				console.log(
					`Normal Object: key: ${key}, value: ${
						newDoc[key]
					}, typeOf: ${typeof newDoc[key]}`
				)
				// const newDocSubObject = doc[key].toString()
				// const oldDocSubObject = oldDoc[key].toString()
				// for (const subKey in newDocSubObject) {
				// 	if (oldDocSubObject[subKey] !== newDocSubObject[subKey]) {
				// 		changes.push({
				// 			field: `${key}.${subKey}`,
				// 			oldValue: oldDocSubObject[subKey],
				// 			newValue: newDocSubObject[subKey],
				// 		})
				// 	}
				// }
				continue
			} else if (oldDoc[key] !== newDoc[key]) {
				console.log(
					`Yes change to ${key}, value: ${doc[key]}, typeOf: ${typeof doc[key]}`
				)
				changes.push({
					field: key,
					oldValue: oldDoc[key],
					newValue: doc[key],
				})
			} else {
				console.log(`No change to: ${key}`)
				continue
			}
		}

		// If there are no changes, move to the next middleware
		if (changes.length === 0) {
			console.log("No changes")
			return next()
		}

		console.log("Changes: ", changes)

		// If there are changes, add them to the history array
		doc.history.push({
			updates: changes,
			updatedBy: this.getOptions().userId,
		})

		await doc.save()
		next()
	}
}

// Setter function to format dates for createdAt and updatedAt fields
export function formatDate(v: Date): string {
	const date = new Date(v)
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	})
}

// Function to check if a string is a valid MongoDB ObjectId
export function isStrictValidObjectId(value: string): boolean {
	const isValid = ObjectId.isValid(value)
	console.log(`isValid: ${isValid}`)

	const isStrict = new ObjectId(value).toString() === value
	console.log(`isStrict: ${isStrict}`)
	return isValid && isStrict
}
