import React from 'react'
import { useState } from 'react'
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useFirestore } from '../../../../hooks/useFirestore'
import { useDates } from '../../../../hooks/useDates'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'

// Styles
import './Message.scss'

// Components
import Avatar from '../../../../components/Avatar/Avatar'
import Modal from '../../../../components/Modal/Modal'
import Tooltip from '../../../../components/Tooltip/Tooltip'
import AvatarWithStatus from '../../../../components/AvatarWithStatus/AvatarWithStatus'
import ProfilePreview from '../../../../components/ProfilePreview/ProfilePreview'

export default function Message({
	message,
	elements,
	i,
	chat,
	onMessageResponse,
	setMessageToDelete,
	showImage,
	setShowImage,
	otherUser,
}) {
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('projects')
	const { formatDate } = useDates()

	const [showEmojis, setShowEmojis] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [emojiReactions, setEmojiReactions] = useState([])
	const [showProfilePrev, setShowProfilePrev] = useState(false)

	const showSendDate = (elements, i) => {
		if (elements[i] && elements[i - 1]) {
			const value1 = elements[i].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			const value2 = elements[i - 1].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

			// Get miliseconds of each message.createdAt
			const date1 = new Date('01/01/2022 ' + value1 + ':00').getTime()
			const date2 = new Date('01/01/2022 ' + value2 + ':00').getTime()

			const minuteDiff = Math.abs(date1 - date2)

			// Check if difference between when message was created is greater than 15 minutes
			if (minuteDiff >= 900000) {
				return true
			} else {
				return false
			}
		}
	}

	const showSendDate2 = (elements, i) => {
		if (elements[i + 1] && elements[i]) {
			const value1 = elements[i + 1].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			const value2 = elements[i].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

			// Get miliseconds of each message.createdAt
			const date1 = new Date('01/01/2022 ' + value1 + ':00').getTime()
			const date2 = new Date('01/01/2022 ' + value2 + ':00').getTime()

			const minuteDiff = Math.abs(date1 - date2)

			// Check if difference between when message was created is greater than 15 minutes
			if (minuteDiff >= 900000) {
				return true
			} else {
				return false
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
		ref.scrollIntoView({ block: 'center' })
		setTimeout(() => {
			ref.classList.add('pop')
			setTimeout(() => {
				ref.classList.remove('pop')
			}, 800)
		}, 400)
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

	const handleMessageStyle = (message, prev, next, prevIsDate, nextIsDate) => {
		if (
			next &&
			(!prev ||
				prev.createdBy !== message.createdBy ||
				next.response !== null ||
				prevIsDate ||
				message.response !== null) &&
			next.createdBy === message.createdBy &&
			next.response === null &&
			!nextIsDate
		) {
			if (message.createdBy === user.uid) {
				return 'group-top owner'
			} else {
				return 'group-top'
			}
		} else if (
			prev &&
			next &&
			(prev.createdBy === message.createdBy || prev.response !== null) &&
			next.createdBy === message.createdBy &&
			next.response === null &&
			!prevIsDate &&
			!nextIsDate
		) {
			if (message.createdBy === user.uid) {
				return 'group-middle owner'
			} else {
				return 'group-middle'
			}
		} else if (
			// prettier-ignore
			prev &&
			prev.createdBy === message.createdBy &&
			message.response === null &&
			(
				(!next && message.response === null) ||
				(
					next && 
					(
						next.response !== null ||
						next.createdBy !== message.createdBy ||
						nextIsDate
					)
				)
			) &&
			!prevIsDate
		) {
			if (message.createdBy === user.uid) {
				return 'group-bottom owner'
			} else {
				return 'group-bottom'
			}
		} else {
			if (message.createdBy === user.uid) {
				return 'owner'
			} else {
				return ''
			}
		}
	}

	const handleReactionNicknames = reaction => {
		let nickname
		chat.assignedUsers.forEach(u => {
			if (u.id === reaction.id) {
				if (u.nickname !== '') {
					nickname = u.nickname
				} else {
					nickname = u.displayName
				}
			}
		})
		return nickname
	}

	const deleteEmojiReaction = async (message, reaction) => {
		let otherUserReaction = null
		if (reaction.id === user.uid) {
			if (message.emojiReactions.length > 0) {
				// otherUserReaction = message.emojiReactions.find(rec => rec.id !== user.uid)

				message.emojiReactions.forEach(rec => {
					if (rec !== null && rec.id !== user.uid) {
						otherUserReaction = rec
					}
				})
			}

			const indexOfMessage = chat.messages.indexOf(message)

			chat.messages[indexOfMessage] = {
				...chat.messages[indexOfMessage],
				emojiReactions: [otherUserReaction],
			}

			try {
				await updateDocument(chat.id, {
					messages: [...chat.messages],
				})
				setEmojiReactions([])
				setShowModal(false)
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<>
			{message.isSpecial && <div className='messages__centered mb05'>{message.content}</div>}
			{!message.isSpecial && (
				<>
					{showSendDate(elements, i) && (
						<div className='messages__centered mb1 mt2'>{formatDate(message.createdAt)}</div>
					)}
					<li
						className={`${handleMessageStyle(
							message,
							elements[i - 1],
							elements[i + 1],
							showSendDate(elements, i),
							showSendDate2(elements, i)
						)} ${message.deleted ? 'deleted' : ''} ${message.emojiReactions ? 'emoji-response' : ''}`}
						id={message.id}>
						{message.createdBy !== user.uid && // top
							((elements[i + 1] &&
								(!elements[i - 1] ||
									elements[i - 1].createdBy !== message.createdBy ||
									elements[i + 1].response !== null ||
									showSendDate(elements, i) ||
									message.response !== null) &&
								elements[i + 1].createdBy === message.createdBy &&
								elements[i + 1].response === null &&
								!showSendDate2(elements, i)) ||
								!(
									// middle
									(
										(elements[i - 1] &&
											elements[i + 1] &&
											(elements[i - 1].createdBy === message.createdBy || elements[i - 1].response !== null) &&
											elements[i + 1].createdBy === message.createdBy &&
											elements[i + 1].response === null &&
											!showSendDate(elements, i) &&
											!showSendDate2(elements, i)) ||
										// bottom
										(elements[i - 1] &&
											elements[i - 1].createdBy === message.createdBy &&
											message.response === null &&
											((!elements[i + 1] && message.response === null) ||
												(elements[i + 1] &&
													(elements[i + 1].response !== null ||
														elements[i + 1].createdBy !== message.createdBy ||
														showSendDate2(elements, i)))) &&
											!showSendDate(elements, i))
									)
								)) && <p className='message-author'>{otherUser.nickname}</p>}

						{message.response !== null && (
							<div
								onClick={() => scrollToResponse(chat.messages[message.response].id)}
								className={`response ${chat.messages[message.response].deleted ? 'deleted' : ''}`}>
								{message.createdBy !== user.uid && <div className='left-margin'></div>}

								{chat.messages[message.response].content && (
									<div className='response__message'>{chat.messages[message.response].content.substring(0, 55)}</div>
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
									{!(
										// middle
										(
											elements[i - 1] &&
											elements[i + 1] &&
											(elements[i - 1].createdBy === message.createdBy || elements[i - 1].response !== null) &&
											elements[i + 1].createdBy === message.createdBy &&
											elements[i + 1].response === null &&
											!showSendDate(elements, i) &&
											!showSendDate2(elements, i)
										)
									) &&
										!(
											// top
											(
												elements[i + 1] &&
												(!elements[i - 1] ||
													elements[i - 1].createdBy !== message.createdBy ||
													elements[i + 1].response !== null ||
													showSendDate(elements, i) ||
													message.response !== null) &&
												elements[i + 1].createdBy === message.createdBy &&
												elements[i + 1].response === null &&
												!showSendDate2(elements, i)
											)
										) && (
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
							<div className='message-content__text'>
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
									<>
										<div
											className='emoji-reactions'
											onClick={() => {
												setEmojiReactions(message.emojiReactions)
												setShowModal(true)
											}}>
											{message.emojiReactions.map(reaction =>
												reaction !== null ? (
													<div key={reaction.id} className='emoji-reactions__reaction'>
														<span className='content'>{reaction.content}</span>
														<span className='display-name'>{handleReactionNicknames(reaction)}</span>
													</div>
												) : null
											)}
										</div>

										<Modal show={showModal} setShow={() => setShowModal(false)} onClose={() => setEmojiReactions([])}>
											<div className='show-reactions'>
												<h3>Reactions</h3>
												{emojiReactions.map(reaction =>
													reaction !== null ? (
														<div
															className={`reaction ${reaction.id === user.uid ? 'cursor-pointer' : ''}`}
															onClick={() => {
																deleteEmojiReaction(message, reaction)
															}}
															key={reaction.id}>
															<div className='reaction__author'>
																<Avatar src={reaction.photoURL} />
																<div>
																	<p>{reaction.displayName}</p>
																	{reaction.id === user.uid && <p>Click to delete</p>}
																</div>
															</div>

															<span className='reaction__emoji'>{reaction.content}</span>
														</div>
													) : null
												)}
											</div>
										</Modal>
									</>
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
										}}>
										<Tooltip>React</Tooltip>
									</i>

									{user.uid === message.createdBy && (
										<i className='fa-solid fa-trash-can' onClick={() => setMessageToDelete(message)}>
											<Tooltip>Remove</Tooltip>
										</i>
									)}

									<i
										className='fa-solid fa-reply'
										onClick={() => {
											onMessageResponse(Number(chat.messages.indexOf(message)))
										}}>
										<Tooltip>Reply</Tooltip>
									</i>
								</div>
							)}

							<div className={`message-createdAt ${showEmojis === message ? 'hidden' : ''}`}>
								{formatDate(message.createdAt)}
							</div>
						</div>

						<div className='seen'>
							{chat.assignedUsers.map(
								u => u.lastRead === message.id && u.id !== user.uid && <Avatar src={u.photoURL} key={u.id} />
							)}
						</div>
					</li>
				</>
			)}
		</>
	)
}
