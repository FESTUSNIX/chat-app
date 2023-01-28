import { useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link } from 'react-router-dom'

// Compontents
import ChatsList from './ChatsList'

// Styles
import './Chats.scss'
import Avatar from '../Avatar/Avatar'
import AvatarWithStatus from '../AvatarWithStatus/AvatarWithStatus'
import MediaQuery from 'react-responsive'

export default function Chats({ currentChat, inputRef, setShowChat }) {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)

	const [query, setQuery] = useState('')

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
		<div className='chats'>
			<div className='page-title'>
				<h2>Chats</h2>
				<MediaQuery maxWidth={768}>
					<Link to={`/profile/${user.uid}`}>
						<AvatarWithStatus userId={user.uid} linkToProfile={false} noTooltip={true} />
					</Link>
				</MediaQuery>
			</div>

			<label className='chats__search-bar'>
				<i className='fa-solid fa-magnifying-glass'></i>
				<input type='text' placeholder='Find a user' onChange={e => setQuery(e.target.value)} value={query} />
			</label>

			{query !== '' && (
				<>
					<div className='chats__filtered'>
						{chats &&
							chats
								.filter(chat => filterChats(chat))
								.map(chat =>
									chat.assignedUsers.map(
										u =>
											u.id !== user.uid && (
												<Link
													to={`/u/${chat.id}`}
													key={u.id}
													className='chats__filtered-user'
													onClick={() => {
														setQuery('')
													}}>
													<Avatar src={getDoc(u.id).photoURL} />

													<span>{getDoc(u.id).displayName}</span>
												</Link>
											)
									)
								)}
					</div>
				</>
			)}

			{query === '' && chats && (
				<ChatsList chats={chats} currentChat={currentChat} inputRef={inputRef} setShowChat={setShowChat} />
			)}
		</div>
	)
}
