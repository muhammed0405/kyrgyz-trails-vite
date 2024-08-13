/** @format */

import { useNavigate } from "react-router-dom"
import PocketBase from "pocketbase"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)

const VerifyEmail = () => {
	const { email, password, isAuth } = useTypedSelectorHook(state => state.auth)
	const { loginAfterVerification } = UseTypedDispatch()
	const navigate = useNavigate()

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		checkVerification({ email, password })
	// 	}, 10000)
	// }, [email])

	if (isAuth) {
		navigate("/")
	}

	return (
		<div>
			<h1>Verify Your Email</h1>
			<p>
				We have sent a verification link to your email: {email}. Please check
				your inbox and verify your email.
			</p>

			<h1>Если подтвердили свою почту нажмите на кнопку</h1>
			<button onClick={() => loginAfterVerification(email, password)}>
				Проверил{" "}
			</button>
		</div>
	)
}

export default VerifyEmail
