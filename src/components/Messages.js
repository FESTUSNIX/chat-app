import React, { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useDates } from '../hooks/useDates'
import { useFirestore } from '../hooks/useFirestore'
import { useHistory } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import FileSaver from 'file-saver'
import Message from './Message'

// Styles && Assets
import './Messages.scss'
import Avatar from './Avatar'

const Messages = ({ chat, onMessageResponse, setBottomDiv }) => {
	const { user } = useAuthContext()
	const { dates } = useDates()
	const { updateDocument } = useFirestore('projects')

	const [showImage, setShowImage] = useState('')
	const [messageToDelete, setMessageToDelete] = useState(null)
	const [emojiReactions, setEmojiReactions] = useState({
		message: null,
		reactions: [],
	})

	const history = useHistory()
	const bottomRef = useRef()
	const scrollDownRef = useRef()

	useEffect(() => {
		setBottomDiv(bottomRef)
		scrollToBottom()
	}, [])

	useEffect(() => {
		return history.listen(() => {
			setBottomDiv(bottomRef)
			scrollToBottom()
			onMessageResponse(null)
		})
	}, [history])

	const deleteMessage = async message => {
		if (user.uid === message.createdBy) {
			chat.messages[chat.messages.indexOf(message)] = {
				...chat.messages[chat.messages.indexOf(message)],
				content: 'Message deleted',
				emojiReactions: null,
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
				setEmojiReactions({
					message: null,
					reactions: [],
				})
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<ul className='messages custom-scrollbar' id='messages' onScroll={e => handleScrollDownBtn(e)}>
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
			<div className='messages-wrapper'>
				<div className='messages__conversation-start'>
					<p>This is the start of your conversation with this user</p>
					<p>{dates(chat.createdAt).fullDate}</p>
				</div>

				{chat.messages.length > 0 &&
					chat.messages.map((message, i, elements) => (
						<Message
							key={message.id}
							message={message}
							elements={elements}
							i={i}
							chat={chat}
							onMessageResponse={onMessageResponse}
							setMessageToDelete={setMessageToDelete}
							showImage={showImage}
							setShowImage={setShowImage}
							setEmojiReactions={setEmojiReactions}
						/>
					))}
				<div ref={bottomRef} className='bottom-ref'></div>
			</div>
			<div className='scroll-down' onClick={() => scrollToBottom()} ref={scrollDownRef}>
				<i className='fa-solid fa-arrow-down'></i>
			</div>

			{messageToDelete && (
				<div className='confirm-message-delete'>
					<div className='hero-shadow'></div>

					<OutsideClickHandler
						onOutsideClick={() => {
							setMessageToDelete(null)
						}}>
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
					</OutsideClickHandler>
				</div>
			)}

			{emojiReactions.reactions.length !== 0 && (
				<div className='show-reactions'>
					<div className='hero-shadow'></div>

					<OutsideClickHandler
						onOutsideClick={() => {
							setEmojiReactions({
								message: null,
								reactions: [],
							})
						}}>
						<div className='show-reactions__content'>
							<h3>Reactions</h3>
							{emojiReactions.reactions.map(reaction =>
								reaction !== null ? (
									<div
										className='reaction'
										onClick={() => deleteEmojiReaction(emojiReactions.message, reaction)}
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

							<i
								className='fa-solid fa-xmark close-btn'
								onClick={() =>
									setEmojiReactions({
										message: null,
										reactions: [],
									})
								}></i>
						</div>
					</OutsideClickHandler>
				</div>
			)}
		</ul>
	)
}

export default Messages
