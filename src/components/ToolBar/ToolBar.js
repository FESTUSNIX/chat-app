import React, { useEffect } from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { useDocument } from '../../hooks/useDocument'

// Styles
import './ToolBar.scss'
import AvatarWithStatus from '../AvatarWithStatus/AvatarWithStatus'
import ProfilePreview from '../ProfilePreview/ProfilePreview'
import Pinned from '../Pinned/Pinned'

const ToolBar = () => {
	const location = useLocation()

	const { user } = useAuthContext()
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)
	const { document: userDoc } = useDocument('users', user.uid)

	const [latestChat, setLatestChat] = useState()
	const [currentPath, setCurrentPath] = useState('')
	const [showProfile, setShowProfile] = useState(false)
	const [invitesAmount, setInvitesAmount] = useState(0)

	useEffect(() => {
		if (chats && chats !== null && chats.length !== 0) {
			setLatestChat(chats[0])
		} else {
			setLatestChat('')
		}
	}, [chats, userDoc])

	useEffect(() => {
		setCurrentPath(location.pathname)
	}, [location])

	useEffect(() => {
		if (userDoc?.friends) {
			setInvitesAmount(
				userDoc.friends.filter(f => {
					if (f.isPending) return true
					return false
				}).length
			)
		}
	}, [userDoc])

	return (
		userDoc && (
			<div className='tool-bar'>
				<nav className='tool-bar__pages'>
					<NavLink to={`/u/${latestChat && latestChat.id}`} className={currentPath.includes('/u/') ? 'active' : ''}>
						<i className='fa-solid fa-comment'></i>
					</NavLink>
					<NavLink to='/'>
						<i className='fa-solid fa-house'></i>
					</NavLink>
					<NavLink to='/friends' className='friends'>
						<i className='fa-solid fa-address-book'></i>
						{invitesAmount > 0 && (
							<div className='pending-indicator'>
								<p>{invitesAmount}</p>
							</div>
						)}
					</NavLink>

					<NavLink
						to='/settings/account-details'
						className={`${
							[
								'/settings/account-details',
								'/settings/profile',
								'/settings/theme',
								'/settings',
								'/settings/',
								'/settings/become-cool',
								'/settings/privacy-and-security'
							].includes(location.pathname)
								? 'active'
								: ''
						}`}>
						<i className='fa-solid fa-gear'></i>
					</NavLink>
				</nav>

				<div className='separator-no-text'></div>

				<Pinned orientation='vertical' />

				<div className='separator-no-text'></div>

				<div className='tool-bar__profile-menu'>
					<div
						onClick={() => {
							setShowProfile(true)
						}}>
						<AvatarWithStatus userId={userDoc.id} linkToProfile={false} noTooltip={true} />
					</div>

					<ProfilePreview show={showProfile} setShow={() => setShowProfile(false)} userId={userDoc.id} />
				</div>
			</div>
		)
	)
}

export default ToolBar
