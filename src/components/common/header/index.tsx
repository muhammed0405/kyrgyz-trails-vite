/** @format */

import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import styles from "../../../styles/header.module.scss"
import Logo from "../../../assets/img/logo.png"
import BurgerMenu from "../burgerMenu"
import { UseTypedDispatch } from "../../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../../Redux/customHooks/useTypedSelectorHook"
import pb from "../../../lib/pocketbase"

const Header: React.FC = () => {
	const { isLoggedIn } = useTypedSelectorHook(state => state.auth)
	const { logout } = UseTypedDispatch()
	const navigate = useNavigate()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [roleOfUser, setRoleOfUser] = useState(null)
	const handleLogout = () => {
		logout()
		navigate("/")
		setIsMenuOpen(false)
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		const roleOfUser =
			localStorage.getItem("pocketbase_auth") !== null
				? JSON.parse(localStorage.getItem("pocketbase_auth") as string)
				: null

		setRoleOfUser(roleOfUser?.role)
	}, [isLoggedIn])

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<NavLink to="/" className={styles.logo}>
					<img src={Logo} width={50} alt="Logo" />
					<span>Kyrgyz Trails</span>
				</NavLink>
				<div className={styles.navLinksBig}>
					<NavLink to="/tours">Туры</NavLink>
				</div>
				<div className={styles.navLinksBig}>
					<NavLink to="/my_tours">Мои Туры</NavLink>
				</div>
				{roleOfUser === "guide" ? (
					<div className={styles.navLinksBig}>
						<NavLink to="/my_bookings_guide">Мои Бронирование</NavLink>
					</div>
				) : roleOfUser === "user" ? (
					<div className={styles.navLinksBig}>
						<NavLink to="/my_bookings_tourist">История Бронирование</NavLink>
					</div>
				) : (
					<p></p>
				)}

				<div className={styles.authLinks}>
					{isLoggedIn ? (
						<button onClick={handleLogout} className={styles.logoutBtn}>
							Выйти
						</button>
					) : (
						<>
							<NavLink to="/auth/login_user" className={styles.loginBtn}>
								Войти
							</NavLink>
							<NavLink to="/auth/register_user" className={styles.registerBtn}>
								Регистрация
							</NavLink>
						</>
					)}
				</div>

				<button className={styles.burgerBtn} onClick={toggleMenu}>
					<BurgerMenu />
				</button>

				<div
					className={`${styles.sideMenu} ${isMenuOpen ? styles.active : ""}`}
				>
					<button className={styles.closeBtn} onClick={toggleMenu}>
						×
					</button>
					<div className={styles.navLinks}>
						<NavLink to="/tours" onClick={toggleMenu}>
							Туры
						</NavLink>
						<NavLink to="/orders" onClick={toggleMenu}>
							Заказы
						</NavLink>
						<NavLink to="/my_tours" onClick={toggleMenu}>
							Мои Туры
						</NavLink>

						<NavLink to="/guide_tours" onClick={toggleMenu}>
							История гидов
						</NavLink>
					</div>

					<div className={styles.authLinks}>
						{isLoggedIn ? (
							<button onClick={handleLogout} className={styles.logoutBtn}>
								Выйти
							</button>
						) : (
							<>
								<NavLink
									to="/auth/login_user"
									className={styles.loginBtn}
									onClick={toggleMenu}
								>
									Войти
								</NavLink>
								<NavLink
									to="/auth/register_user"
									className={styles.registerBtn}
									onClick={toggleMenu}
								>
									Регистрация
								</NavLink>
							</>
						)}
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
