import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNow'

// Styles && Assets
import './ChatsList.scss'

// Components
import AvatarWithStatus from '../AvatarWithStatus/AvatarWithStatus'

export default function ChatsList({ chats, inputRef, setShowChat }) {
	const { user } = useAuthContext()

	const replaceDistanceToNow = {
		about: '',
		minute: 'min',
		minutes: 'min',
		'less than a minute': '1 min'
	}

	const handleSeen = chat => {
		if (!chat.messages || !chat.messages[chat.messages.length - 1]) {
			return
		}

		return chat.assignedUsers.filter(
			u => u.id === user.uid && u.lastRead !== chat.messages[chat.messages.length - 1].id
		)?.[0]
	}

	return (
		<div className='chats__list custom-scrollbar'>
			{chats.length === 0 && <p>No chats yet!</p>}
			{chats.map(chat => (
				<NavLink
					to={`/u/${chat.id}`}
					key={chat.id}
					className={`chats__list-chat ${handleSeen(chat) ? 'unread' : ''}`}
					onClick={() => {
						inputRef.current?.focus()
						setShowChat(true)
					}}>
					{chat.assignedUsers.map(
						u =>
							u.id !== user.uid && (
								<React.Fragment key={u.id}>
									<AvatarWithStatus userId={u.id} />
									<div className='flex-column justify-center'>
										<p className='display-name text-clip'>{u.nickname}</p>

										<div className='last-chat'>
											<span className='last-message text-clip'>
												{chat.messages.length !== 0 ? (
													<>
														{chat.messages[chat.messages.length - 1]?.createdBy === user.uid && 'You: '}

														{chat.messages[chat.messages.length - 1].content &&
															chat.messages[chat.messages.length - 1].fileType === undefined &&
															chat.messages[chat.messages.length - 1].content.substring(0, 15)}

														{!chat.messages[chat.messages.length - 1].content && (
															<>
																{chat.messages[chat.messages.length - 1].fileType === 'image' && `sent a photo`}
																{chat.messages[chat.messages.length - 1].fileType === 'video' && `sent a video`}
															</>
														)}

														{chat.messages[chat.messages.length - 1].content &&
															chat.messages[chat.messages.length - 1].content.length >= 15 &&
															'...'}
													</>
												) : (
													'No messages yet'
												)}
											</span>

											{chat.messages.length !== 0 && (
												<>
													<div className='dot'></div>
													<span className='comment-date'>
														{formatDistanceToNowStrict(chat.messages[chat.messages.length - 1].createdAt.toDate(), {
															addSuffix: false
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
