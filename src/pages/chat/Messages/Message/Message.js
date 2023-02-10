import React from 'react'
import { useState } from 'react'
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useDates } from '../../../../hooks/useDates'
import { useCollection } from '../../../../hooks/useCollection'

// Styles
import './Message.scss'

// Components
import { Avatar, Tooltip, AvatarWithStatus, ProfilePreview, Loader } from '../../../../components'
import { useMessageProperties } from './useMessageProperties'
import { MessageEmojiReactions } from './MessageEmojiReactions'
import { MessageTools } from './MessageTools'
import MessageResponse from './MessageResponse'

export default function Message({ message, elements, i, chat, onMessageResponse, setMessageToDelete, setShowImage }) {
	const { user } = useAuthContext()
	const { formatDate } = useDates()
	const { documents: users } = useCollection('users')
	const { isTop, isBottom, isMiddle, showSendDatePrev, handleMessageStyle } = useMessageProperties(message, elements, i)

	const [showEmojis, setShowEmojis] = useState(null)
	const [showProfilePrev, setShowProfilePrev] = useState(false)

	const getDoc = id => users?.filter(doc => doc.id === id)?.[0] ?? null
	const getLocalUser = id => chat?.assignedUsers.filter(u => u.id === id)?.[0] ?? null

	if (!message && !elements && !i) return <Loader />

	return (
		<>
			{message.isSpecial && <div className='messages__centered mt2 mb2'>{message.content}</div>}
			{!message.isSpecial && (
				<>
					{showSendDatePrev() && <div className='messages__centered mb1 mt2'>{formatDate(message.createdAt)}</div>}
					<li
						className={`message ${handleMessageStyle()} ${message.deleted ? 'deleted' : ''} ${
							message.emojiReactions && message.emojiReactions.filter(r => r === null).length === 0
								? 'emoji-response'
								: ''
						}`}
						id={message.id}>
						{message.createdBy !== user.uid && (isTop() || !(isMiddle() || isBottom())) && (
							<p className='message__author'>{getLocalUser(message.createdBy).nickname}</p>
						)}

						{message.response !== null && <MessageResponse message={message} chat={chat} />}

						<div className='message__content'>
							{message.createdBy !== user.uid && (
								<div className='message__content-margin'>
									{!isMiddle() && !isTop() && (
										<div className='cursor-pointer' onClick={() => setShowProfilePrev(message.id)}>
											<AvatarWithStatus userId={message.createdBy} noStatus={true} />
											{
												<ProfilePreview
													show={showProfilePrev === message.id}
													setShow={setShowProfilePrev}
													userId={message.createdBy}
													pos='right'
													align='end'
												/>
											}
										</div>
									)}
								</div>
							)}

							<div className='message__content-text'>
								{message.content && <p>{message.content}</p>}

								{message.image && message.fileType === 'image' && (
									<div
										className='file-message'
										onClick={e => {
											setShowImage(e.target.src)
										}}>
										<img src={message.image} alt='' />
										<div className='file-message__preview'>
											<i className='fa-solid fa-up-right-and-down-left-from-center'></i>
										</div>
									</div>
								)}

								{message.image && message.fileType === 'video' && (
									<div className='file-message'>
										<video src={message.image} controls playsInline />
										<div className='file-message__preview'>
											<i className='fa-solid fa-up-right-and-down-left-from-center'></i>
										</div>
									</div>
								)}

								{message?.emojiReactions?.length > 0 && <MessageEmojiReactions message={message} chat={chat} />}
							</div>

							{!message.deleted && (
								<MessageTools
									showEmojis={showEmojis}
									setShowEmojis={setShowEmojis}
									message={message}
									chat={chat}
									onMessageResponse={onMessageResponse}
									setMessageToDelete={setMessageToDelete}
								/>
							)}

							<Tooltip
								pos='top'
								align='center'
								className={`message-createdAt ${showEmojis === message ? 'hidden' : ''}`}>
								<span>{formatDate(message.createdAt)}</span>
							</Tooltip>
						</div>

						<div className='seen'>
							{chat.assignedUsers.map(
								u =>
									u.lastRead === message.id &&
									u.id !== user.uid && (
										<React.Fragment key={u.id}>
											<Avatar src={getDoc(u.id) !== null ? getDoc(u.id).photoURL : ''} />
										</React.Fragment>
									)
							)}
						</div>
					</li>
				</>
			)}
		</>
	)
}
