import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

// Styles && Assets
import './Settings.scss'
import premiumIcon from '../../assets/premium-account.png'

// Components
import AccountDetails from './subpages/AccountDetails/AccountDetails'
import Profile from './subpages/Profile/Profile'
import Theme from './subpages/Theme/Theme'
import Premium from './subpages/Premium/Premium'
import PrivacyAndSecurity from './subpages/PrivacyAndSecurity/PrivacyAndSecurity'
import { AvatarWithStatus } from '../../components'

export default function Settings() {
	const { user } = useAuthContext()
	const { logout } = useLogout()

	const [showPage, setShowPage] = useState(false)
	const mediaQueryXL = useMediaQuery({ query: '(min-width: 992px)' })

	return (
		<div className='settings'>
			<div className='wrapper'>
				<aside className='settings__sidebar'>
					<Link to={`/profile/${user.uid}`} className='settings__sidebar-user'>
						<AvatarWithStatus userId={user.uid} />
						<div className='flex-column'>
							<h3>{user.displayName}</h3>
							<p>{user.email && user.email}</p>
						</div>
					</Link>

					<div className='custom-scrollbar flex-column'>
						<NavLink
							to='/settings/account-details'
							className='settings__sidebar-link'
							onClick={() => setShowPage(true)}>
							<i className='fa-solid fa-circle-user'></i>
							<span>account details</span>
						</NavLink>
						<NavLink to='/settings/profile' className='settings__sidebar-link' onClick={() => setShowPage(true)}>
							<i className='fa-solid fa-address-card'></i>
							<span>profile</span>
						</NavLink>
						<NavLink to='/settings/theme' className='settings__sidebar-link' onClick={() => setShowPage(true)}>
							<i className='fa-solid fa-paintbrush'></i>
							<span>theme</span>
						</NavLink>
						<NavLink to='/settings/become-cool' className='settings__sidebar-link' onClick={() => setShowPage(true)}>
							<img src={premiumIcon} alt='Icon for premium account' />
							<span>premium</span>
						</NavLink>
						<NavLink
							to='/settings/privacy-and-security'
							className='settings__sidebar-link'
							onClick={() => setShowPage(true)}>
							<i className='fa-solid fa-shield-halved'></i>
							<span>privacy & security</span>
						</NavLink>

						<div className='settings__sidebar-link logout' onClick={() => logout()}>
							<span>log out</span>
							<i className='fa-solid fa-arrow-right-from-bracket'></i>
						</div>
					</div>
				</aside>

				{(showPage || mediaQueryXL) && (
					<div className='settings__content custom-scrollbar'>
						{!mediaQueryXL && <i className='fa-solid fa-arrow-left close-btn' onClick={() => setShowPage(false)}></i>}

						<Routes>
							<Route path='account-details' element={<AccountDetails />} />
							<Route path='profile' element={<Profile />} />
							<Route path='theme' element={<Theme />} />
							<Route path='become-cool' element={<Premium />} />
							<Route path='privacy-and-security' element={<PrivacyAndSecurity />} />
						</Routes>
					</div>
				)}
			</div>
		</div>
	)
}
