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
	id: string
	location: number
	comments: IComments[]
	title: string
	images: string[]
	price: number
	guide_id: string
	created: string
}

export interface IComments {
	id: number
	user: string
	comment: string
	tour: string
	star: number
	created: string
}

export interface IBooking {
	additional_text: string
	username: string
	current_state: string
	id: string
	tour: string
	tourist: string
}
export interface ITourState {
	regions: IRegion[]
	tours: ITour[]
	tour: ITour
	loading: boolean
	error: string | null
	bookings: IBooking[]
	comments: IComments[]
}
