/** @format */

import { ImSpinner3 } from "react-icons/im"
import styles from "../../styles/spinner.module.scss"
export default function Spinner() {
	return (
		<div>
			<ImSpinner3 className={styles.spinner} />
		</div>
	)
}
