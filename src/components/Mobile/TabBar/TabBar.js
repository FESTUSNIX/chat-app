import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCollection } from '../../../hooks/useCollection'
import { useDocument } from '../../../hooks/useDocument'

// Styles
import './TabBar.scss'

export default function TabBar() {
	const location = useLocation()

	const { user } = useAuthContext()
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)
	const { document: userDoc } = useDocument('users', user.uid)

	const [currentPath, setCurrentPath] = useState('')
	const [latestChat, setLatestChat] = useState()
	const [invitesAmount, setInvitesAmount] = useState(0)

	useEffect(() => {
		setLatestChat(chats && chats.length ? chats[0] : '')
	}, [chats, userDoc])

	useEffect(() => {
		setInvitesAmount(
			userDoc?.friends?.filter(f => {
				return f.isPending
			}).length
		)
	}, [userDoc])

	useEffect(() => {
		setCurrentPath(location.pathname)
	}, [location])

	return (
		<nav className='tab-bar'>
			<NavLink
				to={`/u/${latestChat && latestChat.id}`}
				className={`tab-bar__link  ${currentPath.includes('/u/') ? 'active' : ''}`}>
				<i className='fa-solid fa-comment'></i>
				<div className='tab-bar__link-description'>Chat</div>
			</NavLink>

			<NavLink to='/' className='tab-bar__link'>
				<i className='fa-solid fa-house'></i>
				<div className='tab-bar__link-description'>Home</div>
			</NavLink>

			<NavLink to='/friends' className='tab-bar__link tab-bar__link--friends'>
				<i className='fa-solid fa-address-book'></i>
				{invitesAmount > 0 && (
					<div className='pending-indicator'>
						<p>{invitesAmount}</p>
					</div>
				)}
				<div className='tab-bar__link-description'>Friends</div>
			</NavLink>

			<NavLink
				to='/settings/account-details'
				className={`tab-bar__link ${
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
				<div className='tab-bar__link-description'>Settings</div>
			</NavLink>
		</nav>
	)
}
