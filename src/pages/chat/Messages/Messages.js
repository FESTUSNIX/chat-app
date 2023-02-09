import React, { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useDates } from '../../../hooks/useDates'
import { useFirestore } from '../../../hooks/useFirestore'
import { useLocation } from 'react-router-dom'
import FileSaver from 'file-saver'
import Message from './Message/Message'

// Styles && Assets
import './Messages.scss'
import { Modal } from '../../../components'

const Messages = ({ chat, onMessageResponse, setBottomDiv, otherUser, currentUser }) => {
	const { user } = useAuthContext()
	const { dates } = useDates()
	const { updateDocument } = useFirestore('projects')

	const [showImage, setShowImage] = useState('')
	const [messageToDelete, setMessageToDelete] = useState(null)
	const [showModal, setShowModal] = useState(false)

	const location = useLocation()
	const bottomRef = useRef()
	const scrollDownRef = useRef()

	useEffect(() => {
		setBottomDiv(bottomRef)
		scrollToBottom()
	}, [])

	useEffect(() => {
		setBottomDiv(bottomRef)
		scrollToBottom()
		onMessageResponse(null)
	}, [location])

	useEffect(() => {
		if (messageToDelete !== null) {
			setShowModal(true)
		} else {
			setShowModal(false)
		}
	}, [messageToDelete, showModal])

	const deleteMessage = async message => {
		if (user.uid === message.createdBy) {
			chat.messages[chat.messages.indexOf(message)] = {
				...chat.messages[chat.messages.indexOf(message)],
				content: 'Message deleted',
				emojiReactions: null,
				deleted: true
			}

			try {
				await updateDocument(chat.id, {
					messages: [...chat.messages]
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
				block: 'end'
			})
		}
	}

	const handleScrollDownBtn = e => {
		const winScroll = e.target.scrollTop

		if (-winScroll <= 300) {
			scrollDownRef.current.classList.remove('active')
		}

		if (-winScroll >= 300) {
			scrollDownRef.current.classList.add('active')
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
						/>
					))}
				<div ref={bottomRef} className='bottom-ref'></div>
			</div>
			<div className='scroll-down' onClick={() => scrollToBottom()} ref={scrollDownRef}>
				<i className='fa-solid fa-arrow-down'></i>
			</div>
			{messageToDelete !== null && (
				<Modal show={showModal} setShow={() => setMessageToDelete(null)}>
					<div className='confirm-message-delete'>
						<h2>Delete message</h2>
						<p>Do you really want to delete this message?</p>

						<p>Message to delete: </p>
						<div className='message-to-delete custom-scrollbar'>
							{messageToDelete.content && <span>"{messageToDelete.content}"</span>}
							{messageToDelete.image && <img src={messageToDelete.image} alt='' />}
						</div>

						<div className='vertical-btns'>
							<button
								className='btn btn--secondary'
								onClick={() => {
									setMessageToDelete(null)
								}}>
								Cancel
							</button>
							<button className='btn' onClick={() => deleteMessage(messageToDelete)}>
								Delete
							</button>
						</div>
					</div>
				</Modal>
			)}
		</ul>
	)
}

export default Messages
