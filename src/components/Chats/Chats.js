import { useRef, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link } from 'react-router-dom'

// Compontents
import ChatsList from './ChatsList'

// Styles
import './Chats.scss'
import Avatar from '../Avatar/Avatar'

export default function Chats({ currentChat, inputRef }) {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)

	const [query, setQuery] = useState('')

	const eyes = useRef([])

	const getDoc = id => {
		let res = null

		if (users) {
			res = users.filter(doc => {
				if (doc.id === id) {
					return true
				}
				return false
			})[0]
		}

		return res
	}

	const filterChats = chat => {
		let result = false
		// chat.displayName.toLowerCase().trim().replace(/\s+/g, '').includes(query.toLowerCase())

		chat.assignedUsers.forEach(u => {
			if (u.id !== user.uid) {
				console.log(u)
				if (
					getDoc(u.id).displayName.toLowerCase().trim().replace(/\s+/g, '').includes(query.toLowerCase()) ||
					(u.nickname && u.nickname.toLowerCase().trim().replace(/\s+/g, '').includes(query.toLowerCase()))
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
															<Avatar src={getDoc(u.id).photoURL} />
															<div className='user-chat-info'>
																<span>{getDoc(u.id).displayName}</span>
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
		</div>
	)
}
