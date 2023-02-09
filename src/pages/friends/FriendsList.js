import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useCollection } from '../../hooks/useCollection'

// Components
import { useMediaQuery } from 'react-responsive'
import { AvatarWithStatus, Field } from '../../components'

const FriendsList = () => {
	const { user } = useAuthContext()
	const { document: currentUserDoc } = useDocument('users', user.uid)
	const { documents: users } = useCollection('users')

	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState('all')

	const getDoc = id => users?.filter(doc => doc.id === id)?.[0] ?? null

	const filterUsers = f => {
		console.log('xd')

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
				return (
					getDoc(f.id).displayName.toLowerCase().trim().replace(/\s+/g, '').includes(search.toLowerCase()) ||
					search === ''
				)
			}
		}
		return false
	}

	const styleStatus = status => {
		let styled

		switch (status) {
			case 'invisible':
				styled = 'Offline'
				break
			case 'do-not-disturb':
				styled = 'Do Not Disturb'
				break
			default:
				styled = status
				break
		}

		return styled
	}

	const queryMd = useMediaQuery({ query: '(min-width: 768px)' })

	return (
		<>
			<div className={`friends__filter`}>
				<div className={`friends__filter-item ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
					<span>all</span>
				</div>
				<div
					className={`friends__filter-item ${filter === 'online' ? 'active' : ''}`}
					onClick={() => setFilter('online')}>
					<div className='status status--online'></div>
					{queryMd && <span>online</span>}
				</div>
				<div className={`friends__filter-item ${filter === 'idle' ? 'active' : ''}`} onClick={() => setFilter('idle')}>
					<div className='status status--idle'></div>
					{queryMd && <span>idle</span>}
				</div>
				<div
					className={`friends__filter-item ${filter === 'do not disturb' ? 'active' : ''}`}
					onClick={() => setFilter('do not disturb')}>
					<div className='status status--do-not-disturb'></div>
					{queryMd && <span>do not disturb</span>}
				</div>
				<div
					className={`friends__filter-item ${filter === 'offline' ? 'active' : ''}`}
					onClick={() => setFilter('offline')}>
					<div className='status status--offline'></div>
					{queryMd && <span>offline</span>}
				</div>
			</div>

			<Field
				value={search}
				setValue={setSearch}
				label='Search'
				after={<i className='fa-solid fa-magnifying-glass'></i>}
				before={<i className='fa-solid fa-magnifying-glass'></i>}
			/>

			{currentUserDoc?.friends ? (
				<div className='friends__list'>
					<div className='friends__list-title'>
						{filter} - {currentUserDoc.friends.filter(f => filterUsers(f)).length}
					</div>

					<div className='friends__list-users'>
						{currentUserDoc.friends.map(
							f =>
								filterUsers(f) && (
									<Link to={`/profile/${f.id}`} className='user' key={f.id}>
										<div className='flex-row gap05 w100'>
											<AvatarWithStatus userId={f.id} />
											<div className='flex-column w100 overflow-hidden'>
												<p>{getDoc(f.id) && getDoc(f.id).displayName}</p>
												<p>{getDoc(f.id) && styleStatus(getDoc(f.id).status)}</p>
											</div>
										</div>
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
