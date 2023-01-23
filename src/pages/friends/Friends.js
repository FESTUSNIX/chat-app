import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'

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

	return (
		currentUserDoc && (
			<div className='friends wrapper'>
				<div className='friends__title-bar'>
					<div className='friends__title-bar-title' onClick={() => setView('list')}>
						<i className='fa-solid fa-user-group'></i>
						<h2>Friends</h2>
						{/* <div className='friends-count'>
							{currentUserDoc.friends && currentUserDoc.friends.filter(f => f.accepted).length}
						</div> */}
					</div>

					<div className='flex-row gap1'>
						<div
							className={`friends__title-bar-pending ${view === 'pending' ? 'active' : ''}`}
							onClick={() => setView('pending')}>
							<span>pending</span>
							{invitesAmount > 0 && (
								<>
									<i className='fa-solid fa-envelope'></i>
									<div className='pending-indicator'>
										<p>{invitesAmount}</p>
									</div>
								</>
							)}
						</div>
						<div className={`friends__title-bar-add ${view === 'add' ? 'active' : ''}`} onClick={() => setView('add')}>
							<span>add friend</span>
							<i className='fa-solid fa-user-plus'></i>
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
