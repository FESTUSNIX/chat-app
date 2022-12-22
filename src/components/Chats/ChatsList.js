import {  NavLink } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { useFirestore } from '../../hooks/useFirestore'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNow'

// Styles && Assets
import './ChatsList.scss'
import Avatar from '../Avatar/Avatar'

export default function ChatsList({ chats, currentChat, inputRef }) {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')
	const { updateDocument } = useFirestore('projects')

	let onlineUsers = []
	let rightUrl = ''
	let rightDisplayName = ''
	let rightId = ''

	const replaceDistanceToNow = {
		about: '',
		minute: 'min',
		minutes: 'min',

		'less than a minute': '1 min',
	}

	const handleOnMouseMove = e => {
		for (const card of document.getElementsByClassName('card')) {
			const rect = card.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top

			card.style.setProperty('--mouse-x', `${x}px`)
			card.style.setProperty('--mouse-y', `${y}px`)
		}
	}

	const handleSeen = () => {
		if (inputRef.current !== null) {
			inputRef.current.focus()
		}
		if (
			currentChat &&
			currentChat.messages[currentChat.messages.length - 1] &&
			currentChat.messages[currentChat.messages.length - 1].createdBy !== user.uid
		) {
			updateDocument(currentChat.id, {
				isRead: true,
			})
		}
	}

	return (
		<div className='chat-list custom-scrollbar' onMouseMove={handleOnMouseMove}>
			{chats.length === 0 && <p>No chats yet!</p>}
			{chats.map(chat => (
				<NavLink
					to={`/u/${chat.id}`}
					key={chat.id}
					className={`card ${
						chat.messages &&
						chat.messages[chat.messages.length - 1] &&
						!chat.isRead &&
						chat.messages[chat.messages.length - 1].createdBy !== user.uid
							? 'unread'
							: ''
					}`}
					onClick={() => handleSeen()}>
					<div className='card__content'>
						{chat.assignedUsers.forEach(u => {
							if (u.id !== user.uid) {
								rightId = u.id
								rightUrl = u.photoURL
								rightDisplayName = u.nickname
							}
						})}

						{users &&
							users.forEach(user => {
								if (user.online && !onlineUsers.includes(user.id)) {
									onlineUsers.push(user.id)
								}
							})}

						<div className='avatar-container'>
							<Avatar src={rightUrl} />

							{onlineUsers.includes(rightId) && (
								<span className='online-user'>
									<div className='status-circle'></div>
								</span>
							)}
						</div>
						{/* {console.log(chat.messages[chat.messages.length - 1].createdAt.toDate().getTime())}
					{console.log(chat)} */}
						<div className='chat-info'>
							<p className='display-name'>
								{rightDisplayName.substring(0, 18)}
								<span>{rightDisplayName.length >= 18 && '...'}</span>
							</p>

							<div className='last-chat'>
								<span className='last-message'>
									{chat &&
										chat.messages[chat.messages.length - 1] &&
										chat.messages[chat.messages.length - 1].createdBy === user.uid &&
										'You: '}

									{chat.messages.length !== 0 &&
										chat.messages[chat.messages.length - 1].content &&
										chat.messages[chat.messages.length - 1].fileType === undefined &&
										chat.messages[chat.messages.length - 1].content.substring(0, 15)}

									{chat.messages.length !== 0 &&
										!chat.messages[chat.messages.length - 1].content &&
										chat.messages[chat.messages.length - 1].fileType === 'image' &&
										`sent a photo`}

									{chat.messages.length !== 0 &&
										!chat.messages[chat.messages.length - 1].content &&
										chat.messages[chat.messages.length - 1].fileType === 'video' &&
										`sent a video`}

									{chat.messages.length !== 0 &&
										chat.messages[chat.messages.length - 1].content &&
										chat.messages[chat.messages.length - 1].content.length >= 15 &&
										'...'}
									{/* {console.log(chat.messages[chat.messages.length - 1].fileType !== undefined)} */}
									{chat.messages.length === 0 && 'No messages yet'}
								</span>

								{chat.messages.length !== 0 && <div className='dot'></div>}
								<span className='comment-date'>
									{chat.messages.length !== 0 &&
										formatDistanceToNowStrict(chat.messages[chat.messages.length - 1].createdAt.toDate(), {
											addSuffix: false,
										}).replace(/\b(?:about|less than a minute)\b/gi, matched => replaceDistanceToNow[matched])}
								</span>
							</div>
						</div>
					</div>
				</NavLink>
			))}
		</div>
	)
}
