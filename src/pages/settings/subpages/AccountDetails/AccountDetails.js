import { useState } from 'react'
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useDocument } from '../../../../hooks/useDocument'

// Styles && Assets
import './AccountDetails.scss'

// Components
import Username from './fields/Username'
import Email from './fields/Email'
import PhoneNumber from './fields/PhoneNumber'
import Password from './fields/Password'
import DeleteAccount from './fields/DeleteAccount'

import { Loader } from '../../../../components'

const AccountDetails = () => {
	const { user } = useAuthContext()
	const { document: userDoc, error: docError } = useDocument('users', user.uid)

	const [copyBtnText, setCopyBtnText] = useState('copy')

	const isPasswordProvider = () => {
		let res = false

		user.providerData.forEach(provider => {
			if (provider.providerId === 'password') {
				res = true
			}
		})

		return res
	}

	const copyInviteCode = () => {
		navigator.clipboard.writeText(user.uid)
		setCopyBtnText('copied')

		setTimeout(() => {
			setCopyBtnText('copy')
		}, 1000)
	}

	if (docError) {
		return <div className='error'>{docError}</div>
	}
	if (userDoc && user)
		return (
			<div className='account-details'>
				<h2 className='setting-title'>account details</h2>

				<div className='account-details__details'>
					<div className='account-details__details-field'>
						<h3>invite code</h3>
						<p className='text-clip'>{user.uid}</p>

						<button className='btn btn--secondary' onClick={() => copyInviteCode()}>
							{copyBtnText}
						</button>
					</div>

					<div className='separator'></div>

					<Username />
					<div className='separator'></div>

					{isPasswordProvider() && (
						<>
							<Email />
							<div className='separator'></div>
						</>
					)}

					<PhoneNumber />
					<div className='separator'></div>

					{isPasswordProvider() && (
						<>
							<Password />
							<div className='separator'></div>
						</>
					)}
				</div>
				<DeleteAccount />
			</div>
		)

	if (!userDoc && user) return <Loader />
}

export default AccountDetails
