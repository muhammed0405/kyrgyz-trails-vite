/** @format */

import { FaFacebookSquare, FaInstagramSquare, FaTelegram } from "react-icons/fa"
import "@/styles/footer.scss"
const Footer = () => {
	return (
		<footer className={"footer"}>
			<div className={"footerContent"}>
				<div className={"footerSection"}>
					<h3>О нас</h3>
					<p>Kyrgyz Trails - ваш надежный гид по Кыргызстану</p>
				</div>
				<div className={"footerSection"}>
					<h3>Контакты</h3>
					<p>Email: info@kyrgyztrails.kg</p>
					<p>Телефон: +996 777 888 999</p>
				</div>
				<div className={"footerSection"}>
					<h3>Следите за нами</h3>
					<div className={"socialIcons"}>
						<a href="#" className={"socialIcon"}>
							<FaFacebookSquare />
						</a>
						<a href="#" className={"socialIcon"}>
							<FaInstagramSquare />
						</a>
						<a href="#" className={"socialIcon"}>
							<FaTelegram />
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
