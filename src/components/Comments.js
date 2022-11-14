import React, { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useDates } from '../hooks/useDates'
import { useFirestore } from '../hooks/useFirestore'
import { useHistory } from 'react-router-dom'
import FileSaver from 'file-saver'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'

// Styles && Assets
import './Comments.scss'
import Avatar from './Avatar'

const Comments = ({ chat, onMessageResponse, setBottomDiv }) => {
	const { formatDate, dates } = useDates()
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('projects')

	const [showImage, setShowImage] = useState('')
	const [messageToDelete, setMessageToDelete] = useState(null)
	const [showEmojis, setShowEmojis] = useState(null)

	const history = useHistory()
	const bottomRef = useRef()
	const scrollDownRef = useRef()

	useEffect(() => {
		setBottomDiv(bottomRef)
		scrollToBottom()
	}, [])

	useEffect(() => {
		return history.listen(() => {
			scrollToBottom()
			onMessageResponse(null)
		})
	}, [history])

	const handleMessageStyle = (comment, i, previous, next) => {
		if (next && comment.response !== null && next.response !== null) {
			if (comment.createdBy === user.uid) {
				return 'owner'
			} else {
				return ''
			}
		} else if (previous && next && comment.response !== null) {
			if (comment.createdBy === user.uid) {
				return 'owner group-top'
			} else {
				return 'group-top'
			}
		} else if (
			(!previous && next && next === next.createdBy) ||
			(next && previous && comment.createdBy !== previous.createdBy && comment.createdBy === next.createdBy) ||
			(next && !previous && comment.createdBy === next.createdBy)
		) {
			if (comment.createdBy === user.uid) {
				return 'owner group-top'
			} else {
				return 'group-top'
			}
		} else if (comment.response !== null && next && !next.response !== null && !previous.response !== null) {
			if (comment.createdBy === user.uid) {
				return 'owner group-down'
			} else {
				return 'group-down'
			}
		} else if (next && previous && comment.createdBy === previous.createdBy && comment.createdBy === next.createdBy) {
			if (comment.createdBy === user.uid) {
				return 'owner group-middle'
			} else {
				return 'group-middle'
			}
		} else if (
			previous &&
			// comment.response === null &&
			comment.createdBy === previous.createdBy &&
			(!next || comment.createdBy !== next.createdBy)
		) {
			if (comment.createdBy === user.uid) {
				return 'owner group-down'
			} else {
				return 'group-down'
			}
		} else if (comment.createdBy === user.uid) {
			return 'owner'
		} else {
			return ''
		}
	}

	const showSendDate = (comment, elements, i) => {
		if (comment && elements[i - 1]) {
			const value1 = comment.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			const value2 = elements[i - 1].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

			// Get miliseconds of each comment.createdAt
			const date1 = new Date('01/01/2022 ' + value1 + ':00').getTime()
			const date2 = new Date('01/01/2022 ' + value2 + ':00').getTime()

			const minuteDiff = Math.abs(date1 - date2)

			// Check if difference between when comment was created is greater than 15 minutes
			if (minuteDiff >= 900000) {
				return true
			}
		}
	}

	const deleteMessage = async comment => {
		if (user.uid === comment.createdBy) {
			// chat.messages.splice(chat.messages.indexOf(comment), 1)

			chat.messages[chat.messages.indexOf(comment)] = {
				...chat.messages[chat.messages.indexOf(comment)],
				content: 'Message deleted',
				deleted: true,
			}

			try {
				await updateDocument(chat.id, {
					messages: [...chat.messages],
				})
				setMessageToDelete(null)
			} catch (error) {
				console.log(error)
			}
		}
	}

	const showFullImage = e => {
		if (showImage !== e.target.src) {
			setShowImage(e.target.src)
		}
	}

	const hideFullImage = () => {
		setShowImage('')
	}

	const downloadImage = () => {
		FileSaver.saveAs(showImage)
	}

	const scrollToBottom = () => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({
				block: 'end',
			})
		}
	}

	const handleScrollDownBtn = e => {
		const winScroll = e.target.scrollTop

		if (-winScroll <= 500) {
			scrollDownRef.current.classList.remove('active')
		}

		if (-winScroll >= 500) {
			scrollDownRef.current.classList.add('active')
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

	const reactWithEmoji = async (e, comment) => {
		chat.messages[chat.messages.indexOf(comment)] = {
			...chat.messages[chat.messages.indexOf(comment)],
			emojiReaction: e.emoji,
		}
		try {
			await updateDocument(chat.id, {
				messages: [...chat.messages],
			})
			setMessageToDelete(null)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<ul className='comments custom-scrollbar' id='comments' onScroll={e => handleScrollDownBtn(e)}>
			{showImage && (
				<div className='full-img'>
					<div className='full-img__background'>
						<div className='backdrop-blur'></div>
						<img src={showImage} alt='' className='' />
					</div>
					<div className='wrapper'>
						<img src={showImage} alt='' className='full-img__img' />
					</div>

					<div className='full-img__tools'>
						<div className='tool' onClick={() => downloadImage()}>
							<i className='fa-solid fa-download'></i>
						</div>
						<div className='tool' onClick={() => hideFullImage()}>
							<i className='fa-solid fa-xmark'></i>
						</div>
					</div>
				</div>
			)}
			<div className='comments-wrapper'>
				<div className='comments__conversation-start'>
					<p>This is the start of your conversation with this user</p>
					<p>{dates(chat.createdAt).fullDate}</p>
				</div>

				{chat.messages.length > 0 &&
					chat.messages.map((comment, i, elements) => (
						<React.Fragment key={comment.id}>
							{showSendDate(comment, elements, i) && <div className='comments__time-passed'>{formatDate(comment)}</div>}
							<li
								className={`${handleMessageStyle(comment, i, elements[i - 1], elements[i + 1])} ${
									comment.deleted ? 'deleted' : ''
								} ${comment.emojiReaction ? 'emoji-response' : ''}`}
								id={comment.id}>
								{comment.createdBy !== user.uid &&
									(!elements[i - 1] || comment.createdBy !== elements[i - 1].createdBy) && (
										<p className='comment-author'>{comment.displayName}</p>
									)}
								{comment.response !== null && (
									<div
										onClick={() => scrollToResponse(chat.messages[comment.response].id)}
										className={`${
											(comment.createdBy !== user.uid && !elements[i - 1]) ||
											comment.createdBy !== elements[i - 1].createdBy
												? 'response no-margin'
												: 'response'
										} ${chat.messages[comment.response].deleted ? 'deleted' : ''}`}>
										{comment.createdBy !== user.uid && <div className='left-margin'></div>}
										{chat.messages[comment.response].content && (
											<div className='response__message'>{chat.messages[comment.response].content}</div>
										)}

										<div className='response__img'>
											{chat.messages[comment.response].image &&
												(chat.messages[comment.response].fileType === 'image' ? (
													<img src={chat.messages[comment.response].image} alt='' />
												) : (
													<video src={chat.messages[comment.response].image}></video>
												))}
										</div>
									</div>
								)}
								<div className='comment-content'>
									{comment.createdBy !== user.uid && (
										<div className='left-margin'>
											{(!elements[i + 1] || comment.createdBy !== elements[i + 1].createdBy) && (
												<Avatar src={comment.photoURL} />
											)}
										</div>
									)}
									<div
										className='comment-content__text'
										style={comment.image ? { padding: 0, backgroundColor: 'transparent' } : null}>
										{comment.content && <p>{comment.content}</p>}
										{comment.image && comment.fileType === 'image' && (
											<div className='file-message' onClick={e => showFullImage(e)}>
												<img src={comment.image} alt='' />
												<div className='file-message__preview'>
													<i className='fa-solid fa-up-right-and-down-left-from-center'></i>
												</div>
											</div>
										)}

										{comment.image && comment.fileType === 'video' && (
											<div className='file-message'>
												<video src={comment.image} controls playsInline />
												<div className='file-message__preview'>
													<i className='fa-solid fa-up-right-and-down-left-from-center'></i>
												</div>
											</div>
										)}

										{comment.emojiReaction && (
											<div className='emoji-reaction'>
												<span>{comment.emojiReaction}</span>
											</div>
										)}
									</div>

									{showEmojis === comment && (
										<div className='react-with-emoji'>
											<OutsideClickHandler
												onOutsideClick={() => {
													setShowEmojis(null)
												}}
												disabled={showEmojis === comment ? false : true}>
												<EmojiPicker
													className='emoji-picker'
													onEmojiClick={e => {
														reactWithEmoji(e, comment)
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

									{!comment.deleted && (
										<div className={`comment-tools ${showEmojis === comment ? 'visible' : ''}`}>
											<i
												className='fa-regular fa-face-smile'
												onClick={() => {
													setShowEmojis(comment)
												}}></i>

											{user.uid === comment.createdBy && (
												<i className='fa-solid fa-trash-can' onClick={() => setMessageToDelete(comment)}></i>
											)}

											<i
												className='fa-solid fa-reply'
												onClick={() => {
													onMessageResponse(Number(chat.messages.indexOf(comment)))
												}}></i>
										</div>
									)}

									<div className={`comment-createdAt ${showEmojis === comment ? 'hidden' : ''}`}>
										{formatDate(comment)}
									</div>
								</div>
							</li>
						</React.Fragment>
					))}
				<div ref={bottomRef} className='bottom-ref'></div>
			</div>
			<div className='scroll-down' onClick={() => scrollToBottom()} ref={scrollDownRef}>
				<i className='fa-solid fa-arrow-down'></i>
			</div>

			{messageToDelete && (
				<div className='confirm-message-delete'>
					<div className='hero-shadow'></div>

					<div className='confirm-message-delete__content'>
						<h2>Delete message</h2>
						<p>Do you really want to delete this message?</p>

						<p>Message to delete: </p>
						<div className='message-to-delete custom-scrollbar'>
							{messageToDelete.content && <span>"{messageToDelete.content}"</span>}
							{messageToDelete.image && <img src={messageToDelete.image} alt='' />}
						</div>

						<div className='vertical-btns'>
							<button className='btn btn--secondary' onClick={() => setMessageToDelete(null)}>
								Cancel
							</button>
							<button className='btn' onClick={() => deleteMessage(messageToDelete)}>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</ul>
	)
}

export default Comments
