import React, { useEffect, useRef, useState } from 'react'
import { timestamp, projectStorage } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { v4 as uuid } from 'uuid'
import { useDates } from '../../hooks/useDates'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'
// import InfiniteScroll from 'react-infinite-scroller'

// Assets
import Avatar from '../../components/Avatar'
import ImageIcon from '../../assets/image.svg'
import { ReactComponent as SendIcon } from '../../assets/send-icon.svg'
import { ReactComponent as CloseBtn } from '../../assets/x.svg'
import { ReactComponent as SmileIcon } from '../../assets/smile.svg'

export default function ProjectComments({ project }) {
	const uniqueId = uuid()

	const { formatDate } = useDates()
	const { updateDocument, response } = useFirestore('projects')
	const { user } = useAuthContext()

	const [newComment, setNewComment] = useState('')
	const [imgUpload, setImgUpload] = useState(null)
	const [isAssignedUser, setIsAssignedUser] = useState(false)
	const [fastEmoji, setFastEmoji] = useState('👍')
	const [sendFastEmoji, setSendFastEmoji] = useState(false)

	const inputRef = useRef(null)

	useEffect(() => {
		if (sendFastEmoji === true) {
			// console.log(fastEmoji)
			sendMessage()
		}
	}, [sendFastEmoji])

	useEffect(() => {
		project.assignedUsersId.forEach(id => {
			if (id === user.uid) setIsAssignedUser(true)
		})
	}, [setIsAssignedUser, project.assignedUsersId, user.uid])

	const sendMessage = async () => {
		const commentToAdd = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			content: sendFastEmoji ? fastEmoji : newComment,
			createdAt: timestamp.fromDate(new Date()),
			createdBy: user.uid,
			id: uniqueId,
		}

		if (commentToAdd.content.trim() !== '' && newComment.length < 900 && isAssignedUser) {
			await updateDocument(project.id, {
				messages: [...project.messages, commentToAdd],
				updatedAt: timestamp.fromDate(new Date()),
			})
			if (!response.error) {
				setNewComment('')
				setSendFastEmoji(false)
			}
		}
	}

	const sendImage = async () => {
		const acceptedFileTypes = ['image', 'video']

		if (acceptedFileTypes.includes(imgUpload.type.split('/')[0])) {
			// TODO Make it so sending image AND message at once works, for now image overwrittes the text message

			const storageRef = ref(
				projectStorage,
				`imgs/${project.assignedUsersId[0] + project.assignedUsersId[1]}/${imgUpload.name + uuid()}`
			)
			const uploadTask = uploadBytes(storageRef, imgUpload)

			uploadTask.then(snapshot => {
				getDownloadURL(snapshot.ref).then(async downloadURL => {
					const commentToAdd = {
						displayName: user.displayName,
						photoURL: user.photoURL,
						// content: newComment,
						fileType: imgUpload.type.includes('image/') ? 'image' : 'video',
						image: downloadURL,
						createdAt: timestamp.fromDate(new Date()),
						createdBy: user.uid,
						id: uniqueId,
					}

					if (isAssignedUser) {
						await updateDocument(project.id, {
							messages: [...project.messages, commentToAdd],
							updatedAt: timestamp.fromDate(new Date()),
						})

						if (!response.error) {
							setImgUpload(null)
						}
					}
				})
			})
		}
	}

	const handleSubmit = e => {
		e.preventDefault()

		if (imgUpload) {
			sendImage()
		} else {
			sendMessage()
		}
	}

	const handleKey = e => {
		e.code === 'Enter' && handleSubmit(e)
	}

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

	const [fileThumbnail, setFileThumbnail] = useState('')
	const handleFileChange = e => {
		setImgUpload(e.target.files[0])
		setFileThumbnail(URL.createObjectURL(e.target.files[0]))
	}

	const resetFileInput = e => {
		e.preventDefault()
		inputRef.current.value = ''
		setImgUpload(null)
	}

	const handleEmojis = (emojiData, event) => {
		setNewComment(newComment => newComment + emojiData.emoji)
	}

	const [showEmojis, setShowEmojis] = useState(false)

	// const [chats, setChats] = useState(project.messages.splice(0, 10))
	// console.log(chats)
	// const fetchMoreData = () => {
	// 	console.log('cos')
	// }

	return (
		<div className='chat-comments'>
			<ul>
				<div className='comments-wrapper' id='scrollableDiv'>
					{/* <InfiniteScroll
						pageStart={0}
						loadMore={fetchMoreData}
						hasMore={true}
						isReverse={true}
						loader={
							<div className='loader' key={0}>
								Loading ...
							</div>
						}
						useWindow={false}
						className='infinite-scroll'> */}
					<p className='conv-start'>This is the start of your conversation with this user</p>
					{project.messages.length > 0 &&
						project.messages.map((comment, i, elements) => (
							<React.Fragment key={comment.id}>
								{showSendDate(comment, elements, i) && <div className='time-passed'>{formatDate(comment)}</div>}

								<li className={`${handleMessageStyle(comment, i, elements)}`}>
									{comment.createdBy !== user.uid &&
										(!elements[i - 1] || comment.createdBy !== elements[i - 1].createdBy) && (
											<p className='comment-author'>{comment.displayName}</p>
										)}

									<div className='comment-bottom'>
										{comment.createdBy !== user.uid &&
											(!elements[i + 1] || comment.createdBy !== elements[i + 1].createdBy) && (
												<Avatar src={comment.photoURL} />
											)}

										<div
											className='comment-content'
											style={comment.image ? { padding: 0, backgroundColor: 'transparent' } : null}>
											{comment.content && <p>{comment.content}</p>}
											{comment.image && comment.fileType === 'image' && <img src={comment.image} alt='' />}

											{comment.image && comment.fileType === 'video' && (
												<video src={comment.image} controls playsInline />
											)}
										</div>
									</div>
								</li>
							</React.Fragment>
						))}
					{/* </InfiniteScroll> */}
				</div>
			</ul>

			<form onSubmit={handleSubmit}>
				<div className='add-comment'>
					<label className='attach-image'>
						<input ref={inputRef} type='file' accept='video/*, image/*' onChange={e => handleFileChange(e)} />
						<img src={ImageIcon} alt='' />
					</label>

					<div className='message-field'>
						<div className='column'>
							{imgUpload && (
								<div className='thumbnails'>
									<div className='file-thumbnail'>
										x
										<img src={fileThumbnail} alt='' />
										<button className='remove-img' onClick={e => resetFileInput(e)}>
											<CloseBtn className='close-btn' />
										</button>
									</div>
								</div>
							)}
							<label>
								<input
									maxLength='900'
									placeholder='Aa'
									onChange={e => setNewComment(e.target.value)}
									value={newComment}
									onKeyDown={e => handleKey(e)}
								/>
							</label>
						</div>
						<button className='toggle-emoji-picker' onClick={() => setShowEmojis(!showEmojis)}>
							<SmileIcon />
						</button>

						{showEmojis && (
							<OutsideClickHandler
								onOutsideClick={() => {
									setShowEmojis(false)
								}}>
								<EmojiPicker
									className='emoji-picker'
									onEmojiClick={handleEmojis}
									theme={Theme.DARK}
									previewConfig={{
										defaultCaption: '',
										defaultEmoji: null,
									}}
									// lazyLoadEmojis={true}
									emojiStyle={EmojiStyle.NATIVE}
								/>
							</OutsideClickHandler>
						)}
					</div>

					{!imgUpload && newComment.trim() === '' && (
						<button
							className='input-tool'
							onClick={() => {
								setSendFastEmoji(true)
							}}>
							<span>👍</span>
						</button>
					)}

					{(newComment.trim() !== '' || imgUpload) && (
						<button type='submit' className='input-tool'>
							<SendIcon />
						</button>
					)}
				</div>
				{newComment.length >= 900 && <p className='error'>Message can't be longer than 900 characters</p>}
			</form>
		</div>
	)
}
