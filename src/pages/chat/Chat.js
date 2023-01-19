import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'

// Styles && Assets
import './Chat.scss'

// Components
import Messages from './Messages/Messages'
import MessageField from './MessageField/MessageField'
import Avatar from '../../components/Avatar/Avatar'
import ChatOptions from './ChatOptions/ChatOptions'

export default function Chat({ setCurrentChat, inputRef, currentTheme }) {
	const { user } = useAuthContext()
	const { id } = useParams()
	const { error, document } = useDocument('projects', id)
	const { updateDocument } = useFirestore('projects')

	const [isAssignedUser, setIsAssignedUser] = useState(false)
	const [messageResponse, onMessageResponse] = useState(null)
	const [bottomDiv, setBottomDiv] = useState(null)
	const [showChatOptions, setShowChatOptions] = useState(false)

	const [otherUserLocal, setOtherUserLocal] = useState(null)
	const [currentUserLocal, setCurrentUserLocal] = useState(null)

	const { document: otherUserDoc } = useDocument('users', otherUserLocal ? otherUserLocal.id : null)
	const { document: currentUserDoc } = useDocument('users', currentUserLocal ? currentUserLocal.id : null)

	useEffect(() => {
		if (document !== null) {
			document.assignedUsers.forEach(u => {
				if (u.id !== user.uid) {
					setOtherUserLocal({ ...u })
				}
			})

			document.assignedUsers.forEach(u => {
				if (u.id === user.uid) {
					setCurrentUserLocal({ ...u })
					setIsAssignedUser(true)
				}
			})
		}

		setCurrentChat(document)
	}, [id, document])

	const handleSeen = async () => {
		if (document.messages && document.messages.length > 0) {
			await updateDocument(document.id, {
				isRead: true,
				assignedUsers: [
					otherUserLocal,
					{
						id: currentUserDoc.id,
						nickname: currentUserLocal.nickname,
						lastRead: document.messages[document.messages.length - 1].id,
					},
				],
			})
		}
	}

	if (error) {
		return <div className='error'>{error}</div>
	}

	if (!document) {
		return <div className='loading'>Loading...</div>
	}

	return (
		<>
			{isAssignedUser && otherUserDoc && currentUserDoc && (
				<div className='chat'>
					<div className='vertical-container'>
						<div className='chat__top-bar'>
							<div className='flex-row'>
								<Avatar src={otherUserDoc.photoURL} />
								<div className='vertical-container'>
									<h3>{otherUserLocal.nickname}</h3>
									{<p className='isActive'>{currentUserDoc.status ? currentUserDoc.status : ''}</p>}
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
							}}>
							<Messages
								chat={document}
								onMessageResponse={onMessageResponse}
								setBottomDiv={setBottomDiv}
								otherUser={otherUserDoc}
								currentUser={currentUserDoc}
							/>
							<MessageField
								chat={document}
								messageResponse={messageResponse}
								onMessageResponse={onMessageResponse}
								bottomDiv={bottomDiv}
								inputRef={inputRef}
								handleSeen={handleSeen}
								otherUser={otherUserDoc}
								currentUser={currentUserDoc}
							/>
						</div>
					</div>

					{showChatOptions && (
						<ChatOptions
							onMessageResponse={onMessageResponse}
							otherUser={otherUserDoc}
							chat={document}
							currentTheme={currentTheme}
							otherUserLocal={otherUserLocal}
						/>
					)}
				</div>
			)}
		</>
	)
}
