/** @format */

import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import Logo from "../../../assets/img/logo.png"
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
				 Областар
			</NavLink>
			<NavLink onClick={() => setIsMenuOpen(false)} to="/tours">
				Турлар
			</NavLink>
			{isAdmin && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/delete">
					Өчүрүү
				</NavLink>
			)}
			{(roleOfUser === "admin" || roleOfUser === "guide") && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/add_tour">
					Жаңы тур кошуу
				</NavLink>
			)}
			{roleOfUser === "guide" && (
				<>
					<NavLink onClick={() => setIsMenuOpen(false)} to="/my_tours">
						Менин турларым
					</NavLink>
					<NavLink onClick={() => setIsMenuOpen(false)} to="/my_bookings_guide">
						Менин броньдорум
					</NavLink>
				</>
			)}
			{roleOfUser === "user" && (
				<>
					<NavLink onClick={() => setIsMenuOpen(false)} to="/my_tours">
						Тандалган турлар
					</NavLink>
					<NavLink onClick={() => setIsMenuOpen(false)} to="/my_bookings_tourist">
						Менин броньдорум
					</NavLink>
				</>
			)}
		</>
	)

	const renderAuthLinks = () => (
		<>
			{isLoggedIn ? (
				<button onClick={handleLogout} className="logoutBtn">
					Чыгуу
				</button>
			) : (
				<>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to="/auth/login_user"
						className="loginBtn"
					>
						Кирүү
					</NavLink>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to="/auth/register_user"
						className="registerBtn"
					>
						Катталуу
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
					<span>Кыргыз турлары</span>
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
							Заказдар
						</NavLink>
						<NavLink onClick={() => setIsMenuOpen(false)} to="/guide_tours">
							Гиддердин тарыхы
						</NavLink>
					</div>

					<div className="authLinks">{renderAuthLinks()}</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
