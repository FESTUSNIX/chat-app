import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

// Components
import Messages from '../../components/Messages'
import ChatInput from '../../components/ChatInput'

// Styles && Assets
import './Chat.scss'
import Avatar from '../../components/Avatar'
import OutsideClickHandler from 'react-outside-click-handler'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'

export default function Chat({ setCurrentChat, inputRef }) {
	const { user } = useAuthContext()
	const { id } = useParams()

	const { error, document } = useDocument('projects', id)
	const { updateDocument } = useFirestore('projects')

	const [isAssignedUser, setIsAssignedUser] = useState(false)
	const [messageResponse, onMessageResponse] = useState(null)
	const [bottomDiv, setBottomDiv] = useState(null)
	const [otherUsersId, setOtherUsersId] = useState(null)
	const [showChatOptions, setShowChatOptions] = useState(false)
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)

	useEffect(() => {
		if (document !== null) {
			document.assignedUsersId.forEach(id => {
				if (id !== user.uid) {
					setOtherUsersId(id)
				}
			})
		}
		setCurrentChat(document)
	}, [id, document])

	const { document: otherUser } = useDocument('users', otherUsersId)

	useEffect(() => {
		if (document) {
			document.assignedUsersId.forEach(id => {
				if (id === user.uid) setIsAssignedUser(true)
			})
		}
	}, [document, user.uid])

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

	return (
		<>
			{isAssignedUser && otherUser && (
				<div className='chat' onClick={() => inputRef.current.focus()}>
					<div className='vertical-container'>
						<div className='chat__top-bar'>
							<div className='flex-row'>
								<Avatar src={otherUser.photoURL} />
								<div className='vertical-container'>
									<h3>{otherUser.displayName}</h3>
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
						<div className='chat__comments' onClick={() => handleSeen()}>
							<Messages chat={document} onMessageResponse={onMessageResponse} setBottomDiv={setBottomDiv} />
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

							<h3>{otherUser.displayName}</h3>

							<div className='option'>
								<div className='option__icon'>
									<i className='fa-solid fa-paint-roller'></i>
								</div>
								<div className='option__name'>Change theme</div>
							</div>

							<div
								className='option'
								onClick={e => {
									setShowEmojiPicker(true)
			
								}}>
								<div className='option__icon'>
									<i className='fa-solid fa-thumbs-up'></i>
								</div>
								<div className='option__name'>Change emoji icon</div>
							</div>

							<div className='option'>
								<div className='option__icon'>Aa</div>
								<div className='option__name'>Edit nicknames</div>
							</div>

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
