import React, { useEffect, useRef, useState } from 'react'
import { timestamp, projectStorage } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFirestore } from '../hooks/useFirestore'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'
import imageCompression from 'browser-image-compression'

// Styles && Assets
import './ChatInput.scss'
import ImageIcon from '../assets/image.svg'
import { ReactComponent as SendIcon } from '../assets/send-icon.svg'
import { ReactComponent as CloseBtn } from '../assets/x.svg'
import { ReactComponent as SmileIcon } from '../assets/smile.svg'

const ChatInput = ({ chat }) => {
	const uniqueId = uuid()

	const { updateDocument, response } = useFirestore('projects')
	const { user } = useAuthContext()

	const [newComment, setNewComment] = useState('')
	const [imgUpload, setImgUpload] = useState(null)
	const [isAssignedUser, setIsAssignedUser] = useState(false)
	// setFastEmoji is left for changing fastEmoji later
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
		chat.assignedUsersId.forEach(id => {
			if (id === user.uid) setIsAssignedUser(true)
		})
	}, [setIsAssignedUser, chat.assignedUsersId, user.uid])

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
			await updateDocument(chat.id, {
				messages: [...chat.messages, commentToAdd],
				updatedAt: timestamp.fromDate(new Date()),
			})
			if (!response.error) {
				setNewComment('')
				setSendFastEmoji(false)
			}
		}
	}
	const handleImageUpload = async e => {
		const imageFile = e.target.files[0]
		// console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
		// console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)

		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		}
		try {
			const compressedFile = await imageCompression(imageFile, options)
			// console.log('compressedFile instanceof Blob', compressedFile instanceof Blob) // true
			// console.log(`compressedFile size ${compressedFile.size / 2048 / 2048} MB`) // smaller than maxSizeMB
			await setImgUpload(compressedFile)
		} catch (error) {
			console.log(error)
		}
	}

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
						await updateDocument(chat.id, {
							messages: [...chat.messages, commentToAdd],
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

	const [fileThumbnail, setFileThumbnail] = useState('')

	const handleFileChange = e => {
		handleImageUpload(e)
		// setImgUpload(e.target.files[0])
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

	return (
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
	)
}

export default ChatInput
