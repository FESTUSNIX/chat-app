import { useState } from 'react'
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useDocument } from '../../../../hooks/useDocument'
import { useEffect } from 'react'

// Styles && Assets
import './Profile.scss'

// Components
import { ToastContainer } from 'react-toastify'
import AvatarField from './fields/AvatarField'
import BannerField from './fields/BannerField'
import AboutField from './fields/AboutField'
import Loader from '../../../../components/Loader/Loader'
import Preview from './Preview'

const Profile = () => {
	const { user } = useAuthContext()
	const { document: userDoc } = useDocument('users', user.uid)

	const [bannerColor, setBannerColor] = useState('#354167')

	const [avatarState, setAvatarState] = useState({})
	const [showAvatarModal, setShowAvatarModal] = useState(false)

	const [about, setAbout] = useState('')

	useEffect(() => {
		if (userDoc) {
			if (userDoc.banner) setBannerColor(userDoc.banner)

			if (userDoc.bio) setAbout(userDoc.bio)
		}
	}, [userDoc])

	if (!userDoc) return <Loader />

	if (userDoc)
		return (
			<div className='profile-settings'>
				<ToastContainer />
				<h2 className='setting-title'>customize profile</h2>

				<div className='profile-settings__container'>
					<Preview
						userDoc={userDoc}
						avatarState={avatarState}
						bannerColor={bannerColor}
						about={about}
						setShowAvatarModal={setShowAvatarModal}
					/>

					<div className='profile-settings__fields'>
						<BannerField setBannerColor={setBannerColor} bannerColor={bannerColor} />

						<AvatarField
							setAvatarState={e => setAvatarState(e)}
							userDoc={userDoc}
							setShowAvatarModal={setShowAvatarModal}
							showAvatarModal={showAvatarModal}
						/>

						<AboutField about={about} setAbout={setAbout} />
					</div>
				</div>
			</div>
		)
}

export default Profile
