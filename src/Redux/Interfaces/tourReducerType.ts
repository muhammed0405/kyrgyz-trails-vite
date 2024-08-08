export interface IRegion {
	id: number

	name: string
	shortDescription: string
	longDescription: string
	imageUrl: string
	rating: number
	reviews: number
}

export interface ITour {
	id: number
	location: number
	comments: IComments[]

	title: string
	images: string
	included: string
	not_included: string
	price: string
	guide: number
	description: string
	itinerary: IItinerary[]
	place_to_live: IPlaceToLive[]
}

export interface IItinerary {
	place: string
	description: string
	images: string
}

export interface IPlaceToLive {
	description: string
	images: string
}
export interface IComments {
	id: number
	user: string
	text: string
	created_at: string
}
export interface ITourState {
	regions: IRegion[]
	tours: ITour[]
	loading: boolean
	error: string | null
}
