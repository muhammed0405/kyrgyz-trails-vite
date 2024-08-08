/** @format */
"use client"
import  { useEffect } from "react"
// import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import { UserCard } from "../../components/common/userCard"
import { IUserType } from "../../Redux/Interfaces/interFaces"

export default function UsersList() {
	// const { getUsers } = UseTypedDispatch()
	const users = useTypedSelectorHook(state => state.user.users)

	useEffect(() => {
		// getUsers()
	}, [])

	return (
		<div>
			<h1>User List</h1>
			{users.map((user: IUserType) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	)
}
