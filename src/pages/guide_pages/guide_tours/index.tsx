/** @format */

'use client'
import React, { useEffect } from 'react'
import { useTypedSelectorHook } from '../../../Redux/customHooks/useTypedSelectorHook'
// import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"

interface Tour {
	id: string
	name: string
	description: string
	price: number
	duration: number
	// Add other tour properties as needed
}

const GuideTours: React.FC = () => {
	// const dispatch = UseTypedDispatch()
	const { guideTours, loading, error } = useTypedSelectorHook(
		(state) => state.guide.guideTours
	)
	// const { user } = useTypedSelectorHook(state => state.auth)

	useEffect(() => {
		// if (user && user.id) {
		// 	dispatch(getGuideTours(user.id))
		// }
	}, [])

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>
	if (!guideTours || guideTours.length === 0)
		return <div>You haven't added any tours yet.</div>

	return (
		<div className={guideTours}>
			<h1>My Tours</h1>
			<ul>
				{guideTours.map((tour: Tour) => (
					<li key={tour.id} className={tourItem}>
						<h2>{tour.name}</h2>
						<p>{tour.description}</p>
						<p>Price: ${tour.price}</p>
						<p>Duration: {tour.duration} hours</p>
						{/* Add more tour details as needed */}
					</li>
				))}
			</ul>
		</div>
	)
}

export default GuideTours
