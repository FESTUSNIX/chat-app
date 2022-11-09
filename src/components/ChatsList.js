import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useCollection } from '../hooks/useCollection'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNow'
import Avatar from './Avatar'

// Styles
import './ChatsList.scss'

export default function ChatsList({ projects }) {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')

	let onlineUsers = []
	let rightUrl = ''
	let rightDisplayName = ''
	let rightId = ''
	const replaceDistanceToNow = {
		about: '',
		minute: 'min',
		minutes: 'min',
		'less than a minute': '1 min',
	}

	// const handleOnMouseMove = e => {
	// 	console.log(e)
	// 	const rect = e.target.getBoundingClientRect(),
	// 		x = e.clientX - rect.left,
	// 		y = e.clientY - rect.top
	// 	e.target.firstChild.style.setProperty('left', `${x}px`)
	// 	e.target.firstChild.style.setProperty('top', `${y}px`)
	// }

	const handleOnMouseMove = e => {
		for (const card of document.getElementsByClassName('card')) {
			const rect = card.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top

			card.style.setProperty('--mouse-x', `${x}px`)
			card.style.setProperty('--mouse-y', `${y}px`)
		}
	}

	return (
		<div className='chat-list custom-scrollbar' onMouseMove={handleOnMouseMove}>
			{projects.length === 0 && <p>No chats yet!</p>}
			{projects.map(project => (
				<Link to={`/u/${project.id}`} key={project.id} className='card'>
					<div className='card-content'>
						{project.assignedUsersPhotoURL.forEach(url => {
							if (url !== user.photoURL) {
								rightUrl = url
							}
						})}

						{project.assignedUsersName.forEach(name => {
							if (name !== user.displayName) {
								rightDisplayName = name
							}
						})}

						{project.assignedUsersId.forEach(id => {
							if (id !== user.uid) {
								rightId = id
							}
						})}

						{users &&
							users.forEach(user => {
								if (user.online && !onlineUsers.includes(user.id)) {
									onlineUsers.push(user.id)
								}
							})}

						<div className='avatar-container'>
							<Avatar src={rightUrl} />

							{onlineUsers.includes(rightId) && (
								<span className='online-user'>
									<div className='status-circle'></div>
								</span>
							)}
						</div>
						{/* {console.log(project.messages[project.messages.length - 1].createdAt.toDate().getTime())}
					{console.log(project)} */}
						<div className='chat-info'>
							<p className='display-name'>
								{rightDisplayName.substring(0, 18)}
								<span>{rightDisplayName.length >= 18 && '...'}</span>
							</p>

							<div className='last-chat'>
								<span className='last-message'>
									{project &&
										project.messages[project.messages.length - 1] &&
										project.messages[project.messages.length - 1].createdBy === user.uid &&
										'You: '}

									{project.messages.length !== 0 &&
										project.messages[project.messages.length - 1].content &&
										project.messages[project.messages.length - 1].fileType === undefined &&
										project.messages[project.messages.length - 1].content.substring(0, 15)}

									{project.messages.length !== 0 &&
										!project.messages[project.messages.length - 1].content &&
										project.messages[project.messages.length - 1].fileType === 'image' &&
										`sent a photo`}

									{project.messages.length !== 0 &&
										!project.messages[project.messages.length - 1].content &&
										project.messages[project.messages.length - 1].fileType === 'video' &&
										`sent a video`}

									{project.messages.length !== 0 &&
										project.messages[project.messages.length - 1].content &&
										project.messages[project.messages.length - 1].content.length >= 15 &&
										'...'}
									{/* {console.log(project.messages[project.messages.length - 1].fileType !== undefined)} */}
									{project.messages.length === 0 && 'No messages yet'}
								</span>

								{project.messages.length !== 0 && <div className='dot'></div>}
								<span className='comment-date'>
									{project.messages.length !== 0 &&
										formatDistanceToNowStrict(project.messages[project.messages.length - 1].createdAt.toDate(), {
											addSuffix: false,
										}).replace(/\b(?:about|less than a minute)\b/gi, matched => replaceDistanceToNow[matched])}
								</span>
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}
