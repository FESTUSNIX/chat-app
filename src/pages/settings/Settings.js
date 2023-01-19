import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
import { useState } from 'react'

// Styles && Assets
import './Settings.scss'
import premiumIcon from '../../assets/premium-account.png'

// Components
import AvatarWithStatus from '../../components/AvatarWithStatus/AvatarWithStatus'
import Modal from '../../components/Modal/Modal'
import Loader from '../../components/Loader/Loader'
import AccountDetails from './subpages/AccountDetails/AccountDetails'
import Profile from './subpages/Profile/Profile'
import Theme from './subpages/Theme/Theme'
import Premium from './subpages/Premium/Premium'
import PrivacyAndSecurity from './subpages/PrivacyAndSecurity/PrivacyAndSecurity'

export default function Settings() {
	const { user } = useAuthContext()
	const { logout, error, isPending } = useLogout()

	const [confirmLogout, setConfirmLogout] = useState(false)
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

					<div className='custom-scrollbar flex-column gap05'>
						<NavLink to='/settings/account-details' className='settings__sidebar-link'>
							<i className='fa-solid fa-circle-user'></i>
							<span>account details</span>
						</NavLink>
						<NavLink to='/settings/profile' className='settings__sidebar-link'>
							<i className='fa-solid fa-address-card'></i>
							<span>profile</span>
						</NavLink>
						<NavLink to='/settings/theme' className='settings__sidebar-link'>
							<i className='fa-solid fa-paintbrush'></i>
							<span>theme</span>
						</NavLink>
						<NavLink to='/settings/become-cool' className='settings__sidebar-link'>
							<img src={premiumIcon} alt='Icon for premium account' />
							<span>plenvy pro</span>
						</NavLink>
						<NavLink to='/settings/privacy-and-security' className='settings__sidebar-link'>
							<i className='fa-solid fa-shield-halved'></i>
							<span>privacy & security</span>
						</NavLink>

						<div className='settings__sidebar-link logout' onClick={() => setConfirmLogout(true)}>
							<span>log out</span>
							<i className='fa-solid fa-arrow-right-from-bracket'></i>
						</div>
					</div>

					<Modal show={confirmLogout} setShow={() => setConfirmLogout(false)}>
						{!isPending && <i className='fa-regular fa-hand mb05'></i>}

						{isPending && <Loader />}

						<h3 className='mb05'>Come back soon!</h3>
						<p>Are you sure you want to Log Out?</p>

						<div className='btn-group'>
							<button className='btn btn--secondary' onClick={() => setConfirmLogout(false)}>
								cancel
							</button>
							<button className='btn' onClick={() => logout()}>
								logout
							</button>
						</div>

						{error && <div className='error'>{error}</div>}
					</Modal>
				</aside>

				<div className='settings__content custom-scrollbar'>
					<Routes>
						<Route path='account-details' element={<AccountDetails />} />
						<Route path='profile' element={<Profile />} />
						<Route path='theme' element={<Theme />} />
						<Route path='become-cool' element={<Premium />} />
						<Route path='privacy-and-security' element={<PrivacyAndSecurity />} />
					</Routes>
				</div>
			</div>
		</div>
	)
}
