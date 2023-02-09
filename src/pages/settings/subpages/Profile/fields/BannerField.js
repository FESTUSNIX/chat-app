import { useFirestore } from '../../../../../hooks/useFirestore'
import { useState } from 'react'
import { useAuthContext } from '../../../../../hooks/useAuthContext'
import { toast } from 'react-toastify'

// Components
import { ColorPicker } from '../../../../../components'

export default function BannerField({ setBannerColor, bannerColor }) {
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('users')

	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)

	const notify = message =>
		toast.success(message, {
			position: 'bottom-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark'
		})

	const updateBanner = async () => {
		setError(null)
		setIsPending(true)

		try {
			await updateDocument(user.uid, {
				banner: `${bannerColor}`
			})

			setIsPending(false)
			setError(null)
			notify('Updated banner')
		} catch (error) {
			setError(error.message)
			console.log(error.message)
			setIsPending(false)
		}
	}

	return (
		<div className='profile-settings__fields-field flex-row align-end gap1'>
			<div className='flex-column'>
				<h3 className='field-title'>banner color</h3>

				<ColorPicker
					value={bannerColor}
					setValue={e => {
						setBannerColor(e.target.value)
					}}
					className='mb0'
				/>
			</div>

			<button className='btn btn--secondary' onClick={() => updateBanner()}>
				Update Banner
			</button>

			{error && <div className='error'>{error}</div>}
		</div>
	)
}
