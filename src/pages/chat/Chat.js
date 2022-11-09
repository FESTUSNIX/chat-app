import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'

// Components
import Comments from '../../components/Comments'
import ChatInput from '../../components/ChatInput'

// Styles && Assets
import './Chat.scss'
import Avatar from '../../components/Avatar'

export default function Chat() {
	const [isAssignedUser, setIsAssignedUser] = useState(false)
	const [query, setQuery] = useState(null)

	const { user } = useAuthContext()
	const { id } = useParams()

	const { error, document } = useDocument('projects', id)
	let rightUrl = ''
	let rightDisplayName = ''

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

	document.assignedUsersPhotoURL.forEach(url => {
		if (url !== user.photoURL) {
			rightUrl = url
		}
	})

	document.assignedUsersName.forEach(name => {
		if (name !== user.displayName) {
			rightDisplayName = name
		}
	})

	return (
		<>
			{isAssignedUser && (
				<div className='chat'>
					{user && (
						<div className='chat__top-bar'>
							<Avatar src={rightUrl} />
							<h3>{rightDisplayName}</h3>
						</div>
					)}

					<div className='vertical-container'>
						<div className='chat__comments'>
							<Comments chat={document} onQuery={setQuery} />
							<ChatInput chat={document} query={query} onQuery={setQuery} />
						</div>
					</div>
				</div>
			)}
		</>
	)
}
