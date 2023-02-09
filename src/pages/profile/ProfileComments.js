import { useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useDates } from '../../hooks/useDates'
import { v4 as uuid } from 'uuid'
import { useFirestore } from '../../hooks/useFirestore'

// Components
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { Tooltip, Avatar, Modal, Field, Loader } from '../../components'

export default function ProfileComments({ id }) {
	const uniqueId = uuid()

	const { user } = useAuthContext()
	const { documents } = useCollection('users')
	const { updateDocument } = useFirestore('users')
	const { formatDate } = useDates()
	const { document } = useDocument('users', id)

	const [confirmDelete, setConfirmDelete] = useState(null)
	const [comment, setComment] = useState('')
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [showInputControls, setShowInputControls] = useState(false)
	const [inputError, setInputError] = useState('')

	const getDoc = id => documents?.filter(doc => doc.id === id)?.[0] ?? null

	const addComment = async () => {
		if (comment.trim() === '') return

		if (document.profileComments) {
			await updateDocument(id, {
				profileComments: [
					{
						id: uniqueId,
						content: comment,
						createdBy: user.uid,
						createdAt: timestamp.fromDate(new Date())
					},
					...document.profileComments
				]
			})
			setShowInputControls(false)
			setComment('')
		} else {
			await updateDocument(id, {
				profileComments: [
					{
						id: uniqueId,
						content: comment,
						createdBy: user.uid,
						createdAt: timestamp.fromDate(new Date())
					}
				]
			})
			setShowInputControls(false)
			setComment('')
		}

		setComment('')
	}

	const deleteComment = async comment => {
		await updateDocument(id, {
			profileComments: [
				...document.profileComments.filter(comm => {
					return comment !== comm
				})
			]
		})

		setConfirmDelete(null)
	}

	const handleEmojis = e => {
		setComment(comment => comment + e.emoji)
	}

	if (!document) {
		return <Loader />
	}

	if (document) {
		return (
			<div className='profile__comments'>
				{/* <div className='separator'></div> */}
				<div className='comment-input'>
					<Field
						type='text'
						value={comment}
						setValue={setComment}
						label='Add a comment'
						onClick={() => {
							setShowInputControls(true)
						}}
						error={inputError}
						resetError={() => setInputError('')}
						onLostFocus={() => {
							if (comment === '') {
								setInputError('Please enter a comment')
							}
						}}
					/>

					{showInputControls && (
						<div className='input-controls'>
							<i className='fa-regular fa-face-smile' onClick={() => setShowEmojiPicker(true)}>
								{showEmojiPicker && (
									<Tooltip pos='right' align='start'>
										<OutsideClickHandler
											onOutsideClick={() => {
												setShowEmojiPicker(false)
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
									</Tooltip>
								)}
							</i>

							<button
								className='btn cancel-btn'
								onClick={() => {
									setShowInputControls(false)
									setComment('')
								}}>
								cancel
							</button>

							{comment.trim().length === 0 && (
								<button className='btn' disabled>
									comment
								</button>
							)}

							{comment.trim().length > 0 && (
								<button className='btn' onClick={() => addComment()}>
									comment
								</button>
							)}
						</div>
					)}
				</div>

				<div className='comments-container custom-scrollbar'>
					{document.profileComments &&
						document.profileComments.map(
							comment =>
								getDoc(comment.createdBy) !== null && (
									<div className='comments-container__comment' key={comment.id}>
										<Avatar src={getDoc(comment.createdBy) && getDoc(comment.createdBy).photoURL} />

										<div className='flex-column'>
											<div className='flex-row'>
												<span>{getDoc(comment.createdBy) && getDoc(comment.createdBy).displayName}</span>
												<span>{formatDate(comment.createdAt)}</span>
											</div>

											<p>{comment.content}</p>
										</div>

										{(id === user.uid || comment.createdBy === user.uid) && (
											<i className='fa-solid fa-trash-can delete-comment' onClick={() => setConfirmDelete(comment)}></i>
										)}
									</div>
								)
						)}

					<Modal show={confirmDelete !== null} setShow={() => setConfirmDelete(null)}>
						<div className='flex-column'>
							<h3 className='mt1'>Delete comment</h3>

							<p className='mb3'>Are you sure you want to delete this comment?</p>

							<div className='btn-group'>
								<button className='btn btn--secondary' onClick={() => setConfirmDelete(null)}>
									cancel
								</button>
								<button
									className='btn'
									onClick={() => {
										deleteComment(confirmDelete)
									}}>
									delete
								</button>
							</div>
						</div>
					</Modal>
				</div>
			</div>
		)
	}
}
