/** @format */

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { Provider } from "react-redux"
import { makeStore } from "./Redux/store.tsx"
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={makeStore}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
)
