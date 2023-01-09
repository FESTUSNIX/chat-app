import React from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { Link } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'

// Styles
import './ProfilePreview.scss'

// Components
import OutsideClickHandler from 'react-outside-click-handler'
import AvatarWithStatus from '../AvatarWithStatus/AvatarWithStatus'
import Tooltip from '../Tooltip/Tooltip'

export default function ProfilePreview({ show, setShow, userId, pos, align }) {
	const statuses = ['online', 'idle', 'do-not-disturb', 'invisible']

	const { updateDocument } = useFirestore('users')
	const { document: userDoc } = useDocument('users', userId)
	const { user } = useAuthContext()

	const handleStatus = async status => {
		await updateDocument(user.uid, {
			status: status,
		})
	}

	if (show && setShow && userDoc) {
		return (
			<OutsideClickHandler onOutsideClick={() => setShow(false)}>
				<Tooltip pos={pos ? pos : 'top'} align={align ? align : 'end'} className='profile-preview-tooltip'>
					<div className='profile-preview'>
						<div className='banner'></div>

						<div className='profile-preview__header'>
							{userDoc && <AvatarWithStatus userId={userDoc.id} linkToProfile={true} />}

							{userId === user.uid && (
								<Link to='/profile-menu'>
									<i className='fa-solid fa-gear'></i>
								</Link>
							)}
						</div>

						<div className='profile-preview__info'>
							<h3 className='name'>{userDoc.displayName}</h3>

							<div className='separator'></div>

							<div className='cards'>
								<div className='cards__card'>
									<h4>About me</h4>
									{userDoc.bio && <p className='bio'>{userDoc.bio}</p>}
								</div>

								<div className='cards__card'>
									<h4>Member since</h4>
									<p>{userDoc.createdAt}</p>
								</div>

								{userId === user.uid && (
									<>
										<div className='separator'></div>
										<div className='status-picker'>
											<div className='flex-row'>
												<div className={`status-dot status-dot--${userDoc.status}`}></div>
												<span>{userDoc.status === 'do-not-disturb' ? 'do not disturb' : userDoc.status}</span>
											</div>

											<i className='fa-solid fa-angle-right'></i>

											<div className='tooltip-container'>
												<Tooltip>
													<div className='picker'>
														{statuses.map(status => (
															<div
																className={`status ${status === userDoc.status ? 'status--current' : ''}`}
																onClick={() => handleStatus(status)}
																key={status}>
																<span className={`status-dot status-dot--${status}`}></span>
																<span className='status__name'>
																	{status === 'do-not-disturb' ? 'do not disturb' : status}
																</span>
															</div>
														))}
													</div>
												</Tooltip>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</Tooltip>
			</OutsideClickHandler>
		)
	} else {
		return null
	}
}
