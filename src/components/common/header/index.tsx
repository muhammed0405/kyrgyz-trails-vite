/** @format */

import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import Logo from "../../../assets/img/logo.png"
import { UseTypedDispatch } from "../../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../../Redux/customHooks/useTypedSelectorHook"
import BurgerMenu from "../burgerMenu"
import "./header.scss"

// Башкы компонент
const Header = () => {
	// Керектүү state жана hook'тор
	const { isLoggedIn } = useTypedSelectorHook(state => state.auth)
	const { logout } = UseTypedDispatch()
	const navigate = useNavigate()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [roleOfUser, setRoleOfUser] = useState(null)
	const [isAdmin, setIsAdmin] = useState(false)

	// Колдонуучуну чыгаруу функциясы
	const handleLogout = () => {
		logout()
		navigate("/")
		setIsMenuOpen(false)
	}

	// Меню ачуу/жабуу функциясы
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	// Колдонуучунун ролун текшерүү
	useEffect(() => {
		const roleOfUser =
			localStorage.getItem("pocketbase_auth") !== null
				? JSON.parse(localStorage.getItem("pocketbase_auth"))
				: null

		setRoleOfUser(roleOfUser?.role)
		setIsAdmin(roleOfUser?.role === "admin")
	}, [isLoggedIn])

	// Навигация шилтемелерин көрсөтүү
	const renderNavLinks = () => (
		<>
			{/* Башкы бет шилтемеси */}
			<NavLink onClick={() => setIsMenuOpen(false)} to="/">
				Башкы бет
			</NavLink>

			{/* Турлар шилтемеси */}
			<NavLink onClick={() => setIsMenuOpen(false)} to="/tours">
				Турлар
			</NavLink>

			{/* Админ үчүн өчүрүү шилтемеси */}
			{isAdmin && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/delete">
					Өчүрүү
				</NavLink>
			)}

			{/* Жаңы тур кошуу шилтемеси (админ жана гид үчүн) */}
			<div className="add_tor">
				{(roleOfUser === "admin" || roleOfUser === "guide") && (
					<NavLink onClick={() => setIsMenuOpen(false)} to="/add_tour">
						Жаңы тур кошуу
					</NavLink>
				)}
			</div>

			{/* Гид үчүн "Менин турларым" шилтемеси */}
			{roleOfUser === "guide" && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/my_tours">
					Менин турларым
				</NavLink>
			)}

			{/* Колдонуучу үчүн "Тандалган турлар" шилтемеси */}
			{roleOfUser === "user" && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/my_tours">
					Тандалган турлар
				</NavLink>
			)}

			{/* Гид үчүн "Менин броньдорум" шилтемеси */}
			{roleOfUser === "guide" && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/my_bookings_guide">
					Менин броньдорум
				</NavLink>
			)}

			{/* Колдонуучу үчүн "Менин броньдорум" шилтемеси */}
			{roleOfUser === "user" && (
				<NavLink onClick={() => setIsMenuOpen(false)} to="/my_bookings_tourist">
					Менин броньдорум
				</NavLink>
			)}
		</>
	)

	// Авторизация шилтемелерин көрсөтүү
	const renderAuthLinks = () => (
		<>
			{isLoggedIn ? (
				// Эгер колдонуучу кирген болсо, чыгуу баскычын көрсөтүү
				<button onClick={handleLogout} className={"logoutBtn"}>
					Чыгуу
				</button>
			) : (
				<>
					{/* Эгер колдонуучу кирбеген болсо, кирүү жана катталуу шилтемелерин көрсөтүү */}
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to="/auth/login_user"
						className={"loginBtn"}
					>
						Кирүү
					</NavLink>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to="/auth/register_user"
						className={"registerBtn"}
					>
						Катталуу
					</NavLink>
				</>
			)}
		</>
	)

	return (
		// Башкы header элементи
		<header className={"header"}>
			<nav className={"nav"}>
				{/* Логотип жана башкы бет шилтемеси */}
				<NavLink onClick={() => setIsMenuOpen(false)} to="/" className={"logo"}>
					<img src={Logo} width={50} alt="Logo" />
					<span>Kyrgyz Trails</span>
				</NavLink>

				{/* Негизги навигация шилтемелери */}
				<div className={"navLinksBig"}>{renderNavLinks()}</div>

				{/* Авторизация шилтемелери */}
				<div className={"authLinks"}>{renderAuthLinks()}</div>

				{/* Бургер меню баскычы */}
				<button className={"burgerBtn"} onClick={toggleMenu}>
					<BurgerMenu />
				</button>

				{/* Каптал меню */}
				<div className={`sideMenu ${isMenuOpen ? "active" : ""}`}>
					{/* Меню жабуу баскычы */}
					<button className={"closeBtn"} onClick={toggleMenu}>
						×
					</button>

					{/* Каптал меню навигация шилтемелери */}
					<div className={"navLinks"}>
						{renderNavLinks()}
						<NavLink onClick={() => setIsMenuOpen(false)} to="/orders">
							Заказдар
						</NavLink>
						<NavLink onClick={() => setIsMenuOpen(false)} to="/guide_tours">
							Гиддердин тарыхы
						</NavLink>
					</div>

					{/* Каптал меню авторизация шилтемелери */}
					<div className={"authLinks"}>{renderAuthLinks()}</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
