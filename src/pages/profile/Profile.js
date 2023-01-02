import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import { useFirestore } from '../../hooks/useFirestore'
import ReactCountryFlag from 'react-country-flag'

// Styles
import './Profile.scss'

// Components
import AvatarWithStatus from '../../components/AvatarWithStatus/AvatarWithStatus'
import Tooltip from '../../components/Tooltip/Tooltip'
import randomColor from 'randomcolor'

export default function Profile() {
	const statuses = ['online', 'idle', 'do-not-disturb', 'invisible']

	const { id } = useParams()
	const { user } = useAuthContext()
	const { error, document } = useDocument('users', id)
	const { updateDocument } = useFirestore('users')

	console.log(document)

	const randColor = randomColor()

	const handleStatus = async status => {
		await updateDocument(user.uid, {
			status: status,
		})
	}

	if (error !== null) {
		return <div className='error'>{error}</div>
	}

	if (document) {
		return (
			<div className='profile'>
				<div className='wrapper'>
					<div className='banner' style={{ background: randColor }}></div>

					<div className='profile__header'>
						{<AvatarWithStatus userId={document.id} />}

						<div className='flex-column'>
							<div>
								<h3 className='name'>{document.displayName}</h3>
								<p className='bio'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
							</div>

							<div className='badges'>
								{document.createdAt && (
									<div className='badges__badge'>
										<p>
											<span>Joined</span> - {document.createdAt}
										</p>
									</div>
								)}

								{document.pronouns && (
									<div className='badges__badge'>
										<p>
											<span>Pronouns</span> - {document.pronouns}
										</p>
									</div>
								)}

								{document.country && (
									<div className='badges__badge'>
										<p className='country'>
											<ReactCountryFlag countryCode={`${document.country.code}`} svg />
											{document.country.name}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className='profile__info'>
						<div className='cards'>
							{document.id === user.uid && (
								<div className='status-picker'>
									<div className='flex-row'>
										<div className={`status-dot status-dot--${document.status}`}></div>
										<span>{document.status === 'do-not-disturb' ? 'do not disturb' : document.status}</span>
									</div>

									<i className='fa-solid fa-angle-right'></i>

									<div className='tooltip-container'>
										<Tooltip>
											<div className='picker'>
												{statuses.map(status => (
													<div
														className={`status ${status === document.status ? 'status--current' : ''}`}
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
							)}
						</div>
					</div>
				</div>
			</div>
		)
	}
	return null
}
