import React, { useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link } from 'react-router-dom'

// Styles
import './Chats.scss'

// Compontents
import ChatsList from './ChatsList'
import Avatar from '../Avatar/Avatar'
import AvatarWithStatus from '../AvatarWithStatus/AvatarWithStatus'
import MediaQuery from 'react-responsive'
import Pinned from '../Pinned/Pinned'

export default function Chats({ currentChat, inputRef, setShowChat }) {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)

	const [query, setQuery] = useState('')

	const getDoc = id => users?.filter(doc => doc.id === id)?.[0] ?? null

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

			<MediaQuery maxWidth={768}>
				<Pinned orientation='horizontal' />
			</MediaQuery>

			<label className='chats__search-bar'>
				<i className='fa-solid fa-magnifying-glass'></i>

				<input type='text' placeholder='Find a user' onChange={e => setQuery(e.target.value)} value={query} />
			</label>

			{query !== '' && (
				<>
					<div className='chats__filtered'>
						{chats &&
							chats
								.filter(
									chat =>
										chat.assignedUsers.filter(u =>
											getDoc(u.id).displayName?.toLowerCase().includes(query.toLowerCase())
										)[0]
								)
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
