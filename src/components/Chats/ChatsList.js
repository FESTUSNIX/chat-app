import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNow'

// Styles && Assets
import './ChatsList.scss'

// Components
import AvatarWithStatus from '../AvatarWithStatus/AvatarWithStatus'
import React from 'react'

export default function ChatsList({ chats, inputRef }) {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')

	const replaceDistanceToNow = {
		about: '',
		minute: 'min',
		minutes: 'min',
		'less than a minute': '1 min',
	}

	const focusInput = () => {
		if (inputRef.current !== null) {
			inputRef.current.focus()
		}
	}

	const handleSeen = chat => {
		let res = false

		if (chat.messages && chat.messages[chat.messages.length - 1]) {
			chat.assignedUsers.forEach(u => {
				if (u.id === user.uid && u.lastRead !== chat.messages[chat.messages.length - 1].id) {
					res = true
				}
			})
		}

		return res
	}

	return (
		<div className='chat-list custom-scrollbar'>
			{chats.length === 0 && <p>No chats yet!</p>}
			{chats.map(chat => (
				<NavLink
					to={`/u/${chat.id}`}
					key={chat.id}
					className={`card ${handleSeen(chat) ? 'unread' : ''}`}
					onClick={() => focusInput()}>
					{chat.assignedUsers.map(
						u =>
							u.id !== user.uid && (
								<React.Fragment key={u.id}>
									<AvatarWithStatus userId={u.id} />
									<div className='chat-info'>
										<p className='display-name'>
											{u.nickname.substring(0, 18)}
											<span>{u.nickname.length >= 18 && '...'}</span>
										</p>

										<div className='last-chat'>
											<span className='last-message'>
												{chat.messages.length !== 0 && (
													<>
														{chat &&
															chat.messages[chat.messages.length - 1] &&
															chat.messages[chat.messages.length - 1].createdBy === user.uid &&
															'You: '}

														{chat.messages[chat.messages.length - 1].content &&
															chat.messages[chat.messages.length - 1].fileType === undefined &&
															chat.messages[chat.messages.length - 1].content.substring(0, 15)}

														{!chat.messages[chat.messages.length - 1].content &&
															chat.messages[chat.messages.length - 1].fileType === 'image' &&
															`sent a photo`}

														{!chat.messages[chat.messages.length - 1].content &&
															chat.messages[chat.messages.length - 1].fileType === 'video' &&
															`sent a video`}

														{chat.messages[chat.messages.length - 1].content &&
															chat.messages[chat.messages.length - 1].content.length >= 15 &&
															'...'}
													</>
												)}

												{chat.messages.length === 0 && 'No messages yet'}
											</span>

											{chat.messages.length !== 0 && (
												<>
													<div className='dot'></div>
													<span className='comment-date'>
														{formatDistanceToNowStrict(chat.messages[chat.messages.length - 1].createdAt.toDate(), {
															addSuffix: false,
														}).replace(
															/\b(?:about|less than a minute|minute|minutes)\b/gi,
															matched => replaceDistanceToNow[matched]
														)}
													</span>
												</>
											)}
										</div>
									</div>
								</React.Fragment>
							)
					)}
				</NavLink>
			))}
		</div>
	)
}
