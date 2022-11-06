import React, { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useDates } from '../hooks/useDates'
import FileSaver from 'file-saver'

// Styles && Assets
import './Comments.scss'
import Avatar from './Avatar'

const Comments = ({ chat }) => {
	const { formatDate } = useDates()
	const { user } = useAuthContext()

	const handleMessageStyle = (comment, i, elements) => {
		if (
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

	const [showImage, setShowImage] = useState('')

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
		<ul className='comments'>
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
				<p className='comments__conversation-start'>This is the start of your conversation with this user</p>

				{chat.messages.length > 0 &&
					chat.messages.map((comment, i, elements) => (
						<React.Fragment key={comment.id}>
							{showSendDate(comment, elements, i) && <div className='comments__time-passed'>{formatDate(comment)}</div>}

							<li className={`${handleMessageStyle(comment, i, elements)}`}>
								{comment.createdBy !== user.uid &&
									(!elements[i - 1] || comment.createdBy !== elements[i - 1].createdBy) && (
										<p className='comment-author'>{comment.displayName}</p>
									)}

								<div className='comment-content'>
									<div className='comment-createdAt'>{formatDate(comment)}</div>

									{/* On click show options (deleting message and answering to it) */}
									<div className='comment-tools'>
										<i class='fa-solid fa-gear'></i>
									</div>
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
								</div>
							</li>
						</React.Fragment>
					))}
			</div>
		</ul>
	)
}

export default Comments
