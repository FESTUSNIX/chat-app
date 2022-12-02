import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

// Components
import Messages from '../../components/Messages'
import ChatInput from '../../components/ChatInput'
import Avatar from '../../components/Avatar'
import OutsideClickHandler from 'react-outside-click-handler'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import Modal from '../../components/Modal'

// Styles && Assets
import './Chat.scss'

export default function Chat({ setCurrentChat, inputRef }) {
	const { user } = useAuthContext()
	const { id } = useParams()
	const { error, document } = useDocument('projects', id)
	const { updateDocument } = useFirestore('projects')

	const [isAssignedUser, setIsAssignedUser] = useState(false)
	const [messageResponse, onMessageResponse] = useState(null)
	const [bottomDiv, setBottomDiv] = useState(null)
	const [showChatOptions, setShowChatOptions] = useState(false)
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [showNicknameInput, setShowNicknameInput] = useState(null)
	const [newNickname, setNewNickname] = useState('')
	const [otherUser, setOtherUser] = useState(null)
	const [currentUser, setCurrentUser] = useState(null)

	useEffect(() => {
		if (document !== null) {
			document.assignedUsers.forEach(u => {
				if (u.id !== user.uid) {
					setOtherUser(u)
				}
			})
		}

		if (document) {
			document.assignedUsers.forEach(u => {
				if (u.id === user.uid) {
					setCurrentUser(u)
					setIsAssignedUser(true)
				}
			})
		}

		setCurrentChat(document)
	}, [id, document])

	if (error) {
		return <div className='error'>{error}</div>
	}

	if (!document) {
		return <div className='loading'>Loading...</div>
	}

	const handleSeen = () => {
		if (
			document.messages[document.messages.length - 1] &&
			document.messages[document.messages.length - 1].createdBy !== user.uid
		) {
			updateDocument(document.id, {
				isRead: true,
			})
		}
	}

	const changeChatEmoji = e => {
		updateDocument(document.id, {
			chatEmoji: e.unified,
		})
	}

	const handleNicknameInput = u => {
		setShowNicknameInput(u.id)
	}

	const changeNickname = user => {
		if (newNickname.trim() !== '' && newNickname.trim().length < 80) {
			document.assignedUsers.forEach(u => {
				if (u !== user) {
					console.log(newNickname)
					updateDocument(document.id, {
						assignedUsers: [
							u,
							{
								id: user.id,
								displayName: user.displayName,
								nickname: newNickname.trim(),
								photoURL: user.photoURL,
							},
						],
					})
					setShowModal(false)
				}
			})
		}
	}
	return (
		<>
			{isAssignedUser && otherUser && (
				<div className='chat'>
					<div className='vertical-container'>
						<div className='chat__top-bar'>
							<div className='flex-row'>
								<Avatar src={otherUser.photoURL} />
								<div className='vertical-container'>
									<h3>{otherUser.nickname}</h3>
									{otherUser.online && <p className='isActive'>Active now</p>}
								</div>
							</div>

							<div
								className='top-bar-options'
								onClick={e => {
									setShowChatOptions(prevValue => !prevValue)
									e.target.classList.toggle('active')
								}}>
								<i className='fa-solid fa-ellipsis-vertical'></i>
							</div>
						</div>
						<div
							className='chat__comments'
							onClick={() => {
								handleSeen()
								inputRef.current.focus()
							}}>
							<Messages
								chat={document}
								onMessageResponse={onMessageResponse}
								setBottomDiv={setBottomDiv}
								otherUser={otherUser}
								currentUser={currentUser}
							/>
							<ChatInput
								chat={document}
								messageResponse={messageResponse}
								onMessageResponse={onMessageResponse}
								bottomDiv={bottomDiv}
								inputRef={inputRef}
							/>
						</div>
					</div>

					{showChatOptions && (
						<aside className='chat__options'>
							<Avatar src={otherUser.photoURL} />

							<h3>{otherUser.nickname}</h3>

							<div className='option'>
								<div className='option__icon'>
									<i className='fa-solid fa-paint-roller'></i>
								</div>
								<div className='option__name'>Change theme</div>
							</div>

							<div
								className='option'
								onClick={() => {
									setShowEmojiPicker(true)
								}}>
								<div className='option__icon'>
									<i className='fa-solid fa-thumbs-up'></i>
								</div>
								<div className='option__name'>Change emoji icon</div>
							</div>

							<div
								className='option'
								onClick={() => {
									setShowModal(true)
								}}>
								<div className='option__icon'>Aa</div>
								<div className='option__name'>Edit nicknames</div>
							</div>

							<Modal
								show={showModal}
								setShow={() => setShowModal(false)}
								onClose={() => {
									setNewNickname('')
									setShowNicknameInput(null)
								}}>
								{document.assignedUsers.map(u => (
									// <OutsideClickHandler onOutsideClick={() => setShowNicknameInput(null)}>
									<div
										key={u.id}
										className='user'
										onClick={() => {
											setNewNickname(' ')
											handleNicknameInput(u)
										}}>
										<div className='author'>
											<Avatar src={u.photoURL} />
											{showNicknameInput !== u.id && (
												<div className='flex-column'>
													<p className='user__display-name'>{u.nickname}</p>
													<p>Set nickname</p>
												</div>
											)}
											{showNicknameInput === u.id && (
												<input
													type='text'
													placeholder={u.nickname}
													value={newNickname}
													onChange={e => {
														setNewNickname(e.target.value)
													}}
												/>
											)}
										</div>

										{showNicknameInput !== u.id && <i className='fa-solid fa-pen-to-square'></i>}
										{showNicknameInput === u.id && (
											<i
												className='fa-solid fa-check'
												onClick={() => {
													changeNickname(u)
												}}></i>
										)}
									</div>
									// </OutsideClickHandler>
								))}
							</Modal>

							{showEmojiPicker && (
								<OutsideClickHandler
									onOutsideClick={() => {
										setShowEmojiPicker(false)
									}}>
									<EmojiPicker
										className='emoji-picker'
										onEmojiClick={e => {
											changeChatEmoji(e)
											setShowEmojiPicker(false)
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
							)}
						</aside>
					)}
				</div>
			)}
		</>
	)
}
