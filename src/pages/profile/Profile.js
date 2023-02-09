import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import { useCollection } from '../../hooks/useCollection'

// Styles && Assets
import './Profile.scss'
import premiumIcon from '../../assets/premium-account.png'

// Components
import ReactCountryFlag from 'react-country-flag'
import randomColor from 'randomcolor'
import ProfileComments from './ProfileComments'
import { AvatarWithStatus, Loader } from '../../components'

export default function Profile() {
	const randColor = randomColor()

	const { id } = useParams()
	const { user } = useAuthContext()
	const { error, document: userDoc } = useDocument('users', id)
	const { document: currentUserDoc } = useDocument('users', user.uid)
	const { documents: chats } = useCollection('projects')

	const getChatId = id => {
		let res = ''

		if (chats) {
			chats.filter(chat => {
				if (
					!chat.isGroup &&
					(chat.assignedUsersId[0] === id || chat.assignedUsersId[0] === user.uid) &&
					(chat.assignedUsersId[1] === id || chat.assignedUsersId[1] === user.uid)
				) {
					res = chat.id
					return true
				} else {
					return false
				}
			})
		}

		return res
	}

	const notInFriends = () => {
		if (!currentUserDoc.friends) return true

		let count = 0

		currentUserDoc.friends.forEach(f => {
			if (f.id !== userDoc.id) {
				count += 1
			}
		})

		return currentUserDoc.friends.length === count ? true : false
	}

	if (error !== null) {
		return <div className='error'>{error}</div>
	}

	if (!userDoc) {
		return <Loader />
	}

	if (userDoc) {
		return (
			<div className='profile custom-scrollbar'>
				<div className='wrapper flex-column'>
					<div
						className='banner'
						style={userDoc.banner ? { background: userDoc.banner } : { background: randColor }}></div>

					<div className='profile__header'>
						<div className='profile__header-user'>
							<AvatarWithStatus userId={userDoc.id} />
							<div className='flex-column'>
								<div>
									<h3 className='name'>{userDoc.displayName}</h3>
									{userDoc.bio && <p className='bio'>{userDoc.bio}</p>}
								</div>

								<div className='badges'>
									{userDoc.createdAt && (
										<div className='badges__badge'>
											<p>
												<span>Joined</span> - {userDoc.createdAt}
											</p>
										</div>
									)}

									{userDoc.pronouns && (
										<div className='badges__badge'>
											<p>
												<span>Pronouns</span> - {userDoc.pronouns}
											</p>
										</div>
									)}

									{userDoc.country && (
										<div className='badges__badge'>
											<p className='country'>
												<ReactCountryFlag countryCode={`${userDoc.country.code}`} svg />
												{userDoc.country.name}
											</p>
										</div>
									)}
								</div>
							</div>
							<div className='profile__header-additional'>
								{userDoc.premium && (
									<div className='premium'>
										<img src={premiumIcon} alt='Icon for premium account' />
										<span>Premium</span>
									</div>
								)}

								<div className='btn-group'>
									{id === user.uid && (
										<Link to='/settings/profile'>
											<button className='action-btn btn'>edit profile</button>
										</Link>
									)}

									{id !== user.uid && (
										<>
											{currentUserDoc && currentUserDoc.friends && (
												<>
													{currentUserDoc.friends.some(f => {
														if (f.id === userDoc.id && f.accepted === true && f.isPending === false) {
															return true
														}
														return false
													}) && (
														<Link to={`/u/${getChatId(userDoc.id)}`}>
															<button className='action-btn btn'>send message</button>
														</Link>
													)}

													{currentUserDoc.friends.some(f => {
														if (f.id === userDoc.id && f.accepted === false && f.isPending === false) {
															return true
														}
														return false
													}) && (
														<Link to={`/friends`}>
															<button className='action-btn btn'>invite sent</button>
														</Link>
													)}
												</>
											)}

											{currentUserDoc && notInFriends() && <button className='action-btn btn'>invite friend</button>}
										</>
									)}
								</div>
							</div>
						</div>

						<div className='separator mt1'></div>
					</div>

					<p className='mb2'>will finish someday</p>

					<ProfileComments id={id} />
				</div>
			</div>
		)
	}
}
