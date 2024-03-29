import React, { useEffect, useRef, useState } from 'react'
import { timestamp, projectStorage } from '../../../firebase/config'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useFirestore } from '../../../hooks/useFirestore'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import EmojiPicker, { Emoji, EmojiStyle, Theme } from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'
import imageCompression from 'browser-image-compression'

// Styles && Assets
import './MessageField.scss'
import ResponseField from './ResponseField'

const MessageField = ({ chat, messageResponse, onMessageResponse, bottomDiv, inputRef, otherUser, currentUser }) => {
	const uniqueId = uuid()

	const { updateDocument, response } = useFirestore('projects')
	const { user } = useAuthContext()

	const [newComment, setNewComment] = useState('')
	const [imgUpload, setImgUpload] = useState(null)
	const [isAssignedUser, setIsAssignedUser] = useState(false)
	const [fastEmoji, setFastEmoji] = useState(chat.chatEmoji)
	const [sendFastEmoji, setSendFastEmoji] = useState(false)
	const [showEmojis, setShowEmojis] = useState(false)
	const [seen, setSeen] = useState(false)
	const fileInputRef = useRef(null)

	useEffect(() => {
		inputRef.current.focus()
	}, [messageResponse])

	useEffect(() => {
		chat.assignedUsersId.forEach(id => {
			if (id === user.uid) setIsAssignedUser(true)
		})
	}, [setIsAssignedUser, chat.assignedUsersId, user.uid])

	const scrollToBottom = () => {
		bottomDiv.current.scrollIntoView({
			block: 'end'
		})
	}

	const sendMessage = async () => {
		const commentToAdd = {
			id: uniqueId,
			content: sendFastEmoji ? fastEmoji : newComment,
			createdAt: timestamp.fromDate(new Date()),
			createdBy: user.uid,
			response: messageResponse !== null ? messageResponse : null
		}

		if (commentToAdd.content.trim() !== '' && newComment.length < 900 && isAssignedUser) {
			await updateDocument(chat.id, {
				messages: [...chat.messages, commentToAdd],
				updatedAt: timestamp.fromDate(new Date())
			})
			if (!response.error) {
				setSeen(!seen)
				scrollToBottom()
				setNewComment('')
				setSendFastEmoji(false)
				onMessageResponse(null)
			}
		}
	}

	useEffect(() => {
		if (document.messages && document.messages.length > 0) {
			updateDocument(chat.id, {
				isRead: true,
				assignedUsers: [
					otherUser,
					{
						id: currentUser.id,
						nickname: currentUser.nickname,
						lastRead: chat.messages[chat.messages.length - 1].id
					}
				]
			})
		}
	}, [seen])

	const sendImage = async () => {
		const acceptedFileTypes = ['image', 'video']

		if (acceptedFileTypes.includes(imgUpload.type.split('/')[0])) {
			const storageRef = ref(
				projectStorage,
				`imgs/${chat.assignedUsersId[0] + chat.assignedUsersId[1]}/${uuid() + imgUpload.name}`
			)
			const uploadTask = uploadBytes(storageRef, imgUpload)

			uploadTask.then(snapshot => {
				getDownloadURL(snapshot.ref).then(async downloadURL => {
					const commentToAdd = {
						id: uniqueId,
						fileType: imgUpload.type.includes('image/') ? 'image' : 'video',
						image: downloadURL,
						createdAt: timestamp.fromDate(new Date()),
						createdBy: user.uid,
						response: messageResponse !== null ? messageResponse : null
					}

					if (isAssignedUser) {
						await updateDocument(chat.id, {
							messages: [...chat.messages, commentToAdd],
							updatedAt: timestamp.fromDate(new Date()),
							isRead: false
						})

						if (!response.error) {
							setSeen(!seen)
							scrollToBottom()
							setImgUpload(null)
						}
					}
				})
			})
		}
	}

	const handleImageUpload = async e => {
		const imageFile = e.target.files[0]

		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true
		}
		try {
			const compressedFile = await imageCompression(imageFile, options)
			await setImgUpload(compressedFile)
		} catch (error) {
			console.log(error)
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

	const [fileThumbnail, setFileThumbnail] = useState('')

	const handleFileChange = e => {
		handleImageUpload(e)
		setFileThumbnail(URL.createObjectURL(e.target.files[0]))
	}

	const resetFileInput = e => {
		e.preventDefault()
		fileInputRef.current.value = ''
		setImgUpload(null)
	}

	const handleEmojis = e => {
		setNewComment(newComment => newComment + e.emoji)
	}

	return (
		chat && (
			<form onSubmit={handleSubmit}>
				{messageResponse !== null && (
					<ResponseField chat={chat} messageResponse={messageResponse} onMessageResponse={onMessageResponse} />
				)}

				<div className='add-comment'>
					<label className='attach-image'>
						<input ref={fileInputRef} type='file' accept='video/*, image/*' onChange={e => handleFileChange(e)} />
						<i className='fa-regular fa-image'></i>
					</label>

					<div className='message-field'>
						<div className='column'>
							{imgUpload && (
								<div className='thumbnails'>
									<div className='file-thumbnail'>
										<img src={fileThumbnail} alt='' />
										<button className='remove-img' onClick={e => resetFileInput(e)}>
											<i className='fa-solid fa-xmark close-btn'></i>
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
									ref={inputRef}
								/>
							</label>
						</div>
						<button
							className='toggle-emoji-picker'
							onClick={e => {
								e.preventDefault()
								setShowEmojis(!showEmojis)
							}}>
							<i className='fa-regular fa-face-smile'></i>
						</button>

						{showEmojis && (
							<OutsideClickHandler
								onOutsideClick={() => {
									setShowEmojis(false)
								}}>
								<EmojiPicker
									className='emoji-picker'
									onEmojiClick={e => {
										handleEmojis(e)
									}}
									theme={Theme.DARK}
									previewConfig={{
										defaultCaption: '',
										defaultEmoji: null
									}}
									emojiStyle={EmojiStyle.NATIVE}
								/>
							</OutsideClickHandler>
						)}
					</div>

					{!imgUpload && newComment.trim() === '' && (
						<button
							className='input-tool'
							onClick={e => {
								setFastEmoji(e.target.innerText)
								setSendFastEmoji(true)
							}}>
							{chat.chatEmoji && <Emoji unified={chat.chatEmoji} emojiStyle={EmojiStyle.NATIVE} size={33} />}
						</button>
					)}

					{(newComment.trim() !== '' || imgUpload) && (
						<button type='submit' className='input-tool'>
							<i className='fa-solid fa-paper-plane'></i>
						</button>
					)}
				</div>
				{newComment.length >= 900 && <p className='error'>Message can't be longer than 900 characters</p>}
			</form>
		)
	)
}

export default MessageField
