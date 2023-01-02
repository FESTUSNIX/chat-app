import React, { useEffect, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { Link } from 'react-router-dom'

// Styles
import './AvatarWithStatus.scss'

// Components
import Avatar from '../Avatar/Avatar'
import Tooltip from '../Tooltip/Tooltip'

const AvatarWithStatus = ({ userId, linkToProfile, noTooltip, noStatus }) => {
	const { documents: users } = useCollection('users')

	const [user, setUser] = useState(null)

	useEffect(() => {
		if (users && userId && userId !== null) {
			setUser(
				users.filter(u => {
					return u.id === userId
				})[0]
			)
		}
	}, [userId, users])

	if (user && user !== undefined && user !== null) {
		return (
			<div className='avatar-container'>
				{linkToProfile && (
					<Link to={`/profile/${user.id}`}>
						<Avatar src={user.photoURL} />
					</Link>
				)}

				{!linkToProfile && <Avatar src={user.photoURL} />}

				{user && user.status && !noStatus && (
					<span className={`status`}>
						<div className={`status__dot status__dot--${user.status}`}>
							{(!noTooltip || noTooltip === undefined) && <Tooltip>{user.status}</Tooltip>}
						</div>
					</span>
				)}
			</div>
		)
	} else {
		return null
	}
}

export default AvatarWithStatus
