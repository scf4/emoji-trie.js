class CodePointTrie {
	constructor(dataset) {
		const trie = {}
		for (let y = 0; y < dataset.length; y++) {
			let ref = trie
			for (let x = 0; x < dataset[y].length; x++) {
				const atEnd = x + 1 === dataset[y].length
				if (!atEnd) {
					// Do not overwrite sequence paths:
					if (!ref[dataset[y][x]]) {
						ref[dataset[y][x]] = {}
					}
				} else {
					// Throw on repeat sequences:
					if (ref[dataset[y][x]] && typeof ref[dataset[y][x]] === "string") {
						throw new Error("An unexpected repeat sequence occurred")
					}
					const string = String.fromCodePoint(...dataset[y])
					ref[dataset[y][x]] = { string }
				}
				ref = ref[dataset[y][x]]
			}
		}
		Object.assign(this, {
			trie,
		})
	}
	// FIXME: Return greatest (not least) combination
	matches(codePoints) { // Expects an array of numbers
		let ref = this.trie
		for (let index = 0; index < codePoints.length; index++) {
			const res = ref[codePoints[index]]
			if (!res || res.string) {
				return res.string || ""
			}
			ref = res
		}
		return ""
	}
}

module.exports = CodePointTrie