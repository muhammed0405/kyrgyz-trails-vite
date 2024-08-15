/** @format */

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
	price: string
	guide: number
}

export interface IComments {
	id: number
	user: string
	text: string
	created_at: string
}

export interface IBooking {
	additional_text: string
	username: string
	current_state: string
	id: string
	tour_id: string
	tourist_id: string
}
export interface ITourState {
	regions: IRegion[]
	tours: ITour[]
	tour: ITour
	loading: boolean
	error: string | null
	bookings: IBooking[]
}
