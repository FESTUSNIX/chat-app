import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import ProjectComments from './ProjectComments'

// Styles
import './Project.scss'
import Avatar from '../../components/Avatar'

export default function Project() {
	const [isAssignedUser, setIsAssignedUser] = useState(false)

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
				<div className='project-details'>
					{user && (
						<div className='top-bar'>
							<Avatar src={rightUrl} />
							<h3>{rightDisplayName}</h3>
						</div>
					)}
					<ProjectComments project={document} />
				</div>
			)}
		</>
	)
}
