/** @format */

import { Link } from "react-router-dom"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import styles from "../../styles/search.module.scss"
import { useState } from "react"

const Search = () => {
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const [searchValue, setSearchValue] = useState<string>("")

	const search = searchValue
		? tours?.items?.filter(el =>
				el.title?.toLowerCase().includes(searchValue.toLowerCase())
		  )
		: []

	const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	return (
		<div className={styles.searchBar}>
			<div className={styles.search}>
				<input
				className={styles.searchInput}
					type="text"
					placeholder="Куда вы хотите поехать?"
					onChange={handleInputOnChange}
				/>
			</div>

			{search.length > 0 ? (
				<div className={styles.searchedResultsWrapper}>
					{search.map(t => (
						<div key={t.id} className={styles.searchedResult}>
							<Link to={`/tour_details/${t.id}`} className={styles.link}>
								{t.title}
							</Link>
						</div>
					))}
				</div>
			) : (
				searchValue && (
					<div className={styles.noResults}>
						<p>No results found</p>
					</div>
				)
			)}
		</div>
	)
}

export default Search
