import styles from '../../styles/search.module.scss'
const Search = () => {

	return (
		
			<div className={styles.searchBar}>
					<input type="text" placeholder="Куда вы хотите поехать?" />
					<button>Искать</button>
				</div>
		
	);
};

export default Search;
