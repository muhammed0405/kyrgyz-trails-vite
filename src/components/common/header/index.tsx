/** @format */

import { NavLink } from "react-router-dom"
import styles from "../../../styles/header.module.scss"
import Logo from "../../../assets/img/logo.png"
import BurgerMenu from "../burgerMenu"

const Header = () => {
	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<NavLink to="/" className={styles.logo}>
					<img src={Logo} width={50} alt="Logo" />
					<span>Kyrgyz Trails</span>
				</NavLink>
				<div className={styles.navLinks}>
					<NavLink to="/tours">Туры</NavLink>
					<NavLink to="/hotels">Отели</NavLink>
					<NavLink to="/restaurants">Рестораны</NavLink>
					<NavLink to="/users">Юзеры</NavLink>
					<NavLink to="/guide_tours">История гидов</NavLink>
				</div>

				<div>
					<button className={styles.burgerBtn}>
						<BurgerMenu />
					</button>
				</div>
				<div className={styles.authLinks}>
					<NavLink to="/auth/login_user" className={styles.loginBtn}>
						Войти
					</NavLink>
					<NavLink to="/auth/register_user" className={styles.registerBtn}>
						Регистрация
					</NavLink>
				</div>
			</nav>
		</header>
	)
}

export default Header
