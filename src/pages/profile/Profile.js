import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config'
import { useDates } from '../../hooks/useDates'
import { v4 as uuid } from 'uuid'
import ReactCountryFlag from 'react-country-flag'

// Styles
import './Profile.scss'

// Components
import AvatarWithStatus from '../../components/AvatarWithStatus/AvatarWithStatus'
import Tooltip from '../../components/Tooltip/Tooltip'
import randomColor from 'randomcolor'
import Avatar from '../../components/Avatar/Avatar'
import Modal from '../../components/Modal/Modal'
import OutsideClickHandler from 'react-outside-click-handler'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import { useRef } from 'react'

export default function Profile() {
	const randColor = randomColor()
	const uniqueId = uuid()
	const commentInput = useRef()

	const { id } = useParams()
	const { user } = useAuthContext()
	const { error, document: userDoc } = useDocument('users', id)
	const { documents } = useCollection('users')
	const { updateDocument } = useFirestore('users')
	const { formatDate } = useDates()

	const [confirmDelete, setConfirmDelete] = useState(null)
	const [comment, setComment] = useState('')
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [showInputControls, setShowInputControls] = useState(false)

	const handleStatus = async status => {
		await updateDocument(user.uid, {
			status: status,
		})
	}

	const getDoc = id => {
		let res = null
		if (documents) {
			documents.filter(doc => {
				if (doc.id === id) {
					res = doc
					return true
				}
			})
		}

		return res
	}

	const addComment = async () => {
		if (comment.trim() === '') return

		if (userDoc.profileComments) {
			await updateDocument(id, {
				profileComments: [
					{
						id: uniqueId,
						content: comment,
						createdBy: user.uid,
						createdAt: timestamp.fromDate(new Date()),
					},
					...userDoc.profileComments,
				],
			})
		} else {
			await updateDocument(id, {
				profileComments: [
					{
						id: uniqueId,
						content: comment,
						createdBy: user.uid,
						createdAt: timestamp.fromDate(new Date()),
					},
				],
			})
		}

		setComment('')
	}

	const deleteComment = async comment => {
		await updateDocument(id, {
			profileComments: [
				...userDoc.profileComments.filter(comm => {
					return comment !== comm
				}),
			],
		})

		setConfirmDelete(null)
	}

	const handleEmojis = e => {
		setComment(comment => comment + e.emoji)
	}

	if (error !== null) {
		return <div className='error'>{error}</div>
	}

	if (userDoc) {
		return (
			<div className='profile'>
				<div className='wrapper flex-column'>
					<div
						className='banner'
						style={userDoc.banner ? { background: userDoc.banner } : { background: randColor }}></div>

					<div className='profile__header'>
						<div className='flex-row'>
							<AvatarWithStatus userId={userDoc.id} />

							<div className='flex-column'>
								<div>
									<h3 className='name'>{userDoc.displayName}</h3>
									{userDoc.bio && <p className='bio'>{userDoc.bio}</p>}
								</div>

								<div className='badges'>
									{userDoc.createdAt && (
										<div className='badges__badge'>
											<p>
												<span>Joined</span> - {userDoc.createdAt}
											</p>
										</div>
									)}

									{userDoc.pronouns && (
										<div className='badges__badge'>
											<p>
												<span>Pronouns</span> - {userDoc.pronouns}
											</p>
										</div>
									)}

									{userDoc.country && (
										<div className='badges__badge'>
											<p className='country'>
												<ReactCountryFlag countryCode={`${userDoc.country.code}`} svg />
												{userDoc.country.name}
											</p>
										</div>
									)}
								</div>
							</div>
						</div>

						<button className='action-btn btn'>Add friend</button>
					</div>

					<div className='profile__comments'>
						<div className='separator'></div>
						<div className='comment-input'>
							<Avatar src={user.photoURL} />

							<input
								type='text'
								placeholder='Add a comment'
								value={comment}
								onChange={e => setComment(e.target.value)}
								ref={commentInput}
								onClick={() => {
									setShowInputControls(true)
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
															defaultEmoji: null,
														}}
														// lazyLoadEmojis={true}
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

						<div className='comments-container'>
							{userDoc.profileComments &&
								userDoc.profileComments.map(
									comment =>
										getDoc(comment.createdBy) !== null && (
											<div className='comments-container__comment' key={comment.id}>
												<Avatar src={getDoc(comment.createdBy).photoURL} />

												<div className='flex-column'>
													<div className='flex-row'>
														<span>{getDoc(comment.createdBy).displayName}</span>
														<span>{formatDate(comment.createdAt)}</span>
													</div>

													<p>{comment.content}</p>
												</div>

												{(id === user.uid || comment.createdBy === user.uid) && (
													<i
														className='fa-solid fa-trash-can delete-comment'
														onClick={() => setConfirmDelete(comment)}></i>
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
				</div>
			</div>
		)
	}
	return null
}
