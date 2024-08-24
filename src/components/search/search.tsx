/** @format */

import '@/styles/search.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'
const Search = () => {
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const [searchValue, setSearchValue] = useState<string>('')

	const search = searchValue
		? tours?.items?.filter((el) =>
				el.title?.toLowerCase().includes(searchValue.toLowerCase())
		  )
		: []

	const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	return (
		<div
			style={{
				zIndex: 1,
			}}
			className={'searchBar'}
		>
			<div className={search}>
				<input
					className={'searchInput'}
					type='text'
					placeholder='Куда вы хотите поехать?'
					onChange={handleInputOnChange}
				/>
			</div>

			{search.length > 0 ? (
				<div className={'searchedResultsWrapper'}>
					{search.map((t) => (
						<div key={t.id} className={'searchedResult'}>
							<Link to={`/tour_details/${t.id}`} className={'link'}>
								{t.title}
							</Link>
						</div>
					))}
				</div>
			) : (
				searchValue && (
					<div className={'noResults'}>
						<p>No results found</p>
					</div>
				)
			)}
		</div>
	)
}

export default Search
