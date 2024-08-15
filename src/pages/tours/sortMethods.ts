/** @format */

// sortMethods.js

export const sortTours = (
	items,
	sortType,
	sortByPriceFrom,
	sortByPriceTo,
	currentLocation
) => {
	if (!items || !Array.isArray(items)) return []

	// First, filter by price range and location
	let filteredItems = items.filter(
		item =>
			item.price >= Number(sortByPriceFrom) &&
			item.price <= Number(sortByPriceTo) &&
			(currentLocation === "all" || item.location === currentLocation)
	)

	// Then, sort the filtered items
	switch (sortType) {
		case "asc":
			return filteredItems.sort((a, b) => (a.price || 0) - (b.price || 0))
		case "dsc":
			return filteredItems.sort((a, b) => (b.price || 0) - (a.price || 0))
		case "A-Z":
			return filteredItems.sort((a, b) => a.title.localeCompare(b.title))
		case "Z-A":
			return filteredItems.sort((a, b) => b.title.localeCompare(a.title))
		default:
			return filteredItems
	}
}
