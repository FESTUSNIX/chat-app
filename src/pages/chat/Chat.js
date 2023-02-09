import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

// Styles && Assets
import './Chat.scss'

// Components
import { useMediaQuery } from 'react-responsive'
import MediaQuery from 'react-responsive'
import Messages from './Messages/Messages'
import MessageField from './MessageField/MessageField'
import ChatOptions from './ChatOptions/ChatOptions'

import { Avatar } from '../../components'

export default function Chat({ setCurrentChat, inputRef, currentTheme, showChat, setShowChat }) {
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
						lastRead: document.messages[document.messages.length - 1].id
					}
				]
			})
		}
	}
	const queryMd = useMediaQuery({ query: '(max-width: 768px)' })

	if (error) {
		return <div className='error'>{error}</div>
	}

	if (!document) {
		return <div className='loading'>Loading...</div>
	}

	return (
		isAssignedUser &&
		otherUserDoc &&
		currentUserDoc &&
		(queryMd ? showChat : true) && (
			<div className={`chat ${showChat ? 'active' : ''}`}>
				<div className='vertical-container'>
					<div className='chat__top-bar'>
						<div className='flex-row'>
							<MediaQuery maxWidth={768}>
								<i className='fa-solid fa-arrow-left close-chat' onClick={() => setShowChat(false)}></i>
							</MediaQuery>

							<Avatar src={otherUserDoc.photoURL} />
							<div className='vertical-container'>
								<h3>{otherUserLocal.nickname}</h3>
								{<p className='isActive'>{otherUserDoc.status ? otherUserDoc.status : ''}</p>}
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
						setShowChatOptions={setShowChatOptions}
					/>
				)}
			</div>
		)
	)
}
