import { useEffect, useRef, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
import { Link } from 'react-router-dom'

// Compontents
import ChatsList from './ChatsList'

// Styles
import './Chats.scss'

export default function Chats({ currentChat, inputRef }) {
	const { user } = useAuthContext()
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)

	const [query, setQuery] = useState('')

	const eyes = useRef([])

	useEffect(() => {
		const handleMouseMove = event => {
			if (eyes.current) {
				eyes.current.forEach(eye => {
					if (eye) {
						let x = eye.getBoundingClientRect().left + eye.clientWidth / 2
						let y = eye.getBoundingClientRect().top + eye.clientHeight / 2

						let radian = Math.atan2(event.pageX - x, event.pageY - y)
						let rotation = radian * (180 / Math.PI) * -1

						eye.style.transform = `rotate(${rotation}deg)`
					}
				})
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [])

	const handleSelect = async addUser => {
		// // Check whether the group(chats in firestore) exists, if not create
		// const combinedId = user.uid > addUser.id ? user.uid + addUser.id : addUser.id + user.uid
		// try {
		// 	const res = await getDoc(doc(projectFirestore, 'projects', combinedId))
		// 	if (!res.exists() && user.uid !== addUser.id) {
		// 		// Create a chat in chats collection
		// 		await setDoc(doc(projectFirestore, 'projects', combinedId), {
		// 			id: combinedId,
		// 			assignedUsers: [
		// 				{
		// 					id: user.uid,
		// 					displayName: user.displayName,
		// 					nickname: user.displayName,
		// 					photoURL: user.photoURL,
		// 				},
		// 				{
		// 					id: addUser.id,
		// 					displayName: addUser.displayName,
		// 					nickname: addUser.displayName,
		// 					photoURL: addUser.photoURL,
		// 				},
		// 			],
		// 			assignedUsersId: [user.uid, addUser.id],
		// 			chatEmoji: '1f44d',
		// 			messages: [],
		// 			updatedAt: timestamp.fromDate(new Date()),
		// 			createdAt: timestamp.fromDate(new Date()),
		// 			customThemes: [],
		// 		})
		// 	}
		// } catch (err) {}
		// setQuery('')
	}

	const filterChats = chat => {
		let result = false
		// chat.displayName.toLowerCase().trim().replace(/\s+/g, '').includes(query.toLowerCase())

		chat.assignedUsers.forEach(u => {
			if (u.id !== user.uid) {
				if (
					u.displayName.toLowerCase().trim().replace(/\s+/g, '').includes(query.toLowerCase()) ||
					u.nickname.toLowerCase().trim().replace(/\s+/g, '').includes(query.toLowerCase())
				) {
					result = true
				}
			}
		})

		return result
	}

	return (
		<div className='user-list'>
			{/* <div className="blur"></div> */}
			<div className='search'>
				<h2>Chats</h2>
				<div>
					<div className='search-form'>
						<label>
							<i className='fa-solid fa-magnifying-glass'></i>
							<input type='text' placeholder='Find a user' onChange={e => setQuery(e.target.value)} value={query} />
						</label>
					</div>
					{query !== '' && (
						<>
							<div className='add-users'>
								{chats &&
									chats
										.filter(chat => filterChats(chat))
										.map(chat =>
											chat.assignedUsers.map(
												u =>
													u.id !== user.uid && (
														<Link to={`/u/${chat.id}`} key={u.id} className='user-chat' onClick={() => setQuery('')}>
															<img src={u.photoURL} alt='' />
															<div className='user-chat-info'>
																<span>{u.displayName}</span>
															</div>
														</Link>
													)
											)
										)}
							</div>
						</>
					)}
					<div className='chats'>
						{query === '' && chats && <ChatsList chats={chats} currentChat={currentChat} inputRef={inputRef} />}
					</div>
				</div>
			</div>

			<div className='nom-nom'>
				<div className='nom-nom__eyes'>
					<div
						className='eye'
						ref={e => {
							eyes.current[0] = e
						}}>
						<div className='pupil'></div>
					</div>
					<div
						className='eye'
						ref={e => {
							eyes.current[1] = e
						}}>
						<div className='pupil'></div>
					</div>
				</div>
			</div>
		</div>
	)
}
