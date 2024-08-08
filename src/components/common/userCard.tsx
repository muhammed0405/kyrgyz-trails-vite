/** @format */

import React from "react"
import { IUserType } from "../../Redux/Interfaces/interFaces"
interface UserCardProps {
	user: IUserType
}
export const UserCard: React.FC<UserCardProps> = ({ user }) => {
	return (
		<div className="user-card">
			<h2>{user.name}</h2>
			<p>Username: {user.username}</p>
			<p>Email: {user.email}</p>
			<p>Phone: {user.phone}</p>
			<p>Website: {user.website}</p>
			<h3>Address:</h3>
			<p>
				{user.address.street}, {user.address.suite}
			</p>
			<p>
				{user.address.city}, {user.address.zipcode}
			</p>
			<h3>Company:</h3>
			<p>{user.company.name}</p>
			<p>{user.company.catchPhrase}</p>
		</div>
	)
}
