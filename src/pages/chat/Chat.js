import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'

// Components
import Messages from './Messages/Messages'
import ChatInput from './MessageField/MessageField'
import Avatar from '../../components/Avatar/Avatar'
import ChatOptions from './ChatOptions/ChatOptions'

// Styles && Assets
import './Chat.scss'

export default function Chat({ setCurrentChat, inputRef, currentTheme }) {
	const { user } = useAuthContext()
	const { id } = useParams()
	const { error, document } = useDocument('projects', id)
	const { documents: users } = useCollection('users')
	const { updateDocument } = useFirestore('projects')

	const [isAssignedUser, setIsAssignedUser] = useState(false)
	const [messageResponse, onMessageResponse] = useState(null)
	const [bottomDiv, setBottomDiv] = useState(null)
	const [showChatOptions, setShowChatOptions] = useState(false)
	const [otherUser, setOtherUser] = useState(null)
	const [currentUser, setCurrentUser] = useState(null)
	const [otherUserActive, setOtherUserActive] = useState(null)

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

	useEffect(() => {
		if (users !== null && otherUser !== null) {
			users.forEach(u => {
				if (u.id === otherUser.id) {
					setOtherUserActive(u.online)
				}
			})
		}
	}, [id, users, otherUser])

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
									{otherUserActive === true && <p className='isActive'>Active now</p>}
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
						<ChatOptions
							onMessageResponse={onMessageResponse}
							otherUser={otherUser}
							chat={document}
							currentTheme={currentTheme}
						/>
					)}
				</div>
			)}
		</>
	)
}
