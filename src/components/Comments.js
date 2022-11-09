import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useDates } from '../hooks/useDates'
import { useFirestore } from '../hooks/useFirestore'
import { useHistory } from 'react-router-dom'
import FileSaver from 'file-saver'

// Styles && Assets
import './Comments.scss'
import Avatar from './Avatar'

const Comments = ({ chat, onQuery }) => {
	const { formatDate, dates } = useDates()
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('projects')

	const [showImage, setShowImage] = useState('')
	const [messageToDelete, setMessageToDelete] = useState(null)

	const history = useHistory()

	useEffect(() => {
		return history.listen(() => {
			onQuery(null)
		})
	}, [history])

	const handleMessageStyle = (comment, i, elements) => {
		if (elements[i + 1] && comment.response && elements[i + 1].response) {
			if (comment.createdBy === user.uid) {
				return 'owner'
			} else {
				return ''
			}
		} else if (elements[i - 1] && comment.response && (!elements[i - 1].response || elements[i - 1].response)) {
			if (comment.createdBy === user.uid) {
				return 'owner group-top'
			} else {
				return 'group-top'
			}
		} else if (
			!elements[i - 1] ||
			(elements[i + 1] &&
				elements[i - 1] &&
				comment.createdBy !== elements[i - 1].createdBy &&
				comment.createdBy === elements[i + 1].createdBy)
		) {
			if (comment.createdBy === user.uid) {
				return 'owner group-top'
			} else {
				return 'group-top'
			}
		} else if (elements[i + 1] && elements[i + 1].response) {
			if (comment.createdBy === user.uid) {
				return 'owner group-down'
			} else {
				return 'group-down'
			}
		} else if (
			elements[i + 1] &&
			elements[i - 1] &&
			comment.createdBy === elements[i - 1].createdBy &&
			comment.createdBy === elements[i + 1].createdBy
		) {
			if (comment.createdBy === user.uid) {
				return 'owner group-middle'
			} else {
				return 'group-middle'
			}
		} else if (
			elements[i - 1] &&
			comment.createdBy === elements[i - 1].createdBy &&
			(!elements[i + 1] || comment.createdBy !== elements[i + 1].createdBy)
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
			chat.messages.splice(chat.messages.indexOf(comment), 1)

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

	const handleReply = comment => {
		onQuery(comment)
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

	return (
		<ul className='comments custom-scrollbar'>
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
							<i class='fa-solid fa-download'></i>
						</div>
						<div className='tool' onClick={() => hideFullImage()}>
							<i class='fa-solid fa-xmark'></i>
						</div>
					</div>
				</div>
			)}
			<div className='comments-wrapper'>
				<div className='comments__conversation-start'>
					<p>This is the start of your conversation with this user</p>
					{/* <p>{dates(chat.createdAt).fullDate}</p> */}
				</div>

				{chat.messages.length > 0 &&
					chat.messages.map((comment, i, elements) => (
						<React.Fragment key={comment.id}>
							{showSendDate(comment, elements, i) && <div className='comments__time-passed'>{formatDate(comment)}</div>}

							<li className={`${handleMessageStyle(comment, i, elements)}`}>
								{comment.createdBy !== user.uid &&
									(!elements[i - 1] || comment.createdBy !== elements[i - 1].createdBy) && (
										<p className='comment-author'>{comment.displayName}</p>
									)}

								{comment.response && <div className='response-message'>{comment.response.content}</div>}

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
									</div>
									{/* On click show options (deleting message and replying to it) */}

									<div className='comment-tools'>
										{user.uid === comment.createdBy && (
											<i className='fa-solid fa-trash-can' onClick={() => setMessageToDelete(comment)}></i>
										)}
										<i className='fa-solid fa-reply' onClick={() => handleReply(comment)}></i>
									</div>

									<div className='comment-createdAt'>{formatDate(comment)}</div>
								</div>
							</li>
						</React.Fragment>
					))}
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
