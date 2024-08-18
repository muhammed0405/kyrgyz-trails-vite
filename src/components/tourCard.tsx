import { Link } from 'react-router-dom'
import tourPageStyles from "../styles/tourPage.module.scss"
const TourCard = ({key, tour}) => {
	return (
		<Link to={`/tour_details/${tour.id}`} key={tour.id}>
								<div
									className={tourPageStyles.tourCard}
									style={{
										backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${tour.id}/${tour.images[0]})`,
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center center",
										backgroundSize: "cover",
									}}
								>
									<h3>{tour.title}</h3>
									<p className={tourPageStyles.price}>Цена: {tour.price} сом</p>
								</div>
							</Link>
	);
};

export default TourCard;