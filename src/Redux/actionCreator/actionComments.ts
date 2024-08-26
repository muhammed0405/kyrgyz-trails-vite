/** @format */

import { showErrorToast } from "@/components/common/toaster/customToast"
import pb from "@/lib/pocketbase"
import { Dispatch } from "redux"
import { userActionsTypes } from "../actionTypes/actionTypes"
/** @format */

export const fetchComments =
	(tour_id: string) => async (dispatch: Dispatch) => {
		try {
			const fetchedComments = await pb.collection("comments").getList(1, 50, {
				filter: `tour = "${tour_id}"`,
			})
			console.log(fetchedComments)

			dispatch({
				type: userActionsTypes.FETCH_COMMENTS,
				payload: fetchedComments.items,
			})
		} catch (err) {
			console.error("Error fetching comments:", err)
			showErrorToast("Не удалось загрузить комментарии")
		}
	}

export const addComment = data => async () => {
	try {
		await pb.collection("comments").create(data)
	} catch (err) {
		console.log(err)
	}
}
