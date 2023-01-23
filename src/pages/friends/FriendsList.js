import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useCollection } from '../../hooks/useCollection'

// Components
import AvatarWithStatus from '../../components/AvatarWithStatus/AvatarWithStatus'

const FriendsList = () => {
	const { user } = useAuthContext()
	const { document: currentUserDoc } = useDocument('users', user.uid)
	const { documents: users } = useCollection('users')

	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState('all')
	const [list, setList] = useState(currentUserDoc ? currentUserDoc.friends : [])

	const getDoc = id => {
		let res = null

		if (users) {
			res = users.filter(doc => {
				if (doc.id === id) {
					return true
				}
				return false
			})[0]
		}

		return res
	}

	const filterUsers = f => {
		if (getDoc(f.id)) {
			let flt

			switch (filter) {
				case 'offline':
					flt = 'invisible'
					break
				case 'do not disturb':
					flt = 'do-not-disturb'
					break
				case 'all':
					flt = getDoc(f.id).status
					break
				default:
					flt = filter
					break
			}

			if (getDoc(f.id).status === flt && f.accepted) {
				if (
					getDoc(f.id).displayName.toLowerCase().trim().replace(/\s+/g, '').includes(search.toLowerCase()) ||
					search === ''
				) {
					return true
				}

				return false
			}
		}
		return false
	}

	return (
		<>
			<div className='friends__filter'>
				<div className={`friends__filter-item ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
					all
				</div>
				<div
					className={`friends__filter-item ${filter === 'online' ? 'active' : ''}`}
					onClick={() => setFilter('online')}>
					online
				</div>
				<div className={`friends__filter-item ${filter === 'idle' ? 'active' : ''}`} onClick={() => setFilter('idle')}>
					idle
				</div>
				<div
					className={`friends__filter-item ${filter === 'do not disturb' ? 'active' : ''}`}
					onClick={() => setFilter('do not disturb')}>
					do not disturb
				</div>
				<div
					className={`friends__filter-item ${filter === 'offline' ? 'active' : ''}`}
					onClick={() => setFilter('offline')}>
					offline
				</div>
			</div>

			<label className='friends__search'>
				<input type='text' placeholder='Search' onChange={e => setSearch(e.target.value)} value={search} />
				<i className='fa-solid fa-magnifying-glass'></i>
			</label>

			{currentUserDoc && currentUserDoc.friends && currentUserDoc.friends.filter(f => filterUsers(f)).length > 0 ? (
				<div className='friends__list'>
					<div className='friends__list-title'>
						{filter} - {currentUserDoc.friends.filter(f => filterUsers(f)).length}
					</div>

					<div className='friends__list-users'>
						{currentUserDoc.friends.map(
							f =>
								filterUsers(f) && (
									<Link to={`/profile/${f.id}`} className='user' key={f.id}>
										<div className='flex-row gap05'>
											<AvatarWithStatus userId={f.id} />
											<div className='flex-column'>
												<p>{getDoc(f.id) && getDoc(f.id).displayName}</p>
												<p>online</p>
											</div>
										</div>

										<i className='fa-solid fa-message'></i>
									</Link>
								)
						)}
					</div>
				</div>
			) : (
				<div className='absolute-center'>No user to be found</div>
			)}
		</>
	)
}

export default FriendsList
