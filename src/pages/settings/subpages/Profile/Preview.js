import AvatarWithStatus from '../../../../components/AvatarWithStatus/AvatarWithStatus'

export default function Preview({ userDoc, avatarState, about, bannerColor, setShowAvatarModal }) {
	return (
		<div className='profile-preview'>
			<div className='profile-preview__banner' style={{ backgroundColor: bannerColor }}></div>
			<div className='profile-preview__header'>
				<div
					onClick={() => {
						setShowAvatarModal(true)
					}}>
					<AvatarWithStatus userId={userDoc.id} src={avatarState && !avatarState.remove ? avatarState.url : ''} />
				</div>
			</div>

			<div className='profile-preview__info'>
				<h3 className='name'>{userDoc.displayName}</h3>

				<div className='cards'>
					<div className='cards__card'>
						{about && (
							<>
								<h4>About me</h4>
								<p className='bio'>{about}</p>
							</>
						)}
					</div>

					<div className='cards__card'>
						<h4>Member since</h4>
						<p>{userDoc.createdAt}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
