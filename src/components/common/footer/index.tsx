/** @format */

import React from "react"
import styles from "../../../styles/footer.module.scss"
import {
	FaFacebookSquare,
	FaInstagramSquare,
	FaTelegram,
} from "react-icons/fa"

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				<div className={styles.footerSection}>
					<h3>О нас</h3>
					<p>Kyrgyz Trails - ваш надежный гид по Кыргызстану</p>
				</div>
				<div className={styles.footerSection}>
					<h3>Контакты</h3>
					<p>Email: info@kyrgyztrails.kg</p>
					<p>Телефон: +996 777 888 999</p>
				</div>
				<div className={styles.footerSection}>
					<h3>Следите за нами</h3>
					<div className={styles.socialIcons}>
						<a href="#" className={styles.socialIcon}>
							<FaFacebookSquare />
						</a>
						<a href="#" className={styles.socialIcon}>
							<FaInstagramSquare />
						</a>
						<a href="#" className={styles.socialIcon}>
							<FaTelegram />
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
