/** @format */

import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../../assets/img/logo.png'
import { UseTypedDispatch } from '../../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../../Redux/customHooks/useTypedSelectorHook'
import styles from '../../../styles/header.module.scss'
import BurgerMenu from '../burgerMenu'

const Header: React.FC = () => {
	const { isLoggedIn } = useTypedSelectorHook((state) => state.auth)
	const { logout } = UseTypedDispatch()
	const navigate = useNavigate()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [roleOfUser, setRoleOfUser] = useState(null)

	const handleLogout = () => {
		logout()
		navigate('/')
		setIsMenuOpen(false)
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		const roleOfUser =
			localStorage.getItem('pocketbase_auth') !== null
				? JSON.parse(localStorage.getItem('pocketbase_auth') as string)
				: null

		setRoleOfUser(roleOfUser?.role)
	}, [isLoggedIn])

	const renderNavLinks = () => (
		<>
			<NavLink onClick={() => setIsMenuOpen(false)} to='/tours'>
				Туры
			</NavLink>
			<NavLink onClick={() => setIsMenuOpen(false)} to='/my_tours'>
				Мои Туры
			</NavLink>
			{roleOfUser === 'guide' && (
				<NavLink onClick={() => setIsMenuOpen(false)} to='/my_bookings_guide'>
					Мои Бронирование
				</NavLink>
			)}
			{roleOfUser === 'user' && (
				<NavLink onClick={() => setIsMenuOpen(false)} to='/my_bookings_tourist'>
					История Бронирование
				</NavLink>
			)}
		</>
	)

	const renderAuthLinks = () => (
		<>
			{isLoggedIn ? (
				<button onClick={handleLogout} className={styles.logoutBtn}>
					Выйти
				</button>
			) : (
				<>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to='/auth/login_user'
						className={styles.loginBtn}
					>
						Войти
					</NavLink>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to='/auth/register_user'
						className={styles.registerBtn}
					>
						Регистрация
					</NavLink>
				</>
			)}
		</>
	)

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<NavLink
					onClick={() => setIsMenuOpen(false)}
					to='/'
					className={styles.logo}
				>
					<img  src={Logo} width={50} alt='Logo' />
					<span>Kyrgyz Trails</span>
				</NavLink>
				<div className={styles.navLinksBig}>{renderNavLinks()}</div>
				<div className={styles.authLinks}>{renderAuthLinks()}</div>

				<button className={styles.burgerBtn} onClick={toggleMenu}>
					<BurgerMenu />
				</button>

				<div
					className={`${styles.sideMenu} ${isMenuOpen ? styles.active : ''}`}
				>
					<button className={styles.closeBtn} onClick={toggleMenu}>
						×
					</button>
					<div className={styles.navLinks}>
						{renderNavLinks()}
						<NavLink
							onClick={() => setIsMenuOpen(false)}
							to='/orders'
							onClick={toggleMenu}
						>
							Заказы
						</NavLink>
						<NavLink
							onClick={() => setIsMenuOpen(false)}
							to='/guide_tours'
							onClick={toggleMenu}
						>
							История гидов
						</NavLink>
					</div>
					<div className={styles.authLinks}>{renderAuthLinks()}</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
