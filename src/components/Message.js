import React from 'react'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFirestore } from '../hooks/useFirestore'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import { useDates } from '../hooks/useDates'
import OutsideClickHandler from 'react-outside-click-handler'

// Styles && Assets
import './Message.scss'
import Avatar from './Avatar'

export default function Message({
	message,
	elements,
	i,
	chat,
	onMessageResponse,
	setMessageToDelete,
	showImage,
	setShowImage,
	setEmojiReactions,
}) {
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('projects')
	const { formatDate } = useDates()

	const [showEmojis, setShowEmojis] = useState(null)

	const showSendDate = (message, elements, i) => {
		if (message && elements[i - 1]) {
			const value1 = message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			const value2 = elements[i - 1].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

			// Get miliseconds of each message.createdAt
			const date1 = new Date('01/01/2022 ' + value1 + ':00').getTime()
			const date2 = new Date('01/01/2022 ' + value2 + ':00').getTime()

			const minuteDiff = Math.abs(date1 - date2)

			// Check if difference between when message was created is greater than 15 minutes
			if (minuteDiff >= 900000) {
				return true
			}
		}
	}

	const showFullImage = e => {
		if (showImage !== e.target.src) {
			setShowImage(e.target.src)
		}
	}

	const scrollToResponse = id => {
		const ref = document.getElementById(id)
		ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
		setTimeout(() => {
			ref.classList.add('pop')
			setTimeout(() => {
				ref.classList.remove('pop')
			}, 800)
		}, 800)
	}

	const reactWithEmoji = async (e, message) => {
		const indexOfMessage = chat.messages.indexOf(message)

		let otherUserReaction = null

		if (message.emojiReactions && message.emojiReactions.length > 0) {
			message.emojiReactions.forEach(rec => {
				if (rec !== null) {
					if (rec.id !== user.uid) {
						otherUserReaction = rec
					}
				}
			})
		}

		const emojiToAdd = {
			id: user.uid,
			photoURL: user.photoURL,
			content: e.emoji,
			displayName: user.displayName,
		}

		chat.messages[indexOfMessage] = {
			...chat.messages[indexOfMessage],
			emojiReactions: [
				otherUserReaction ? otherUserReaction : null,
				{
					...emojiToAdd,
				},
			],
		}

		try {
			await updateDocument(chat.id, {
				messages: [...chat.messages],
			})
		} catch (error) {
			console.log(error)
		}
	}

	const handleMessageStyle = (message, i, previous, next) => {
		if (next && message.response !== null && next.response !== null) {
			if (message.createdBy === user.uid) {
				return 'owner'
			} else {
				return ''
			}
		} else if (previous && next && message.response !== null) {
			if (message.createdBy === user.uid) {
				return 'owner group-top'
			} else {
				return 'group-top'
			}
		} else if (
			(!previous && next && next === next.createdBy) ||
			(next && previous && message.createdBy !== previous.createdBy && message.createdBy === next.createdBy) ||
			(next && !previous && message.createdBy === next.createdBy)
		) {
			if (message.createdBy === user.uid) {
				return 'owner group-top'
			} else {
				return 'group-top'
			}
		} else if (message.response !== null && next && !next.response !== null && !previous.response !== null) {
			if (message.createdBy === user.uid) {
				return 'owner group-down'
			} else {
				return 'group-down'
			}
		} else if (next && previous && message.createdBy === previous.createdBy && message.createdBy === next.createdBy) {
			if (message.createdBy === user.uid) {
				return 'owner group-middle'
			} else {
				return 'group-middle'
			}
		} else if (
			previous &&
			// message.response === null &&
			message.createdBy === previous.createdBy &&
			(!next || message.createdBy !== next.createdBy)
		) {
			if (message.createdBy === user.uid) {
				return 'owner group-down'
			} else {
				return 'group-down'
			}
		} else if (message.createdBy === user.uid) {
			return 'owner'
		} else {
			return ''
		}
	}

	return (
		<>
			{showSendDate(message, elements, i) && <div className='messages__time-passed'>{formatDate(message)}</div>}
			<li
				className={`${handleMessageStyle(message, i, elements[i - 1], elements[i + 1])} ${
					message.deleted ? 'deleted' : ''
				} ${message.emojiReactions ? 'emoji-response' : ''}`}
				id={message.id}>
				{message.createdBy !== user.uid && (!elements[i - 1] || message.createdBy !== elements[i - 1].createdBy) && (
					<p className='message-author'>{message.displayName}</p>
				)}

				{message.response !== null && (
					<div
						onClick={() => scrollToResponse(chat.messages[message.response].id)}
						className={`${
							(message.createdBy !== user.uid && !elements[i - 1]) || message.createdBy !== elements[i - 1].createdBy
								? 'response no-margin'
								: 'response'
						} ${chat.messages[message.response].deleted ? 'deleted' : ''}`}>
						{message.createdBy !== user.uid && <div className='left-margin'></div>}

						{chat.messages[message.response].content && (
							<div className='response__message'>{chat.messages[message.response].content}</div>
						)}

						<div className='response__img'>
							{chat.messages[message.response].image &&
								(chat.messages[message.response].fileType === 'image' ? (
									<img src={chat.messages[message.response].image} alt='' />
								) : (
									<video src={chat.messages[message.response].image}></video>
								))}
						</div>
					</div>
				)}
				<div className='message-content'>
					{message.createdBy !== user.uid && (
						<div className='left-margin'>
							{(!elements[i + 1] || message.createdBy !== elements[i + 1].createdBy) && (
								<Avatar src={message.photoURL} />
							)}
						</div>
					)}
					<div
						className='message-content__text'
						style={message.image ? { padding: 0, backgroundColor: 'transparent' } : null}>
						{message.content && <p>{message.content}</p>}

						{message.image && message.fileType === 'image' && (
							<div className='file-message' onClick={e => showFullImage(e)}>
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

						{message.emojiReactions && message.emojiReactions.length > 0 && (
							<div
								className='emoji-reactions'
								onClick={() =>
									setEmojiReactions({
										message: message,
										reactions: message.emojiReactions,
									})
								}>
								{message.emojiReactions.map(reaction =>
									reaction !== null ? (
										<div key={reaction.id} className='emoji-reactions__reaction'>
											<span className='content'>{reaction.content}</span>
											<span className='display-name'>{reaction.displayName}</span>
										</div>
									) : null
								)}
							</div>
						)}
					</div>

					{showEmojis === message && (
						<div className='react-with-emoji'>
							<OutsideClickHandler
								onOutsideClick={() => {
									setShowEmojis(null)
								}}
								disabled={showEmojis === message ? false : true}>
								<EmojiPicker
									className='emoji-picker'
									onEmojiClick={e => {
										reactWithEmoji(e, message)
									}}
									theme={Theme.DARK}
									previewConfig={{
										defaultCaption: '',
										defaultEmoji: null,
									}}
									width={300}
									height={400}
									// lazyLoadEmojis={true}
									emojiStyle={EmojiStyle.NATIVE}
								/>
							</OutsideClickHandler>

							<svg height='12' viewBox='0 0 25 12' width='25' data-darkreader-inline-fill=''>
								<path d='M24.553.103c-2.791.32-5.922 1.53-7.78 3.455l-9.62 7.023c-2.45 2.54-5.78 1.645-5.78-2.487V2.085C1.373 1.191.846.422.1.102h24.453z'></path>
							</svg>
						</div>
					)}

					{!message.deleted && (
						<div className={`message-tools ${showEmojis === message ? 'visible' : ''}`}>
							<i
								className='fa-regular fa-face-smile'
								onClick={() => {
									setShowEmojis(message)
								}}></i>

							{user.uid === message.createdBy && (
								<i className='fa-solid fa-trash-can' onClick={() => setMessageToDelete(message)}></i>
							)}

							<i
								className='fa-solid fa-reply'
								onClick={() => {
									onMessageResponse(Number(chat.messages.indexOf(message)))
								}}></i>
						</div>
					)}

					<div className={`message-createdAt ${showEmojis === message ? 'hidden' : ''}`}>{formatDate(message)}</div>
				</div>
			</li>
		</>
	)
}
