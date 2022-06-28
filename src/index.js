import CodePointTrie from "./CodePointTrie"
import dataset14 from "../scripts/UNICODE_14-0_DO-NOT-EDIT.generated.json"
import dataset15 from "../scripts/UNICODE_15-0_DO-NOT-EDIT.generated.json"

// Enable future Unicode support?
const ENABLE_AUTOMATIC_UNICODE_15_SUPPORT_FROM_2023 = true

const dataset = (ENABLE_AUTOMATIC_UNICODE_15_SUPPORT_FROM_2023 && (new Date()).getUTCFullYear() > 2022)
	? dataset15
	: dataset14

const EmojiTrie = new CodePointTrie(dataset)
const ReversedEmojiTrie = new CodePointTrie(dataset.map(each => ({ ...each, codePoints: [...each.codePoints].reverse() })))

// Gets code points from a string.
function getCodePointsFromString(str) {
	return [...str].map(each => each.codePointAt(0))
}

// Gets the next emoji (from the start of a string)
export function atStart(substr) {
	// Scope substr to the current paragraph:
	const arr = substr.split("\n")
	substr = arr[0] // Start
	const codePoints = getCodePointsFromString(substr)
	return EmojiTrie.getMatch(codePoints)
}

// Gets the previous emoji (from the end of a string)
export function atEnd(substr) {
	// Scope substr to the current paragraph:
	const arr = substr.split("\n")
	substr = arr[arr.length - 1] // End
	const reversedCodePoints = getCodePointsFromString(substr).reverse()
	return ReversedEmojiTrie.getMatch(reversedCodePoints)
}
