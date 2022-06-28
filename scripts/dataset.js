// $ node scripts/dataset.js
const fetch = require("node-fetch")
const fs = require("fs")

// Update as needed:
const VERSION = "15.0" // 2020-01-21
const URL = `https://unicode.org/Public/emoji/${VERSION}/emoji-test.txt`

;(async function main() {
	// Get the text database:
	let resp = null
	let text = ""
	try {
		resp = await fetch(URL)
		text = await resp.text()
	} catch (error) {
		throw new Error(`await fetch(URL)…await resp.text(): ${error}`)
	}
	// Parse the dataset:
	const dataset = text
		.split("# group: ")
		.slice(1) // Remove the header
		.map(each => {
			const [group] = each.split("\n", 1)
			const data = each
				.split("# subgroup: ")
				.slice(1) // Remove the header
				.map(each => {
					const [subgroup] = each.split("\n", 1)
					const data = each
						.split("\n")
						.slice(1) // Remove the header
						.filter(each => each.indexOf(" ; ") !== -1)
						.map(each => {
							const [lhs, rhs] = each.split(" ; ")
							const codePoints = lhs
								.split(/\s+/)                    // -> ["263A", "FE0F", ""]
								.filter(Boolean)                 // -> ["263A", "FE0F"]
								.map(each => parseInt(each, 16)) // -> [9786, 65039]
							const [status, , emoji, tag, ...description] = rhs
								.split(/\s+/)
							const datapoint = {
								group,      // "Smileys & Emotion"
								subgroup,   // "face-affection"
								codePoints, // [9786, 65039]
								status,     // "fully-qualified"
								emoji,      // "☺️"
								tag,        // "E0.6"
								description: description.join(" "), // "smiling face"
							}
							return datapoint
						})
					return data.flat()
				})
			return data.flat()
		})
		.flat()
	// Save the dataset:
	const name = `UNICODE_${VERSION.replace(".", "-")}_DO-NOT-EDIT.generated.json`
	const data = JSON.stringify(dataset, null, "  ")
	try {
		fs.writeFileSync(`./scripts/${name}`, `${data}\n`) // EOF
	} catch (error) {
		throw new Error(`fs.writeFile: ${error}`)
	}
})()
