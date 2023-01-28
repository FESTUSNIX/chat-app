import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import { useMediaQuery } from 'react-responsive'

// Styles
import './Friends.scss'

// Components
import FriendsList from './FriendsList'
import AddFriend from './AddFriend'
import PendingInvites from './PendingInvites'

const Friends = () => {
	const { user } = useAuthContext()
	const { document: currentUserDoc } = useDocument('users', user.uid)

	const [view, setView] = useState('list') // list, pending, add
	const [invitesAmount, setInvitesAmount] = useState(0)

	useEffect(() => {
		if (currentUserDoc && currentUserDoc.friends) {
			setInvitesAmount(
				currentUserDoc.friends.filter(f => {
					if (f.isPending) return true
					return false
				}).length
			)
		}
	}, [currentUserDoc])

	const queryMd = useMediaQuery({ query: '(max-width: 768px)' })

	return (
		currentUserDoc && (
			<div className='friends wrapper'>
				<div className='friends__title-bar'>
					<div className='friends__title-bar-title' onClick={() => setView('list')}>
						<h2>Friends</h2>
					</div>

					<div className='flex-row gap1'>
						<div
							className={`friends__title-bar-pending ${view === 'pending' ? 'active' : ''}`}
							onClick={() => setView('pending')}>
							{!queryMd && <span>pending</span>}
							{queryMd && invitesAmount === 0 && <i className='fa-solid fa-envelope'></i>}
							{invitesAmount > 0 && (
								<>
									<i className='fa-solid fa-envelope'></i>
									<div className='pending-indicator'>
										<p>{invitesAmount}</p>
									</div>
								</>
							)}
						</div>
						<div
							className={`friends__title-bar-add ${view === 'add' ? 'active' : ''} ${queryMd ? 'mobile' : ''}`}
							onClick={() => setView('add')}>
							{!queryMd && (
								<>
									<span>add friend</span>
									<i className='fa-solid fa-user-plus'></i>
								</>
							)}
							{queryMd && <i className='fa-solid fa-user-plus mobile'></i>}
						</div>
					</div>
				</div>

				{view === 'list' && <FriendsList />}
				{view === 'add' && <AddFriend />}
				{view === 'pending' && <PendingInvites />}
			</div>
		)
	)
}

export default Friends
