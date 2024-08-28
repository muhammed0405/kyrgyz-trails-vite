/** @format */

import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import Logo from "../../../assets/img/abaz1.png"
import { UseTypedDispatch } from "../../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../../Redux/customHooks/useTypedSelectorHook"
import BurgerMenu from "../burgerMenu"
import "./header.scss"

const Header = () => {
	const { isLoggedIn } = useTypedSelectorHook(state => state.auth)
	const { logout } = UseTypedDispatch()
	const navigate = useNavigate()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [roleOfUser, setRoleOfUser] = useState(null)
	const [isAdmin, setIsAdmin] = useState(false)

	const handleLogout = () => {
		logout()
		navigate("/")
		setIsMenuOpen(false)
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		const auth = localStorage.getItem("pocketbase_auth")
		if (auth) {
			const { role } = JSON.parse(auth)
			setRoleOfUser(role)
			setIsAdmin(role === "admin")
		} else {
			setRoleOfUser(null)
			setIsAdmin(false)
		}
	}, [isLoggedIn])

	const renderNavLinks = () => (
		<>
			<NavLink onClick={() => setIsMenuOpen(false)} to="/regions">
				Области
			</NavLink>
			<NavLink onClick={() => setIsMenuOpen(false)} to="/tours">
				Все туры
			</NavLink>
			{isAdmin && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/delete">
					Удалить 
				</NavLink>
			)}
			{(roleOfUser === "admin" || roleOfUser === "guide") && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/add_tour">
					Добавить новый тур
				</NavLink>
			)}
			{roleOfUser === "guide" && (
				<>
					<NavLink onClick={() => setIsMenuOpen(false)} to="/my_tours">
						Мои туры 
					</NavLink>
					<NavLink onClick={() => setIsMenuOpen(false)} to="/my_bookings_guide">
						Мои брони
					</NavLink>
				</>
			)}
			{roleOfUser === "user" && (
				<>
					<NavLink onClick={() => setIsMenuOpen(false)} to="/liked_tours">
						Избранные туры
					</NavLink>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to="/my_bookings_tourist"
					>
						Мои брони
					</NavLink>
				</>
			)}
		</>
	)

	
	const renderAuthLinks = () => (
		<>
			{isLoggedIn ? (
				<button onClick={handleLogout} className="logoutBtn">
					Выход
				</button>
			) : (
				<>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to="/auth/login_user"
						className="loginBtn"
					>
						Войти
					</NavLink>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to="/auth/register_user"
						className="registerBtn"
					>
						Регистрация
					</NavLink>
				</>
			)}
		</>
	)

	return (
		<header className="header">
			<nav className="nav">
				<NavLink onClick={() => setIsMenuOpen(false)} to="/" className="logo">
					<img src={Logo} width={50} alt="Logo" />
					<span>Главная</span>
				</NavLink>

				<div className="navLinksBig">{renderNavLinks()}</div>

				<div className="authLinks">{renderAuthLinks()}</div>

				<button className="burgerBtn" onClick={toggleMenu}>
					<BurgerMenu />
				</button>

				<div className={`sideMenu ${isMenuOpen ? "active" : ""}`}>
					<button className="closeBtn" onClick={toggleMenu}>
						×
					</button>

					<div className="navLinks">
						{renderNavLinks()}
						<NavLink onClick={() => setIsMenuOpen(false)} to="/orders">
							Заказы
						</NavLink>
						<NavLink onClick={() => setIsMenuOpen(false)} to="/guide_tours">
							Гидские туры
						</NavLink>
					</div>

					<div className="authLinks">{renderAuthLinks()}</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
