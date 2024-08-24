/** @format */

import '@/components/common/header/header.scss'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../../assets/img/logo.png'
import { UseTypedDispatch } from '../../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../../Redux/customHooks/useTypedSelectorHook'
import BurgerMenu from '../burgerMenu'

const Header: React.FC = () => {
	const { isLoggedIn } = useTypedSelectorHook((state) => state.auth)
	const { logout } = UseTypedDispatch()
	const navigate = useNavigate()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [roleOfUser, setRoleOfUser] = useState(null)
	const [isAdmin, setIsAdmin] = useState(false)
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
		setIsAdmin(roleOfUser?.role === 'admin')
	}, [isLoggedIn])

	const renderNavLinks = () => (
		<>
			<NavLink onClick={() => setIsMenuOpen(false)} to='/'>
				Главная
			</NavLink>
			<NavLink onClick={() => setIsMenuOpen(false)} to='/tours'>
				Туры
			</NavLink>
			{isAdmin && (
				<NavLink onClick={() => setIsMenuOpen(false)} to='/delete'>
					Удалить
				</NavLink>
			)}
			<div className='add_tor'>
				{(roleOfUser === 'admin' || roleOfUser === 'guide') && (
					<NavLink onClick={() => setIsMenuOpen(false)} to='/add_tour'>
						Добавить новый тур
					</NavLink>
				)}
			</div>
			{roleOfUser === 'guide' && (
				<NavLink onClick={() => setIsMenuOpen(false)} to='/my_tours'>
					Мои Туры
				</NavLink>
			)}
			{roleOfUser === 'user' && (
				<NavLink onClick={() => setIsMenuOpen(false)} to='/my_tours'>
					Избранные туры
				</NavLink>
			)}
			{roleOfUser === 'guide' && (
				<NavLink onClick={() => setIsMenuOpen(false)} to='/my_bookings_guide'>
					Мои бронирование
				</NavLink>
			)}
			{roleOfUser === 'user' && (
				<NavLink onClick={() => setIsMenuOpen(false)} to='/my_bookings_tourist'>
					Мои бронирование
				</NavLink>
			)}
		</>
	)

	const renderAuthLinks = () => (
		<>
			{isLoggedIn ? (
				<button onClick={handleLogout} className={'logoutBtn'}>
					Выйти
				</button>
			) : (
				<>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to='/auth/login_user'
						className={'loginBtn'}
					>
						Войти
					</NavLink>
					<NavLink
						onClick={() => setIsMenuOpen(false)}
						to='/auth/register_user'
						className={'registerBtn'}
					>
						Регистрация
					</NavLink>
				</>
			)}
		</>
	)

	return (
		<header className={'header'}>
			<nav className={'nav'}>
				<NavLink onClick={() => setIsMenuOpen(false)} to='/' className={'logo'}>
					<img src={Logo} width={50} alt='Logo' />
					<span>Kyrgyz Trails</span>
				</NavLink>
				<div className={'navLinksBig'}>{renderNavLinks()}</div>
				<div className={'authLinks'}>{renderAuthLinks()}</div>

				<button className={'burgerBtn'} onClick={toggleMenu}>
					<BurgerMenu />
				</button>

				<div className={`${'sideMenu'} ${isMenuOpen ? 'active' : ''}`}>
					<button className={'closeBtn'} onClick={toggleMenu}>
						×
					</button>
					<div className={'navLinks'}>
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
					<div className={'authLinks'}>{renderAuthLinks()}</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
