import pb from '@/lib/pocketbase'
import { UseTypedDispatch } from '@/Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '@/Redux/customHooks/useTypedSelectorHook'
import { ITour } from '@/Redux/Interfaces/tourReducerType'
import '@/styles/my_tours.scss'
import { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

export default function MyTours() {
	const { getTours } = UseTypedDispatch()
	const toursFromRedux = useTypedSelectorHook((state) => state.tours.tours)
	const navigate = useNavigate()

	const authData = localStorage.getItem('pocketbase_auth')
	const userId = authData ? JSON.parse(authData).userId : null

	// Локалдык абал үчүн useState колдонобуз
	const [localTours, setLocalTours] = useState<ITour[]>([])

	useEffect(() => {
		getTours()
	}, [])

	useEffect(() => {
		if (toursFromRedux.items) {
			const filtered = toursFromRedux.items.filter(
				(el: ITour) => el.guide_id === userId
			)
			setLocalTours(filtered)
		}
	}, [toursFromRedux, userId])

	const formatCreationDay = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
	}

	const handleEdit = (tourId: string) => {
		navigate(`/update-tour/${tourId}`)
	}

	const handleDelete = async (tourId: string) => {
		try {
			await pb.collection('tours').delete(tourId)
			// Локалдык абалды жаңылайбыз
			setLocalTours((prevTours) =>
				prevTours.filter((tour) => tour.id !== tourId)
			)
		} catch (error) {
			console.log(error)
		}
	}

	if (localTours.length === 0)
		return (
			<div className={'noToursMessage'}>
				У вас пока нет туров <br />
				<Link to={'/add_tour'}>
					<button>Создать новый тур</button>
				</Link>
			</div>
		)

	return (
		<div className={'pageContainer'}>
			<h1 className={'pageTitle'}>Мои Захватывающие Туры</h1>
			<div className={'toursGrid'}>
				{localTours.map((el: ITour) => (
					<div className={'tourCard'} key={el.id}>
						<button
							className='deleteButton'
							onClick={() => handleDelete(el.id)}
						>
							<MdDelete />
						</button>
						<Link to={`/tour_details/${el.id}`} className={'tourLink'}>
							<div
								className={'tourImage'}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${el.id}/${el.images[0]})`,
								}}
							/>
							<div className={'tourInfo'}>
								<div>
									<h3 className={'tourTitle'}>{el.title}</h3>
								</div>
								<p className={'tourPrice'}>Цена: {el.price} сом</p>
								<p className={'tourCreationDate'}>
									Создано: {formatCreationDay(el.created)}
								</p>
							</div>
						</Link>
						<button className={'editButton'} onClick={() => handleEdit(el.id)}>
							✏️ Редактировать
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
